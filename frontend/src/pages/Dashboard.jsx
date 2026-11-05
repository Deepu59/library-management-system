import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { BookOpen, Users, BookMarked, AlertCircle, UserCog, ShieldCheck } from 'lucide-react';
import api from '../api';
import { useAuth } from '../AuthContext';
import Cover from '../components/Cover';

function StatCard({ icon, label, num, tint }) {
  return (
    <div className={`stat ${tint}`}>
      <div className="stat-icon">{icon}</div>
      <div>
        <div className="label">{label}</div>
        <div className="num">{num ?? '-'}</div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [accountSummary, setAccountSummary] = useState(null);
  const [recent, setRecent] = useState([]);
  const [dueToday, setDueToday] = useState([]);
  const [overdue, setOverdue] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user.role === 'member') return;
    const requests = [
      api.get('/issues/stats'),
      api.get('/issues'),
      api.get('/issues/due-today'),
      api.get('/issues/overdue'),
    ];
    if (user.role === 'admin') requests.push(api.get('/users/summary'));
    Promise.all(requests)
      .then(([s, r, d, o, accounts]) => {
        setStats(s.data);
        setRecent(r.data.slice(0, 5));
        setDueToday(d.data.slice(0, 3));
        setOverdue(o.data.slice(0, 3));
        if (accounts) setAccountSummary(accounts.data);
      })
      .catch(() => setError('Could not load dashboard data'));
  }, [user.role]);

  if (user.role === 'member') return <Navigate to="/my-books" replace />;

  return (
    <>
      <div className="toolbar">
        <div>
          <h2>{user.role === 'admin' ? 'Administrator dashboard' : 'Staff dashboard'}</h2>
          <p className="muted">
            {user.role === 'admin'
              ? 'Oversee library operations and manage staff access.'
              : 'Manage daily book, member, and borrowing operations.'}
          </p>
        </div>
        {user.role === 'admin' && (
          <Link className="btn" to="/staff">
            <UserCog size={18} /> Manage staff
          </Link>
        )}
      </div>
      {error && <div className="error">{error}</div>}
      {user.role === 'admin' && (
        <section className="card">
          <div className="card-head"><h2>Account overview</h2></div>
          <div className="stats">
            <StatCard icon={<Users size={24} color="#1F6F6A" />} label="Members" num={accountSummary?.members} tint="tint-teal" />
            <StatCard icon={<UserCog size={24} color="#1F3358" />} label="Staff accounts" num={accountSummary?.staff} tint="tint-blue" />
            <StatCard icon={<ShieldCheck size={24} color="#9A6A00" />} label="Administrator accounts" num={accountSummary?.admins} tint="tint-gold" />
          </div>
        </section>
      )}
      <div className="stats">
        <StatCard icon={<BookOpen size={24} color="#1F3358" />} label="Total books" num={stats?.total_books} tint="tint-blue" />
        <StatCard icon={<Users size={24} color="#1F6F6A" />} label="Total members" num={stats?.total_members} tint="tint-teal" />
        <StatCard icon={<BookMarked size={24} color="#9A6A00" />} label="Books issued" num={stats?.books_issued} tint="tint-gold" />
        <StatCard icon={<AlertCircle size={24} color="#8F2F20" />} label="Overdue books" num={stats?.overdue_books} tint="tint-red" />
      </div>

      <section className="card" style={{ overflowX: 'auto' }}>
        <div className="card-head"><h2>Recent issued books</h2></div>
        <table className="tbl">
          <thead>
            <tr><th>Book</th><th>Member</th><th>Issue date</th><th>Due date</th><th>Status</th></tr>
          </thead>
          <tbody>
            {recent.map((r) => (
              <tr key={r.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Cover title={r.title} url={r.cover_url} />
                    {r.title}
                  </div>
                </td>
                <td>{r.member_name}</td>
                <td>{r.issue_date}</td>
                <td>{r.due_date}</td>
                <td><span className={`badge ${r.status.toLowerCase()}`}>{r.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
        {recent.length === 0 && <p className="muted">No books issued yet.</p>}
      </section>

      <div className="grid2">
        <section className="card">
          <div className="card-head"><h2>Due today</h2></div>
          {dueToday.map((i) => (
            <div className="item" key={i.id}>
              <Cover title={i.title} url={i.cover_url} />
              <div className="grow"><b>{i.title}</b><span className="muted">{i.member_name}</span></div>
              <span className="badge due">Due today</span>
            </div>
          ))}
          {dueToday.length === 0 && <p className="muted">Nothing due today.</p>}
        </section>
        <section className="card">
          <div className="card-head"><h2>Overdue books</h2></div>
          {overdue.map((i) => (
            <div className="item" key={i.id}>
              <Cover title={i.title} url={i.cover_url} />
              <div className="grow"><b>{i.title}</b><span className="muted">{i.member_name}</span></div>
              <span className="badge overdue">Overdue</span>
            </div>
          ))}
          {overdue.length === 0 && <p className="muted">No overdue books.</p>}
        </section>
      </div>
    </>
  );
}