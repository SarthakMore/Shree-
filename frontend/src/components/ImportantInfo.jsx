import React from 'react';

export default function ImportantInfo({ onOpenQuote }) {
  return (
    <section className="container" style={{ padding: '60px 0' }} id="info">
      <div style={{ background: 'linear-gradient(135deg, #0F172A, #1E293B)', color: 'white', padding: '40px', borderRadius: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', boxShadow: '0 20px 40px rgba(15,23,42,0.3)' }}>
        <div style={{ display: 'flex', gap: '16px' }}>
          <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: 'rgba(255, 159, 28, 0.2)', color: '#FFB703', display: 'flex', alignItems: 'center', justifyCenter: 'center', fontSize: '1.4rem', flexShrink: 0 }}>
            <i className="fa-solid fa-users-rays" style={{ margin: 'auto' }}></i>
          </div>
          <div>
            <h4 style={{ fontFamily: 'Outfit', fontSize: '1.25rem', fontWeight: 800, color: 'white', marginBottom: '8px' }}>
              Rentals With or Without a Driver
            </h4>
            <p style={{ color: '#CBD5E1', fontSize: '0.92rem' }}>
              Choose a premium car for self-drive freedom or travel with a skilled, professional driver.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '16px' }}>
          <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: 'rgba(0, 229, 255, 0.2)', color: '#00E5FF', display: 'flex', alignItems: 'center', justifyCenter: 'center', fontSize: '1.4rem', flexShrink: 0 }}>
            <i className="fa-solid fa-car-side" style={{ margin: 'auto' }}></i>
          </div>
          <div>
            <h4 style={{ fontFamily: 'Outfit', fontSize: '1.25rem', fontWeight: 800, color: 'white', marginBottom: '8px' }}>
              Airport & Full Vehicle Hire
            </h4>
            <p style={{ color: '#CBD5E1', fontSize: '0.92rem' }}>
              Arrange a dependable airport transfer or private trip with a punctual pickup and a clear, affordable quote.
            </p>
            <button onClick={onOpenQuote} className="btn-cyan" style={{ marginTop: '12px', padding: '8px 16px', fontSize: '0.85rem' }}>
              <i className="fa-solid fa-paper-plane"></i> Request Custom Quote
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
