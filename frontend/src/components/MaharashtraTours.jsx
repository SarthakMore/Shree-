import React, { useState, useEffect } from 'react';
import { API_BASE } from '../api';

const customerCopy = (value = '') => String(value)
  .replace(/100%\s*(?:Electric|EV)|Zero Emissions?/gi, 'Premium comfort')
  .replace(/\b(?:VinFast|Electric|EV|Shared Cabs?|Kolhapur|Pune)\b/gi, '')
  .replace(/\s+/g, ' ')
  .trim();

export default function MaharashtraTours() {
  const [tours, setTours] = useState([]);
  useEffect(() => {
    fetch(`${API_BASE}/api/tours`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setTours(data.data);
        }
      })
      .catch(err => console.log('Tours sync offline fallback'));
  }, []);

  const handleBookPackage = (pkg) => {
    const client = JSON.parse(localStorage.getItem('sv_client_user')) || {};
    const passName = client.name || 'Valued Passenger';
    const passPhone = client.phone || 'Not provided';

    const waMsg = encodeURIComponent(
      `*NEW TOUR PACKAGE BOOKING - SHREE VENKATESHWARA EXPRESS*\n\n` +
      `👤 *Passenger Name:* ${passName}\n` +
      `📞 *Contact Phone:* ${passPhone}\n` +
      `🗺️ *Selected Tour Package:* ${customerCopy(pkg.title)}\n` +
      `💰 *Package Rate:* ₹${pkg.price} (Full Private Vehicle)\n` +
      `⏱️ *Duration:* ${pkg.duration || '1 Day Tour'}\n` +
      `🚘 *Rental:* Premium air-conditioned car with a skilled driver\n\n` +
      `Please confirm my tour package and pickup details!`
    );

    window.open(`https://wa.me/918669410303?text=${waMsg}`, '_blank');
  };

  return (
    <section id="maharashtra-tours" style={{ padding: '64px 0', background: '#F8FAFC', borderTop: '1px solid #E2E8F0' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 20px' }}>

        <div style={{ textAlign: 'center', marginBottom: '44px' }}>
          <span style={{ background: 'rgba(249, 115, 22, 0.1)', color: '#F97316', padding: '6px 16px', borderRadius: '9999px', fontWeight: 'bold', fontSize: '0.85rem' }}>
            <i className="fa-solid fa-map-location-dot"></i> Maharashtra Sightseeing & Outstation
          </span>
          <h2 style={{ fontSize: '2.2rem', fontWeight: '800', margin: '12px 0 8px', color: '#111827' }}>
            Famous Sightseeing & Tour Packages within Maharashtra
          </h2>
          <p style={{ color: '#64748B', fontSize: '1.05rem' }}>
            Explore Maharashtra's top hill stations, sacred pilgrimage temples, and beach gateways with 1-click WhatsApp ticket confirmation to hotline <strong>866 941 0303</strong>!
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px' }}>
          {tours.map(pkg => (
            <div key={pkg._id} style={{ background: '#FFFFFF', borderRadius: '16px', border: '1.5px solid #E2E8F0', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }}>

              <div>
                {pkg.photo && (
                  <div style={{ height: '180px', width: '100%', overflow: 'hidden', position: 'relative' }}>
                    <img src={pkg.photo} alt={pkg.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <span style={{ position: 'absolute', bottom: '12px', right: '12px', background: '#2563EB', color: '#FFFFFF', padding: '4px 12px', borderRadius: '9999px', fontWeight: 'bold', fontSize: '0.82rem' }}>
                      ₹{pkg.price} Total
                    </span>
                  </div>
                )}

                <div style={{ padding: '24px 24px 12px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 'bold', background: 'rgba(37, 99, 235, 0.1)', color: '#2563EB', padding: '4px 10px', borderRadius: '9999px' }}>
                    <i className="fa-solid fa-route"></i> {customerCopy(pkg.destination || 'Maharashtra')} • {pkg.duration || '1 Day Tour'}
                  </span>

                  <h3 style={{ fontSize: '1.25rem', fontWeight: '800', margin: '10px 0 6px', color: '#111827' }}>
                    {customerCopy(pkg.title)}
                  </h3>

                  <p style={{ fontSize: '0.85rem', color: '#64748B', margin: '0 0 16px', lineHeight: 1.5 }}>
                    {customerCopy(pkg.description)}
                  </p>

                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {(pkg.highlights || ['Convenient Pickup', 'Premium comfort']).map((item, i) => (
                      <li key={i} style={{ fontSize: '0.85rem', color: '#475569', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <i className="fa-solid fa-check" style={{ color: '#10B981' }}></i> {customerCopy(item)}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div style={{ padding: '0 24px 24px' }}>
                <button
                  onClick={() => handleBookPackage(pkg)}
                  style={{ width: '100%', background: '#10B981', color: 'white', border: 'none', padding: '12px', borderRadius: '10px', fontSize: '0.95rem', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  <i className="fa-brands fa-whatsapp"></i> Reserve Package on WhatsApp
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
