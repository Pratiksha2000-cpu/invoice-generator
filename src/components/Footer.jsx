import React from 'react';
import { Heart } from 'lucide-react';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <p className="site-footer__copy">
          &copy; {year} Invoicely. All rights reserved.
        </p>

        <p className="site-footer__made">
          Made with <Heart /> by a human who hates ugly invoices
        </p>

        <div className="site-footer__links">
          <a href="#features">Features</a>
          <a href="#how-it-works">How it works</a>
          <a href="#about">About</a>
        </div>
      </div>
    </footer>
  );
}
