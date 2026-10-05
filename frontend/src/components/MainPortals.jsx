import React from 'react';

export default function MainPortals() {
  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section style={{ padding: '56px 0', background: '#FFFFFF' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 20px' }}>

        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <span style={{ background: 'rgba(37, 99, 235, 0.1)', color: '#2563EB', padding: '6px 16px', borderRadius: '9999px', fontWeight: 'bold', fontSize: '0.85rem' }}>
            <i className="fa-solid fa-route"></i> Select Service Category
          </span>
          <h2 style={{ fontSize: '2.2rem', fontWeight: '800', margin: '12px 0 8px', color: '#111827' }}>
            Where Would You Like To Travel?
          </h2>
          <p style={{ color: '#64748B', fontSize: '1.05rem' }}>
            Choose a premium car for a comfortable, reliable journey.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>

          {/* ADDITIONAL RENTAL SERVICES: COMING SOON */}
          <div
            style={{
              background: '#F8FAFC', border: '2px solid #E2E8F0', borderRadius: '20px', padding: '36px 32px',
              transition: 'all 0.3s ease', display: 'flex', flexDirection: 'column'
            }}
            className="portal-hover-card"
          >
            <div style={{ alignSelf: 'flex-start', background: 'rgba(37, 99, 235, 0.1)', color: '#2563EB', padding: '6px 14px', borderRadius: '9999px', fontWeight: 'bold', fontSize: '0.75rem', marginBottom: '20px' }}>
              <i className="fa-regular fa-clock"></i> Coming Soon
            </div>

            <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'linear-gradient(135deg, #2563EB, #1D4ED8)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', marginBottom: '20px', boxShadow: '0 8px 16px rgba(37, 99, 235, 0.25)' }}>
              <i className="fa-regular fa-clock" aria-hidden="true"></i>
            </div>

            <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '10px', color: '#111827' }}>
              Additional Rental Services
            </h3>

            <p style={{ fontSize: '0.95rem', color: '#64748B', lineHeight: '1.6', marginBottom: '24px' }}>
              We're preparing more convenient ways to book with us.
            </p>

            <div style={{ marginTop: 'auto', background: '#E2E8F0', color: '#475569', fontWeight: 'bold', padding: '14px 20px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <i className="fa-regular fa-clock" aria-hidden="true"></i> Coming Soon
            </div>
          </div>

          {/* MAIN CLICKABLE OPTION 2: AIRPORT & FULL VEHICLE HIRE */}
          <div
            onClick={() => scrollToSection('maharashtra-tours')}
            style={{
              background: '#F8FAFC', border: '2px solid #E2E8F0', borderRadius: '20px', padding: '36px 32px',
              cursor: 'pointer', transition: 'all 0.3s ease', display: 'flex', flexDirection: 'column'
            }}
            className="portal-hover-card"
          >
            <div style={{ alignSelf: 'flex-start', background: 'rgba(249, 115, 22, 0.1)', color: '#F97316', padding: '6px 14px', borderRadius: '9999px', fontWeight: 'bold', fontSize: '0.75rem', marginBottom: '20px' }}>
              <i className="fa-solid fa-plane"></i> Dedicated Full Vehicle
            </div>

            <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'linear-gradient(135deg, #F97316, #EA580C)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', marginBottom: '20px', boxShadow: '0 8px 16px rgba(249, 115, 22, 0.25)' }}>
              <i className="fa-solid fa-car-side"></i>
            </div>

            <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '10px', color: '#111827' }}>
              Airport & Full Vehicle Hire
            </h3>

            <p style={{ fontSize: '0.95rem', color: '#64748B', lineHeight: '1.6', marginBottom: '24px' }}>
              Private airport transfers and custom trips with premium cars, skilled drivers, and clear quotes.
            </p>

            <div style={{ marginTop: 'auto', background: 'linear-gradient(135deg, #F97316, #EA580C)', color: '#FFFFFF', fontWeight: 'bold', padding: '14px 20px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 4px 12px rgba(249, 115, 22, 0.3)' }}>
              <span><i className="fa-solid fa-map-location-dot"></i> View Full Hire & Tour Packages</span>
              <i className="fa-solid fa-arrow-right"></i>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
