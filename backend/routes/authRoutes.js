const express = require('express');
const crypto = require('node:crypto');
const router = express.Router();
const { createAdminSession, requireAdmin, revokeAdminSession } = require('../middleware/adminAuth');

// Admin & Client Login Endpoint
router.post('/login', (req, res) => {
  const { role, username, password, name, phone } = req.body || {};

  if (role === 'admin') {
    const configuredPassword = process.env.ADMIN_PASSWORD;
    if (!configuredPassword) {
      return res.status(503).json({ success: false, message: 'Admin login is not configured' });
    }

    const providedHash = crypto.createHash('sha256').update(String(password || '')).digest();
    const configuredHash = crypto.createHash('sha256').update(configuredPassword).digest();
    if (crypto.timingSafeEqual(providedHash, configuredHash)) {
      return res.json({
        success: true,
        message: 'Admin Authentication Successful!',
        token: createAdminSession(),
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

router.post('/logout', requireAdmin, (req, res) => {
  revokeAdminSession(req.adminToken);
  return res.json({ success: true });
});

module.exports = router;
