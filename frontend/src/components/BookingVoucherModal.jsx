import React from 'react';

export default function BookingVoucherModal({ booking, onClose }) {
  if (!booking) return null;

  const whatsappText = `🚖 *SHREE VENKATESWARA EV SHARED CAB BOOKING PASS*%0A` +
    `------------------------------------%0A` +
    `👤 *Passenger:* ${encodeURIComponent(booking.name)}%0A` +
    `📞 *Phone:* ${encodeURIComponent(booking.phone)}%0A` +
    `📍 *Pickup:* ${encodeURIComponent(booking.pickup)}%0A` +
    `🏁 *Drop:* ${encodeURIComponent(booking.drop)}%0A` +
    `💺 *Seat Row:* ${encodeURIComponent(booking.seatPosition || 'Middle Row')}%0A` +
    `📅 *Date:* ${encodeURIComponent(booking.date)} at ${encodeURIComponent(booking.time)}%0A` +
    `👥 *Seats:* ${booking.passengers} Seat(s)%0A` +
    `💰 *Total Fare:* ₹${booking.totalFare.toLocaleString('en-IN')}%0A` +
    `------------------------------------%0A` +
    `Hotline: +91 866 843 2935. Please confirm VinFast EV dispatch!`;

  const waUrl = `https://wa.me/918668432935?text=${whatsappText}`;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <button className="modal-close" onClick={onClose}>&times;</button>
        
        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <span style={{ background: '#DCFCE7', color: '#15803D', fontWeight: 'bold', fontSize: '0.8rem', padding: '4px 12px', borderRadius: '20px' }}>
            <i className="fa-solid fa-circle-check"></i> SEAT RESERVED IN DATABASE
          </span>
          <h3 style={{ fontFamily: 'Outfit', fontSize: '1.6rem', fontWeight: 800, marginTop: '8px' }}>Digital Ride Pass Voucher</h3>
        </div>

        <div style={{ background: 'linear-gradient(135deg, #F0FDF4, #F0F7FF)', border: '2px dashed #00B100', borderRadius: '16px', padding: '20px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyBetween: 'space-between', borderBottom: '1px solid #E2E8F0', paddingBottom: '8px', marginBottom: '12px' }}>
            <span style={{ fontWeight: 'bold', color: '#64748B', fontSize: '0.85rem' }}>PASSENGER</span>
            <span style={{ fontWeight: 'bold', color: '#0F172A' }}>{booking.name} ({booking.phone})</span>
          </div>

          <div style={{ display: 'flex', justifyBetween: 'space-between', borderBottom: '1px solid #E2E8F0', paddingBottom: '8px', marginBottom: '12px' }}>
            <span style={{ fontWeight: 'bold', color: '#64748B', fontSize: '0.85rem' }}>ROUTE</span>
            <span style={{ fontWeight: 'bold', color: '#00B100' }}>{booking.pickup} ➔ {booking.drop}</span>
          </div>

          <div style={{ display: 'flex', justifyBetween: 'space-between', borderBottom: '1px solid #E2E8F0', paddingBottom: '8px', marginBottom: '12px' }}>
            <span style={{ fontWeight: 'bold', color: '#64748B', fontSize: '0.85rem' }}>SEAT TIER</span>
            <span style={{ fontWeight: 'bold', color: '#00B100' }}>{booking.seatPosition || 'Middle Row (Comfort)'}</span>
          </div>

          <div style={{ display: 'flex', justifyBetween: 'space-between', borderBottom: '1px solid #E2E8F0', paddingBottom: '8px', marginBottom: '12px' }}>
            <span style={{ fontWeight: 'bold', color: '#64748B', fontSize: '0.85rem' }}>VEHICLE</span>
            <span style={{ fontWeight: 'bold', color: '#0F172A' }}>VinFast Limo Green EV</span>
          </div>

          <div style={{ display: 'flex', justifyBetween: 'space-between', borderBottom: '1px solid #E2E8F0', paddingBottom: '8px', marginBottom: '12px' }}>
            <span style={{ fontWeight: 'bold', color: '#64748B', fontSize: '0.85rem' }}>DATE & TIME</span>
            <span style={{ fontWeight: 'bold', color: '#0F172A' }}>{booking.date} at {booking.time}</span>
          </div>

          <div style={{ display: 'flex', justifyBetween: 'space-between', alignItems: 'center', background: 'rgba(0, 177, 0, 0.15)', padding: '10px 14px', borderRadius: '10px' }}>
            <span style={{ fontWeight: 'bold', color: '#0F172A' }}>TOTAL ESTIMATED FARE</span>
            <span style={{ fontFamily: 'Outfit', fontSize: '1.4rem', fontWeight: 900, color: '#00B100' }}>₹{booking.totalFare.toLocaleString('en-IN')}</span>
          </div>
        </div>

        <a href={waUrl} target="_blank" rel="noreferrer" className="btn-green" style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '1.05rem', textDecoration: 'none' }}>
          <i className="fa-brands fa-whatsapp" style={{ fontSize: '1.3rem' }}></i> Send Booking Details to +91 866 843 2935 on WhatsApp
        </a>
      </div>
    </div>
  );
}
