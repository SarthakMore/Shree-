import React from 'react';

export default function Footer() {
  return (
    <footer style={{ background: '#0C0E2E', color: 'white', padding: '60px 5% 30px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '36px', marginBottom: '40px' }}>
        <div>
          <div className="brand-logo" style={{ marginBottom: '16px' }}>
            <div className="logo-icon">
              <i className="fa-solid fa-bolt-lightning"></i>
            </div>
            <div className="logo-text">
              <h1 style={{ color: 'white' }}>SHREE VENKATESHWARA</h1>
              <span style={{ color: '#00B100' }}>KOLHAPUR ⇄ PUNE SHARED CABS</span>
            </div>
          </div>
          <p style={{ color: '#94A3B8', fontSize: '0.88rem' }}>
            Kolhapur & Pune's #1 daily 100% electric shared cab platform with VinFast Limo Green EV fleet and 24/7 highway dispatch.
          </p>
        </div>

        <div>
          <h4 style={{ fontFamily: 'Outfit', color: '#00B100', marginBottom: '16px' }}>Highway Route Points</h4>
          <p style={{ color: '#CBD5E1', fontSize: '0.85rem' }}>
            <strong>Kolhapur:</strong> CBS, Kawala Naka, Shiroli Naka<br />
            <strong>Highway:</strong> Toap, Peth Naka, Karad, Umbraj, Satara, Shirwal, Khed Shivapur<br />
            <strong>Pune:</strong> Katraj, Swargate, Hadapsar, Wakad, Hinjewadi, Airport
          </p>
        </div>

        <div>
          <h4 style={{ fontFamily: 'Outfit', color: '#00B100', marginBottom: '16px' }}>24/7 Booking Hotline</h4>
          <p style={{ color: '#CBD5E1', fontSize: '1rem', marginBottom: '10px', fontWeight: 'bold' }}>
            <i className="fa-solid fa-phone" style={{ color: '#00B100', marginRight: '8px' }}></i>
            <a href="tel:+918669410303" style={{ color: '#00E5FF', textDecoration: 'none' }}>+91 866 941 0303</a>
          </p>
          <p style={{ color: '#CBD5E1', fontSize: '0.88rem', marginBottom: '8px' }}>
            <i className="fa-brands fa-whatsapp" style={{ color: '#00E676', marginRight: '8px' }}></i>
            <a href="https://wa.me/918669410303" target="_blank" rel="noreferrer" style={{ color: 'white', textDecoration: 'none' }}>WhatsApp: +91 866 941 0303</a>
          </p>
          <p style={{ color: '#CBD5E1', fontSize: '0.88rem' }}>
            <i className="fa-solid fa-clock" style={{ color: '#00E5FF', marginRight: '8px' }}></i> 24/7 Hourly EV Departures
          </p>
        </div>
      </div>

      <div style={{ textAlign: 'center', paddingTop: '24px', borderTop: '1px solid #1E293B', color: '#64748B', fontSize: '0.82rem' }}>
        &copy; 2026 Shree Venkateshwara Express Shared Cab Service. Hotline: +91 866 941 0303.
      </div>
    </footer>
  );
}
