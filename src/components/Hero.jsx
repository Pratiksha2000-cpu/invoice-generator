import React from 'react';
import { Sparkles, CheckCircle } from 'lucide-react';

const TRUST_ITEMS = [
  'No signup required',
  'Free forever',
  'Download as PDF',
  'No watermark',
  'Privacy first',
];

export default function Hero() {
  return (
    <section className="hero">
      <div className="container">
        <div className="hero__badge">
          <Sparkles />
          Professional invoices, zero effort
        </div>

        <h1 className="hero__title">
          Create <span>stunning</span> invoices<br />in seconds.
        </h1>

        <p className="hero__subtitle">
          The fastest way to create polished, professional invoices.
          Fill in your details, see a live preview, and download a
          pixel-perfect PDF — completely free.
        </p>

        <div className="hero__trust">
          {TRUST_ITEMS.map((item) => (
            <div key={item} className="hero__trust-item">
              <CheckCircle />
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
