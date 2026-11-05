import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Mail, Lock, LogIn } from 'lucide-react';
import { useAuth } from '../auth';
import PublicNav from '../components/PublicNav';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const registered = location.state?.registered;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Cannot reach the server');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <PublicNav />
      <div className="login-page">
        <div className="login-hero">
          <h1>Welcome back to Pustak</h1>
          <p>Sign in to access your library dashboard, browse books and track your borrowing history.</p>
        </div>
        <div className="login-panel">
          <form className="login-form" onSubmit={handleSubmit}>
            <h1>Sign in</h1>
            <span className="sub">New here? <Link to="/register" style={{ color: '#14213D', fontWeight: 600 }}>Create an account</Link></span>
            {registered && <div className="success"><LogIn size={16} /> Account created! Sign in below.</div>}
            {error && <div className="error">{error}</div>}
            <label>Email
              <div className="input-wrap">
                <Mail size={18} />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Enter your email" autoComplete="email" />
              </div>
            </label>
            <label>Password
              <div className="input-wrap">
                <Lock size={18} />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Enter your password" autoComplete="current-password" />
              </div>
            </label>
            <button className="btn" type="submit" disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>
              {loading ? 'Signing in...' : <><LogIn size={18} /> Sign in</>}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}