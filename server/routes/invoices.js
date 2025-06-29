const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const Invoice = require('../models/Invoice');
const { generateInvoice } = require('../utils/generateInvoicePDF'); // You’ll move the PDF logic here

// Get all user invoices
router.get('/:transactionId/download', authMiddleware, generateInvoice); // download
router.get('/:transactionId/preview', authMiddleware, generateInvoice); // preview


module.exports = router;
