export default function FareCalculator() {
  return (
    <section className="container" style={{ padding: '60px 0' }} id="calculator">
      <div style={{ padding: '40px 0', borderTop: '1px solid #E2E8F0', borderBottom: '1px solid #E2E8F0' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <span style={{ color: '#2563EB', fontWeight: 800, fontSize: '0.82rem', textTransform: 'uppercase' }}>The Shree Difference</span>
          <h2 style={{ color: '#0F172A', margin: '8px 0' }}>Comfortable Rides, Thoughtfully Priced</h2>
          <p style={{ color: '#64748B', margin: 0 }}>Premium cars and dependable service for every kind of journey.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '20px' }}>
          {[
            ['fa-car-side', 'Premium Cars', 'Comfortable, well-maintained vehicles for your plans.'],
            ['fa-user-check', 'Skilled Drivers', 'Professional drivers focused on a safe, smooth trip.'],
            ['fa-clock', 'Reliable & Punctual', 'Thoughtful pickup coordination and dependable service.'],
            ['fa-tag', 'Affordable Options', 'Clear quotes and choices to suit your trip and budget.']
          ].map(([icon, title, description]) => (
            <div key={title} style={{ padding: '20px', borderLeft: '3px solid #2563EB', background: '#F8FAFC' }}>
              <i className={`fa-solid ${icon}`} aria-hidden="true" style={{ color: '#2563EB', marginBottom: '10px' }}></i>
              <h3 style={{ fontSize: '1rem', color: '#0F172A', margin: '0 0 6px' }}>{title}</h3>
              <p style={{ color: '#64748B', fontSize: '0.9rem', margin: 0 }}>{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
