import { useEffect, useState } from 'react';
import { Bell, BellOff, CheckCircle } from 'lucide-react';
import api from '../api';
import Cover from '../components/Cover';

export default function Alerts() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');

  async function load() {
    try {
      const { data } = await api.get('/issues/due-soon');
      setItems(data);
    } catch {
      setError('Could not load alerts');
    }
  }

  useEffect(() => { load(); }, []);

  async function notify(id) {
    try {
      await api.put(`/issues/${id}/notify`);
      setMsg('Marked as notified');
      load();
    } catch {
      setError('Could not update');
    }
  }

  return (
    <>
      <div className="card-head">
        <h2 style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <Bell size={20} /> Due tomorrow — alert members
        </h2>
      </div>
      {error && <div className="error">{error}</div>}
      {msg && <div className="success"><CheckCircle size={16} /> {msg}</div>}
      {items.length === 0
        ? <div className="card"><p className="muted">No books are due tomorrow.</p></div>
        : (
          <section className="card" style={{ overflowX: 'auto' }}>
            <table className="tbl">
              <thead>
                <tr><th>Book</th><th>Member</th><th>Due date</th><th>Status</th><th></th></tr>
              </thead>
              <tbody>
                {items.map((i) => (
                  <tr key={i.id} className={i.notified ? 'notified-row' : 'alert-row'}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Cover title={i.title} url={i.cover_url} />
                        {i.title}
                      </div>
                    </td>
                    <td>{i.member_name}</td>
                    <td>{i.due_date}</td>
                    <td>
                      {i.notified
                        ? <span className="badge returned"><CheckCircle size={12} /> Notified</span>
                        : <span className="badge due"><Bell size={12} /> Pending</span>}
                    </td>
                    <td>
                      {!i.notified && (
                        <button className="btn warn small" onClick={() => notify(i.id)}>
                          <BellOff size={14} /> Mark notified
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}
    </>
  );
}