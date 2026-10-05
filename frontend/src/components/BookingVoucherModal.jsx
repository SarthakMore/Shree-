import React from 'react';

export default function BookingVoucherModal({ booking, onClose }) {
  if (!booking) return null;

  const whatsappText = `🚖 *SHREE VENKATESHWARA EXPRESS CAB BOOKING PASS*%0A` +
    `------------------------------------%0A` +
    `👤 *Passenger:* ${encodeURIComponent(booking.name || booking.passengerName || '')}%0A` +
    `📞 *Phone:* ${encodeURIComponent(booking.phone || booking.passengerPhone || '')}%0A` +
    `📍 *Pickup:* ${encodeURIComponent(booking.pickup || booking.pickupLocation || '')}%0A` +
    `🏁 *Drop:* ${encodeURIComponent(booking.drop || booking.dropLocation || '')}%0A` +
    `💺 *Seat Row:* ${encodeURIComponent(booking.seatPosition || booking.selectedRow || 'Middle Row')}%0A` +
    `📅 *Date:* ${encodeURIComponent(booking.date || booking.travelDate || '')} at ${encodeURIComponent(booking.time || booking.travelTime || '')}%0A` +
    `👥 *Seats:* ${booking.passengers || booking.seatCount || 1} Seat(s)%0A` +
    `💳 *Total Fare:* ₹${(booking.totalFare || 0).toLocaleString('en-IN')}%0A` +
    `------------------------------------%0A` +
    `Hotline: +91 866 941 0303. Please confirm my car and driver details.`;

  const waUrl = `https://wa.me/918669410303?text=${whatsappText}`;

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
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #E2E8F0', paddingBottom: '8px', marginBottom: '12px' }}>
            <span style={{ fontWeight: 'bold', color: '#64748B', fontSize: '0.85rem' }}>PASSENGER</span>
            <span style={{ fontWeight: 'bold', color: '#0F172A' }}>{booking.name || booking.passengerName} ({booking.phone || booking.passengerPhone})</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #E2E8F0', paddingBottom: '8px', marginBottom: '12px' }}>
            <span style={{ fontWeight: 'bold', color: '#64748B', fontSize: '0.85rem' }}>ROUTE</span>
            <span style={{ fontWeight: 'bold', color: '#00B100' }}>{booking.pickup || booking.pickupLocation} ➔ {booking.drop || booking.dropLocation}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #E2E8F0', paddingBottom: '8px', marginBottom: '12px' }}>
            <span style={{ fontWeight: 'bold', color: '#64748B', fontSize: '0.85rem' }}>SEAT TIER</span>
            <span style={{ fontWeight: 'bold', color: '#00B100' }}>{booking.seatPosition || booking.selectedRow || 'Middle Row (Comfort)'}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #E2E8F0', paddingBottom: '8px', marginBottom: '12px' }}>
            <span style={{ fontWeight: 'bold', color: '#64748B', fontSize: '0.85rem' }}>VEHICLE</span>
            <span style={{ fontWeight: 'bold', color: '#0F172A' }}>Premium Rental Car</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #E2E8F0', paddingBottom: '8px', marginBottom: '12px' }}>
            <span style={{ fontWeight: 'bold', color: '#64748B', fontSize: '0.85rem' }}>DATE & TIME</span>
            <span style={{ fontWeight: 'bold', color: '#0F172A' }}>{booking.date || booking.travelDate} at {booking.time || booking.travelTime}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0, 177, 0, 0.15)', padding: '10px 14px', borderRadius: '10px' }}>
            <span style={{ fontWeight: 'bold', color: '#0F172A' }}>TOTAL ESTIMATED FARE</span>
            <span style={{ fontFamily: 'Outfit', fontSize: '1.4rem', fontWeight: 900, color: '#00B100' }}>₹{(booking.totalFare || 0).toLocaleString('en-IN')}</span>
          </div>
        </div>

        <a href={waUrl} target="_blank" rel="noreferrer" className="btn-green" style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '1.05rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <i className="fa-brands fa-whatsapp" style={{ fontSize: '1.3rem' }}></i> Send Booking Ticket to +91 866 941 0303 on WhatsApp
        </a>
      </div>
    </div>
  );
}
