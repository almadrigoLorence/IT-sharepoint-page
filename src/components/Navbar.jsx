import { NavLink, Link } from 'react-router-dom';
import { useAcademy } from '../context/DataContext.jsx';
import './Navbar.css';

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/catalog', label: 'Catalog' },
  { to: '/paths', label: 'Paths' },
  { to: '/resources', label: 'Resources' },
  { to: '/events', label: 'Events' },
  { to: '/progress', label: 'My Progress' },
];

export default function Navbar() {
  const { data, isAdmin } = useAcademy();
  const logoUrl = data?.site?.logoUrl;
  const deptTag = data?.site?.deptTag || 'IT DEPARTMENT';

  return (
    <header className="sharepoint-navbar">
      {/* Top Header Bar */}
      <div className="container navbar-top-bar">
        <Link to="/" className="navbar-brand-group">
          {logoUrl ? (
            <img src={logoUrl} alt="Department Logo" className="navbar-logo-img" />
          ) : (
            <div className="navbar-logo-icon">
              <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                <path d="M12 3L1 9L12 15L21 10.09V17H23V9M5 13.18V17.18L12 21L19 17.18V13.18L12 17L5 13.18Z" />
              </svg>
            </div>
          )}
          <span className="navbar-brand-title">{data?.theme?.headerTitle || data?.site?.name || 'SharePoint Academy'}</span>
          <span className="navbar-dept-tag">{deptTag}</span>
        </Link>

        <div className="navbar-actions-right">
          <Link to="/paths" className="navbar-cert-link">
            <span className="cert-icon">🎓</span> IT Certification Program
          </Link>
          <Link to={isAdmin ? '/admin' : '/admin/login'} className="btn-student-portal">
            {isAdmin ? 'Admin Portal' : 'Student Portal'}
          </Link>
        </div>
      </div>

      {/* Sub Navigation Links Bar */}
      <div className="navbar-sub-bar">
        <div className="container navbar-sub-inner">
          <nav className="navbar-links">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
