import React from 'react';
import { FileText, Download, Menu } from 'lucide-react';

export default function Navbar({ scrolled, onDownload }) {
  return (
    <nav className={`navbar${scrolled ? ' navbar--scrolled' : ''}`}>
      <div className="navbar__inner">
        <a href="#" className="navbar__logo">
          <span className="navbar__logo-icon">
            <FileText />
          </span>
          Invoicely
        </a>

        <ul className="navbar__links">
          <li><a href="#features">Features</a></li>
          <li><a href="#how-it-works">How it works</a></li>
          <li><a href="#about">About</a></li>
        </ul>

        <button className="navbar__cta" onClick={onDownload}>
          <Download size={16} />
          Download PDF
        </button>

        <button className="navbar__mobile-toggle" aria-label="Menu">
          <Menu size={22} />
        </button>
      </div>
    </nav>
  );
}
