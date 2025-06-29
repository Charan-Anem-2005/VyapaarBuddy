const express = require('express');
const router = express.Router();
const { sellMaterials, buyMaterials } = require('../controllers/inventoryController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/sell',authMiddleware, sellMaterials);
router.post('/buy',authMiddleware, buyMaterials);

module.exports = router;
