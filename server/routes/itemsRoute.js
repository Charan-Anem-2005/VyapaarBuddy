const express = require('express');
const router = express.Router();
const { uploadData,deleteData } = require('../controllers/itemsController');

router.post('/upload', uploadData);
router.delete('/delete', deleteData)

module.exports = router;
