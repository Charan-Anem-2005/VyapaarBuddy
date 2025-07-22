const express = require('express');
const router = express.Router();
const Item = require('../models/Item');
const authMiddleware = require('../middleware/authMiddleware');
const { updateRates } = require("../controllers/inventoryController");

// 🔒 Apply authMiddleware to all routes
router.use(authMiddleware);

// ➕ Create a new item (user-specific)
router.post('/', async (req, res) => {
  try {
    const userId = req.user.id;

    // Check if item with same CODE or PROFILE already exists for this user
    const existingItem = await Item.findOne({
      userId,
      $or: [{ CODE: req.body.CODE }, { PROFILE: req.body.PROFILE }]
    });

    if (existingItem) {
      return res.status(400).json({ error: 'Item with same CODE or PROFILE already exists' });
    }

    const item = new Item({ ...req.body, userId });

    // Update TOTAL row for this user
    const total = await Item.findOne({ PROFILE: 'TOTAL', userId });
    if (total) {
      total.AMOUNT += item.AMOUNT || 0;
      total.PACKS += item.PACKS || 0;
      total.LENGTHS += item.LENGTHS || 0;
      total.QTY += item.QTY || 0;
      await total.save();
    }

    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create item', details: err.message });
  }
});

// 📦 Fetch all items (user-specific)
router.get('/', async (req, res) => {
  try {
    const userId = req.user.id;
    const items = await Item.find({ userId });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch items' });
  }
});

// ❌ Delete an item by ID (user-specific)
router.delete('/:id', async (req, res) => {
  try {
    const userId = req.user.id;
    const item = await Item.findOne({ _id: req.params.id, userId });

    if (!item) {
      return res.status(404).json({ error: 'Item not found or unauthorized' });
    }

    // Adjust TOTAL row
    const total = await Item.findOne({ PROFILE: 'TOTAL', userId });
    if (total) {
      total.AMOUNT -= item.AMOUNT || 0;
      total.PACKS -= item.PACKS || 0;
      total.LENGTHS -= item.LENGTHS || 0;
      total.QTY -= item.QTY || 0;
      await total.save();
    }

    await item.deleteOne();
    res.json({ message: 'Item deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete item' });
  }
});

router.put("/update-rate", authMiddleware, updateRates);

module.exports = router;
