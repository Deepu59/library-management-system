import { useEffect, useState } from 'react';
import { ArrowRightCircle, RotateCcw, CheckCircle } from 'lucide-react';
import api from '../api';
import Cover from '../components/Cover';

export default function Issue() {
  const [members, setMembers] = useState([]);
  const [books, setBooks] = useState([]);
  const [issues, setIssues] = useState([]);
  const [form, setForm] = useState({ user_id: '', book_id: '', days: 7 });
  const [msg, setMsg] = useState({ type: '', text: '' });

  async function load() {
    try {
      const [u, b, i] = await Promise.all([
        api.get('/users'),
        api.get('/books'),
        api.get('/issues'),
      ]);
      setMembers(u.data.filter((x) => x.role === 'member'));
      setBooks(b.data.filter((x) => x.available_copies > 0));
      setIssues(i.data.filter((x) => x.status !== 'Returned'));
    } catch {
      setMsg({ type: 'error', text: 'Could not load data' });
    }
  }

  useEffect(() => { load(); }, []);

  async function issueBook(e) {
    e.preventDefault();
    setMsg({ type: '', text: '' });
    try {
      await api.post('/issues', form);
      setMsg({ type: 'success', text: 'Book issued successfully' });
      setForm({ user_id: '', book_id: '', days: 7 });
      load();
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Could not issue the book' });
    }
  }

  async function returnBook(id) {
    setMsg({ type: '', text: '' });
    try {
      await api.put(`/issues/${id}/return`);
      setMsg({ type: 'success', text: 'Book returned successfully' });
      load();
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Could not return the book' });
    }
  }

  return (
    <>
      {msg.text && <div className={msg.type}>{msg.text}</div>}

      <form className="card" onSubmit={issueBook}>
        <div className="card-head">
          <h2 style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <ArrowRightCircle size={20} /> Issue a book
          </h2>
        </div>
        <div className="form-grid">
          <label>Member
            <select value={form.user_id} onChange={(e) => setForm({ ...form, user_id: e.target.value })} required>
              <option value="">Choose a member</option>
              {members.map((m) => (
                <option key={m.id} value={m.id}>{m.name} ({m.email})</option>
              ))}
            </select>
          </label>
          <label>Book
            <select value={form.book_id} onChange={(e) => setForm({ ...form, book_id: e.target.value })} required>
              <option value="">Choose a book</option>
              {books.map((b) => (
                <option key={b.id} value={b.id}>{b.title} — {b.available_copies} available</option>
              ))}
            </select>
          </label>
          <label>Days to keep
            <input type="number" min="1" max="60" value={form.days} onChange={(e) => setForm({ ...form, days: e.target.value })} required />
          </label>
        </div>
        <div style={{ marginTop: 16 }}>
          <button className="btn" type="submit">
            <ArrowRightCircle size={18} /> Issue book
          </button>
        </div>
      </form>

      <section className="card" style={{ overflowX: 'auto' }}>
        <div className="card-head">
          <h2 style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <RotateCcw size={20} /> Books currently issued
          </h2>
        </div>
        <table className="tbl">
          <thead>
            <tr><th>Book</th><th>Member</th><th>Issue date</th><th>Due date</th><th>Status</th><th></th></tr>
          </thead>
          <tbody>
            {issues.map((i) => (
              <tr key={i.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Cover title={i.title} url={i.cover_url} />
                    {i.title}
                  </div>
                </td>
                <td>{i.member_name}</td>
                <td>{i.issue_date}</td>
                <td>{i.due_date}</td>
                <td><span className={`badge ${i.status.toLowerCase()}`}>{i.status}</span></td>
                <td>
                  <button className="btn small" onClick={() => returnBook(i.id)}>
                    <CheckCircle size={14} /> Return
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {issues.length === 0 && <p className="muted">No books are issued right now.</p>}
      </section>
    </>
  );
}