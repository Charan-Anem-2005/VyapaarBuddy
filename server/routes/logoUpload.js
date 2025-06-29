const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadLogo');
const authMiddleware = require('../middleware/authMiddleware');

// POST /api/logo
router.post('/upload', authMiddleware, upload.single('logo'), (req, res) => {
  const logoPath = `/uploads/logos/${req.file.filename}`;
  res.json({ url: logoPath });
});

module.exports = router;
