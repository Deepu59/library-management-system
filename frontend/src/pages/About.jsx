import { BookOpen, Users, Shield, Heart, Search, Clock, ArrowLeftRight, BookMarked } from 'lucide-react';
import { Link } from 'react-router-dom';
import PublicNav from '../components/PublicNav';

const features = [
  {
    icon: <Search size={24} />,
    title: 'Find books quickly',
    description: 'Browse the catalogue and search for books by title, author or ISBN.',
  },
  {
    icon: <BookMarked size={24} />,
    title: 'Keep borrowing organized',
    description: 'Members can review their borrowed books and keep track of due dates.',
  },
  {
    icon: <ArrowLeftRight size={24} />,
    title: 'Manage lending',
    description: 'Staff can issue books, record returns and keep availability up to date.',
  },
  {
    icon: <Clock size={24} />,
    title: 'Stay ahead of due dates',
    description: 'Staff can review books due today and overdue loans from the alerts area.',
  },
  {
    icon: <Users size={24} />,
    title: 'Support every role',
    description: 'Separate tools help members, staff and administrators focus on their tasks.',
  },
  {
    icon: <Shield size={24} />,
    title: 'Protect accounts',
    description: 'Passwords are hashed, and authenticated access is controlled by user role.',
  },
];

export default function About() {
  return (
    <>
      <PublicNav />
      <main className="about-page">
        <section className="about-hero">
          <div className="about-hero-icon"><BookOpen size={30} /></div>
          <span className="about-eyebrow">ABOUT PUSTAK</span>
          <h1>A simpler way to manage your library</h1>
          <p>
            Pustak — “book” in Nepali — brings the everyday work of a library into one
            straightforward place: discovering books, managing members and keeping borrowing
            records organized.
          </p>
          <div className="about-actions">
            <Link className="btn" to="/register">Join the library</Link>
            <Link className="btn dark" to="/contact">Get in touch</Link>
          </div>
        </section>

        <section className="about-intro">
          <div>
            <span className="about-eyebrow">OUR PURPOSE</span>
            <h2>More time for reading, less time on paperwork</h2>
          </div>
          <p>
            Pustak is a college library management system created as a fourth-semester B.Tech IT
            project. It helps bring book and member records together, makes lending activity
            easier to follow, and gives each user a clear view of the tools they need.
          </p>
        </section>

        <section className="about-features">
          <div className="about-section-heading">
            <span className="about-eyebrow">WHAT YOU CAN DO</span>
            <h2>Everyday library tasks, in one system</h2>
            <p>Tools designed around the way members and library teams use the collection.</p>
          </div>
          <div className="feature-grid">
            {features.map((feature) => (
              <article className="feature-card" key={feature.title}>
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="about-roles">
          <div className="about-section-heading">
            <span className="about-eyebrow">BUILT FOR YOUR ROLE</span>
            <h2>One library, clear responsibilities</h2>
          </div>
          <div className="about-role-grid">
            <article>
              <div className="feature-icon"><BookMarked size={24} /></div>
              <h3>Members</h3>
              <p>Explore the catalogue and see your borrowed books and due dates.</p>
            </article>
            <article>
              <div className="feature-icon"><Users size={24} /></div>
              <h3>Staff</h3>
              <p>Maintain member records, manage book loans and follow due-date alerts.</p>
            </article>
            <article>
              <div className="feature-icon"><Shield size={24} /></div>
              <h3>Administrators</h3>
              <p>Access staff account management alongside the library’s operational tools.</p>
            </article>
          </div>
        </section>

        <section className="about-stack">
          <Heart size={22} />
          <p>
            Built in Nepal with React, Node.js, Express and PostgreSQL, Pustak is a learning
            project focused on practical library workflows and a welcoming experience for readers.
          </p>
        </section>
      </main>
      <footer className="pub-footer">© 2026 Pustak Library System · Built with Node.js, React and PostgreSQL</footer>
    </>
  );
}
