import React, { useState } from 'react';
import { API_BASE } from '../api';

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

  const frontFare = settings?.frontSeatFare || 650;
  const middleFare = settings?.middleSeatFare || 550;
  const thirdFare = settings?.thirdSeatFare || 450;
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

  const getMaxPassengers = () => {
    if (formData.seatPosition.includes('Front')) return 1;
    if (formData.seatPosition.includes('Third')) return 2;
    return 3;
  };

  const maxPassengersAllowed = getMaxPassengers();

  const handleSeatChange = (e) => {
    const seat = e.target.value;
    let maxSeats = 3;
    if (seat.includes('Front')) maxSeats = 1;
    if (seat.includes('Third')) maxSeats = 2;

    setFormData(prev => ({
      ...prev,
      seatPosition: seat,
      passengers: prev.passengers > maxSeats ? maxSeats : prev.passengers
    }));
  };

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
      alert('This cab is currently FULL / SOLD OUT. Please call hotline +91 866 941 0303 for next slot.');
      return;
    }

    setLoading(true);
    const totalFare = calculateFare();
    const payload = { ...formData, vehicle: 'VinFast Limo Green EV', totalFare };

    try {
      const response = await fetch(`${API_BASE}/api/bookings`, {
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
    <section className="hero-widget-section" id="booking-pill">
      <div className="hero-content">
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(0, 177, 0, 0.15)', color: '#00B100', padding: '6px 16px', borderRadius: '20px', fontWeight: 'bold', fontSize: '0.85rem', marginBottom: '16px' }}>
          <i className="fa-solid fa-charging-station"></i> Daily Express 100% Electric Shared Cab Engine
        </div>

        <h1 style={{ fontFamily: 'Outfit', fontSize: '2.8rem', fontWeight: 900, color: '#0C0E2E', lineHeight: '1.15', marginBottom: '12px' }}>
          Kolhapur ⇄ Pune Daily Shared EV Cab
        </h1>

        <p style={{ color: '#475569', fontSize: '1.1rem', maxWidth: '780px', margin: '0 auto 28px' }}>
          Book guaranteed individual seats in flagship <strong>VinFast Limo Green EV</strong>. Strict Per-Row Passenger Limits — Front Row (Max 1 Seat), Middle Row (Max 3 Seats), Third Row (Max 2 Seats).
        </p>

        {isCabFull && (
          <div style={{ background: '#FEE2E2', color: '#991B1B', padding: '12px 20px', borderRadius: '12px', fontWeight: 'bold', fontSize: '0.95rem', marginBottom: '20px', border: '1px solid #EF4444' }}>
            <i className="fa-solid fa-circle-exclamation"></i> CURRENT CAB SLOT IS FULL / SOLD OUT. Call hotline +91 866 941 0303 for upcoming departure.
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
            <select className="pill-select" value={formData.seatPosition} onChange={handleSeatChange} disabled={isCabFull}>
              <option value="Front Row (VIP)">Front Row (Max 1 Seat • ₹{frontFare})</option>
              <option value="Middle Row (Comfort)">Middle Row (Max 3 Seats • ₹{middleFare})</option>
              <option value="Third Row (Economy)">Third Row (Max 2 Seats • ₹{thirdFare})</option>
            </select>
          </div>

          <div className="pill-form-group">
            <span className="pill-label"><i className="fa-solid fa-calendar-days"></i> Travel Date</span>
            <input type="date" className="pill-input" min={new Date().toISOString().split('T')[0]} value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} required disabled={isCabFull} />
          </div>

          <div className="pill-form-group">
            <span className="pill-label"><i className="fa-solid fa-users"></i> Passengers</span>
            <input
              type="number"
              className="pill-input"
              min="1"
              max={maxPassengersAllowed}
              value={formData.passengers}
              onChange={(e) => {
                let val = parseInt(e.target.value) || 1;
                if (val > maxPassengersAllowed) val = maxPassengersAllowed;
                setFormData({ ...formData, passengers: val });
              }}
              required
              disabled={isCabFull}
            />
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
