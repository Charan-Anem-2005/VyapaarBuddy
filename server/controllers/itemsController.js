const Item = require('../models/Item');

// Upload data (user-specific)
const uploadData = async (req, res) => {
  try {
    const userId = req.user.id; // From auth middleware
    const items = req.body;

    const itemsWithUser = items.map(item => ({ ...item, userId }));

    await Item.insertMany(itemsWithUser);

    res.status(201).json({ message: 'Data uploaded successfully' });
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
};

// Delete data (only for logged-in user)
const deleteData = async (req, res) => {
  try {
    const userId = req.user.id;

    await Item.deleteMany({ userId });

    res.status(200).json({ message: 'Data deleted successfully' });
  } catch (error) {
    console.error('Delete Error:', error);
    res.status(500).json({ error: 'Delete failed' });
  }
};

module.exports = { uploadData, deleteData };
