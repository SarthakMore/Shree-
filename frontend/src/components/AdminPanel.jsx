import React, { useState, useEffect } from 'react';

export default function AdminPanel({ onClose, onSettingsUpdated }) {
  const [activeTab, setActiveTab] = useState('bookings');
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);

  // Settings State
  const [settings, setSettings] = useState({
    frontSeatFare: 649,
    middleSeatFare: 499,
    thirdSeatFare: 399,
    cabStatus: 'AVAILABLE',
    statusNote: 'VinFast Limo Green EV is accepting reservations for upcoming hourly slots.'
  });
  const [savingSettings, setSavingSettings] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  const fetchBookings = async () => {
    setLoadingBookings(true);
    try {
      const res = await fetch('/api/bookings');
      const data = await res.json();
      if (data.success) {
        setBookings(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch MERN bookings', err);
    }
    setLoadingBookings(false);
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      if (data.success && data.data) {
        setSettings(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch settings', err);
    }
  };

  useEffect(() => {
    fetchBookings();
    fetchSettings();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      const res = await fetch(`/api/bookings/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (data.success) {
        fetchBookings();
      }
    } catch (err) {
      alert('Error updating status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this booking record?')) return;
    try {
      const res = await fetch(`/api/bookings/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchBookings();
      }
    } catch (err) {
      alert('Error deleting booking');
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSavingSettings(true);
    setSaveSuccessMsg('');

    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      const data = await res.json();
      setSavingSettings(false);
      if (data.success) {
        setSaveSuccessMsg('✅ Live Fares & Cab Availability Status updated successfully!');
        if (onSettingsUpdated) onSettingsUpdated(data.data);
      }
    } catch (err) {
      setSavingSettings(false);
      alert('Failed to update settings');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <button className="modal-close" onClick={onClose}>&times;</button>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '2px solid #00B100', paddingBottom: '12px' }}>
          <div>
            <h3 style={{ fontFamily: 'Outfit', fontSize: '1.5rem', fontWeight: 800, color: '#0C0E2E' }}>
              <i className="fa-solid fa-sliders" style={{ color: '#00B100', marginRight: '8px' }}></i> MERN Control & Management Admin Panel
            </h3>
            <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>Real-time Live Fare & Cab Availability Sync</span>
          </div>
          
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              onClick={() => setActiveTab('bookings')}
              style={{ background: activeTab === 'bookings' ? '#00B100' : '#F1F5F9', color: activeTab === 'bookings' ? 'white' : '#0F172A', border: 'none', padding: '6px 14px', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.82rem' }}
            >
              <i className="fa-solid fa-list"></i> Bookings ({bookings.length})
            </button>
            <button 
              onClick={() => setActiveTab('pricing')}
              style={{ background: activeTab === 'pricing' ? '#00B100' : '#F1F5F9', color: activeTab === 'pricing' ? 'white' : '#0F172A', border: 'none', padding: '6px 14px', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.82rem' }}
            >
              <i className="fa-solid fa-indian-rupee-sign"></i> Dynamic Fares & Cab Status
            </button>
          </div>
        </div>

        {activeTab === 'pricing' ? (
          <div style={{ background: '#F8FAFC', padding: '24px', borderRadius: '16px', border: '2px solid #00B100' }}>
            <h4 style={{ fontFamily: 'Outfit', fontSize: '1.2rem', fontWeight: 800, color: '#0C0E2E', marginBottom: '14px' }}>
              ⚡ Change Live Fares & Cab Full/Free Status
            </h4>

            {saveSuccessMsg && (
              <div style={{ background: '#DCFCE7', color: '#15803D', padding: '12px', borderRadius: '10px', fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '16px' }}>
                {saveSuccessMsg}
              </div>
            )}

            <form onSubmit={handleSaveSettings}>
              {/* Cab Availability Toggle */}
              <div style={{ background: 'white', padding: '16px', borderRadius: '12px', border: '1.5px solid #E2E8F0', marginBottom: '20px' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#0C0E2E', display: 'block', marginBottom: '8px' }}>
                  <i className="fa-solid fa-car-side" style={{ color: '#00B100' }}></i> Current Cab Availability Status
                </label>
                
                <div style={{ display: 'flex', gap: '16px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 'bold', color: '#15803D', background: settings.cabStatus === 'AVAILABLE' ? '#DCFCE7' : '#F1F5F9', padding: '10px 18px', borderRadius: '10px', border: '1px solid #00B100' }}>
                    <input 
                      type="radio" 
                      name="cabStatus" 
                      value="AVAILABLE" 
                      checked={settings.cabStatus === 'AVAILABLE'} 
                      onChange={(e) => setSettings({ ...settings, cabStatus: e.target.value })} 
                    />
                    🟢 Cab Free / Accepting Bookings
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 'bold', color: '#B91C1C', background: settings.cabStatus === 'FULL' ? '#FEE2E2' : '#F1F5F9', padding: '10px 18px', borderRadius: '10px', border: '1px solid #EF4444' }}>
                    <input 
                      type="radio" 
                      name="cabStatus" 
                      value="FULL" 
                      checked={settings.cabStatus === 'FULL'} 
                      onChange={(e) => setSettings({ ...settings, cabStatus: e.target.value })} 
                    />
                    🔴 Cab Full / All Seats Booked
                  </label>
                </div>
              </div>

              {/* Dynamic Seat Fares Inputs */}
              <div className="form-grid" style={{ marginBottom: '20px' }}>
                <div className="form-group">
                  <label><i className="fa-solid fa-chair" style={{ color: '#FF9F1C' }}></i> Front Seat VIP Fare (₹)</label>
                  <input 
                    type="number" 
                    className="input-field" 
                    value={settings.frontSeatFare} 
                    onChange={(e) => setSettings({ ...settings, frontSeatFare: parseInt(e.target.value) || 0 })} 
                    required 
                  />
                </div>

                <div className="form-group">
                  <label><i className="fa-solid fa-chair" style={{ color: '#2563EB' }}></i> Middle Row Comfort Fare (₹)</label>
                  <input 
                    type="number" 
                    className="input-field" 
                    value={settings.middleSeatFare} 
                    onChange={(e) => setSettings({ ...settings, middleSeatFare: parseInt(e.target.value) || 0 })} 
                    required 
                  />
                </div>

                <div className="form-group">
                  <label><i className="fa-solid fa-chair" style={{ color: '#00B100' }}></i> Third Row Economy Fare (₹)</label>
                  <input 
                    type="number" 
                    className="input-field" 
                    value={settings.thirdSeatFare} 
                    onChange={(e) => setSettings({ ...settings, thirdSeatFare: parseInt(e.target.value) || 0 })} 
                    required 
                  />
                </div>

                <div className="form-group full-width">
                  <label><i className="fa-solid fa-comment-dots"></i> Status Note / Announcement</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    value={settings.statusNote} 
                    onChange={(e) => setSettings({ ...settings, statusNote: e.target.value })} 
                    placeholder="e.g. Next available departure slot at 2:00 PM." 
                  />
                </div>
              </div>

              <button type="submit" className="btn-green" style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '1rem' }} disabled={savingSettings}>
                {savingSettings ? <i className="fa-solid fa-spinner fa-spin"></i> : <><i className="fa-solid fa-floppy-disk"></i> Save Settings & Update Client Side Fares Live</>}
              </button>
            </form>
          </div>
        ) : (
          <div>
            {loadingBookings ? (
              <div style={{ textAlign: 'center', padding: '40px' }}><i className="fa-solid fa-spinner fa-spin fa-2x"></i></div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Passenger</th>
                      <th>Route</th>
                      <th>Seat Row</th>
                      <th>Date & Time</th>
                      <th>Fare</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map(b => (
                      <tr key={b._id}>
                        <td>
                          <strong>{b.name}</strong><br />
                          <small style={{ color: '#64748B' }}>{b.phone}</small>
                        </td>
                        <td>{b.pickup} ➔ {b.drop}</td>
                        <td style={{ fontWeight: 'bold', color: '#00B100' }}>{b.seatPosition || 'Middle Row'}</td>
                        <td>{b.date} <br /><small style={{ color: '#64748B' }}>{b.time}</small></td>
                        <td style={{ fontWeight: 'bold', color: '#2563EB' }}>₹{b.totalFare}</td>
                        <td>
                          <span className={`status-badge ${b.status === 'Confirmed' ? 'status-confirmed' : 'status-pending'}`}>
                            {b.status}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            {b.status === 'Pending' && (
                              <button 
                                onClick={() => handleUpdateStatus(b._id, 'Confirmed')}
                                style={{ background: '#00E676', border: 'none', color: 'white', padding: '4px 8px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.75rem' }}
                              >
                                Confirm
                              </button>
                            )}
                            <button 
                              onClick={() => handleDelete(b._id)}
                              style={{ background: '#FF4081', border: 'none', color: 'white', padding: '4px 8px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.75rem' }}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
