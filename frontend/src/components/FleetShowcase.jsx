import React from 'react';

export default function FleetShowcase({ settings }) {
  const frontFare = settings?.frontSeatFare || 649;
  const middleFare = settings?.middleSeatFare || 499;
  const thirdFare = settings?.thirdSeatFare || 399;

  return (
    <section className="container" style={{ padding: '70px 0' }} id="ev-fleet">
      <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 40px' }}>
        <span style={{ background: 'rgba(0, 177, 0, 0.15)', color: '#00B100', padding: '6px 18px', borderRadius: '20px', fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase' }}>
          ⚡ Exclusive 100% Electric Fleet
        </span>
        <h2 style={{ fontFamily: 'Outfit', fontSize: '2.6rem', fontWeight: 900, color: '#0C0E2E', marginTop: '8px' }}>
          Meet the VinFast Limo Green EV
        </h2>
        <p style={{ color: '#475569', fontSize: '1.05rem' }}>
          Our flagship luxury electric SUV operating daily zero-emission express trips between Kolhapur and Pune.
        </p>
      </div>

      {/* EXCLUSIVE VINFAST LIMO GREEN EV CARD */}
      <div className="ev-vehicle-card">
        <div>
          <img 
            src="/vinfast_limo_green.jpg" 
            alt="VinFast Limo Green Electric SUV" 
            className="ev-car-img" 
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#DCFCE7', color: '#15803D', width: 'max-content', padding: '4px 12px', borderRadius: '20px', fontWeight: 'bold', fontSize: '0.8rem' }}>
            <i className="fa-solid fa-leaf"></i> 100% ELECTRIC ZERO EMISSIONS
          </div>

          <h3 style={{ fontFamily: 'Outfit', fontSize: '2rem', fontWeight: 900, color: '#0C0E2E' }}>
            VinFast Limo Green EV (7-Seater)
          </h3>

          <p style={{ color: '#475569', fontSize: '0.98rem' }}>
            Powered by advanced electric powertrain technology, offering a whisper-quiet cabin, panoramic glass roof, dual-zone climate control AC, and plush leatherette recliners.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', background: '#F8FAFC', padding: '16px', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: '0.88rem', fontWeight: 'bold', color: '#0F172A' }}>
              <i className="fa-solid fa-bolt" style={{ color: '#00B100', marginRight: '6px' }}></i> Range: 450 KM / Charge
            </div>
            <div style={{ fontSize: '0.88rem', fontWeight: 'bold', color: '#0F172A' }}>
              <i className="fa-solid fa-volume-xmark" style={{ color: '#00B100', marginRight: '6px' }}></i> Silent Cabin Ride
            </div>
            <div style={{ fontSize: '0.88rem', fontWeight: 'bold', color: '#0F172A' }}>
              <i className="fa-solid fa-snowflake" style={{ color: '#00E5FF', marginRight: '6px' }}></i> Dual Climate AC
            </div>
            <div style={{ fontSize: '0.88rem', fontWeight: 'bold', color: '#0F172A' }}>
              <i className="fa-solid fa-plug" style={{ color: '#00B100', marginRight: '6px' }}></i> USB Fast Charging
            </div>
          </div>

          {/* Dynamic Seat Tiers Pricing Box */}
          <div id="seat-rates" style={{ background: '#F0FDF4', border: '2px solid #00B100', borderRadius: '16px', padding: '16px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#059669', textTransform: 'uppercase' }}>Live Dynamic Seat Fares</span>
            
            <div style={{ display: 'flex', justifyBetween: 'space-between', alignItems: 'center', marginTop: '10px' }}>
              <div>
                <strong style={{ color: '#0C0E2E' }}>⭐ Front Row (VIP)</strong>
                <span style={{ display: 'block', fontSize: '0.75rem', color: '#64748B' }}>Co-passenger luxury view</span>
              </div>
              <span style={{ fontFamily: 'Outfit', fontSize: '1.25rem', fontWeight: 900, color: '#00B100' }}>₹{frontFare} / seat</span>
            </div>

            <div style={{ display: 'flex', justifyBetween: 'space-between', alignItems: 'center', marginTop: '8px', borderTop: '1px solid #DCFCE7', paddingTop: '8px' }}>
              <div>
                <strong style={{ color: '#0C0E2E' }}>👍 Middle Row (Comfort)</strong>
                <span style={{ display: 'block', fontSize: '0.75rem', color: '#64748B' }}>Bucket recliner seating</span>
              </div>
              <span style={{ fontFamily: 'Outfit', fontSize: '1.25rem', fontWeight: 900, color: '#2563EB' }}>₹{middleFare} / seat</span>
            </div>

            <div style={{ display: 'flex', justifyBetween: 'space-between', alignItems: 'center', marginTop: '8px', borderTop: '1px solid #DCFCE7', paddingTop: '8px' }}>
              <div>
                <strong style={{ color: '#0C0E2E' }}>💰 Third Row (Economy)</strong>
                <span style={{ display: 'block', fontSize: '0.75rem', color: '#64748B' }}>Economy budget saver</span>
              </div>
              <span style={{ fontFamily: 'Outfit', fontSize: '1.25rem', fontWeight: 900, color: '#059669' }}>₹{thirdFare} / seat</span>
            </div>
          </div>

          <a href="#booking-pill" className="btn-green" style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '1.05rem', marginTop: '10px' }}>
            <i className="fa-solid fa-charging-station"></i> Book Seat in VinFast Limo Green EV
          </a>
        </div>
      </div>
    </section>
  );
}
