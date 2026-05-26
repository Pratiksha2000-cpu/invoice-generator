import React from 'react';
import { formatCurrency, formatDisplayDate } from '../helpers';

function Placeholder({ text }) {
  return <span className="preview__placeholder">{text}</span>;
}

export default function InvoicePreview({ invoice, calculations, currencySymbol }) {
  const {
    businessName, senderName, senderEmail, senderPhone, senderAddress, logo,
    clientName, clientCompany, clientEmail, clientAddress,
    invoiceNumber, invoiceDate, dueDate, currency,
    items, discountPercent, taxPercent, notes,
  } = invoice;

  const { subtotal, discountAmount, taxAmount, total } = calculations;

  const hasSenderDetails = senderName || senderEmail || senderPhone || senderAddress;
  const hasClientDetails = clientName || clientCompany || clientEmail || clientAddress;

  return (
    <div className="preview-document">
      {/* ── Header ── */}
      <div className="preview__header">
        <div>
          {logo && (
            <img src={logo} alt="Logo" className="preview__logo-img" />
          )}
          <div className="preview__logo-text">
            {businessName || <Placeholder text="Your Business Name" />}
          </div>
          {hasSenderDetails && (
            <div className="preview__logo-details">
              {senderName && <>{senderName}<br /></>}
              {senderEmail && <>{senderEmail}<br /></>}
              {senderPhone && <>{senderPhone}<br /></>}
              {senderAddress && <>{senderAddress}</>}
            </div>
          )}
        </div>

        <div className="preview__invoice-right">
          <div className="preview__invoice-label">INVOICE</div>
          <div className="preview__invoice-meta">
            <strong>{invoiceNumber || 'INV-0000'}</strong><br />
            {formatDisplayDate(invoiceDate) || 'Invoice Date'}<br />
            Due: {formatDisplayDate(dueDate) || 'Due Date'}
          </div>
        </div>
      </div>

      {/* ── Addresses ── */}
      <div className="preview__addresses">
        <div>
          <div className="preview__address-label">From</div>
          <div className="preview__address-name">
            {businessName || <Placeholder text="Your Business Name" />}
          </div>
          <div className="preview__address-details">
            {hasSenderDetails ? (
              <>
                {senderName && <>{senderName}<br /></>}
                {senderEmail && <>{senderEmail}<br /></>}
                {senderPhone && <>{senderPhone}<br /></>}
                {senderAddress && <>{senderAddress}</>}
              </>
            ) : (
              <Placeholder text="Your business details" />
            )}
          </div>
        </div>
        <div>
          <div className="preview__address-label">Bill To</div>
          <div className="preview__address-name">
            {clientCompany || clientName || <Placeholder text="Client Name" />}
          </div>
          <div className="preview__address-details">
            {hasClientDetails ? (
              <>
                {clientCompany && clientName && <>{clientName}<br /></>}
                {clientEmail && <>{clientEmail}<br /></>}
                {clientAddress && <>{clientAddress}</>}
              </>
            ) : (
              <Placeholder text="Client details" />
            )}
          </div>
        </div>
      </div>

      {/* ── Items Table ── */}
      <div className="preview__items">
        <div className="preview__items-header">
          <span>Description</span>
          <span>Qty</span>
          <span>Rate</span>
          <span>Amount</span>
        </div>
        {items.map((item) => {
          const amount = item.quantity * item.rate;
          return (
            <div key={item.id} className="preview__items-row">
              <span>{item.description || <Placeholder text="Item description" />}</span>
              <span>{item.quantity}</span>
              <span>{formatCurrency(item.rate, currency)}</span>
              <span>{formatCurrency(amount, currency)}</span>
            </div>
          );
        })}
      </div>

      {/* ── Totals ── */}
      <div className="preview__totals">
        <div className="preview__totals-table">
          <div className="preview__totals-row">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal, currency)}</span>
          </div>

          {discountPercent > 0 && (
            <div className="preview__totals-row preview__totals-row--discount">
              <span>Discount ({discountPercent}%)</span>
              <span>-{formatCurrency(discountAmount, currency)}</span>
            </div>
          )}

          {taxPercent > 0 && (
            <div className="preview__totals-row">
              <span>Tax / GST ({taxPercent}%)</span>
              <span>{formatCurrency(taxAmount, currency)}</span>
            </div>
          )}

          <div className="preview__totals-row preview__totals-row--total">
            <span>Total</span>
            <span>{formatCurrency(total, currency)}</span>
          </div>
        </div>
      </div>

      {/* ── Notes ── */}
      {notes && (
        <div className="preview__notes">
          <div className="preview__notes-label">Notes</div>
          <div className="preview__notes-text">{notes}</div>
        </div>
      )}

      {/* ── Footer ── */}
      <div className="preview__footer">
        <p>Thank you for your business.</p>
      </div>
    </div>
  );
}
