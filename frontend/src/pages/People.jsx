import { useEffect, useState } from 'react';
import { UserPlus, Pencil, Trash2, KeyRound, Phone, Mail } from 'lucide-react';
import api from '../api';
import { useAuth } from '../AuthContext';

export default function People({ staffMode = false }) {
  const { user } = useAuth();
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [pwdId, setPwdId] = useState(null);
  const [newPwd, setNewPwd] = useState('');
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');

  const emptyForm = { name: '', email: '', phone: '', password: '', role: staffMode ? 'staff' : 'member' };

  async function load() {
    try {
      const { data } = await api.get('/users');
      setRows(data.filter((u) => (staffMode ? u.role !== 'member' : u.role === 'member')));
    } catch {
      setError('Could not load the list');
    }
  }

  useEffect(() => { load(); }, [staffMode]);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  function openAdd() { setError(''); setMsg(''); setEditingId(null); setForm(emptyForm); }
  function openEdit(u) { setError(''); setMsg(''); setEditingId(u.id); setForm({ ...emptyForm, name: u.name, email: u.email, phone: u.phone || '' }); }
  function closeForm() { setForm(null); setEditingId(null); }

  async function save(e) {
    e.preventDefault();
    setError('');
    try {
      if (editingId) {
        await api.put(`/users/${editingId}`, { name: form.name, email: form.email, phone: form.phone });
      } else {
        await api.post('/users', form);
      }
      setMsg(editingId ? 'Account updated' : 'Account created');
      closeForm();
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save');
    }
  }

  async function remove(id) {
    if (!window.confirm('Delete this account?')) return;
    setError('');
    try {
      await api.delete(`/users/${id}`);
      setMsg('Account deleted');
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not delete');
    }
  }

  async function changePassword(id) {
    if (!newPwd || newPwd.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setError('');
    try {
      await api.put(`/users/${id}/password`, { password: newPwd });
      setMsg('Password updated');
      setPwdId(null);
      setNewPwd('');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not update password');
    }
  }

  return (
    <>
      <div className="toolbar">
        <h2>{staffMode ? 'Staff accounts' : 'Members'}</h2>
        <button className="btn" onClick={openAdd}>
          <UserPlus size={18} /> {staffMode ? 'Add staff' : 'Add member'}
        </button>
      </div>

      {error && <div className="error">{error}</div>}
      {msg && <div className="success">{msg}</div>}

      {form && (
        <form className="card" onSubmit={save}>
          <div className="card-head">
            <h2>{editingId ? 'Edit account' : 'New account'}</h2>
          </div>
          <div className="form-grid">
            <label>Full name<input value={form.name} onChange={set('name')} required /></label>
            <label>
              <span style={{ display: 'flex', gap: 6, alignItems: 'center' }}><Mail size={14} /> Email</span>
              <input type="email" value={form.email} onChange={set('email')} required />
            </label>
            <label>
              <span style={{ display: 'flex', gap: 6, alignItems: 'center' }}><Phone size={14} /> Phone</span>
              <input value={form.phone} onChange={set('phone')} />
            </label>
            {!editingId && (
              <label>
                <span style={{ display: 'flex', gap: 6, alignItems: 'center' }}><KeyRound size={14} /> Password</span>
                <input type="password" value={form.password} onChange={set('password')} required minLength={6} />
              </label>
            )}
            {!editingId && staffMode && (
              <label>Role
                <select value={form.role} onChange={set('role')}>
                  <option value="staff">Staff</option>
                  <option value="admin">Admin</option>
                </select>
              </label>
            )}
          </div>
          <div className="actions" style={{ marginTop: 16 }}>
            <button className="btn" type="submit">Save</button>
            <button className="btn light" type="button" onClick={closeForm}>Cancel</button>
          </div>
        </form>
      )}

      <section className="card" style={{ overflowX: 'auto' }}>
        <table className="tbl">
          <thead>
            <tr>
              <th>Name</th><th>Email</th><th>Phone</th>
              {staffMode && <th>Role</th>}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((u) => (
              <>
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.phone || '-'}</td>
                  {staffMode && <td style={{ textTransform: 'capitalize' }}>{u.role}</td>}
                  <td>
                    <div className="actions">
                      <button className="btn light small" onClick={() => openEdit(u)}>
                        <Pencil size={14} /> Edit
                      </button>
                      <button
                        className="btn warn small"
                        onClick={() => { setPwdId(pwdId === u.id ? null : u.id); setNewPwd(''); setError(''); }}
                      >
                        <KeyRound size={14} /> Password
                      </button>
                      {user.role === 'admin' && u.id !== user.id && (
                        <button className="btn danger small" onClick={() => remove(u.id)}>
                          <Trash2 size={14} /> Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
                {pwdId === u.id && (
                  <tr key={`pwd-${u.id}`}>
                    <td colSpan={staffMode ? 5 : 4}>
                      <div style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '8px 0' }}>
                        <input
                          type="password"
                          placeholder="New password (min 6 chars)"
                          value={newPwd}
                          onChange={(e) => setNewPwd(e.target.value)}
                          style={{ width: 260 }}
                        />
                        <button className="btn small" type="button" onClick={() => changePassword(u.id)}>
                          <KeyRound size={14} /> Set password
                        </button>
                        <button className="btn light small" type="button" onClick={() => setPwdId(null)}>
                          Cancel
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && <p className="muted">Nothing here yet.</p>}
      </section>
    </>
  );
}