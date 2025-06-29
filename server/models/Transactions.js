const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['Bought', 'Sold'],
    required: true
  },
  items: {
    type: [Object], // You can further normalize this if needed
    required: true
  },
  totalAmount: {
    type: Number,
    required: true
  },
  buyerInfo: {
    companyName: String,
    address: String,
    gstin: String,
    phone: String,
    vehicleNumber: String,
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Transaction', transactionSchema);
