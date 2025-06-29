// utils/compute.js
const computeDerivedValues = (input, item) => {
  const {
    PACKS = 0,
    LENGTHS = 0,
    QTY = 0,
    WEIGHT = 0
  } = input;

  const profileLength = item.PROFILE_LEGT || 1;
  const lengthPerPack = item.LENGT_PACKT || 1;
  const weightPerMeter = item.WEIGHT_KG_M || 1;

  let qty = QTY;
  let lengths = LENGTHS;
  let packs = PACKS;
  let weight = WEIGHT;

  if (packs) {
    lengths = packs * lengthPerPack;
    qty = lengths * profileLength * weightPerMeter;
  } else if (lengths) {
    qty = lengths * profileLength;
    packs = Math.ceil(lengths / lengthPerPack);
  } else if (qty) {
    lengths = qty / (profileLength * weightPerMeter);
    packs = Math.ceil(lengths / lengthPerPack);
  }

  const amount = qty * item.RATE;

  return { qty, lengths, packs, weight, amount };
};

module.exports = computeDerivedValues;
