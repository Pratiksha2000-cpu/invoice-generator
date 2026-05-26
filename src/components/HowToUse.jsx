import React from 'react';
import { Lightbulb } from 'lucide-react';

const STEPS = [
  {
    number: '1',
    title: 'Fill in the details',
    desc: 'Enter your business info, client details, and line items. Everything auto-saves as you type.',
  },
  {
    number: '2',
    title: 'Preview your invoice',
    desc: 'Watch your invoice come to life in the live preview. Adjust anything until it looks perfect.',
  },
  {
    number: '3',
    title: 'Download as PDF',
    desc: 'Hit download and get a polished, professional PDF ready to send to your client. That\'s it.',
  },
];

export default function HowToUse() {
  return (
    <section className="howto-section" id="how-it-works">
      <div className="container">
        <div className="section-label">
          <Lightbulb size={16} />
          Simple as 1-2-3
        </div>
        <h2 className="section-title">How it works</h2>
        <p className="section-subtitle">
          No learning curve. No account setup. Just invoices, done right.
        </p>

        <div className="howto-steps">
          {STEPS.map((step) => (
            <div key={step.number} className="howto-step">
              <div className="howto-step__number">{step.number}</div>
              <h3 className="howto-step__title">{step.title}</h3>
              <p className="howto-step__desc">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
