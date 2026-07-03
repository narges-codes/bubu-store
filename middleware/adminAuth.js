const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'change-this-secret';

function adminAuth(req, res, next) {
  if (req.headers['x-admin-token'] !== ADMIN_TOKEN) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

module.exports = adminAuth;