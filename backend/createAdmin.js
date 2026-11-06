require('dotenv').config();
const bcrypt = require('bcryptjs');
const pool = require('./db');

(async () => {
  try {
    const hash = await bcrypt.hash('Deepu@123', 10);
    await pool.query(
      `INSERT INTO users (name, email, password_hash, role)
       VALUES ($1, $2, $3, 'admin')
       ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash, role = 'admin'`,
      ['Admin', 'admin@pustak.com', hash]
    );
    console.log('Admin ready: admin@pustak.com / Deepu@123');
  } catch (err) {
    console.error('Failed:', err.message);
  }
  process.exit();
})();