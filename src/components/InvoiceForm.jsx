import React, { useRef, useState } from 'react';
import {
  User, Building2, Mail, Phone, MapPin,
  Hash, Calendar, Globe, Receipt, Percent,
  StickyNote, Plus, X, Upload, Image,
} from 'lucide-react';
import { CURRENCY_OPTIONS, MAX_ITEMS } from '../constants';
import { formatCurrency } from '../helpers';

function SectionHeader({ icon, iconColor, title, subtitle }) {
  return (
    <div className="form-section__header">
      <div className={`form-section__icon form-section__icon--${iconColor}`}>
        {icon}
      </div>
      <div className="form-section__text">
        <div className="form-section__title">{title}</div>
        {subtitle && <div className="form-section__subtitle">{subtitle}</div>}
      </div>
    </div>
  );
}

function InputField({ label, name, value, onChange, type = 'text', placeholder, fullWidth, error, ...rest }) {
  return (
    <div className={`input-group${fullWidth ? ' input-group--full' : ''}`}>
      <label className="input-group__label" htmlFor={name}>{label}</label>
      {type === 'textarea' ? (
        <textarea
          id={name}
          className={`input-group__input${error ? ' input-group__input--error' : ''}`}
          value={value}
          onChange={(e) => onChange(name, e.target.value)}
          placeholder={placeholder}
          {...rest}
        />
      ) : type === 'select' ? (
        <select
          id={name}
          className="input-group__input"
          value={value}
          onChange={(e) => onChange(name, e.target.value)}
          {...rest}
        >
          {rest.options?.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      ) : (
        <input
          id={name}
          type={type}
          className={`input-group__input${error ? ' input-group__input--error' : ''}`}
          value={value}
          onChange={(e) => onChange(name, type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value)}
          placeholder={placeholder}
          {...rest}
        />
      )}
      {error && <span className="input-group__error">{error}</span>}
    </div>
  );
}

export default function InvoiceForm({
  invoice,
  onChange,
  onItemChange,
  onAddItem,
  onRemoveItem,
  onLogoUpload,
}) {
  const fileRef = useRef(null);
  const [removingId, setRemovingId] = useState(null);
  const [errors, setErrors] = useState({});

  function handleLogoSelect(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onLogoUpload(reader.result);
    reader.readAsDataURL(file);
  }

  function handleRemove(id) {
    if (invoice.items.length <= 1) return;
    setRemovingId(id);
    setTimeout(() => {
      onRemoveItem(id);
      setRemovingId(null);
    }, 250);
  }

  function validateEmail(field, value) {
    if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setErrors((prev) => ({ ...prev, [field]: 'Invalid email format' }));
    } else {
      setErrors((prev) => { const next = { ...prev }; delete next[field]; return next; });
    }
  }

  const currencySymbol = CURRENCY_OPTIONS.find(o => o.value === invoice.currency)?.label.split(' ')[0] || '$';

  return (
    <div className="form-panel">
      {/* ── Section 1: Your Details ── */}
      <div className="form-section">
        <SectionHeader
          icon={<User />}
          iconColor="purple"
          title="Your Details"
          subtitle="Your business information"
        />
        <div className="form-section__content">
          <div className="logo-upload">
            <div className="logo-upload__preview" onClick={() => fileRef.current?.click()}>
              {invoice.logo ? (
                <img src={invoice.logo} alt="Logo" />
              ) : (
                <Image />
              )}
            </div>
            <div className="logo-upload__actions">
              <button
                type="button"
                className="logo-upload__btn"
                onClick={() => fileRef.current?.click()}
              >
                <Upload size={14} />
                {invoice.logo ? 'Change Logo' : 'Upload Logo'}
              </button>
              <span className="logo-upload__hint">PNG, JPG up to 2MB</span>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleLogoSelect}
              style={{ display: 'none' }}
            />
          </div>

          <div className="input-grid" style={{ marginTop: 16 }}>
            <InputField
              label="Business Name"
              name="businessName"
              value={invoice.businessName}
              onChange={onChange}
              placeholder="Acme Inc."
              fullWidth
            />
            <InputField
              label="Your Name"
              name="senderName"
              value={invoice.senderName}
              onChange={onChange}
              placeholder="John Doe"
            />
            <InputField
              label="Email"
              name="senderEmail"
              value={invoice.senderEmail}
              onChange={onChange}
              type="email"
              placeholder="you@example.com"
              error={errors.senderEmail}
              onBlur={() => validateEmail('senderEmail', invoice.senderEmail)}
            />
            <InputField
              label="Phone"
              name="senderPhone"
              value={invoice.senderPhone}
              onChange={onChange}
              placeholder="+1 (555) 000-0000"
            />
            <InputField
              label="Address"
              name="senderAddress"
              value={invoice.senderAddress}
              onChange={onChange}
              placeholder="123 Main St, City, State"
              fullWidth
            />
          </div>
        </div>
      </div>

      {/* ── Section 2: Bill To ── */}
      <div className="form-section">
        <SectionHeader
          icon={<Building2 />}
          iconColor="blue"
          title="Bill To"
          subtitle="Your client's information"
        />
        <div className="form-section__content">
          <div className="input-grid">
            <InputField
              label="Client Name"
              name="clientName"
              value={invoice.clientName}
              onChange={onChange}
              placeholder="Jane Smith"
            />
            <InputField
              label="Company"
              name="clientCompany"
              value={invoice.clientCompany}
              onChange={onChange}
              placeholder="Client Corp."
            />
            <InputField
              label="Email"
              name="clientEmail"
              value={invoice.clientEmail}
              onChange={onChange}
              type="email"
              placeholder="client@example.com"
              error={errors.clientEmail}
              onBlur={() => validateEmail('clientEmail', invoice.clientEmail)}
            />
            <InputField
              label="Address"
              name="clientAddress"
              value={invoice.clientAddress}
              onChange={onChange}
              placeholder="456 Oak Ave, City, State"
            />
          </div>
        </div>
      </div>

      {/* ── Section 3: Invoice Info ── */}
      <div className="form-section">
        <SectionHeader
          icon={<Hash />}
          iconColor="green"
          title="Invoice Info"
          subtitle="Invoice number and dates"
        />
        <div className="form-section__content">
          <div className="input-grid">
            <InputField
              label="Invoice Number"
              name="invoiceNumber"
              value={invoice.invoiceNumber}
              onChange={onChange}
              placeholder="INV-2026-0001"
            />
            <InputField
              label="Currency"
              name="currency"
              value={invoice.currency}
              onChange={onChange}
              type="select"
              options={CURRENCY_OPTIONS}
            />
            <InputField
              label="Invoice Date"
              name="invoiceDate"
              value={invoice.invoiceDate}
              onChange={onChange}
              type="date"
            />
            <InputField
              label="Due Date"
              name="dueDate"
              value={invoice.dueDate}
              onChange={onChange}
              type="date"
            />
          </div>
        </div>
      </div>

      {/* ── Section 4: Line Items ── */}
      <div className="form-section">
        <SectionHeader
          icon={<Receipt />}
          iconColor="orange"
          title="Line Items"
          subtitle="Products or services"
        />
        <div className="form-section__content">
          <div className="items-header">
            <span>Description</span>
            <span>Qty</span>
            <span>Rate</span>
            <span>Amount</span>
            <span></span>
          </div>

          {invoice.items.map((item) => {
            const amount = item.quantity * item.rate;
            return (
              <div
                key={item.id}
                className={`item-row${removingId === item.id ? ' item-row--removing' : ''}`}
              >
                <input
                  className="input-group__input"
                  value={item.description}
                  onChange={(e) => onItemChange(item.id, 'description', e.target.value)}
                  placeholder="Item description"
                />
                <input
                  className="input-group__input"
                  type="number"
                  min="0"
                  step="1"
                  value={item.quantity || ''}
                  onChange={(e) => onItemChange(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                  placeholder="1"
                  style={{ textAlign: 'right' }}
                />
                <input
                  className="input-group__input"
                  type="number"
                  min="0"
                  step="0.01"
                  value={item.rate || ''}
                  onChange={(e) => onItemChange(item.id, 'rate', parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                  style={{ textAlign: 'right' }}
                />
                <div className="item-row__amount">
                  {formatCurrency(amount, invoice.currency)}
                </div>
                <button
                  type="button"
                  className="item-row__remove"
                  onClick={() => handleRemove(item.id)}
                  disabled={invoice.items.length <= 1}
                  title="Remove item"
                  style={invoice.items.length <= 1 ? { opacity: 0.3, cursor: 'not-allowed' } : {}}
                >
                  <X size={16} />
                </button>
              </div>
            );
          })}

          {invoice.items.length < MAX_ITEMS && (
            <button type="button" className="add-item-btn" onClick={onAddItem}>
              <Plus size={16} />
              Add Item
            </button>
          )}
        </div>
      </div>

      {/* ── Section 5: Adjustments ── */}
      <div className="form-section">
        <SectionHeader
          icon={<Percent />}
          iconColor="pink"
          title="Adjustments"
          subtitle="Discount and tax"
        />
        <div className="form-section__content">
          <div className="adjustments-grid">
            <div className="adjustment-item">
              <InputField
                label="Discount %"
                name="discountPercent"
                value={invoice.discountPercent || ''}
                onChange={(name, val) => onChange(name, Math.min(100, Math.max(0, val)))}
                type="number"
                min="0"
                max="100"
                step="0.5"
                placeholder="0"
              />
            </div>
            <div className="adjustment-item">
              <InputField
                label="Tax / GST %"
                name="taxPercent"
                value={invoice.taxPercent || ''}
                onChange={(name, val) => onChange(name, Math.min(100, Math.max(0, val)))}
                type="number"
                min="0"
                max="100"
                step="0.5"
                placeholder="0"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Section 6: Notes ── */}
      <div className="form-section">
        <SectionHeader
          icon={<StickyNote />}
          iconColor="teal"
          title="Notes / Payment Terms"
          subtitle="Additional information for your client"
        />
        <div className="form-section__content">
          <div className="input-grid">
            <InputField
              label="Notes"
              name="notes"
              value={invoice.notes}
              onChange={onChange}
              type="textarea"
              placeholder="Payment due within 14 days. Bank: Account Name, BSB: 000-000, Account: 12345678. Thank you for your business!"
              fullWidth
            />
          </div>
        </div>
      </div>
    </div>
  );
}
