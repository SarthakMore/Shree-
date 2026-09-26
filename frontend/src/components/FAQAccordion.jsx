import React, { useState } from 'react';

export default function FAQAccordion() {
  const [activeIndex, setActiveIndex] = useState(0);

  const faqs = [
    {
      q: 'What are the main pickup and drop points in Kolhapur & Pune?',
      a: 'In Kolhapur, our main pickup points are CBS Bus Stand, Kawala Naka, and Dabholkar Corner. In Pune, we drop and pick up at Swargate, Katraj Tunnel, Wakad Bypass, Chandani Chowk, and Pune Airport.'
    },
    {
      q: 'How much luggage can I bring per seat?',
      a: 'Each passenger is allowed 1 medium trolley bag (up to 15 kg) plus 1 handbag/backpack. For heavy additional luggage, please notify us in advance.'
    },
    {
      q: 'What is the cancellation and refund policy?',
      a: 'Free cancellation is allowed up to 4 hours prior to departure time. Cancellations made within 4 hours carry a nominal 20% re-scheduling fee.'
    },
    {
      q: 'Can I book a dedicated private cab instead of a shared seat?',
      a: 'Yes! We offer dedicated full vehicle hires (Innova Crysta, Ertiga, Dzire) with doorstep pickup for private family or corporate trips.'
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
