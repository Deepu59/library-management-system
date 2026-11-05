import { useEffect, useState } from 'react';
import api from '../api';
import { useAuth } from '../auth';
import Cover from '../components/Cover';

const EMPTY = { title: '', author: '', isbn: '', cover_url: '', total_copies: 1 };

export default function Books() {
  const { user } = useAuth();
  const canEdit = user.role !== 'member';
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  async function load(q) {
    try {
      const { data } = await api.get('/books', { params: { search: q } });
      setBooks(data);
    } catch {
      setError('Could not load books');
    }
  }

  useEffect(() => { load(''); }, []);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  function openAdd() {
    setError('');
    setEditingId(null);
    setForm(EMPTY);
  }

  function openEdit(b) {
    setError('');
    setEditingId(b.id);
    setForm({
      title: b.title,
      author: b.author,
      isbn: b.isbn || '',
      cover_url: b.cover_url || '',
      total_copies: b.total_copies,
    });
  }

  function closeForm() {
    setForm(null);
    setEditingId(null);
  }

  async function save(e) {
    e.preventDefault();
    setError('');
    try {
      if (editingId) await api.put(`/books/${editingId}`, form);
      else await api.post('/books', form);
      closeForm();
      load(search);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save the book');
    }
  }

  async function remove(id) {
    if (!window.confirm('Delete this book?')) return;
    setError('');
    try {
      await api.delete(`/books/${id}`);
      load(search);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not delete the book');
    }
  }

  return (
    <>
      <div className="toolbar">
        <form
          className="toolbar"
          onSubmit={(e) => { e.preventDefault(); load(search); }}
        >
          <input
            aria-label="Search books"
            placeholder="Search by title, author or ISBN"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="btn dark" type="submit">Search</button>
        </form>
        {canEdit && <button className="btn" onClick={openAdd}>Add book</button>}
      </div>

      {error && <div className="error">{error}</div>}

      {form && (
        <form className="card" onSubmit={save}>
          <div className="card-head">
            <h2>{editingId ? 'Edit book' : 'Add book'}</h2>
          </div>
          <div className="form-grid">
            <label>Title<input value={form.title} onChange={set('title')} required /></label>
            <label>Author<input value={form.author} onChange={set('author')} required /></label>
            <label>ISBN<input value={form.isbn} onChange={set('isbn')} /></label>
            <label>Total copies
              <input type="number" min="1" value={form.total_copies} onChange={set('total_copies')} required />
            </label>
            <label>Cover image link (optional)
              <input value={form.cover_url} onChange={set('cover_url')} placeholder="https://..." />
            </label>
          </div>
          <div className="actions" style={{ marginTop: 16 }}>
            <button className="btn" type="submit">Save</button>
            <button className="btn light" type="button" onClick={closeForm}>Cancel</button>
          </div>
        </form>
      )}

      <div className="book-grid">
        {books.map((b) => (
          <div className="book-card" key={b.id}>
            <Cover big title={b.title} url={b.cover_url} />
            <h3>{b.title}</h3>
            <span className="muted">{b.author}</span>
            <span
              className={`badge ${b.available_copies > 0 ? 'returned' : 'overdue'}`}
              style={{ alignSelf: 'flex-start' }}
            >
              {b.available_copies > 0
                ? `${b.available_copies} of ${b.total_copies} available`
                : 'All issued'}
            </span>
            {canEdit && (
              <div className="actions">
                <button className="btn light small" onClick={() => openEdit(b)}>Edit</button>
                {user.role === 'admin' && (
                  <button className="btn danger small" onClick={() => remove(b.id)}>Delete</button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      {books.length === 0 && <p className="muted">No books found.</p>}
    </>
  );
}