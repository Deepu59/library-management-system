import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, BookOpen, Users, ArrowLeftRight, UserCog, LogOut, BookMarked, Bell } from 'lucide-react';
import { useAuth } from '../AuthContext';

const MENU = [
  { to: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} />, roles: ['staff', 'admin'] },
  { to: '/books', label: 'Books', icon: <BookOpen size={18} />, roles: ['member', 'staff', 'admin'] },
  { to: '/my-books', label: 'My books', icon: <BookMarked size={18} />, roles: ['member'] },
  { to: '/members', label: 'Members', icon: <Users size={18} />, roles: ['staff', 'admin'] },
  { to: '/issue', label: 'Issue / Return', icon: <ArrowLeftRight size={18} />, roles: ['staff', 'admin'] },
  { to: '/alerts', label: 'Due alerts', icon: <Bell size={18} />, roles: ['staff', 'admin'] },
  { to: '/staff', label: 'Staff accounts', icon: <UserCog size={18} />, roles: ['admin'] },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand-wrap">
          <div className="brand">Pustak<span>.</span></div>
          <div className="brand-sub">LIBRARY SYSTEM</div>
        </div>
        {MENU.filter((m) => m.roles.includes(user.role)).map((m) => (
          <NavLink key={m.to} to={m.to} className="nav-link">
            {m.icon}<span>{m.label}</span>
          </NavLink>
        ))}
        <div style={{ flex: 1 }} />
        <button
          className="nav-link"
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#D5DCE8', textAlign: 'left', width: '100%' }}
          onClick={handleLogout}
        >
          <LogOut size={18} /><span>Log out</span>
        </button>
      </aside>
      <main className="content">
        <div className="topbar">
          <h1>
            {user.role === 'admin'
              ? 'Administrator Panel'
              : user.role === 'staff'
                ? 'Staff Workspace'
                : 'Library Management System'}
          </h1>
          <div className="user-box">
            <div style={{ textAlign: 'right' }}>
              <b style={{ display: 'block', fontSize: 14 }}>{user.name}</b>
              <span className={`role-badge role-${user.role}`}>{user.role}</span>
            </div>
            <div className="avatar">{user.name[0]}</div>
          </div>
        </div>
        <Outlet />
      </main>
    </div>
  );
}