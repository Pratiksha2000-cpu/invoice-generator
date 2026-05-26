import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Download, Printer, Eye, X } from 'lucide-react';
import { INITIAL_INVOICE, CURRENCIES } from './constants';
import { getCalculations, getCurrencySymbol, generatePDF } from './helpers';

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import InvoiceForm from './components/InvoiceForm';
import InvoicePreview from './components/InvoicePreview';
import Features from './components/Features';
import HowToUse from './components/HowToUse';
import Footer from './components/Footer';
import Toast from './components/Toast';

let nextItemId = 2;

export default function App() {
  const [invoice, setInvoice] = useState(INITIAL_INVOICE);
  const [scrolled, setScrolled] = useState(false);
  const [toast, setToast] = useState({ message: '', visible: false });
  const [showMobilePreview, setShowMobilePreview] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 20);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const calculations = useMemo(
    () => getCalculations(invoice.items, invoice.discountPercent, invoice.taxPercent),
    [invoice.items, invoice.discountPercent, invoice.taxPercent]
  );

  const currencySymbol = getCurrencySymbol(invoice.currency);

  const handleChange = useCallback((field, value) => {
    setInvoice((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleItemChange = useCallback((id, field, value) => {
    setInvoice((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  }, []);

  const handleAddItem = useCallback(() => {
    setInvoice((prev) => ({
      ...prev,
      items: [...prev.items, { id: nextItemId++, description: '', quantity: 1, rate: 0 }],
    }));
  }, []);

  const handleRemoveItem = useCallback((id) => {
    setInvoice((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== id),
    }));
  }, []);

  const handleLogoUpload = useCallback((base64) => {
    setInvoice((prev) => ({ ...prev, logo: base64 }));
  }, []);

  function showToast(message) {
    setToast({ message, visible: true });
    setTimeout(() => setToast({ message: '', visible: false }), 3000);
  }

  async function handleDownload() {
    try {
      const filename = await generatePDF(invoice, calculations);
      showToast(`Invoice downloaded \u2713`);
    } catch (err) {
      console.error('PDF generation failed:', err);
      showToast('Failed to generate PDF. Please try again.');
    }
  }

  function handlePrint() {
    window.print();
  }

  return (
    <>
      <Navbar scrolled={scrolled} onDownload={handleDownload} />
      <Hero />

      {/* ── AdSense Slot: Top Banner ── */}
      <div className="ad-placeholder">
        <div className="ad-placeholder__inner">
          {/* AdSense Slot: Top Banner — Replace with your ad code */}
          Advertisement
        </div>
      </div>

      {/* ── Invoice Tool ── */}
      <section className="invoice-tool" id="invoice-tool">
        <div className="invoice-tool__inner">
          <InvoiceForm
            invoice={invoice}
            onChange={handleChange}
            onItemChange={handleItemChange}
            onAddItem={handleAddItem}
            onRemoveItem={handleRemoveItem}
            onLogoUpload={handleLogoUpload}
          />

          <div className="preview-panel">
            <InvoicePreview
              invoice={invoice}
              calculations={calculations}
              currencySymbol={currencySymbol}
            />

            <div className="download-actions">
              <button className="btn btn--primary" onClick={handleDownload}>
                <Download size={18} />
                Download Invoice as PDF
              </button>
              <button className="btn btn--secondary" onClick={handlePrint}>
                <Printer size={18} />
                Print
              </button>
            </div>
          </div>
        </div>
      </section>

      <Features />
      <HowToUse />

      {/* ── About ── */}
      <section className="about-section" id="about">
        <div className="about-section__inner container">
          <div className="section-label">About Invoicely</div>
          <h2 className="section-title">Built for people who value their time.</h2>
          <p>
            Invoicely was created for freelancers, consultants, and small business owners
            who need a fast, beautiful way to create invoices — without signing up for
            yet another SaaS tool.
          </p>
          <p>
            Everything runs entirely in your browser. Your data is never sent to any server,
            never stored anywhere, and never shared with anyone. When you close the tab,
            it's gone. That's a feature, not a bug.
          </p>
          <p>
            It's free, it's fast, and it's yours. No watermarks, no upsells, no catch.
          </p>
        </div>
      </section>

      {/* ── AdSense Slot: Bottom Banner ── */}
      <div className="ad-placeholder">
        <div className="ad-placeholder__inner">
          {/* AdSense Slot: Bottom Banner — Replace with your ad code */}
          Advertisement
        </div>
      </div>

      <Footer />
      <Toast message={toast.message} visible={toast.visible} />

      {/* ── Mobile Preview Toggle ── */}
      <button
        className="mobile-preview-toggle"
        onClick={() => setShowMobilePreview(true)}
        aria-label="Preview invoice"
      >
        <Eye />
      </button>

      {/* ── Mobile Preview Modal ── */}
      {showMobilePreview && (
        <>
          <div
            className="mobile-preview-overlay"
            onClick={() => setShowMobilePreview(false)}
          />
          <div className="mobile-preview-modal">
            <div className="mobile-preview-modal__header">
              <span className="mobile-preview-modal__title">Invoice Preview</span>
              <button
                className="mobile-preview-modal__close"
                onClick={() => setShowMobilePreview(false)}
              >
                <X size={18} />
              </button>
            </div>

            <InvoicePreview
              invoice={invoice}
              calculations={calculations}
              currencySymbol={currencySymbol}
            />

            <div className="download-actions" style={{ padding: '16px 0 0' }}>
              <button className="btn btn--primary" onClick={handleDownload}>
                <Download size={18} />
                Download PDF
              </button>
              <button className="btn btn--secondary" onClick={handlePrint}>
                <Printer size={18} />
                Print
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
