const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transactions');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/all',authMiddleware, async (req, res) => {
  try {
    const transactions = await Transaction.find({userId: req.user.id}).sort({ createdAt: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

module.exports = router;
