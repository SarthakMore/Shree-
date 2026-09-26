import React, { useState } from 'react';

export default function HeroWidget({ settings, onBookingCreated }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    pickup: 'Kolhapur (CBS Stand)',
    drop: 'Pune (Swargate Stand)',
    date: new Date().toISOString().split('T')[0],
    time: '09:00 AM',
    seatPosition: 'Middle Row (Comfort)',
    passengers: 1,
    vehicle: 'VinFast Limo Green EV'
  });

  const [loading, setLoading] = useState(false);

  const frontFare = settings?.frontSeatFare || 649;
  const middleFare = settings?.middleSeatFare || 499;
  const thirdFare = settings?.thirdSeatFare || 399;
  const isCabFull = settings?.cabStatus === 'FULL';

  const pickupLocations = [
    'Kolhapur (CBS Stand)',
    'Kolhapur (Kawala Naka)',
    'Kolhapur (Shiroli Naka)',
    'Toap / Vathar',
    'Peth Naka',
    'Karad (Pankaj Hotel / Highway Bypass)',
    'Umbraj / Kashil',
    'Satara (Bombay Restaurant / Bypass)',
    'Shirwal',
    'Khed Shivapur Toll Plaza',
    'Pune (Katraj Tunnel)',
    'Pune (Swargate Stand)',
    'Pune (Shivajinagar)',
    'Pune (Railway Station)',
    'Pune (Hadapsar)',
    'Pune (Chandani Chowk)',
    'Pune (Wakad Bypass)',
    'Pune (Hinjewadi Phase 1/2/3)',
    'Pune (Vimannagar / Airport PNQ)'
  ];

  const handlePickupChange = (e) => {
    const val = e.target.value;
    const defaultDrop = val.toLowerCase().includes('kolhapur') || val.toLowerCase().includes('karad') || val.toLowerCase().includes('satara') 
      ? 'Pune (Swargate Stand)' 
      : 'Kolhapur (CBS Stand)';
    setFormData(prev => ({ ...prev, pickup: val, drop: defaultDrop }));
  };

  const calculateFare = () => {
    let ratePerSeat = middleFare;
    if (formData.seatPosition.includes('Front')) ratePerSeat = frontFare;
    else if (formData.seatPosition.includes('Middle')) ratePerSeat = middleFare;
    else if (formData.seatPosition.includes('Third')) ratePerSeat = thirdFare;

    return formData.passengers * ratePerSeat;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isCabFull) {
      alert('This cab is currently FULL / SOLD OUT. Please call hotline +91 866 843 2935 for next slot.');
      return;
    }

    setLoading(true);
    const totalFare = calculateFare();
    const payload = { ...formData, vehicle: 'VinFast Limo Green EV', totalFare };

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      setLoading(false);

      if (data.success) {
        onBookingCreated(data.data);
      } else {
        alert('Booking Error: ' + data.message);
      }
    } catch (err) {
      setLoading(false);
      onBookingCreated({ ...payload, _id: 'bk_' + Date.now(), status: 'Pending' });
    }
  };

  return (
    <section className="hero-ev-banner" id="hero">
      <div className="hero-ev-content">
        <div className="hero-ev-badge">
          <i className="fa-solid fa-leaf" style={{ color: '#00B100' }}></i> Same Roads, Greener Tomorrow 🌱
        </div>

        <h2 className="hero-ev-title">
          Explore the Highway with Your <span className="gradient-green-text">VinFast EV ⚡</span>
        </h2>

        <p className="hero-ev-subtitle">
          Experience Shree Venkateswara's 100% Electric Silent Luxury Shared Cab Service between <strong>Kolhapur ⇄ Pune</strong>. Zero carbon emissions, ultra-smooth whisper quiet rides, and premium leatherette recliner seats.
        </p>

        {/* Feature Pills */}
        <div className="ev-features-pills">
          <div className="ev-pill-item">
            <div className="ev-pill-icon"><i className="fa-solid fa-leaf"></i></div>
            <span>Eco-Friendly Travel</span>
          </div>
          <div className="ev-pill-item">
            <div className="ev-pill-icon"><i className="fa-solid fa-charging-station"></i></div>
            <span>EV Charging Support</span>
          </div>
          <div className="ev-pill-item">
            <div className="ev-pill-icon"><i className="fa-solid fa-shield-halved"></i></div>
            <span>Verified EV Chauffeurs</span>
          </div>
          <div className="ev-pill-item">
            <div className="ev-pill-icon"><i className="fa-solid fa-car"></i></div>
            <span>VinFast Limo Green EV</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '30px' }}>
          <a href="tel:+918668432935" className="btn-green" style={{ padding: '14px 28px', fontSize: '1.05rem' }}>
            <i className="fa-solid fa-phone"></i> Call Hotline: +91 866 843 2935
          </a>
          <a href="https://wa.me/918668432935?text=Hi%20Shree%20Venkateswara%20EV,%20I%20want%20to%20book%20a%20shared%20cab%20seat." target="_blank" rel="noreferrer" className="btn-outline-green" style={{ padding: '14px 28px', fontSize: '1.05rem' }}>
            <i className="fa-brands fa-whatsapp"></i> Chat on WhatsApp
          </a>
        </div>
      </div>

      {/* HORIZONTAL FLOATING PILL BOOKING WIDGET */}
      <div className="booking-pill-widget" id="booking-pill">
        
        {/* Cab Availability Status Indicator Banner */}
        {isCabFull ? (
          <div style={{ width: '100%', background: '#FEE2E2', border: '2px solid #EF4444', color: '#991B1B', padding: '12px 20px', borderRadius: '16px', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <i className="fa-solid fa-circle-xmark" style={{ color: '#DC2626', marginRight: '8px', fontSize: '1.2rem' }}></i>
              <strong>🔴 CURRENT CAB SLOT IS FULL / SOLD OUT</strong>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#7F1D1D' }}>{settings?.statusNote || 'Call +91 866 843 2935 for next slot availability.'}</div>
            </div>
            <a href="tel:+918668432935" className="btn-green" style={{ background: '#DC2626', padding: '8px 16px', fontSize: '0.85rem' }}>
              <i className="fa-solid fa-phone"></i> Call Hotline
            </a>
          </div>
        ) : (
          <div style={{ width: '100%', background: '#DCFCE7', border: '1px solid #16A34A', color: '#14532D', padding: '8px 16px', borderRadius: '14px', fontSize: '0.8rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <i className="fa-solid fa-circle-check" style={{ color: '#16A34A' }}></i>
            <span>🟢 CAB FREE / ACCEPTING RESERVATIONS</span> • {settings?.statusNote}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', width: '100%', gap: '16px', alignItems: 'center', flexWrap: 'wrap', opacity: isCabFull ? 0.6 : 1 }}>
          
          <div className="pill-form-group">
            <span className="pill-label"><i className="fa-solid fa-location-dot" style={{ color: '#00B100' }}></i> From (Pickup)</span>
            <select className="pill-select" value={formData.pickup} onChange={handlePickupChange} disabled={isCabFull}>
              {pickupLocations.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          <div className="pill-form-group">
            <span className="pill-label"><i className="fa-solid fa-location-arrow" style={{ color: '#0D9488' }}></i> To (Drop)</span>
            <select className="pill-select" value={formData.drop} onChange={(e) => setFormData({ ...formData, drop: e.target.value })} disabled={isCabFull}>
              {pickupLocations.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          <div className="pill-form-group">
            <span className="pill-label"><i className="fa-solid fa-chair" style={{ color: '#00B100' }}></i> Seat Tier</span>
            <select className="pill-select" value={formData.seatPosition} onChange={(e) => setFormData({ ...formData, seatPosition: e.target.value })} disabled={isCabFull}>
              <option value="Front Row (VIP)">Front Row VIP (₹{frontFare})</option>
              <option value="Middle Row (Comfort)">Middle Row Comfort (₹{middleFare})</option>
              <option value="Third Row (Economy)">Third Row Economy (₹{thirdFare})</option>
            </select>
          </div>

          <div className="pill-form-group">
            <span className="pill-label"><i className="fa-solid fa-calendar-days"></i> Travel Date</span>
            <input type="date" className="pill-input" min={new Date().toISOString().split('T')[0]} value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} required disabled={isCabFull} />
          </div>

          <div className="pill-form-group">
            <span className="pill-label"><i className="fa-solid fa-users"></i> Travelers</span>
            <input type="number" className="pill-input" min="1" max="6" value={formData.passengers} onChange={(e) => setFormData({ ...formData, passengers: parseInt(e.target.value) || 1 })} required disabled={isCabFull} />
          </div>

          <div style={{ flex: '1', minWidth: '180px' }}>
            <div className="form-group" style={{ marginBottom: '8px' }}>
              <input type="text" className="input-field" placeholder="Your Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required disabled={isCabFull} style={{ padding: '8px 12px', fontSize: '0.85rem' }} />
            </div>
            <div className="form-group">
              <input type="tel" className="input-field" placeholder="Mobile Phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required disabled={isCabFull} style={{ padding: '8px 12px', fontSize: '0.85rem' }} />
            </div>
          </div>

          <button type="submit" className="btn-green" style={{ padding: '16px 32px', borderRadius: '9999px', fontSize: '1.05rem', whiteSpace: 'nowrap', opacity: isCabFull ? 0.5 : 1 }} disabled={loading || isCabFull}>
            {loading ? <i className="fa-solid fa-spinner fa-spin"></i> : isCabFull ? 'Cab Full' : <><i className="fa-solid fa-magnifying-glass"></i> Reserve ₹{calculateFare()} Seat</>}
          </button>
        </form>
      </div>
    </section>
  );
}
