import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAcademy } from '../context/DataContext.jsx';
import useLoading from '../hooks/useLoading.js';
import Button from '../components/Button.jsx';
import Carousel from '../components/Carousel.jsx';
import './Home.css';

export default function Home() {
  const { data } = useAcademy();
  const loading = useLoading([], 380);
  const [query, setQuery] = useState('');

  const upcoming = [...(data.events || [])]
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 3);

  function handleSearch(e) {
    e.preventDefault();
    window.location.assign(`/#/catalog${query ? `?q=${encodeURIComponent(query)}` : ''}`);
  }

  return (
    <div className="home-page">
      {/* Featured Curriculum Carousel (Hero Section redesign matching Image 2) */}
      <div className="container">
        <Carousel courses={data.courses} />
      </div>

      {/* Quick Access Search Bar */}
      <section className="container search-section">
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
      </section>

      {/* 4 Quick Access Grid Cards */}
      <section className="section container">
        <div className="quick-links-grid">
          {data.quickLinks.map((q) => (
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

      {/* News & Upcoming Events Columns */}
      <section className="section container home-columns-section">
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
              {data.news.map((n) => (
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
          {loading ? (
            <div className="stack">
              {[0, 1, 2].map((i) => (
                <div key={i} className="skeleton" style={{ height: 58, marginBottom: 10 }} />
              ))}
            </div>
          ) : (
            <ul className="event-list">
              {upcoming.map((e) => (
                <li key={e.id} className="event-card">
                  <div className="event-date-badge">
                    <span className="event-month">{new Date(e.date).toLocaleDateString('en-US', { month: 'short' })}</span>
                    <strong className="event-day">{new Date(e.date).getDate()}</strong>
                  </div>
                  <div className="event-card-details">
                    <h4>{e.title}</h4>
                    <p>{e.time} · {e.venue}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}
