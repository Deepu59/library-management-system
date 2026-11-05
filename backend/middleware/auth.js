const jwt = require('jsonwebtoken');
const pool = require('../db');

async function authenticate(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'Please log in' });

  let claims;
  try {
    claims = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }

  if (!claims || typeof claims !== 'object' || !claims.id) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }

  try {
    const result = await pool.query(
      'SELECT id, name, email, role FROM users WHERE id = $1',
      [claims.id]
    );
    if (!result.rows[0]) {
      return res.status(401).json({ message: 'Account no longer exists' });
    }

    req.user = result.rows[0];
    return next();
  } catch (error) {
    console.error('Authentication account lookup failed:', error);
    return res.status(503).json({ message: 'Authentication is temporarily unavailable' });
  }
}

function authorize(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  };
}

module.exports = { authenticate, authorize };