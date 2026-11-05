const express = require('express');
const bcrypt = require('bcryptjs');
const pool = require('../db');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();
router.use(authenticate, authorize('staff', 'admin'));

router.get('/', async (req, res) => {
  try {
    const onlyMembers = req.user.role === 'staff';
    const result = await pool.query(
      `SELECT id, name, email, role, phone, created_at FROM users
       WHERE ($1 = false OR role = 'member') ORDER BY id DESC`,
      [onlyMembers]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', async (req, res) => {
  const { name, email, password, phone, role } = req.body;
  if (!name || typeof email !== 'string' || !email.trim() || !password) {
    return res.status(400).json({ message: 'Name, email and password are required' });
  }
  const allowed = ['member', 'staff', 'admin'];
  const newRole = req.user.role === 'admin' && allowed.includes(role) ? role : 'member';
  try {
    const hash = await bcrypt.hash(password, 10);
    const normalizedEmail = email.trim().toLowerCase();
    const result = await pool.query(
      `INSERT INTO users (name, email, password_hash, role, phone)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, name, email, role, phone`,
      [name, normalizedEmail, hash, newRole, phone || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ message: 'Email already exists' });
    }
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id', async (req, res) => {
  const { name, email, phone } = req.body;
  if (typeof email !== 'string' || !email.trim()) {
    return res.status(400).json({ message: 'Email is required' });
  }
  try {
    const normalizedEmail = email.trim().toLowerCase();
    const result = await pool.query(
      `UPDATE users SET name = $1, email = $2, phone = $3
       WHERE id = $4 AND ($5 = 'admin' OR role = 'member')
       RETURNING id, name, email, role, phone`,
      [name, normalizedEmail, phone || null, req.params.id, req.user.role]
    );
    if (!result.rows[0]) return res.status(404).json({ message: 'User not found' });
    res.json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ message: 'Email already exists' });
    }
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', authorize('admin'), async (req, res) => {
  try {
    await pool.query('DELETE FROM users WHERE id = $1', [req.params.id]);
    res.json({ message: 'User deleted' });
  } catch (err) {
    if (err.code === '23503') {
      return res.status(409).json({ message: 'This user has issue history and cannot be deleted' });
    }
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});
router.put('/:id/password', authorize('staff', 'admin'), async (req, res) => {
  const { password } = req.body;
  if (!password || password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }
  try {
    const hash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `UPDATE users SET password_hash = $1 WHERE id = $2 AND role = 'member' RETURNING id`,
      [hash, req.params.id]
    );
    if (!result.rows[0]) return res.status(404).json({ message: 'Member not found' });
    res.json({ message: 'Password updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;