const mongoose = require('mongoose');
const Item = require('../models/Item');
const Transaction = require('../models/Transactions');

const computeDerivedValues = (input, item) => {
  const profileLength = parseFloat(item.PROFILE_LEGT) || 1;
  const lengthPerPack = parseFloat(item.LENGT_PACKT) || 1;
  const weightPerMeter = parseFloat(item.WEIGHT_KG_M) || 1;

  let packs = parseFloat(input.PACKS || 0);
  let lengths = parseFloat(input.LENGTHS || 0);
  let qty = parseFloat(input.QTY || 0);

  if (packs) {
    lengths = packs * lengthPerPack;
    qty = lengths * profileLength * weightPerMeter;
  } else if (lengths) {
    qty = lengths * profileLength * weightPerMeter;
    packs = lengths / lengthPerPack;
  } else if (qty) {
    lengths = qty / (profileLength * weightPerMeter);
    packs = lengths / lengthPerPack;
  }

  return {
    qty: +qty.toFixed(4),
    lengths: +lengths.toFixed(4),
    packs: +packs.toFixed(4),
    amount: +(qty * parseFloat(item.RATE || 0)).toFixed(2),
  };
};

const bulkTransaction = async (req, res, isSell = true) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const operations = req.body.items;
    const UserId = req.user.id;
    const buyerInfo = req.body.buyerInfo || {};

    if (!Array.isArray(operations)) {
      await session.abortTransaction();
      return res.status(400).json({ error: 'Invalid request format. Expected { items: [...] }' });
    }

    const items = await Item.find({ userId: UserId }).session(session);

    let totalAmount = 0;
    const updatedItems = [];
    const soldItems = [];

    for (const op of operations) {
      const item = items.find(i => i.CODE === op.CODE || i.PROFILE === op.PROFILE);
      if (!item) {
        await session.abortTransaction();
        return res.status(404).json({ error: `Item ${op.CODE || op.PROFILE} not found` });
      }

      const { qty, lengths, packs, amount } = computeDerivedValues(op, item);

      if (isSell && (item.QTY < qty || item.LENGTHS < lengths || item.PACKS < packs)) {
        await session.abortTransaction();
        return res.status(400).json({
          error: `Insufficient stock for ${item.PROFILE || item.CODE}`,
          available: { QTY: item.QTY, LENGTHS: item.LENGTHS, PACKS: item.PACKS },
          required: { QTY: qty, LENGTHS: lengths, PACKS: packs },
        });
      }

      item.QTY += isSell ? -qty : qty;
      item.LENGTHS += isSell ? -lengths : lengths;
      item.PACKS += isSell ? -packs : packs;
      item.AMOUNT += isSell ? -amount : amount;
      await item.save({ session });
      updatedItems.push(item);

      soldItems.push({
        PROFILE: item.PROFILE,
        CODE: item.CODE,
        HSN_CODE: item.HSN_CODE,
        DESCRIPTION: item.DESCRIPTION || item.PROFILE,
        RATE: item.RATE,
        soldQty: qty,
        soldLengths: lengths,
        soldPacks: packs,
        soldAmount: amount,
      });

      const total = await Item.findOne({ PROFILE: 'TOTAL', userId: UserId }).session(session);
      if (total) {
        total.QTY += isSell ? -qty : qty;
        total.LENGTHS += isSell ? -lengths : lengths;
        total.PACKS += isSell ? -packs : packs;
        total.AMOUNT += isSell ? -amount : amount;
        await total.save({ session });
      }

      totalAmount += amount;
    }

    await new Transaction({
      userId: UserId,
      type: isSell ? 'Sold' : 'Bought',
      items: soldItems,
      totalAmount,
      buyerInfo,
    }).save({ session });

    await session.commitTransaction();
    session.endSession();

    res.json({
      message: isSell ? 'Sell successful' : 'Buy successful',
      totalAmount,
      updatedItems,
      soldItems,
    });

  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.error('Transaction failed:', err);
    res.status(500).json({ error: `${isSell ? 'Sell' : 'Buy'} operation failed` });
  }
};

const sellMaterials = (req, res) => bulkTransaction(req, res, true);
const buyMaterials = (req, res) => bulkTransaction(req, res, false);


const updateRates = async (req, res) => {
  const userId = req.user.id;
  const newRate = parseFloat(req.body.newRate);

  if (isNaN(newRate) || newRate <= 0) {
    return res.status(400).json({ error: "Invalid rate" });
  }

  try {
    const items = await Item.find({ userId });

 
    let totalAmount = 0;

    for (const item of items) {
      if (item.PROFILE === "TOTAL") continue;

      item.RATE = newRate;
      item.AMOUNT = +(item.QTY * newRate);
      totalAmount += item.AMOUNT;

      await item.save();
    }

    // Update TOTAL row
    const totalRow = await Item.findOne({ PROFILE: "TOTAL", userId });
    if (totalRow) {
      totalRow.RATE = newRate;
      totalRow.AMOUNT = totalAmount;
      await totalRow.save();
    }

    res.json({ message: "Rates and amounts updated successfully", newRate });
  } catch (err) {
    console.error("Error updating rates:", err);
    res.status(500).json({ error: "Failed to update rates" });
  }
};

module.exports = { sellMaterials, buyMaterials, updateRates };
