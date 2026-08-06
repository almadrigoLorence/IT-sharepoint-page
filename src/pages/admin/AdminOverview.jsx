import { Link } from 'react-router-dom';
import { useAcademy } from '../../context/DataContext.jsx';
import { useState } from 'react';
import Button from '../../components/Button.jsx';
import './AdminLayout.css';
import './admin-shared.css';

export default function AdminOverview() {
  const { data, resetToDefaults } = useAcademy();
  const [confirming, setConfirming] = useState(false);
  const [resetting, setResetting] = useState(false);

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
