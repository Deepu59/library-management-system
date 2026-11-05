import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Phone } from 'lucide-react';
import api from '../api';
import PublicNav from '../components/PublicNav';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/auth/register', form);
      navigate('/login', { state: { registered: true } });
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create account');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <PublicNav />
      <div className="login-page">
        <div className="login-hero">
          <h1>Join Pustak Library</h1>
          <p>Create a free account to browse books and track your borrowing history.</p>
        </div>
        <div className="login-panel">
          <form className="login-form" onSubmit={submit}>
            <h1>Create account</h1>
            <span className="sub">Already have one? <Link to="/login" style={{ color: '#14213D', fontWeight: 600 }}>Sign in</Link></span>
            {error && <div className="error">{error}</div>}
            <label>Full name
              <div className="input-wrap">
                <User size={18} />
                <input value={form.name} onChange={set('name')} required placeholder="Enter your full name" />
              </div>
            </label>
            <label>Email
              <div className="input-wrap">
                <Mail size={18} />
                <input type="email" value={form.email} onChange={set('email')} required placeholder="Enter your email" />
              </div>
            </label>
            <label>Phone (optional)
              <div className="input-wrap">
                <Phone size={18} />
                <input value={form.phone} onChange={set('phone')} placeholder="Enter your phone number" />
              </div>
            </label>
            <label>Password
              <div className="input-wrap">
                <Lock size={18} />
                <input type="password" value={form.password} onChange={set('password')} required minLength={6} placeholder="Create a password" />
              </div>
            </label>
            <button className="btn" type="submit" disabled={loading}>
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}