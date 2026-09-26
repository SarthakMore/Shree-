import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroWidget from './components/HeroWidget';
import ImportantInfo from './components/ImportantInfo';
import FleetShowcase from './components/FleetShowcase';
import FareCalculator from './components/FareCalculator';
import FAQAccordion from './components/FAQAccordion';
import BookingVoucherModal from './components/BookingVoucherModal';
import QuoteModal from './components/QuoteModal';
import AdminPanelModal from './components/AdminPanel';
import Footer from './components/Footer';

export default function App() {
  const [activeVoucher, setActiveVoucher] = useState(null);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);

  // Dynamic Settings State (Synced with Node/Express/MongoDB Backend)
  const [settings, setSettings] = useState({
    frontSeatFare: 649,
    middleSeatFare: 499,
    thirdSeatFare: 399,
    cabStatus: 'AVAILABLE',
    statusNote: 'VinFast Limo Green EV is accepting reservations for upcoming hourly slots.'
  });

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      if (data.success && data.data) {
        setSettings(data.data);
      }
    } catch (err) {
      console.error('Error loading settings', err);
    }
  };

  useEffect(() => {
    fetchSettings();
    // Poll every 5 seconds to keep client in sync with live admin status changes
    const interval = setInterval(fetchSettings, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="app-container">
      <Navbar onOpenAdmin={() => setShowAdminModal(true)} />
      
      <main>
        <HeroWidget 
          settings={settings}
          onBookingCreated={(newBooking) => setActiveVoucher(newBooking)} 
        />
        <ImportantInfo onOpenQuote={() => setShowQuoteModal(true)} />
        <FleetShowcase settings={settings} />
        <FareCalculator />
        <FAQAccordion />
      </main>

      <Footer />

      {/* Modals */}
      {activeVoucher && (
        <BookingVoucherModal 
          booking={activeVoucher} 
          onClose={() => setActiveVoucher(null)} 
        />
      )}

      {showQuoteModal && (
        <QuoteModal 
          onClose={() => setShowQuoteModal(false)} 
        />
      )}

      {showAdminModal && (
        <AdminPanelModal 
          onClose={() => setShowAdminModal(false)} 
          onSettingsUpdated={(updated) => setSettings(updated)}
        />
      )}
    </div>
  );
}
