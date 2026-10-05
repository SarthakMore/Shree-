import React from 'react';

export default function Navbar({ currentPage, onNavigate, onOpenAdmin }) {
  const handleNavClick = (e, page, targetUrl) => {
    if (onNavigate) {
      e.preventDefault();
      onNavigate(page);
    }
  };

  return (
    <>
      <div className="top-bar" style={{ background: '#0F172A', color: '#F8FAFC', padding: '10px 24px', fontSize: '0.88rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div>
          <i className="fa-solid fa-leaf" style={{ color: '#10B981', marginRight: '6px' }}></i>
          Premium Cars, Thoughtful Service | Hotline: <a href="tel:+918669410303" style={{ color: '#38BDF8', textDecoration: 'none', fontWeight: 'bold' }}>866 941 0303</a>
        </div>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <span><i className="fa-solid fa-user-check" style={{ color: '#10B981' }}></i> Skilled, Reliable Drivers</span>
        </div>
      </div>

      <nav className="navbar" style={{ background: '#FFFFFF', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', sticky: 'top', top: 0, zIndex: 100 }}>
        <a href="index.html" onClick={(e) => handleNavClick(e, 'home', 'index.html')} className="brand-logo" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
          <div className="logo-icon" style={{ background: '#2563EB', color: '#FFFFFF', width: '42px', height: '42px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>
            <i className="fa-solid fa-bolt-lightning"></i>
          </div>
          <div className="logo-text">
            <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', margin: 0, lineHeight: 1.1 }}>SHREE VENKATESHWARA</h1>
            <span style={{ fontSize: '0.72rem', color: '#2563EB', fontWeight: 700, letterSpacing: '0.5px' }}>PREMIUM CAR RENTALS</span>
          </div>
        </a>

        <ul className="nav-links" style={{ display: 'flex', gap: '16px', listStyle: 'none', margin: 0, padding: 0 }}>
          <li>
            <a
              href="index.html"
              onClick={(e) => handleNavClick(e, 'home', 'index.html')}
              style={{ padding: '8px 14px', borderRadius: '8px', textDecoration: 'none', fontWeight: 700, fontSize: '0.92rem', color: currentPage === 'home' ? '#FFFFFF' : '#334155', background: currentPage === 'home' ? '#2563EB' : 'transparent' }}
            >
              1. Home
            </a>
          </li>
          <li>
            <a
              href="login.html"
              onClick={(e) => handleNavClick(e, 'login', 'login.html')}
              style={{ padding: '8px 14px', borderRadius: '8px', textDecoration: 'none', fontWeight: 700, fontSize: '0.92rem', color: currentPage === 'login' ? '#FFFFFF' : '#334155', background: currentPage === 'login' ? '#2563EB' : 'transparent' }}
            >
              2. Login Portal
            </a>
          </li>
          <li>
            <a
              href="#rental-fleet"
              onClick={(e) => {
                e.preventDefault();
                if (currentPage !== 'home' && onNavigate) {
                  onNavigate('home');
                  window.requestAnimationFrame(() => document.getElementById('rental-fleet')?.scrollIntoView({ behavior: 'smooth' }));
                  return;
                }
                document.getElementById('rental-fleet')?.scrollIntoView({ behavior: 'smooth' });
              }}
              style={{ padding: '8px 14px', borderRadius: '8px', textDecoration: 'none', fontWeight: 700, fontSize: '0.92rem', color: '#334155' }}
            >
              3. Rent A Car
            </a>
          </li>
          <li>
            <a
              href="shared-cabs.html"
              title="Coming Soon"
              aria-label="Additional Rental Services, Coming Soon"
              onClick={(e) => handleNavClick(e, 'shared-cabs', 'shared-cabs.html')}
              style={{ padding: '8px 14px', borderRadius: '8px', textDecoration: 'none', fontWeight: 700, fontSize: '0.92rem', color: currentPage === 'shared-cabs' ? '#FFFFFF' : '#334155', background: currentPage === 'shared-cabs' ? '#2563EB' : 'transparent' }}
            >
              <i className="fa-regular fa-clock" aria-hidden="true"></i> Coming Soon
            </a>
          </li>
          <li>
            <a
              href="airport-tours.html"
              onClick={(e) => handleNavClick(e, 'airport-tours', 'airport-tours.html')}
              style={{ padding: '8px 14px', borderRadius: '8px', textDecoration: 'none', fontWeight: 700, fontSize: '0.92rem', color: currentPage === 'airport-tours' ? '#FFFFFF' : '#334155', background: currentPage === 'airport-tours' ? '#2563EB' : 'transparent' }}
            >
              4. Airport & Tours
            </a>
          </li>
        </ul>

        <div style={{ display: 'flex', gap: '10px' }}>
          <a href="tel:+918669410303" className="btn-phone" style={{ border: '2px solid #2563EB', color: '#2563EB', padding: '8px 16px', borderRadius: '10px', textDecoration: 'none', fontWeight: 700, fontSize: '0.88rem' }}>
            <i className="fa-solid fa-phone"></i> 866 941 0303
          </a>
        </div>
      </nav>
    </>
  );
}
