const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const numberToWords = require('./numberToWords');
const Transaction = require('../models/Transactions');
const InvoiceSettings = require('../models/InvoiceSettings');

const generateInvoice = async (req, res) => {
  try {
    const { transactionId } = req.params;
    const preview = req.path.includes('/preview');
    const userId = req.user._id;

    const transaction = await Transaction.findOne({ _id: transactionId, userId });
    if (!transaction || transaction.type !== 'Sold') {
      return res.status(404).send('Transaction not found or not a sell type');
    }

    const settings = await InvoiceSettings.findOne({ userId });
    if (!settings) return res.status(400).send("Invoice settings not configured");

    const { buyerInfo = {}, items = [] } = transaction;
    const invoiceNo = `INV-${Date.now()}`;
    const filename = `invoice-${invoiceNo}.pdf`;
    const invoicesDir = path.join(__dirname, '..', 'invoices');
    if (!fs.existsSync(invoicesDir)) fs.mkdirSync(invoicesDir, { recursive: true });
    const filePath = path.join(invoicesDir, filename);

    const doc = new PDFDocument({ margin: 50 });
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // === HEADER ===
    const pageWidth = doc.page.width;
    const startX = 50;
    const endX = pageWidth - 50;
    let y = 50;

    doc.rect(0, 0, pageWidth, 40).fill(settings.colorPrimary || '#007BFF');
    doc.fillColor('#FFFFFF').fontSize(16).font('Helvetica-Bold')
      .text('TAX INVOICE', startX, 13, { align: 'center', width: pageWidth - 100 })
      .fillColor('#000000');

    y += 45;

    if (settings.logoUrl && fs.existsSync(path.join(__dirname, '..', settings.logoUrl))) {
      doc.image(path.join(__dirname, '..', settings.logoUrl), startX, y, { width: 60 });
    }

    doc.fontSize(12).font('Helvetica-Bold').text(settings.companyName || '', startX + 70, y);
    doc.fontSize(9).font('Helvetica')
      .text('GSTIN: ' + (settings.gstin || ''), startX + 70, y + 15)
      .text(settings.address || '', startX + 70, y + 30)
      .text('Ph: ' + (settings.phone || '') + ' | Email: ' + (settings.email || ''), startX + 70, y + 45);
    y += 75;

    doc.rect(startX, y, endX - startX, 80).fill(settings.colorSecondary || '#E9F5FF');
    doc.fillColor('#000000').font('Helvetica-Bold').fontSize(11)
      .text(`Invoice No: ${invoiceNo}`, startX + 10, y + 10);
    doc.font('Helvetica').fontSize(9)
      .text(`Date: ${new Date().toLocaleDateString()}`, endX - 120, y + 10)
      .text(`Buyer name: ${buyerInfo.companyName || '-'}`, startX + 10, y + 25)
      .text(`Address: ${buyerInfo.address || '-'}`, startX + 10, y + 35)
      .text(`GSTIN: ${buyerInfo.gstin || '-'}`, startX + 10, y + 45)
      .text(`Phone: ${buyerInfo.phone || '-'}`, endX - 120, y + 45);
    if (settings.vehicleField) {
      doc.text(`Vehicle No: ${buyerInfo.vehicleNumber || '-'}`, endX - 120, y + 60);
    }

    y += 100;

    // === TABLE ===
    const defaultCols = [
      { key: 'sno', header: 'S No', width: 30 },
      { key: 'description', header: 'Description', width: 90 },
      { key: 'HSN', header: 'HSN Code', width: 45 },
      { key: 'qty', header: 'Qty', width: 45 },
      { key: 'packets', header: 'Packets', width: 40 },
      { key: 'lengths', header: 'Lengths', width: 45 },
      { key: 'rate', header: 'Rate', width: 35 },
      { key: 'amount', header: 'Amount', width: 55 },
      { key: 'CGST', header: 'CGST', width: 45 },
      { key: 'SGST', header: 'SGST', width: 45 },
      { key: 'total', header: 'Total', width: 60 },
    ];

    const visibleCols = defaultCols.filter(col =>
      ['sno', 'description', ...settings.visibleFields].includes(col.key)
    );

    const tableLeft = (pageWidth - visibleCols.reduce((a, b) => a + b.width, 0)) / 2;
    let yPos = y;

    const drawRow = (row, y, isHeader = false, height = 20, fontSize = 7) => {
      let x = tableLeft;
      visibleCols.forEach((col, i) => {
        if (isHeader) doc.fillColor(settings.colorPrimary).rect(x, y, col.width, height).fill();
        doc.lineWidth(0.5).strokeColor('#000000').rect(x, y, col.width, height).stroke();
        doc.font(isHeader ? 'Helvetica-Bold' : 'Helvetica')
          .fontSize(fontSize)
          .fillColor(isHeader ? '#FFFFFF' : '#000000')
          .text(row[i], x + 5, y + 5, {
            width: col.width - 10,
            align: i === 1 ? 'left' : 'right',
          });
        x += col.width;
      });
      if (isHeader) doc.fillColor('#000000');
    };

    drawRow(visibleCols.map(c => c.header), yPos, true);
    yPos += 20;

    let totalQty = 0, totalPacks = 0, totalLengths = 0, subtotal = 0, cgstTotal = 0, sgstTotal = 0, grandTotal = 0;

    items.forEach((item, idx) => {
      const qty = +parseFloat(item.soldQty || 0);
      const packets = +parseFloat(item.soldPacks || 0);
      const lengths = +parseFloat(item.soldLengths || 0);
      const rate = +parseFloat(item.RATE || 0);
      const amount = +(item.soldAmount || qty * rate).toFixed(2);
      const cgst = +(amount * 0.09).toFixed(2);
      const sgst = +(amount * 0.09).toFixed(2);
      const total = +(amount + cgst + sgst).toFixed(2);
      totalQty += qty;
      totalPacks += packets;
      totalLengths += lengths;
      subtotal += amount;
      cgstTotal += cgst;
      sgstTotal += sgst;
      grandTotal += total;

      const row = visibleCols.map(c => {
        switch (c.key) {
          case 'sno': return idx + 1;
          case 'description': return item.DESCRIPTION || item.PROFILE || '-';
          case 'HSN': return item.HSN_CODE || '-';
          case 'qty': return qty.toFixed(2);
          case 'packets': return packets.toFixed(2);
          case 'lengths': return lengths.toFixed(2);
          case 'rate': return rate.toFixed(2);
          case 'amount': return amount.toFixed(2);
          case 'CGST': return cgst.toFixed(2);
          case 'SGST': return sgst.toFixed(2);
          case 'total': return total.toFixed(2);
          default: return '-';
        }
      });

      drawRow(row, yPos, false, 20);
      yPos += 20;
    });

// === GRAND TOTAL ROW ===
const totalRow = visibleCols.map(c => {
  switch (c.key) {
    case 'sno': return '';
    case 'description': return 'GRAND TOTAL';
    case 'HSN': return '';
    case 'qty': return totalQty.toFixed(2);
    case 'packets': return totalPacks.toFixed(2);
    case 'lengths': return totalLengths.toFixed(2);
    case 'rate': return '';
    case 'amount': return subtotal.toFixed(2);
    case 'CGST': return cgstTotal.toFixed(2);
    case 'SGST': return sgstTotal.toFixed(2);
    case 'total': return grandTotal.toFixed(2);
    default: return '';
  }
});

// Light gray background for emphasis
doc.fillColor('#F2F2F2')
  .rect(tableLeft, yPos, visibleCols.reduce((a, b) => a + b.width, 0), 28)
  .fill();

// Draw bold text manually (bigger font)
let x = tableLeft;
visibleCols.forEach((col, i) => {
  doc.lineWidth(0.5).strokeColor('#000000').rect(x, yPos, col.width, 28).stroke();
  doc.font('Helvetica-Bold')
    .fontSize(8)
    .fillColor('#000000')
    .text(totalRow[i], x + 5, yPos + 7, {
      width: col.width - 10,
      align: i === 1 ? 'left' : 'right',
    });
  x += col.width;
});

yPos += 38;

// === AMOUNT IN WORDS ===
const amountInWords = numberToWords(grandTotal).toUpperCase();

doc.moveDown(0.5);
doc.font('Helvetica-Bold')
  .fontSize(11)
  .fillColor('#000000')
  .text(`Amount in Words: ${amountInWords}`, startX, yPos, { width: 500 });

yPos += 30;

// === DECLARATION ===
doc.font('Helvetica-Bold').fontSize(10).text('Declaration:', startX, yPos);
yPos += 15;
doc.font('Helvetica').fontSize(9).text(
  'We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.',
  startX, yPos, { width: 500 }
);
yPos += 60;
doc.text(settings.companyName || '', 400, yPos);
doc.text('Authorized Signatory', 400, yPos + 30);


    doc.end();

    stream.on('finish', () => {
      if (preview) {
        res.sendFile(filePath, () => fs.unlinkSync(filePath));
      } else {
        res.download(filePath, filename, () => fs.unlinkSync(filePath));
      }
    });

    stream.on('error', err => {
      console.error('PDF generation failed:', err);
      res.status(500).send('Failed to generate invoice');
    });

  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

module.exports = { generateInvoice };
