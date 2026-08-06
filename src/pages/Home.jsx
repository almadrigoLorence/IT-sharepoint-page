import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAcademy } from '../context/DataContext.jsx';
import useLoading from '../hooks/useLoading.js';
import Button from '../components/Button.jsx';
import './Home.css';

export default function Home() {
  const { data } = useAcademy();
  const loading = useLoading([], 380);
  const [query, setQuery] = useState('');

  const featured = data.courses.find((c) => c.featured) || data.courses[0];
  const upcoming = [...data.events]
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 3);

  function handleSearch(e) {
    e.preventDefault();
    window.location.assign(`/#/catalog${query ? `?q=${encodeURIComponent(query)}` : ''}`);
  }

  return (
    <div>
      <section className="hero">
        <div className="hero-grid" aria-hidden="true" />
        <div className="container hero-inner">
          <span className="eyebrow">ASEPH Learning Academy</span>
          <h1 className="hero-title">{data.site.tagline}</h1>
          <p className="hero-subtitle">{data.site.heroSubtitle}</p>
          <form className="hero-search" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search courses, paths, or resources…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search the academy"
            />
            <Button type="submit" variant="primary">Search</Button>
          </form>
        </div>
      </section>

      <section className="section container">
        <div className="grid grid-4 stagger">
          {data.quickLinks.map((q) => (
            <Link to={q.to} key={q.id} className="quick-link card card-hover">
              <span className="quick-link-label">{q.label}</span>
              <span className="quick-link-desc">{q.description}</span>
              <span className="quick-link-arrow" aria-hidden="true">→</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="section container home-columns">
        <div>
          <div className="section-head">
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
            <ul className="news-list stagger">
              {data.news.map((n) => (
                <li key={n.id} className="news-item">
                  <span className="badge amber">{n.tag}</span>
                  <div>
                    <h3>{n.title}</h3>
                    <p>{n.body}</p>
                    <time>{n.date}</time>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <div className="section-head">
            <h2>Upcoming events</h2>
            <Link to="/events" className="section-link">See all →</Link>
          </div>
          {loading ? (
            <div className="stack">
              {[0, 1, 2].map((i) => (
                <div key={i} className="skeleton" style={{ height: 58, marginBottom: 10 }} />
              ))}
            </div>
          ) : (
            <ul className="event-list stagger">
              {upcoming.map((e) => (
                <li key={e.id} className="event-item card">
                  <div className="event-date">
                    <span>{new Date(e.date).toLocaleDateString('en-US', { month: 'short' })}</span>
                    <strong>{new Date(e.date).getDate()}</strong>
                  </div>
                  <div>
                    <h4>{e.title}</h4>
                    <p>{e.time} · {e.venue}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {featured && (
        <section className="section container">
          <div className="featured-course card">
            <div>
              <span className="badge">Featured course of the month</span>
              <h2>{featured.title}</h2>
              <p>{featured.audience}</p>
              <div className="featured-meta">
                <span>{featured.level}</span>
                <span>·</span>
                <span>{featured.duration}</span>
                <span>·</span>
                <span>{featured.format}</span>
              </div>
            </div>
            <Button as={Link} to={`/catalog/${featured.id}`} variant="primary" size="lg">
              View course
            </Button>
          </div>
        </section>
      )}
    </div>
  );
}
