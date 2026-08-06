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

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-brand">
          <span className="navbar-mark" aria-hidden="true">◆</span>
          {data.site.name}
        </Link>
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
        <Link to={isAdmin ? '/admin' : '/admin/login'} className="navbar-admin">
          {isAdmin ? 'Admin panel' : 'Admin'}
        </Link>
      </div>
    </header>
  );
}
