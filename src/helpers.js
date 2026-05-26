import { CURRENCIES } from './constants';

export function calculateSubtotal(items) {
  return items.reduce((sum, item) => sum + item.quantity * item.rate, 0);
}

export function calculateDiscount(subtotal, discountPercent) {
  return subtotal * (discountPercent / 100);
}

export function calculateTax(taxableAmount, taxPercent) {
  return taxableAmount * (taxPercent / 100);
}

export function getCalculations(items, discountPercent, taxPercent) {
  const subtotal = calculateSubtotal(items);
  const discountAmount = calculateDiscount(subtotal, discountPercent);
  const taxableAmount = subtotal - discountAmount;
  const taxAmount = calculateTax(taxableAmount, taxPercent);
  const total = taxableAmount + taxAmount;
  return { subtotal, discountAmount, taxableAmount, taxAmount, total };
}

export function getCurrencySymbol(code) {
  return CURRENCIES[code]?.symbol || '$';
}

const PDF_SAFE_SYMBOLS = {
  USD: '$',
  INR: 'Rs.',
  GBP: String.fromCharCode(163),
  EUR: 'EUR ',
  AUD: 'A$',
  CAD: 'C$',
};

export function getPdfCurrencySymbol(code) {
  return PDF_SAFE_SYMBOLS[code] || getCurrencySymbol(code);
}

export function formatCurrency(amount, currencyCode) {
  const symbol = getCurrencySymbol(currencyCode);
  return `${symbol}${Number(amount).toFixed(2)}`;
}

