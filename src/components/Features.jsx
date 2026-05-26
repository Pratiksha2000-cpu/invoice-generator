import React from 'react';
import { Zap, Eye, Globe, Shield, Palette, FileDown } from 'lucide-react';

const FEATURES = [
  {
    icon: <Eye />,
    color: 'purple',
    title: 'Live Preview',
    desc: 'See your invoice update in real-time as you type. What you see is exactly what you get in the PDF.',
  },
  {
    icon: <Zap />,
    color: 'orange',
    title: 'Lightning Fast',
    desc: 'No loading screens, no server calls. Everything runs instantly in your browser — fill, preview, download.',
  },
  {
    icon: <Globe />,
    color: 'blue',
    title: 'Multi-Currency',
    desc: 'Support for USD, EUR, GBP, INR, AUD, and CAD. Switch currencies and see amounts update everywhere.',
  },
  {
    icon: <Shield />,
    color: 'green',
    title: '100% Private',
    desc: 'Your data never leaves your browser. No accounts, no servers, no tracking. Your invoices stay yours.',
  },
  {
    icon: <Palette />,
    color: 'pink',
    title: 'Beautiful Output',
    desc: 'Generate clean, professionally designed PDFs that make your business look polished and established.',
  },
  {
    icon: <FileDown />,
    color: 'teal',
    title: 'No Watermarks',
    desc: 'Unlike other free tools, your invoices are completely clean. No branding, no watermarks, no strings attached.',
  },
];

export default function Features() {
  return (
    <section className="features-section" id="features">
      <div className="container">
        <div className="section-label">
          <Zap size={16} />
          Why choose Invoicely
        </div>
        <h2 className="section-title">Everything you need, nothing you don't.</h2>
        <p className="section-subtitle">
          Built for freelancers and small businesses who want professional
          invoices without the overhead of complex accounting software.
        </p>

        <div className="features-grid">
          {FEATURES.map((f) => (
            <div key={f.title} className="feature-card">
              <div className={`feature-card__icon feature-card__icon--${f.color}`}>
                {f.icon}
              </div>
              <h3 className="feature-card__title">{f.title}</h3>
              <p className="feature-card__desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
