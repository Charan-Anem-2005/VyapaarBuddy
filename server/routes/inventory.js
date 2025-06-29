const express = require('express');
const router = express.Router();
const Item = require('../models/Item');
const { uploadData, deleteData } = require('../controllers/itemsController');
const authMiddleware = require('../middleware/authMiddleware');

// GET user's inventory items
router.get('/', authMiddleware, async (req, res) => {
  try {
    const items = await Item.find({ userId: req.user.id });
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch inventory' });
  }
});

// Upload items - now user-specific
router.post('/upload', authMiddleware, uploadData);

// Delete all items for this user
router.delete('/delete', authMiddleware, deleteData);

module.exports = router;
