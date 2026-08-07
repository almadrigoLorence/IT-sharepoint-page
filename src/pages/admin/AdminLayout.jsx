import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom';
import { useAcademy } from '../../context/DataContext.jsx';
import './AdminLayout.css';

const sections = [
  { to: '/admin', label: 'Overview', end: true, icon: '◧' },
  { to: '/admin/theme', label: 'Theme & Styling', icon: '🎨' },
  { to: '/admin/layout', label: 'Page Layout', icon: '⇇' },
  { to: '/admin/team', label: 'Team Members', icon: '👥' },
  { to: '/admin/site', label: 'Site & Home', icon: '⌂' },
  { to: '/admin/courses', label: 'Courses', icon: '▤' },
  { to: '/admin/paths', label: 'Learning Paths', icon: '⇥' },
  { to: '/admin/resources', label: 'Resource Library', icon: '📎' },
  { to: '/admin/events', label: 'Events & Calendar', icon: '▦' },
  { to: '/admin/progress', label: 'Learner Progress', icon: '✓' },
];

export default function AdminLayout() {
  const { logout, saving, isDbConnected } = useAcademy();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-head">
          <span className="eyebrow">Admin tool</span>
          <h2>Content control</h2>
        </div>
        <nav className="admin-nav">
          {sections.map((s) => (
            <NavLink
              key={s.to}
              to={s.to}
              end={s.end}
              className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}
            >
              <span className="admin-nav-icon" aria-hidden="true">{s.icon}</span>
              {s.label}
            </NavLink>
          ))}
        </nav>
        <div className="admin-sidebar-foot">
          <div
            className={`db-status-badge ${isDbConnected ? 'connected' : 'offline'}`}
            title={
              isDbConnected
                ? 'Connected to XAMPP MySQL via Express API server'
                : 'Using browser storage — start the Express server and XAMPP to sync with MySQL'
            }
            style={{
              padding: '6px 10px',
              borderRadius: '8px',
              fontSize: '11px',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: isDbConnected ? '#dcfce7' : '#fef3c7',
              color: isDbConnected ? '#15803d' : '#b45309',
              border: `1px solid ${isDbConnected ? '#bbf7d0' : '#fde68a'}`,
            }}
          >
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: isDbConnected ? '#22c55e' : '#f59e0b' }} />
            {isDbConnected ? 'MySQL Connected' : 'Browser Storage'}
          </div>

          <span className={`saving-dot ${saving ? 'is-saving' : ''}`}>
            <span className="dot" />
            {saving ? 'Saving…' : 'All changes saved'}
          </span>
          <Link to="/" className="admin-view-site">View site ↗</Link>
          <button className="admin-logout" onClick={handleLogout}>Log out</button>
        </div>
      </aside>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}
