import React, { useState } from 'react';

export default function AuthPortal({ onAdminLoginSuccess, onClientLogin }) {
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [loggedInClient, setLoggedInClient] = useState(
    JSON.parse(localStorage.getItem('sv_client_user')) || null
  );

  const [adminUser, setAdminUser] = useState('admin');
  const [adminPass, setAdminPass] = useState('');
  const [adminMsg, setAdminMsg] = useState(null);

  const handleClientSubmit = (e) => {
    e.preventDefault();
    if (clientName && clientPhone) {
      const user = { name: clientName, phone: clientPhone };
      localStorage.setItem('sv_client_user', JSON.stringify(user));
      setLoggedInClient(user);
      if (onClientLogin) onClientLogin(user);
      alert(`Welcome back, ${clientName}! Your details have been saved for fast booking.`);
    }
  };

  const handleClientLogout = () => {
    localStorage.removeItem('sv_client_user');
    setLoggedInClient(null);
  };

  const handleAdminSubmit = (e) => {
    e.preventDefault();
    // Validate password "0000" or 0
    if (adminPass.trim() === '0000' || parseInt(adminPass, 10) === 0) {
      setAdminMsg({ type: 'success', text: 'Admin Password Verified (0000)! Opening Control Panel...' });
      setTimeout(() => {
        setAdminMsg(null);
        setAdminPass('');
        onAdminLoginSuccess();
      }, 600);
    } else {
      setAdminMsg({ type: 'error', text: 'Invalid Admin Password! Password must be integer 0000.' });
    }
  };

  return (
    <section className="auth-landing-section" id="auth-portal">
      <div className="container" style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 20px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <span className="ev-badge" style={{ background: 'rgba(37, 99, 235, 0.1)', color: '#2563EB', padding: '6px 16px', borderRadius: '9999px', fontWeight: 'bold', fontSize: '0.85rem' }}>
            <i className="fa-solid fa-shield-halved"></i> Access Portal
          </span>
          <h2 style={{ fontSize: '2.2rem', fontWeight: '800', margin: '12px 0 8px', color: '#111827' }}>
            Welcome to Shree Venkateshwara Express
          </h2>
          <p style={{ color: '#64748B', fontSize: '1.05rem' }}>
            Please log in below. Select <strong>Client Login</strong> for fast seat reservations or <strong>Admin Portal</strong> for fleet management.
          </p>
        </div>

        <div className="dual-auth-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '28px' }}>
          
          {/* PANEL 1: CLIENT / PASSENGER LOGIN */}
          <div className="auth-card client-auth-card" style={{ background: '#FFFFFF', borderRadius: '16px', padding: '28px', border: '1.5px solid #E2E8F0', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
              <div style={{ width: '52px', height: '52px', borderRadius: '12px', background: 'rgba(37, 99, 235, 0.1)', color: '#2563EB', display: 'flex', alignItems: 'center', justifyCenter: 'center', fontSize: '1.4rem' }}>
                <i className="fa-solid fa-user-check" style={{ margin: 'auto' }}></i>
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', margin: 0, color: '#111827' }}>Client / Passenger Login</h3>
                <p style={{ fontSize: '0.85rem', color: '#64748B', margin: 0 }}>Login with your Phone & Name for smooth ticket booking</p>
              </div>
            </div>

            {loggedInClient ? (
              <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '10px', padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <i className="fa-solid fa-circle-check" style={{ color: '#10B981', fontSize: '1.4rem' }}></i>
                <div>
                  <strong style={{ color: '#1E3A8A' }}>Logged In as Client</strong>
                  <div style={{ fontSize: '0.85rem', color: '#3B82F6' }}>{loggedInClient.name} ({loggedInClient.phone})</div>
                </div>
                <button type="button" onClick={handleClientLogout} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#EF4444', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.85rem' }}>
                  Logout
                </button>
              </div>
            ) : (
              <form onSubmit={handleClientSubmit}>
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '6px', color: '#111827' }}>Full Name</label>
                  <input type="text" className="input-field" placeholder="e.g. Sarthak Patil" value={clientName} onChange={(e) => setClientName(e.target.value)} required style={{ width: '100%', height: '46px', padding: '0 14px', borderRadius: '8px', border: '1.5px solid #CBD5E1' }} />
                </div>

                <div style={{ marginBottom: '18px' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '6px', color: '#111827' }}>Phone Number (For WhatsApp Ticket)</label>
                  <input type="tel" className="input-field" placeholder="e.g. 866 941 0303" value={clientPhone} onChange={(e) => setClientPhone(e.target.value)} required style={{ width: '100%', height: '46px', padding: '0 14px', borderRadius: '8px', border: '1.5px solid #CBD5E1' }} />
                </div>

                <button type="submit" className="btn-green" style={{ width: '100%', padding: '12px', borderRadius: '8px', fontWeight: 'bold' }}>
                  <i className="fa-solid fa-right-to-bracket"></i> Login as Passenger
                </button>
              </form>
            )}
          </div>

          {/* PANEL 2: ADMIN PORTAL LOGIN */}
          <div className="auth-card admin-auth-card" style={{ background: '#FFFFFF', borderRadius: '16px', padding: '28px', border: '1.5px solid #E2E8F0', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
              <div style={{ width: '52px', height: '52px', borderRadius: '12px', background: 'rgba(249, 115, 22, 0.1)', color: '#F97316', display: 'flex', alignItems: 'center', justifyCenter: 'center', fontSize: '1.4rem' }}>
                <i className="fa-solid fa-user-gear" style={{ margin: 'auto' }}></i>
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', margin: 0, color: '#111827' }}>Admin Control Portal</h3>
                <p style={{ fontSize: '0.85rem', color: '#64748B', margin: 0 }}>Administrator Login (Password: <strong>0000</strong>)</p>
              </div>
            </div>

            {adminMsg && (
              <div style={{ 
                background: adminMsg.type === 'success' ? '#ECFDF5' : '#FEE2E2', 
                border: `1px solid ${adminMsg.type === 'success' ? '#10B981' : '#EF4444'}`,
                color: adminMsg.type === 'success' ? '#065F46' : '#991B1B',
                borderRadius: '8px', padding: '10px 14px', fontSize: '0.85rem', marginBottom: '14px', fontWeight: 'bold'
              }}>
                {adminMsg.text}
              </div>
            )}

            <form onSubmit={handleAdminSubmit}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '6px', color: '#111827' }}>Admin Username</label>
                <input type="text" className="input-field" placeholder="e.g. admin" value={adminUser} onChange={(e) => setAdminUser(e.target.value)} required style={{ width: '100%', height: '46px', padding: '0 14px', borderRadius: '8px', border: '1.5px solid #CBD5E1' }} />
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '6px', color: '#111827' }}>Admin Password (PIN)</label>
                <input type="password" className="input-field" placeholder="Enter password '0000'" value={adminPass} onChange={(e) => setAdminPass(e.target.value)} required style={{ width: '100%', height: '46px', padding: '0 14px', borderRadius: '8px', border: '1.5px solid #CBD5E1' }} />
                <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block', marginTop: '4px' }}>Main Admin Password is integer <strong>0000</strong></span>
              </div>

              <button type="submit" className="btn-outline-green" style={{ width: '100%', padding: '12px', borderRadius: '8px', fontWeight: 'bold', background: '#F97316', color: '#FFFFFF', borderColor: '#F97316' }}>
                <i className="fa-solid fa-lock-open"></i> Unlock Admin Control Panel
              </button>
            </form>
          </div>

        </div>

      </div>
    </section>
  );
}
