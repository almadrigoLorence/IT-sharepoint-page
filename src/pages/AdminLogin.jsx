import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAcademy } from '../context/DataContext.jsx';
import Button from '../components/Button.jsx';
import './AdminLogin.css';

export default function AdminLogin() {
  const { login, isAdmin } = useAcademy();
  const navigate = useNavigate();
  const location = useLocation();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (isAdmin) {
    navigate('/admin', { replace: true });
  }

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setTimeout(() => {
      const ok = login(password);
      setLoading(false);
      if (ok) {
        const dest = location.state?.from || '/admin';
        navigate(dest, { replace: true });
      } else {
        setError('That password is not correct.');
      }
    }, 500);
  }

  return (
    <div className="admin-login-wrap">
      <form className="admin-login-card card fade-up" onSubmit={handleSubmit}>
        <span className="eyebrow">Admin access</span>
        <h1>Sign in to the admin tool</h1>
        <p className="admin-login-note">
          Manage every page — courses, paths, resources, events, news, and site content.
        </p>
        <div className="field">
          <label htmlFor="admin-password">Password</label>
          <input
            id="admin-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter admin password"
            autoFocus
          />
        </div>
        {error && <p className="admin-login-error">{error}</p>}
        <Button type="submit" variant="primary" size="lg" loading={loading} style={{ width: '100%' }}>
          Sign in
        </Button>
        <p className="admin-login-hint">Demo credential: <code>academy-admin</code></p>
      </form>
    </div>
  );
}
