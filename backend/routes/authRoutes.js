const express = require('express');
const router = express.Router();

// Admin & Client Login Endpoint
router.post('/login', (req, res) => {
  const { role, username, password, name, phone } = req.body || {};

  if (role === 'admin') {
    const cleanPass = (password || '').toString().trim();
    if (cleanPass === '0000' || cleanPass === '0') {
      return res.json({
        success: true,
        message: 'Admin Authentication Successful!',
        token: 'sv_admin_sec_token_' + Date.now(),
        user: { role: 'admin', username: username || 'admin' }
      });
    } else {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Please contact the system administrator for access.'
      });
    }
  }

  // Client Login
  if (name && phone) {
    const cleanName = String(name).trim().replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const cleanPhone = String(phone).trim().replace(/[^0-9+ ]/g, "");

    return res.json({
      success: true,
      message: 'Client Login Successful!',
      user: { role: 'client', name: cleanName, phone: cleanPhone }
    });
  }

  return res.status(400).json({
    success: false,
    message: 'Missing required login credentials'
  });
});

module.exports = router;
