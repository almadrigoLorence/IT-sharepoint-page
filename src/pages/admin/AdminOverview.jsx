import { Link } from 'react-router-dom';
import { useAcademy } from '../../context/DataContext.jsx';
import { useState } from 'react';
import Button from '../../components/Button.jsx';
import './AdminLayout.css';
import './admin-shared.css';

export default function AdminOverview() {
  const { data, resetToDefaults, apiUrl, updateApiUrl, isDbConnected } = useAcademy();
  const [confirming, setConfirming] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [customApiInput, setCustomApiInput] = useState(apiUrl);
  const [savedNotice, setSavedNotice] = useState(false);

  function handleSaveApiUrl(e) {
    e.preventDefault();
    updateApiUrl(customApiInput);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  }

  const stats = [
    { label: 'Courses', count: data.courses.length, to: '/admin/courses' },
    { label: 'Learning paths', count: data.paths.length, to: '/admin/paths' },
    { label: 'Library items', count: data.resources.length, to: '/admin/resources' },
    { label: 'Events', count: data.events.length, to: '/admin/events' },
    { label: 'News posts', count: data.news.length, to: '/admin/site' },
    { label: 'Learner records', count: data.progress.completions.length, to: '/admin/progress' },
  ];

  function handleReset() {
    setResetting(true);
    setTimeout(() => {
      resetToDefaults();
      setResetting(false);
      setConfirming(false);
    }, 500);
  }

  return (
    <div>
      <div className="admin-page-head">
        <div>
          <span className="eyebrow">Admin tool</span>
          <h1>Welcome back</h1>
          <p>Every page on the site reads from this content. Edit anything here and it updates live for learners.</p>
        </div>
      </div>

      {/* Database Connection & API Server Endpoint Panel */}
      <form className="admin-panel mb-6" onSubmit={handleSaveApiUrl} style={{ background: '#f8fafc', border: '2px solid #3b82f6' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <h2 style={{ margin: 0, color: '#0f172a' }}>🌐 Database &amp; API Server Endpoint Settings</h2>
          <span
            style={{
              padding: '6px 14px',
              borderRadius: '9999px',
              fontSize: '12px',
              fontWeight: 700,
              background: isDbConnected ? '#dcfce7' : '#fef3c7',
              color: isDbConnected ? '#15803d' : '#b45309',
              border: `1px solid ${isDbConnected ? '#bbf7d0' : '#fde68a'}`,
            }}
          >
            {isDbConnected ? '⚡ MySQL Database Connected' : '⚠️ Browser Storage (GitHub Pages)'}
          </span>
        </div>

        <p style={{ fontSize: '0.88rem', color: '#475569', marginBottom: '1.25rem', lineHeight: 1.6 }}>
          To connect <strong>GitHub Pages (HTTPS)</strong> to your local XAMPP MySQL database:<br />
          1. Run <code>npx localtunnel --port 5000</code> in your VS Code terminal.<br />
          2. Copy the generated <code>https://...loca.lt</code> URL, append <code>/api</code> (e.g. <code>https://xxxxx.loca.lt/api</code>), and paste it below:
        </p>

        <div className="field" style={{ margin: 0 }}>
          <label style={{ fontWeight: 700, fontSize: '0.85rem', color: '#1e293b' }}>API Endpoint Server URL</label>
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.35rem' }}>
            <input
              type="text"
              value={customApiInput}
              onChange={(e) => setCustomApiInput(e.target.value)}
              placeholder="http://localhost:5000/api or https://xxxx.loca.lt/api"
              style={{ flex: 1, padding: '0.65rem 0.9rem', borderRadius: '10px', border: '1px solid #cbd5e1' }}
            />
            <Button type="submit" variant="primary">
              {savedNotice ? 'Connected ✓' : 'Connect API URL'}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setCustomApiInput('http://localhost:5000/api');
                updateApiUrl('http://localhost:5000/api');
              }}
            >
              Reset Default
            </Button>
          </div>
        </div>
      </form>

      <div className="grid grid-3" style={{ marginBottom: 32 }}>
        {stats.map((s) => (
          <Link to={s.to} key={s.label} className="card card-hover" style={{ display: 'block' }}>
            <strong style={{ fontSize: 28, fontFamily: 'var(--font-display)' }}>{s.count}</strong>
            <p style={{ color: 'var(--text-secondary)', fontSize: 13.5, marginTop: 4 }}>{s.label}</p>
          </Link>
        ))}
      </div>

      <div className="admin-panel">
        <h2>Capabilities</h2>
        <ul style={{ margin: 0, paddingLeft: 20, color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.9 }}>
          <li>Edit the home page hero, quick links, and news feed</li>
          <li>Create, edit, and delete courses — objectives, modules, materials, attachments</li>
          <li>Create, edit, and delete learning paths and their course sequence</li>
          <li>Manage the resource library, including file attachments</li>
          <li>Manage events, sessions, and seat counts</li>
          <li>Review learner completions and progress records</li>
        </ul>
      </div>

      <div className="admin-panel">
        <h2>Reset content</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: 13.5, marginBottom: 12 }}>
          Restore every page to the guide's original defaults. This cannot be undone.
        </p>
        {!confirming ? (
          <Button variant="danger" size="sm" onClick={() => setConfirming(true)}>Reset to defaults</Button>
        ) : (
          <div className="admin-confirm-bar">
            <span>Reset all content back to defaults? This replaces every edit you've made.</span>
            <div style={{ display: 'flex', gap: 8 }}>
              <Button variant="danger" size="sm" loading={resetting} onClick={handleReset}>Confirm reset</Button>
              <Button variant="ghost" size="sm" onClick={() => setConfirming(false)}>Cancel</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
