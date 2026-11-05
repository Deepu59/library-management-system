const express = require('express');
const pool = require('../db');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();
router.use(authenticate);

router.get('/', async (req, res) => {
  const search = `%${req.query.search || ''}%`;
  try {
    const result = await pool.query(
      `SELECT * FROM books
       WHERE title ILIKE $1 OR author ILIKE $1 OR isbn ILIKE $1
       ORDER BY id DESC`,
      [search]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', authorize('staff', 'admin'), async (req, res) => {
  const { title, author, isbn, cover_url, total_copies } = req.body;
  if (!title || !author) {
    return res.status(400).json({ message: 'Title and author are required' });
  }
  const copies = Number(total_copies) || 1;
  try {
    const result = await pool.query(
      `INSERT INTO books (title, author, isbn, cover_url, total_copies, available_copies)
       VALUES ($1, $2, $3, $4, $5, $5) RETURNING *`,
      [title, author, isbn || null, cover_url || null, copies]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ message: 'A book with this ISBN already exists' });
    }
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id', authorize('staff', 'admin'), async (req, res) => {
  const { title, author, isbn, cover_url, total_copies } = req.body;
  try {
    const result = await pool.query(
      `UPDATE books
       SET title = $1, author = $2, isbn = $3, cover_url = $4,
           available_copies = available_copies + ($5 - total_copies),
           total_copies = $5
       WHERE id = $6 AND available_copies + ($5 - total_copies) >= 0
       RETURNING *`,
      [title, author, isbn || null, cover_url || null, Number(total_copies) || 1, req.params.id]
    );
    if (!result.rows[0]) {
      return res.status(400).json({ message: 'Book not found, or copies are fewer than issued books' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ message: 'A book with this ISBN already exists' });
    }
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', authorize('admin'), async (req, res) => {
  try {
    await pool.query('DELETE FROM books WHERE id = $1', [req.params.id]);
    res.json({ message: 'Book deleted' });
  } catch (err) {
    if (err.code === '23503') {
      return res.status(409).json({ message: 'This book has issue history and cannot be deleted' });
    }
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;