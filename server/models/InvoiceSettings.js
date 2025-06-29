const mongoose = require('mongoose');

const invoiceSettingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    logoUrl: String,

    // Colors used in invoice PDF
    colorPrimary: {
      type: String,
      default: '#007BFF',
    },
    colorSecondary: {
      type: String,
      default: '#E9F5FF',
    },

    // Table columns to be shown in invoice PDF
    visibleFields: {
      type: [String], // Example: ['qty', 'packets', 'rate', 'CGST', 'SGST', 'total']
      default: ['qty', 'packets', 'rate', 'CGST', 'SGST', 'total'],
    },

    // Company Details
    companyName: {
      type: String,
      default: '',
    },
    gstin: {
      type: String,
      default: '',
    },
    address: {
      type: String,
      default: '',
    },
    phone: {
      type: String,
      default: '',
    },
    email: {
      type: String,
      default: '',
    },

    // Show vehicle number field in invoice
    vehicleField: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('InvoiceSetting', invoiceSettingSchema);
