import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAcademy } from '../context/DataContext.jsx';
import useLoading from '../hooks/useLoading.js';
import Button from '../components/Button.jsx';
import Carousel from '../components/Carousel.jsx';
import TeamSection from '../components/TeamSection.jsx';
import './Home.css';

export default function Home() {
  const { data } = useAcademy();
  const loading = useLoading([], 300);
  const [query, setQuery] = useState('');

  const upcomingEvents = [...(data.events || [])]
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 3);

  const featuredCourses = [...(data.courses || [])].filter((c) => c.featured).slice(0, 3);

  function handleSearch(e) {
    e.preventDefault();
    window.location.assign(`/#/catalog${query ? `?q=${encodeURIComponent(query)}` : ''}`);
  }

  // Layout order array (e.g. ['carousel', 'quickLinks', 'news', 'team', 'courses', 'resources', 'events', 'progress'])
  const layoutOrder = data?.theme?.layout || ['carousel', 'quickLinks', 'news', 'team', 'courses', 'resources', 'events'];

  const sectionMap = {
    carousel: (
      <div key="carousel" className="home-carousel-wrapper">
        <Carousel slides={data?.theme?.carousel} />
      </div>
    ),

    quickLinks: (
      <section key="quickLinks" className="section container">
        <div className="search-bar-wrapper">
          <form className="search-bar-box" onSubmit={handleSearch}>
            <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search courses, tracks, or resources…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search courses"
            />
            <Button type="submit" variant="primary" className="btn-search-submit">
              Search
            </Button>
          </form>
        </div>

        <div className="quick-links-grid">
          {(data.quickLinks || []).map((q) => (
            <Link to={q.to} key={q.id} className="quick-link-card">
              <div className="quick-link-content">
                <span className="quick-link-label">{q.label}</span>
                <span className="quick-link-desc">{q.description}</span>
              </div>
              <span className="quick-link-arrow" aria-hidden="true">→</span>
            </Link>
          ))}
        </div>
      </section>
    ),

    news: (
      <section key="news" className="section container home-columns-section">
        <div className="news-column">
          <div className="section-head-bar">
            <h2>News &amp; announcements</h2>
            <span className="badge neutral">New courses · deadlines · spotlights</span>
          </div>
          {loading ? (
            <div className="stack">
              {[0, 1, 2].map((i) => (
                <div key={i} className="skeleton skeleton-line" style={{ width: `${90 - i * 10}%` }} />
              ))}
            </div>
          ) : (
            <ul className="news-list">
              {(data.news || []).map((n) => (
                <li key={n.id} className="news-card">
                  <span className={`news-tag-badge ${n.tag?.toLowerCase().includes('deadline') ? 'amber' : 'blue'}`}>
                    {n.tag}
                  </span>
                  <div className="news-card-body">
                    <h3>{n.title}</h3>
                    <p>{n.body}</p>
                    <time>{n.date}</time>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="events-column">
          <div className="section-head-bar">
            <h2>Upcoming events</h2>
            <Link to="/events" className="section-link">See all →</Link>
          </div>
          <div className="events-mini-list">
            {upcomingEvents.map((ev) => (
              <div key={ev.id} className="event-mini-card">
                <div className="event-date-pill">
                  <span className="ev-month">{new Date(ev.date).toLocaleString('en', { month: 'short' })}</span>
                  <span className="ev-day">{new Date(ev.date).getDate()}</span>
                </div>
                <div className="event-details">
                  <h4>{ev.title}</h4>
                  <p>{ev.time} · {ev.venue}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),

    team: (
      <div key="team">
        <TeamSection team={data.team} />
      </div>
    ),

    courses: (
      <section key="courses" className="section container">
        <div className="section-head-bar">
          <div>
            <h2>Featured Training Courses</h2>
            <p className="subtitle">Core courses recommended for IT, security, and reliability tracks.</p>
          </div>
          <Link to="/catalog" className="section-link">Full Catalog →</Link>
        </div>
        <div className="courses-featured-grid">
          {featuredCourses.map((c) => (
            <Link to={`/catalog/${c.id}`} key={c.id} className="featured-course-card">
              <div className="course-card-top">
                <span className="course-cat-badge">{c.category}</span>
                <span className="course-level">{c.level}</span>
              </div>
              <h3 className="course-card-title">{c.title}</h3>
              <p className="course-card-desc">{c.description || 'Comprehensive curriculum with hands-on lab exercises.'}</p>
              <div className="course-card-footer">
                <span>⏱ {c.duration}</span>
                <span className="link-arrow">View Details →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    ),

    resources: (
      <section key="resources" className="section container">
        <div className="section-head-bar">
          <div>
            <h2>Quick Technical Resources</h2>
            <p className="subtitle">Download SOPs, walk-through guides, and templates.</p>
          </div>
          <Link to="/resources" className="section-link">All Resources →</Link>
        </div>
        <div className="resources-mini-grid">
          {(data.resources || []).slice(0, 4).map((r) => (
            <div key={r.id} className="resource-mini-item">
              <div className="resource-icon-box">📄</div>
              <div>
                <span className="resource-name">{r.name}</span>
                <span className="resource-meta">{r.type} · {r.owner}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    ),

    events: null,
    progress: null,
  };

  return (
    <div className="home-page">
      {layoutOrder.map((sectionId) => sectionMap[sectionId] || null)}
    </div>
  );
}
