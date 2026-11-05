import { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import PublicNav from '../components/PublicNav';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);
  const set = (key) => (event) => setForm({ ...form, [key]: event.target.value });

  function submit(event) {
    event.preventDefault();
    setSent(true);
    setForm({ name: '', email: '', message: '' });
  }

  return (
    <>
      <PublicNav />
      <section className="pub-section">
        <div className="contact-layout">
          <div className="contact-info">
            <h2>Contact us</h2>
            <p>Have a question or need help? Send us a message and we will get back to you.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                <div className="feature-icon"><Mail size={22} /></div>
                <div><b>Email</b><div className="muted">admin@pustak.com</div></div>
              </div>
              <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                <div className="feature-icon"><Phone size={22} /></div>
                <div><b>Phone</b><div className="muted">+977 980-0000000</div></div>
              </div>
              <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                <div className="feature-icon"><MapPin size={22} /></div>
                <div><b>Location</b><div className="muted">3J38+W6P, Lumbini Province, Nepalgunj Sub metropolitician 10, Nepalgunj</div></div>
              </div>
            </div>
            <div className="contact-map">
              <iframe
                title="Map to Pustak Library in Nepalgunj"
                src="https://maps.google.com/maps?q=3J38%2BW6P%2C%20Nepalgunj%2C%20Nepal&output=embed"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <a href="https://www.google.com/maps/search/?api=1&query=3J38%2BW6P%2C%20Nepalgunj%2C%20Nepal" target="_blank" rel="noreferrer">
                Open in Google Maps
              </a>
            </div>
          </div>
          <form className="contact-form" onSubmit={submit}>
            {sent && <div className="success"><Send size={16} /> Message sent! We will reply soon.</div>}
            <label>Your name<input value={form.name} onChange={set('name')} required placeholder="Rojy Chaudhary" /></label>
            <label>Email<input type="email" value={form.email} onChange={set('email')} required placeholder="you@example.com" /></label>
            <label>Message<textarea value={form.message} onChange={set('message')} required placeholder="Write your message here..." /></label>
            <button className="btn" type="submit"><Send size={16} /> Send message</button>
          </form>
        </div>
      </section>
      <footer className="pub-footer">© 2026 Pustak Library System · Built with Node.js, React and PostgreSQL</footer>
    </>
  );
}
