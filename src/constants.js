export const CURRENCIES = {
  USD: { symbol: '$', code: 'USD', name: 'US Dollar' },
  INR: { symbol: '₹', code: 'INR', name: 'Indian Rupee' },
  GBP: { symbol: '£', code: 'GBP', name: 'British Pound' },
  EUR: { symbol: '€', code: 'EUR', name: 'Euro' },
  AUD: { symbol: 'A$', code: 'AUD', name: 'Australian Dollar' },
  CAD: { symbol: 'C$', code: 'CAD', name: 'Canadian Dollar' },
};

export const CURRENCY_OPTIONS = Object.entries(CURRENCIES).map(([code, info]) => ({
  value: code,
  label: `${info.symbol} ${code} — ${info.name}`,
}));

function generateInvoiceNumber() {
  const year = new Date().getFullYear();
  const rand = String(Math.floor(Math.random() * 9999) + 1).padStart(4, '0');
  return `INV-${year}-${rand}`;
}

function todayString() {
  return new Date().toISOString().split('T')[0];
}

function futureDateString(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

export const INITIAL_INVOICE = {
  businessName: '',
  senderName: '',
  senderEmail: '',
  senderPhone: '',
  senderAddress: '',
  logo: null,
  clientName: '',
  clientCompany: '',
  clientEmail: '',
  clientAddress: '',
  invoiceNumber: generateInvoiceNumber(),
  invoiceDate: todayString(),
  dueDate: futureDateString(14),
  currency: 'USD',
  items: [{ id: 1, description: '', quantity: 1, rate: 0 }],
  discountPercent: 0,
  taxPercent: 0,
  notes: '',
};

export const MAX_ITEMS = 50;
