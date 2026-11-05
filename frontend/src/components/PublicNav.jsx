import { Link, useNavigate } from 'react-router-dom';

export default function PublicNav() {
  const navigate = useNavigate();
  return (
    <nav className="pub-nav">
      <div className="brand">Pustak<span>.</span></div>
      <div className="pub-nav-links">
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
        <button className="signin" onClick={() => navigate('/login')}>Sign in</button>
        <button className="signup" onClick={() => navigate('/register')}>Sign up</button>
      </div>
    </nav>
  );
}