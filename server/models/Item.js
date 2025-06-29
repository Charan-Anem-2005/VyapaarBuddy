const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  PROFILE: { type: String },
  S_NO: { type: Number },
  HSN_CODE: { type: String },
  CODE: { type: String },
  DESCRIPTION: { type: String },
  WEIGHT_KG_M: { type: Number },
  PROFILE_LEGT: { type: Number },
  LENGT_PACKT: { type: Number },
  PACKS: { type: Number },
  LENGTHS: { type: Number },
  QTY: { type: Number },
  RATE: { type: Number },
  AMOUNT: { type: Number },
}, { timestamps: true });

module.exports = mongoose.model('Item', itemSchema);
