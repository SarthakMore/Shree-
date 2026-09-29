const crypto = require('node:crypto');

const sessions = new Map();
const sessionLifetimeMs = 8 * 60 * 60 * 1000;

function createAdminSession() {
    const now = Date.now();
    for (const [token, expiresAt] of sessions) {
        if (expiresAt <= now) sessions.delete(token);
    }

    const token = crypto.randomBytes(32).toString('base64url');
    sessions.set(token, now + sessionLifetimeMs);
    return token;
}

function revokeAdminSession(token) {
    sessions.delete(token);
}

function requireAdmin(req, res, next) {
    const authorization = req.get('authorization') || '';
    const match = authorization.match(/^Bearer\s+(.+)$/i);
    const token = match?.[1];
    const expiresAt = token && sessions.get(token);

    if (!expiresAt || expiresAt <= Date.now()) {
        if (token) sessions.delete(token);
        return res.status(401).json({ success: false, message: 'Admin authentication required' });
    }

    req.adminToken = token;
    return next();
}

module.exports = { createAdminSession, revokeAdminSession, requireAdmin };