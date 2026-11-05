import { useEffect, useState } from 'react';
import { BookMarked, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import api from '../api';
import Cover from '../components/Cover';

export default function MyBooks() {
  const [issues, setIssues] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/issues/mine')
      .then(({ data }) => setIssues(data))
      .catch(() => setError('Could not load your books'));
  }, []);

  const active = issues.filter((i) => !i.return_date);
  const returned = issues.filter((i) => i.return_date);

  function StatusIcon({ status }) {
    if (status === 'Returned') return <CheckCircle size={14} />;
    if (status === 'Overdue') return <AlertCircle size={14} />;
    return <Clock size={14} />;
  }

  return (
    <>
      <div className="card-head">
        <h2 style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <BookMarked size={20} /> My books
        </h2>
      </div>

      <section className="card">
        <h2 style={{ marginBottom: 12, fontSize: 16 }}>Currently borrowed ({active.length})</h2>
        {error && <div className="error">{error}</div>}
        {active.length === 0
          ? <p className="muted">You have no books checked out right now.</p>
          : active.map((i) => (
            <div className="item" key={i.id}>
              <Cover title={i.title} url={i.cover_url} />
              <div className="grow">
                <b>{i.title}</b>
                <span className="muted">Due: {i.due_date}</span>
              </div>
              <span className={`badge ${i.status.toLowerCase()}`}>
                <StatusIcon status={i.status} /> {i.status}
              </span>
            </div>
          ))}
      </section>

      <section className="card">
        <h2 style={{ marginBottom: 12, fontSize: 16 }}>Return history ({returned.length})</h2>
        {returned.length === 0
          ? <p className="muted">No books returned yet.</p>
          : (
            <table className="tbl">
              <thead>
                <tr><th>Book</th><th>Issued</th><th>Due</th><th>Returned</th></tr>
              </thead>
              <tbody>
                {returned.map((i) => (
                  <tr key={i.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Cover title={i.title} url={i.cover_url} />
                        {i.title}
                      </div>
                    </td>
                    <td>{i.issue_date}</td>
                    <td>{i.due_date}</td>
                    <td>{i.return_date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
      </section>
    </>
  );
}