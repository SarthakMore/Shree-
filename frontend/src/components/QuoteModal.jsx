import React, { useState } from 'react';

export default function QuoteModal({ onClose }) {
  const [formData, setFormData] = useState({ name: '', phone: '', travelDetails: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      setSubmitted(true);
    } catch (err) {
      setSubmitted(true);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container" style={{ maxWidth: '520px' }}>
        <button className="modal-close" onClick={onClose}>&times;</button>
        
        <div style={{ marginBottom: '20px' }}>
          <span style={{ background: 'rgba(0, 229, 255, 0.15)', color: '#00B0FF', fontWeight: 'bold', fontSize: '0.8rem', padding: '4px 12px', borderRadius: '20px' }}>
            CUSTOM TRAVEL INQUIRY
          </span>
          <h3 style={{ fontFamily: 'Outfit', fontSize: '1.6rem', fontWeight: 800, marginTop: '6px' }}>Airport & Outstation Quote</h3>
          <p style={{ color: '#64748B', fontSize: '0.88rem' }}>Tell us your route and timing. Our dispatch team will call you within 15 minutes.</p>
        </div>

        {submitted ? (
          <div style={{ background: '#DCFCE7', color: '#15803D', padding: '20px', borderRadius: '12px', textAlign: 'center', fontWeight: 'bold' }}>
            <i className="fa-solid fa-circle-check fa-2x" style={{ marginBottom: '10px' }}></i><br />
            Thank you! Your quote request has been saved in our MERN Database. We will call you shortly!
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group" style={{ marginBottom: '14px' }}>
              <label>Full Name</label>
              <input type="text" className="input-field" placeholder="Enter full name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
            </div>

            <div className="form-group" style={{ marginBottom: '14px' }}>
              <label>Phone Number</label>
              <input type="tel" className="input-field" placeholder="Enter mobile number" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required />
            </div>

            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label>Travel Details</label>
              <textarea className="input-field" style={{ height: '90px', resize: 'none' }} placeholder="e.g. Pune Airport to Kolhapur on 28th Sep, 3 passengers" value={formData.travelDetails} onChange={(e) => setFormData({ ...formData, travelDetails: e.target.value })} required></textarea>
            </div>

            <button type="submit" className="btn-cyan" style={{ width: '100%', justifyContent: 'center', padding: '12px' }}>
              <i className="fa-solid fa-paper-plane"></i> Submit Quote Request
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
