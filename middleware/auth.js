const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'change-this-jwt-secret';

function auth(req, res, next) {
  const header = req.headers['authorization'];
  
  if (!header) {
    return res.status(401).json({ error: 'توکن وجود ندارد' });
  }

  // فرمت: Bearer <token>
  const token = header.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'توکن وجود ندارد' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;  // { id, role }
    next();
  } catch (err) {
    return res.status(401).json({ error: 'توکن نامعتبر است' });
  }
}

module.exports = auth;