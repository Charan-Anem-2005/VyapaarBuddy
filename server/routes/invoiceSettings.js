const express = require('express');
const router = express.Router();
const InvoiceSetting = require('../models/InvoiceSettings');
const authMiddleware = require('../middleware/authMiddleware');


// GET invoice settings for logged-in user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const setting = await InvoiceSetting.findOne({ userId: req.user.id });
    res.json(setting);
  } catch (err) {
    console.error('Fetch settings error:', err);
    res.status(500).json({ error: 'Failed to load settings' });
  }
});

// POST/PUT to save or update invoice settings
router.post('/', authMiddleware, async (req, res) => {
  try {
    const {
      colorPrimary,
      colorSecondary,
      visibleFields,
      vehicleField,
      logoUrl,
      companyName,
      address,
      gstin,
      phone,
      email,
    } = req.body;

    const updated = await InvoiceSetting.findOneAndUpdate(
      { userId: req.user.id },
      {
        colorPrimary,
        colorSecondary,
        visibleFields,
        vehicleField,
        logoUrl,
        companyName,
        address,
        gstin,
        phone,
        email,
      },
      { upsert: true, new: true }
    );
if (updated) {
  res.status(200).json({ message: "Settings saved", data: updated });
} else {
  res.status(500).json({ error: "Failed to save settings" });
}

  } catch (err) {
    console.error('Save settings error:', err);
    res.status(500).json({ error: 'Failed to save settings' });
  }
});



module.exports = router;