export function formatDisplayDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString + 'T00:00:00');
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function generatePDF(invoice, calculations, currencySymbol) {
  const { jsPDF } = window.jspdf;

  return new Promise((resolve, reject) => {
    try {
      currencySymbol = getPdfCurrencySymbol(invoice.currency);
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

      const pageWidth = 210;
      const pageHeight = 297;
      const ml = 20;
      const mr = 20;
      const cw = pageWidth - ml - mr;

      const navy = [10, 37, 64];
      const indigo = [99, 91, 255];
      const gray = [71, 85, 105];
      const lightGray = [148, 163, 184];
      const bgGray = [248, 250, 252];
      const white = [255, 255, 255];
      const red = [239, 68, 68];

      let y = 25;

      if (invoice.logo) {
        try {
          doc.addImage(invoice.logo, 'AUTO', ml, y - 5, 15, 15);
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(18);
          doc.setTextColor(...navy);
          doc.text(invoice.businessName || 'Your Business', ml + 19, y + 5);
        } catch {
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(18);
          doc.setTextColor(...navy);
          doc.text(invoice.businessName || 'Your Business', ml, y + 5);
        }
      } else {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(18);
        doc.setTextColor(...navy);
        doc.text(invoice.businessName || 'Your Business', ml, y + 5);
      }

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(28);
      doc.setTextColor(...indigo);
      doc.text('INVOICE', pageWidth - mr, y + 5, { align: 'right' });

      y += 15;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(...gray);
      const meta = [
        ['Invoice #', invoice.invoiceNumber],
        ['Date', formatDisplayDate(invoice.invoiceDate)],
        ['Due Date', formatDisplayDate(invoice.dueDate)],
      ];
      meta.forEach(([label, val], i) => {
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...lightGray);
        doc.text(`${label}:`, pageWidth - mr - 45, y + i * 5);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...navy);
        doc.text(val, pageWidth - mr, y + i * 5, { align: 'right' });
      });

      y += 25;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(...lightGray);
      doc.text('FROM', ml, y);
      doc.text('BILL TO', ml + cw / 2 + 10, y);
      y += 6;

      doc.setFontSize(11);
      doc.setTextColor(...navy);
      doc.text(invoice.businessName || 'Your Business Name', ml, y);
      doc.text(invoice.clientCompany || invoice.clientName || 'Client Name', ml + cw / 2 + 10, y);
      y += 5;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(...gray);

      const fromLines = [invoice.senderName, invoice.senderEmail, invoice.senderPhone, invoice.senderAddress].filter(Boolean);
      fromLines.forEach((line, i) => {
        doc.text(line, ml, y + i * 4.5);
      });

      const toLines = [
        invoice.clientCompany && invoice.clientName ? invoice.clientName : '',
        invoice.clientEmail,
        invoice.clientAddress,
      ].filter(Boolean);
      toLines.forEach((line, i) => {
        doc.text(line, ml + cw / 2 + 10, y + i * 4.5);
      });

      y += Math.max(fromLines.length, toLines.length, 1) * 4.5 + 12;

      doc.setFillColor(...bgGray);
      doc.roundedRect(ml, y - 1, cw, 8, 1, 1, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(...lightGray);

      const descX = ml + 3;
      const qtyX = ml + cw * 0.55;
      const rateX = ml + cw * 0.72;
      const amtX = ml + cw - 3;

      doc.text('DESCRIPTION', descX, y + 4.5);
      doc.text('QTY', qtyX, y + 4.5, { align: 'center' });
      doc.text('RATE', rateX, y + 4.5, { align: 'center' });
      doc.text('AMOUNT', amtX, y + 4.5, { align: 'right' });
      y += 12;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);

      invoice.items.forEach((item, idx) => {
        if (y > pageHeight - 60) {
          doc.addPage();
          y = 25;
        }
        if (idx > 0) {
          doc.setDrawColor(235, 235, 235);
          doc.line(ml, y - 3, ml + cw, y - 3);
        }
        doc.setTextColor(...navy);
        const desc = item.description || 'Item description';
        const descLines = doc.splitTextToSize(desc, cw * 0.5);
        doc.text(descLines, descX, y + 1);
        doc.setTextColor(...gray);
        doc.text(String(item.quantity || 0), qtyX, y + 1, { align: 'center' });
        doc.text(`${currencySymbol}${Number(item.rate || 0).toFixed(2)}`, rateX, y + 1, { align: 'center' });
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...navy);
        doc.text(`${currencySymbol}${(item.quantity * item.rate).toFixed(2)}`, amtX, y + 1, { align: 'right' });
        doc.setFont('helvetica', 'normal');
        y += Math.max(descLines.length, 1) * 4.5 + 4;
      });

      y += 8;

      const totX = ml + cw * 0.58;
      const totVX = amtX;
      doc.setDrawColor(230, 230, 230);
      doc.line(totX, y, ml + cw, y);
      y += 7;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(...gray);
      doc.text('Subtotal', totX, y);
      doc.setTextColor(...navy);
      doc.text(`${currencySymbol}${calculations.subtotal.toFixed(2)}`, totVX, y, { align: 'right' });
      y += 7;

      if (invoice.discountPercent > 0) {
        doc.setTextColor(...gray);
        doc.text(`Discount (${invoice.discountPercent}%)`, totX, y);
        doc.setTextColor(...red);
        doc.text(`-${currencySymbol}${calculations.discountAmount.toFixed(2)}`, totVX, y, { align: 'right' });
        y += 7;
      }

      if (invoice.taxPercent > 0) {
        doc.setTextColor(...gray);
        doc.text(`Tax / GST (${invoice.taxPercent}%)`, totX, y);
        doc.setTextColor(...navy);
        doc.text(`${currencySymbol}${calculations.taxAmount.toFixed(2)}`, totVX, y, { align: 'right' });
        y += 7;
      }

      y += 3;
      doc.setFillColor(...indigo);
      doc.roundedRect(totX - 4, y - 5, cw * 0.42 + 8, 12, 2, 2, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(...white);
      doc.text('TOTAL', totX, y + 2);
      doc.text(`${currencySymbol}${calculations.total.toFixed(2)}`, totVX, y + 2, { align: 'right' });

      y += 22;

      if (invoice.notes) {
        if (y > pageHeight - 50) {
          doc.addPage();
          y = 25;
        }
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.setTextColor(...lightGray);
        doc.text('NOTES', ml, y);
        y += 6;
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(9);
        doc.setTextColor(...gray);
        const noteLines = doc.splitTextToSize(invoice.notes, cw);
        doc.text(noteLines, ml, y);
        y += noteLines.length * 4.5 + 5;
      }

      const footerY = pageHeight - 15;
      doc.setDrawColor(230, 230, 230);
      doc.line(ml, footerY - 5, ml + cw, footerY - 5);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(...lightGray);
      doc.text('Thank you for your business.', pageWidth / 2, footerY, { align: 'center' });

      const clientName = (invoice.clientCompany || invoice.clientName || 'Client').replace(/[^a-zA-Z0-9]/g, '-');
      const filename = `Invoice-${invoice.invoiceNumber}-${clientName}.pdf`;
      doc.save(filename);
      resolve(filename);
    } catch (error) {
      reject(error);
    }
  });
}
