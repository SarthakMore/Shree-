import React, { useState, useEffect } from 'react';
import { API_BASE } from './api';
import Navbar from './components/Navbar';
import AuthPortal from './components/AuthPortal';
import MainPortals from './components/MainPortals';
import HeroWidget from './components/HeroWidget';
import MaharashtraTours from './components/MaharashtraTours';
import ImportantInfo from './components/ImportantInfo';
import FleetShowcase from './components/FleetShowcase';
import FareCalculator from './components/FareCalculator';
import FAQAccordion from './components/FAQAccordion';
import BookingVoucherModal from './components/BookingVoucherModal';
import QuoteModal from './components/QuoteModal';
import AdminPanelModal from './components/AdminPanel';
import Footer from './components/Footer';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [activeVoucher, setActiveVoucher] = useState(null);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);

  // Dynamic Settings State (Synced with Node/Express Backend)
  const [settings, setSettings] = useState({
    frontSeatFare: 650,
    middleSeatFare: 550,
    thirdSeatFare: 450,
    cabStatus: 'AVAILABLE',
    statusNote: 'VinFast Limo Green EV is accepting reservations for upcoming hourly slots.'
  });

  const fetchSettings = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/settings`);
      const data = await res.json();
      if (data.success && data.data) {
        setSettings(data.data);
      }
    } catch (err) {
      console.log('Settings sync offline');
    }
  };

  useEffect(() => {
    fetchSettings();
    const interval = setInterval(fetchSettings, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleNavigate = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="app-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#F8FAFC' }}>
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onOpenAdmin={() => handleNavigate('admin')}
      />

      <main style={{ flex: 1 }}>
        {/* PAGE 1: HOME PAGE */}
        {currentPage === 'home' && (
          <div>
            <section style={{ padding: '60px 20px 40px', background: 'linear-gradient(180deg, #FFFFFF 0%, #F1F5F9 100%)', textAlign: 'center' }}>
              <div style={{ maxWidth: '960px', margin: '0 auto' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#DBEAFE', color: '#1E40AF', padding: '8px 18px', borderRadius: '9999px', fontWeight: 'bold', fontSize: '0.88rem', marginBottom: '20px' }}>
                  <i className="fa-solid fa-bolt" style={{ color: '#2563EB' }}></i>
                  VinFast Limo Green EV • 100% Electric Express Shared Cabs
                </div>
                <h1 style={{ fontSize: '2.8rem', fontWeight: 800, color: '#0F172A', marginBottom: '16px', lineHeight: 1.2 }}>
                  Welcome to <span style={{ color: '#2563EB' }}>Shree Venkateshwara Express</span>
                </h1>
                <p style={{ fontSize: '1.125rem', color: '#475569', marginBottom: '32px', lineHeight: 1.6 }}>
                  Kolhapur & Pune's most trusted daily shared cab service and outstation travel provider. Use our navigation bar above or attached pages below to log in, reserve shared cab seats, or book full vehicle tour packages!
                </p>

                <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '40px' }}>
                  <button onClick={() => handleNavigate('login')} style={{ background: '#2563EB', color: '#FFFFFF', border: 'none', padding: '16px 28px', borderRadius: '12px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <i className="fa-solid fa-user-check"></i> 1. Open Login Portal
                  </button>
                  <button onClick={() => handleNavigate('shared-cabs')} style={{ background: '#10B981', color: '#FFFFFF', border: 'none', padding: '16px 28px', borderRadius: '12px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <i className="fa-solid fa-van-shuttle"></i> 2. Reserve Shared Cab Seat
                  </button>
                  <button onClick={() => handleNavigate('airport-tours')} style={{ background: '#FFFFFF', color: '#2563EB', border: '2px solid #2563EB', padding: '16px 28px', borderRadius: '12px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <i className="fa-solid fa-plane-departure"></i> 3. Airport & Tour Packages
                  </button>
                </div>
              </div>
            </section>

            <MainPortals onSelectPortal={(portal) => handleNavigate(portal === 'shared' ? 'shared-cabs' : 'airport-tours')} />
            <FleetShowcase settings={settings} />
            <FareCalculator />
            <FAQAccordion />
          </div>
        )}

        {/* PAGE 2: LOGIN PORTAL */}
        {currentPage === 'login' && (
          <div style={{ padding: '40px 0' }}>
            <AuthPortal
              onAdminLoginSuccess={() => handleNavigate('admin')}
              onClientLogin={() => handleNavigate('shared-cabs')}
            />
          </div>
        )}

        {/* PAGE 3: DAILY SHARED CABS SCHEDULE */}
        {currentPage === 'shared-cabs' && (
          <div style={{ padding: '20px 0' }}>
            <HeroWidget
              settings={settings}
              onBookingCreated={(newBooking) => setActiveVoucher(newBooking)}
            />
            <FareCalculator />
          </div>
        )}

        {/* PAGE 4: AIRPORT & TOURS */}
        {currentPage === 'airport-tours' && (
          <div style={{ padding: '20px 0' }}>
            <MaharashtraTours />
            <ImportantInfo onOpenQuote={() => setShowQuoteModal(true)} />
          </div>
        )}

        {/* PAGE 5: ADMIN DASHBOARD */}
        {currentPage === 'admin' && (
          <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '2px solid #2563EB', padding: '24px', boxShadow: '0 10px 25px rgba(0,0,0,0.08)' }}>
              <AdminPanelModal
                onClose={() => handleNavigate('home')}
                onSettingsUpdated={(updated) => setSettings(updated)}
              />
            </div>
          </div>
        )}
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
    </div>
  );
}
