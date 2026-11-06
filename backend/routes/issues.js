const express = require('express');
const pool = require('../db');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();
router.use(authenticate);

const BASE = `
  SELECT i.id, i.issue_date, i.due_date, i.return_date, i.notified,
         b.id AS book_id, b.title, b.cover_url,
         u.id AS user_id, u.name AS member_name,
         CASE WHEN i.return_date IS NOT NULL THEN 'Returned'
              WHEN i.due_date < CURRENT_DATE THEN 'Overdue'
              ELSE 'Issued' END AS status
  FROM issues i
  JOIN books b ON b.id = i.book_id
  JOIN users u ON u.id = i.user_id`;

async function list(res, where, params = []) {
  try {
    const result = await pool.query(`${BASE} ${where} ORDER BY i.id DESC`, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

router.get('/mine', (req, res) => list(res, 'WHERE i.user_id = $1', [req.user.id]));

router.get('/overdue', authorize('staff', 'admin'), (req, res) =>
  list(res, 'WHERE i.return_date IS NULL AND i.due_date < CURRENT_DATE'));

router.get('/due-today', authorize('staff', 'admin'), (req, res) =>
  list(res, 'WHERE i.return_date IS NULL AND i.due_date = CURRENT_DATE'));

router.get('/due-soon', authorize('staff', 'admin'), (req, res) =>
  list(res, `WHERE i.return_date IS NULL
             AND i.due_date = CURRENT_DATE + 1`));

router.get('/stats', authorize('staff', 'admin'), async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        (SELECT COALESCE(SUM(total_copies), 0)::int FROM books) AS total_books,
        (SELECT COUNT(*)::int FROM users WHERE role = 'member') AS total_members,
        (SELECT COUNT(*)::int FROM issues WHERE return_date IS NULL) AS books_issued,
        (SELECT COUNT(*)::int FROM issues
          WHERE return_date IS NULL AND due_date < CURRENT_DATE) AS overdue_books`);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/', authorize('staff', 'admin'), (req, res) => list(res, ''));

router.post('/', authorize('staff', 'admin'), async (req, res) => {
  const { book_id, user_id } = req.body;
  const days = Math.min(Math.max(Number(req.body.days) || 7, 1), 60);
  if (!book_id || !user_id) {
    return res.status(400).json({ message: 'book_id and user_id are required' });
  }

  try {
    const member = await pool.query(
      "SELECT id FROM users WHERE id = $1 AND role = 'member'",
      [user_id]
    );
    if (!member.rows[0]) {
      return res.status(400).json({ message: 'Only member accounts can borrow books' });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const book = await client.query(
      `UPDATE books SET available_copies = available_copies - 1
       WHERE id = $1 AND available_copies > 0 RETURNING id`,
      [book_id]
    );
    if (!book.rows[0]) {
      await client.query('ROLLBACK');
      return res.status(400).json({ message: 'No copy available for this book' });
    }
    const issue = await client.query(
      `INSERT INTO issues (book_id, user_id, due_date)
       VALUES ($1, $2, CURRENT_DATE + $3::int) RETURNING *`,
      [book_id, user_id, days]
    );
    await client.query('COMMIT');
    res.status(201).json(issue.rows[0]);
  } catch (err) {
    await client.query('ROLLBACK');
    if (err.code === '23503') {
      return res.status(400).json({ message: 'Book not found' });
    }
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  } finally {
    client.release();
  }
});

router.put('/:id/return', authorize('staff', 'admin'), async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const issue = await client.query(
      `UPDATE issues SET return_date = CURRENT_DATE
       WHERE id = $1 AND return_date IS NULL RETURNING book_id`,
      [req.params.id]
    );
    if (!issue.rows[0]) {
      await client.query('ROLLBACK');
      return res.status(400).json({ message: 'Issue not found or already returned' });
    }
    await client.query(
      'UPDATE books SET available_copies = available_copies + 1 WHERE id = $1',
      [issue.rows[0].book_id]
    );
    await client.query('COMMIT');
    res.json({ message: 'Book returned' });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  } finally {
    client.release();
  }
});

router.put('/:id/notify', authorize('staff', 'admin'), async (req, res) => {
  try {
    const result = await pool.query(
      `UPDATE issues SET notified = true WHERE id = $1 RETURNING id`,
      [req.params.id]
    );
    if (!result.rows[0]) return res.status(404).json({ message: 'Issue not found' });
    res.json({ message: 'Marked as notified' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;