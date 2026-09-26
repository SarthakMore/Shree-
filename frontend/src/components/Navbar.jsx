import React from 'react';

export default function Navbar({ onOpenAdmin }) {
  return (
    <>
      <div className="top-bar">
        <div>
          <i className="fa-solid fa-leaf" style={{ color: '#00B100', marginRight: '6px' }}></i>
          Same Roads, Greener Tomorrow 🌱 | 24/7 Hotline: <a href="tel:+918668432935" style={{ color: '#00E5FF', textDecoration: 'none', fontWeight: 'bold' }}>+91 866 843 2935</a>
        </div>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <span><i className="fa-solid fa-charging-station" style={{ color: '#00B100' }}></i> 100% EV Zero Emissions</span>
          <button 
            onClick={onOpenAdmin}
            style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid #00B100', color: '#00B100', padding: '3px 12px', borderRadius: '12px', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 'bold' }}
          >
            <i className="fa-solid fa-database"></i> MERN Admin Panel
          </button>
        </div>
      </div>

      <nav className="navbar">
        <a href="#" className="brand-logo">
          <div className="logo-icon">
            <i className="fa-solid fa-bolt-lightning"></i>
          </div>
          <div className="logo-text">
            <h1>SHREE VENKATESWARA</h1>
            <span>100% ELECTRIC SHARED CABS</span>
          </div>
        </a>

        <ul className="nav-links">
          <li><a href="#hero">Home</a></li>
          <li><a href="#ev-fleet">VinFast Limo Green EV</a></li>
          <li><a href="#seat-rates">Seat Tiers</a></li>
          <li><a href="#calculator">Tariff Calculator</a></li>
          <li><a href="#faq">FAQ</a></li>
        </ul>

        <a href="#booking-pill" className="btn-green">
          <i className="fa-solid fa-calendar-check"></i> Book EV Seat Now
        </a>
      </nav>
    </>
  );
}
