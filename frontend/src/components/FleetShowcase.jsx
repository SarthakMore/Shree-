import React, { useState, useEffect } from 'react';
import { API_BASE } from '../api';

const cleanVehicleText = (text = '') => text
  .replace(/VinFast|Electric|\bEV\b/gi, '')
  .replace(/\s+/g, ' ')
  .trim();

export default function FleetShowcase({ settings }) {
  const [cars, setCars] = useState([]);
  const [activePhotoIndices, setActivePhotoIndices] = useState({});
  const [hireTarget, setHireTarget] = useState(null);
  const [hireRequest, setHireRequest] = useState({ name: '', phone: '', date: '', destination: '', driverOption: 'driver' });
  const rateKm = settings?.ratePerKm || 14;
  const today = new Date();
  const minTripDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const openHireRequest = (car) => {
    setHireTarget({ name: cleanVehicleText(car.name) || 'Premium Car', rate: car.ratePerKm || rateKm });
    setHireRequest({ name: '', phone: '', date: '', destination: '', driverOption: 'driver' });
  };

  const submitHireRequest = (event) => {
    event.preventDefault();
    if (!hireTarget) return;

    const message = [
      'CAR RENTAL ENQUIRY - SHREE VENKATESHWARA',
      `Name: ${hireRequest.name.trim()}`,
      `Phone: ${hireRequest.phone.trim()}`,
      `Trip date: ${hireRequest.date}`,
      `Car: ${hireTarget.name}`,
      `Rate: Rs. ${hireTarget.rate}/km`,
      `Destination: ${hireRequest.destination.trim()}`,
      `Rental option: ${hireRequest.driverOption === 'driver' ? 'With driver' : 'Self-drive'}`
    ].join('\n');

    window.open(`https://wa.me/918669410303?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
    setHireTarget(null);
  };

  useEffect(() => {
    fetch(`${API_BASE}/api/cars`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setCars(data.data);
        }
      })
      .catch(err => console.log('Cars offline fallback'));
  }, []);

  return (
    <section className="container" style={{ padding: '60px 20px' }} id="rental-fleet">
      <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 40px' }}>
        <span style={{ background: '#DBEAFE', color: '#1E40AF', padding: '6px 18px', borderRadius: '20px', fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase' }}>
          Premium Cars, Ready for Your Journey
        </span>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#0F172A', marginTop: '8px' }}>
          Our Rental Fleet & Rates Per KM
        </h2>
        <p style={{ color: '#475569', fontSize: '1.05rem' }}>
          Choose a car with or without a skilled driver. Ask us for current availability and a clear, affordable quote.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {cars.length > 0 ? (
          cars.map(car => {
            const photos = (Array.isArray(car.photos) && car.photos.length ? car.photos : [car.photo]).filter(Boolean).slice(0, 5);
            const activePhotoIndex = Math.min(activePhotoIndices[car._id] || 0, Math.max(photos.length - 1, 0));
            const carName = cleanVehicleText(car.name) || 'Premium Car';
            return (
              <div key={car._id} style={{ background: '#FFFFFF', borderRadius: '16px', border: '1.5px solid #E2E8F0', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ position: 'relative', height: '220px' }}>
                    <img src={photos[activePhotoIndex]} alt={carName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <span style={{ position: 'absolute', top: '12px', right: '12px', background: '#10B981', color: '#FFFFFF', padding: '4px 14px', borderRadius: '9999px', fontWeight: 'bold', fontSize: '0.82rem' }}>
                      ₹{car.ratePerKm || rateKm}/km Rate
                    </span>
                    <span style={{ position: 'absolute', top: '12px', left: '12px', background: 'rgba(15,23,42,0.85)', color: '#FFFFFF', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600 }}>
                      Premium Car
                    </span>
                  </div>
                  {photos.length > 1 && (
                    <div style={{ display: 'flex', gap: '8px', padding: '10px 12px', overflowX: 'auto' }}>
                      {photos.map((photo, index) => (
                        <button
                          key={`${car._id}-photo-${index}`}
                          type="button"
                          aria-label={`Show photo ${index + 1} of ${carName}`}
                          aria-pressed={activePhotoIndex === index}
                          onClick={() => setActivePhotoIndices({ ...activePhotoIndices, [car._id]: index })}
                          style={{ width: '56px', height: '44px', flex: '0 0 auto', padding: 0, overflow: 'hidden', borderRadius: '6px', border: activePhotoIndex === index ? '2px solid #2563EB' : '1px solid #CBD5E1', cursor: 'pointer', background: '#F8FAFC' }}
                        >
                          <img src={photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </button>
                      ))}
                    </div>
                  )}
                  <div style={{ padding: '20px' }}>
                    <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>{carName}</h3>
                    <div style={{ display: 'flex', gap: '16px', color: '#64748B', fontSize: '0.88rem', marginBottom: '14px' }}>
                      <span><i className="fa-solid fa-users" style={{ color: '#2563EB' }}></i> {car.capacity} Seats</span>
                      <span><i className="fa-solid fa-gauge-high" style={{ color: '#10B981' }}></i> ₹{car.ratePerKm || rateKm}/km</span>
                      <span><i className="fa-solid fa-clock" style={{ color: '#EAB308' }}></i> ₹{car.hourlyRate || 450}/hr</span>
                    </div>
                    <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 16px', fontSize: '0.85rem', color: '#475569' }}>
                      {(car.features || ['Comfortable interiors', 'Well-maintained vehicles', 'Skilled driver available']).map((feature, i) => (
                        <li key={i} style={{ marginBottom: '4px' }}><i className="fa-solid fa-check" style={{ color: '#10B981', marginRight: '6px' }}></i>{cleanVehicleText(feature)}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div style={{ padding: '0 20px 20px' }}>
                  <button
                    type="button"
                    onClick={() => openHireRequest(car)}
                    style={{ display: 'block', width: '100%', background: '#2563EB', color: 'white', border: 'none', padding: '12px', borderRadius: '10px', fontWeight: 'bold', textAlign: 'center', cursor: 'pointer' }}
                  >
                    <i className="fa-solid fa-car-side"></i> Hire Car
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div style={{ background: '#FFFFFF', padding: '24px', borderRadius: '16px', border: '1.5px solid #2563EB' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Premium Cars for Every Journey</h3>
            <p style={{ color: '#64748B', margin: '8px 0 14px' }}>Self-drive and chauffeur-driven rentals are available. Contact us for vehicle options, availability, and an affordable quote.</p>
            <a href="tel:+918669410303" style={{ color: '#2563EB', fontWeight: 700 }}>Call 866 941 0303</a>
          </div>
        )}
      </div>

      {hireTarget && (
        <div className="modal-overlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setHireTarget(null); }}>
          <div className="modal-container" role="dialog" aria-modal="true" aria-labelledby="hire-request-title" style={{ maxWidth: '520px' }}>
            <button type="button" className="modal-close" aria-label="Close rental enquiry" onClick={() => setHireTarget(null)}>&times;</button>
            <span style={{ color: '#2563EB', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase' }}>Car Rental Enquiry</span>
            <h3 id="hire-request-title" style={{ margin: '8px 32px 6px 0', color: '#0F172A' }}>{hireTarget.name}</h3>
            <p style={{ margin: '0 0 20px', color: '#64748B' }}>₹{hireTarget.rate}/km</p>

            <form onSubmit={submitHireRequest}>
              <label className="form-group" style={{ display: 'block', marginBottom: '14px' }}>
                <span>Full name</span>
                <input className="input-field" type="text" autoComplete="name" value={hireRequest.name} onChange={(event) => setHireRequest({ ...hireRequest, name: event.target.value })} required />
              </label>
              <label className="form-group" style={{ display: 'block', marginBottom: '14px' }}>
                <span>Phone number</span>
                <input className="input-field" type="tel" autoComplete="tel" value={hireRequest.phone} onChange={(event) => setHireRequest({ ...hireRequest, phone: event.target.value })} required />
              </label>
              <label className="form-group" style={{ display: 'block', marginBottom: '14px' }}>
                <span>Trip date</span>
                <input className="input-field" type="date" min={minTripDate} value={hireRequest.date} onChange={(event) => setHireRequest({ ...hireRequest, date: event.target.value })} required />
              </label>
              <label className="form-group" style={{ display: 'block', marginBottom: '16px' }}>
                <span>Destination</span>
                <input className="input-field" type="text" placeholder="Where would you like to go?" value={hireRequest.destination} onChange={(event) => setHireRequest({ ...hireRequest, destination: event.target.value })} required />
              </label>
              <fieldset style={{ border: 0, padding: 0, margin: '0 0 20px' }}>
                <legend style={{ marginBottom: '8px', fontWeight: 700 }}>Rental option</legend>
                <div style={{ display: 'flex', gap: '18px', flexWrap: 'wrap' }}>
                  <label style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                    <input type="radio" name="rental-driver-option" value="driver" checked={hireRequest.driverOption === 'driver'} onChange={(event) => setHireRequest({ ...hireRequest, driverOption: event.target.value })} />
                    With driver
                  </label>
                  <label style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                    <input type="radio" name="rental-driver-option" value="self-drive" checked={hireRequest.driverOption === 'self-drive'} onChange={(event) => setHireRequest({ ...hireRequest, driverOption: event.target.value })} />
                    Self-drive
                  </label>
                </div>
              </fieldset>
              <button type="submit" className="btn-cyan" style={{ width: '100%', justifyContent: 'center', padding: '12px' }}>
                <i className="fa-brands fa-whatsapp"></i> Continue to WhatsApp
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
