import { useNavigate } from 'react-router-dom';
import { BookOpen, Users, ArrowRight, Search, Shield, Clock } from 'lucide-react';
import PublicNav from '../components/PublicNav';

const features = [
  { icon: <BookOpen size={24} />, title: 'Book catalogue', desc: 'Browse thousands of books with live availability, search by title, author or ISBN.' },
  { icon: <Users size={24} />, title: 'Member management', desc: 'Staff can register members, manage accounts and track borrowing history.' },
  { icon: <Search size={24} />, title: 'Smart search', desc: 'Find any book instantly. Filter by availability and see how many copies are left.' },
  { icon: <Clock size={24} />, title: 'Due-date tracking', desc: 'Automatic overdue detection and 1-day-left alerts so no book is forgotten.' },
  { icon: <Shield size={24} />, title: 'Role-based access', desc: 'Three roles — member, staff and admin — each with the right level of access.' },
  { icon: <ArrowRight size={24} />, title: 'Issue & return', desc: 'Staff issue and return books in seconds. Available copies update in real time.' },
];

export default function Home() {
  const navigate = useNavigate();
  return (
    <>
      <PublicNav />
      <section className="hero">
        <div className="hero-content">
          <h1>Your library,<br />everywhere you go.</h1>
          <p>Pustak Library makes it easy to discover books, borrow them, and return them on time — all from one simple dashboard.</p>
          <div className="hero-btns">
            <button className="btn" onClick={() => navigate('/login')}>
              Sign in <ArrowRight size={18} />
            </button>
            <button className="btn dark" onClick={() => navigate('/about')}>
              Learn more
            </button>
          </div>
        </div>
        <img className="hero-image" src="/library-dashboard.png" alt="Pustak library dashboard shown on a laptop and phone" />
      </section>
      <section className="pub-section">
        <h2>Everything your library needs</h2>
        <p>Pustak is a full library management system built for colleges and schools. It handles books, members, issuing, returning and overdue tracking.</p>
        <div className="feature-grid">
          {features.map((f) => (
            <div className="feature-card" key={f.title}>
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
      <footer className="pub-footer">© 2026 Pustak Library System · Built with Node.js, React and PostgreSQL</footer>
    </>
  );
}