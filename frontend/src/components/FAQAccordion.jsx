import React, { useState } from 'react';

export default function FAQAccordion() {
  const [activeIndex, setActiveIndex] = useState(0);

  const faqs = [
    {
      q: 'Can I rent a car with or without a driver?',
      a: 'Yes. Choose a self-drive rental or request a skilled professional driver when you book.'
    },
    {
      q: 'What vehicles are available?',
      a: 'We offer premium cars for personal, family, airport, and outstation travel. Contact us to confirm availability for your dates.'
    },
    {
      q: 'Are rental prices affordable and clear?',
      a: 'We provide a clear quote before confirming your booking, with options to suit your trip and budget.'
    },
    {
      q: 'Are pickups reliable and on time?',
      a: 'We coordinate your pickup in advance and work to provide dependable, punctual service throughout your trip.'
    }
  ];

  return (
    <section className="container" style={{ padding: '60px 0' }} id="faq">
      <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 40px' }}>
        <span style={{ background: 'rgba(37, 99, 235, 0.1)', color: '#2563EB', padding: '6px 16px', borderRadius: '20px', fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase' }}>
          Frequently Asked Questions
        </span>
        <h2 style={{ fontFamily: 'Outfit', fontSize: '2.4rem', fontWeight: 800, color: '#0F172A', marginTop: '8px' }}>
          Got Questions? We Have Answers
        </h2>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {faqs.map((faq, idx) => {
          const isOpen = activeIndex === idx;
          return (
            <div key={idx} style={{ background: 'white', borderRadius: '16px', border: '1.5px solid #E2E8F0', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
              <button
                onClick={() => setActiveIndex(isOpen ? -1 : idx)}
                style={{ width: '100%', padding: '20px 24px', background: 'none', border: 'none', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', fontFamily: 'Outfit', fontSize: '1.1rem', fontWeight: 700, color: '#0F172A' }}
              >
                <span>{faq.q}</span>
                <i className={`fa-solid fa-chevron-down`} style={{ color: '#2563EB', transition: 'transform 0.3s ease', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}></i>
              </button>
              {isOpen && (
                <div style={{ padding: '0 24px 20px 24px', color: '#475569', fontSize: '0.95rem' }}>
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
