import React, { useState, useEffect } from 'react';
import { API_BASE } from '../api';

export default function FleetShowcase({ settings }) {
  const [cars, setCars] = useState([]);
  const frontFare = settings?.frontSeatFare || 650;
  const middleFare = settings?.middleSeatFare || 550;
  const thirdFare = settings?.thirdSeatFare || 450;
  const rateKm = settings?.ratePerKm || 14;

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
    <section className="container" style={{ padding: '60px 20px' }} id="ev-fleet">
      <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 40px' }}>
        <span style={{ background: '#DBEAFE', color: '#1E40AF', padding: '6px 18px', borderRadius: '20px', fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase' }}>
          ⚡ Dynamic Vehicle Fleet & Rental Rates
        </span>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#0F172A', marginTop: '8px' }}>
          Our Rental Fleet & Rates Per KM
        </h2>
        <p style={{ color: '#475569', fontSize: '1.05rem' }}>
          All vehicles available for hourly rental, outstation travel, and daily shared express trips. Standard Rental Rate starts at <strong>₹{rateKm}/km</strong>.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {cars.length > 0 ? (
          cars.map(car => (
            <div key={car._id} style={{ background: '#FFFFFF', borderRadius: '16px', border: '1.5px solid #E2E8F0', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ position: 'relative', height: '220px' }}>
                  <img src={car.photo} alt={car.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <span style={{ position: 'absolute', top: '12px', right: '12px', background: '#10B981', color: '#FFFFFF', padding: '4px 14px', borderRadius: '9999px', fontWeight: 'bold', fontSize: '0.82rem' }}>
                    ₹{car.ratePerKm || rateKm}/km Rate
                  </span>
                  <span style={{ position: 'absolute', top: '12px', left: '12px', background: 'rgba(15,23,42,0.85)', color: '#FFFFFF', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600 }}>
                    {car.category}
                  </span>
                </div>
                <div style={{ padding: '20px' }}>
                  <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>{car.name}</h3>
                  <div style={{ display: 'flex', gap: '16px', color: '#64748B', fontSize: '0.88rem', marginBottom: '14px' }}>
                    <span><i className="fa-solid fa-users" style={{ color: '#2563EB' }}></i> {car.capacity} Seats</span>
                    <span><i className="fa-solid fa-gauge-high" style={{ color: '#10B981' }}></i> ₹{car.ratePerKm || rateKm}/km</span>
                    <span><i className="fa-solid fa-clock" style={{ color: '#EAB308' }}></i> ₹{car.hourlyRate || 450}/hr</span>
                  </div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 16px', fontSize: '0.85rem', color: '#475569' }}>
                    {(car.features || ['100% AC Comfort', 'Clean Hygiene Interior', 'Zero Emissions']).map((f, i) => (
                      <li key={i} style={{ marginBottom: '4px' }}><i className="fa-solid fa-check" style={{ color: '#10B981', marginRight: '6px' }}></i>{f}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div style={{ padding: '0 20px 20px' }}>
                <a 
                  href={`https://wa.me/918669410303?text=${encodeURIComponent(`Hi! I want to hire ${car.name} at ₹${car.ratePerKm || rateKm}/km rate.`)}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  style={{ display: 'block', background: '#2563EB', color: 'white', textCenter: 'center', textDecoration: 'none', padding: '12px', borderRadius: '10px', fontWeight: 'bold', textAlign: 'center' }}
                >
                  <i className="fa-brands fa-whatsapp"></i> Hire at ₹{car.ratePerKm || rateKm}/km
                </a>
              </div>
            </div>
          ))
        ) : (
          <div style={{ background: '#FFFFFF', padding: '24px', borderRadius: '16px', border: '1.5px solid #2563EB' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>VinFast Limo Green EV (Flagship 7-Seater)</h3>
            <p style={{ color: '#64748B', margin: '8px 0 14px' }}>Standard Rental Rate: <strong>₹{rateKm}/km</strong></p>
            <div style={{ background: '#F0FDF4', padding: '16px', borderRadius: '12px', border: '1px solid #10B981' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span>Front Row (VIP)</span>
                <strong>₹{frontFare} / seat</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span>Middle Row (Comfort)</span>
                <strong>₹{middleFare} / seat</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Third Row (Economy)</span>
                <strong>₹{thirdFare} / seat</strong>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
