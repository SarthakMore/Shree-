import React, { useState } from 'react';

export default function FareCalculator() {
  const [cabType, setCabType] = useState('shared_middle');

  const calculateTotal = () => {
    if (cabType === 'shared_front') return 649;
    if (cabType === 'shared_middle') return 499;
    if (cabType === 'shared_third') return 399;
    if (cabType === 'ev_full') return 3600;
    return 499;
  };

  return (
    <section className="container" style={{ padding: '60px 0' }} id="calculator">
      <div style={{ background: 'linear-gradient(135deg, #0C0E2E 0%, #059669 100%)', borderRadius: '28px', padding: '48px', color: 'white', boxShadow: '0 20px 50px rgba(0, 177, 0, 0.3)' }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <span style={{ background: 'rgba(255, 255, 255, 0.2)', color: '#00E5FF', padding: '4px 16px', borderRadius: '20px', fontWeight: 800, fontSize: '0.8rem', textTransform: 'uppercase' }}>
            ⚡ Electric Tariff Estimator
          </span>
          <h2 style={{ fontFamily: 'Outfit', fontSize: '2.5rem', fontWeight: 900, marginTop: '8px' }}>
            Transparent VinFast EV Kolhapur ⇄ Pune Tariff
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '36px', alignItems: 'center' }}>
          <div>
            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label style={{ color: 'white' }}><i className="fa-solid fa-car-side" style={{ color: '#00E5FF' }}></i> Select EV Seat / Full Cab</label>
              <select className="input-field" style={{ background: '#0C0E2E', color: 'white', borderColor: 'rgba(255,255,255,0.2)' }} value={cabType} onChange={(e) => setCabType(e.target.value)}>
                <option value="shared_front">⭐ Front Row VIP Seat (₹649/Seat)</option>
                <option value="shared_middle">👍 Middle Row Comfort Seat (₹499/Seat)</option>
                <option value="shared_third">💰 Third Row Economy Seat (₹399/Seat)</option>
                <option value="ev_full">⚡ Dedicated Full VinFast Limo Green EV Cab (₹3,600)</option>
              </select>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.1)', padding: '16px', borderRadius: '12px', fontSize: '0.88rem', color: '#E2E8F0' }}>
              <i className="fa-solid fa-leaf" style={{ color: '#00B100' }}></i> 100% Zero Emission Electric Transit. Includes Highway Tolls, Charging & Professional EV Chauffeur.
            </div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.12)', border: '2px solid rgba(255,255,255,0.25)', borderRadius: '24px', padding: '32px', textAlign: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: '#E2E8F0', fontWeight: 'bold', textTransform: 'uppercase' }}>Estimated EV Trip Fare</span>
            <div style={{ fontFamily: 'Outfit', fontSize: '3.4rem', fontWeight: 900, color: '#00E5FF', margin: '10px 0' }}>
              ₹{calculateTotal().toLocaleString('en-IN')}
            </div>
            <p style={{ fontSize: '0.85rem', color: '#CBD5E1', marginBottom: '20px' }}>No Hidden Charges • 100% Clean Green Energy</p>
            <a href="#booking-pill" className="btn-green" style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '1.05rem' }}>
              <i className="fa-solid fa-bolt"></i> Reserve VinFast EV Seat
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
