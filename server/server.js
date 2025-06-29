const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const inventoryRoutes = require('./routes/inventoryRoutes');
const itemRoutes = require('./routes/itemRoutes');
const authRoutes = require('./routes/authRoutes');
const invoiceSettingsRoutes = require('./routes/invoiceSettings');
const logoUploadRoutes = require('./routes/logoUpload');
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Routes

app.use('/api', inventoryRoutes); 
app.use('/api/auth', authRoutes);
app.use('/api/inventory', require('./routes/inventory'));
app.use('/api/invoice', require('./routes/invoices'));
app.use('/api/transactions', require('./routes/transaction'));
app.use('/api/items', itemRoutes);
app.use('/api/invoice-settings', invoiceSettingsRoutes);
app.use('/api/logo', logoUploadRoutes);
app.use('/uploads', express.static('uploads')); // Serve logos





// Start server only after DB is connected
const startServer = async () => {
  try {
    await connectDB();
    console.log('✅ MongoDB connected');

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Failed to connect to MongoDB:', err);
    process.exit(1);
  }
};

startServer();
