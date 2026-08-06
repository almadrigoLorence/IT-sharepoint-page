import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Carousel.css';

export default function Carousel({ courses = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // If no courses passed, provide fallback featured tracks
  const defaultTracks = [
    {
      id: 'enterprise-governance',
      category: 'SECURITY',
      title: 'Enterprise Governance & Security',
      description: 'Manage group inheritances, secure documents from unauthorized sharing, and configure tenant data protection rules. Keep corporate libraries compliant.',
      duration: '3 hours',
      labsCount: 8,
      level: 'Advanced',
      to: '/catalog/enterprise-governance'
    },
    {
      id: 'power-bi-intro',
      category: 'DATA & ANALYTICS',
      title: 'Power BI Intro & Lab Dashboards',
      description: 'Connect Power BI to SharePoint lists, build interactive completion dashboards, and publish real-time analytics for team leads.',
      duration: '4 hours',
      labsCount: 6,
      level: 'Intermediate',
      to: '/catalog/power-bi-intro'
    },
    {
      id: 'tct-basics',
      category: 'RELIABILITY',
      title: 'TCT Basics & Testing Profiles',
      description: 'Master the fundamentals of Temperature Cycling Testing (TCT), profile analysis, and defect identification in reliability engineering.',
      duration: '2 hours',
      labsCount: 4,
      level: 'Beginner',
      to: '/catalog/tct-basics'
    }
  ];

  const tracks = courses.length > 0 ? courses.slice(0, 4).map(c => ({
    id: c.id,
    category: (c.category || 'FEATURED').toUpperCase(),
    title: c.title,
    description: c.description || c.audience || 'Hands-on interactive curriculum designed for IT professionals.',
    duration: c.duration || '3 hours',
    labsCount: c.labsCount || 6,
    level: c.level || 'Intermediate',
    to: `/catalog/${c.id}`
  })) : defaultTracks;

  const current = tracks[currentIndex] || tracks[0];

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? tracks.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === tracks.length - 1 ? 0 : prev + 1));
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: current.title,
        text: current.description,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <section className="featured-curriculum-section">
      <div className="curriculum-header">
        <span className="curriculum-eyebrow">FEATURED CURRICULUM</span>
        <h2 className="curriculum-title">Core Training Tracks</h2>
        <div className="curriculum-accent-line" aria-hidden="true" />
      </div>

      <div className="carousel-container">
        {/* Previous Arrow Button */}
        <button
          type="button"
          className="carousel-arrow carousel-arrow-left"
          onClick={prevSlide}
          aria-label="Previous track"
        >
          ‹
        </button>

        {/* Carousel Slide Content */}
        <div className="carousel-card">
          <div className="carousel-content-left">
            <span className="carousel-tag">{current.category}</span>
            <h3 className="carousel-course-title">{current.title}</h3>
            <p className="carousel-description">{current.description}</p>

            <div className="carousel-meta">
              <span className="meta-item">
                <svg className="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                {current.duration}
              </span>
              <span className="meta-item">
                <svg className="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                </svg>
                {current.labsCount} labs
              </span>
              <span className="meta-item">
                <svg className="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                {current.level}
              </span>
            </div>

            <div className="carousel-actions">
              <Link to={current.to} className="btn-start-course">
                Start Course ›
              </Link>
              <button
                type="button"
                className="btn-share"
                onClick={handleShare}
                aria-label="Share course"
                title="Share course"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                  <circle cx="18" cy="5" r="3" />
                  <circle cx="6" cy="12" r="3" />
                  <circle cx="18" cy="19" r="3" />
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                </svg>
              </button>
            </div>
          </div>

          <div className="carousel-content-right">
            <div className="mockup-card">
              <div className="mockup-header">
                <span className="mockup-avatar-dot" />
                <div className="mockup-header-text">
                  <div className="mockup-line mockup-line-short" />
                  <div className="mockup-line mockup-line-xs" />
                </div>
              </div>
              <div className="mockup-body">
                <div className="mockup-line mockup-line-full" />
                <div className="mockup-line mockup-line-full" />
                <div className="mockup-line mockup-line-med" />
              </div>
              <div className="mockup-bg-circle" />
            </div>
          </div>
        </div>

        {/* Next Arrow Button */}
        <button
          type="button"
          className="carousel-arrow carousel-arrow-right"
          onClick={nextSlide}
          aria-label="Next track"
        >
          ›
        </button>

        {/* Pagination Dots */}
        <div className="carousel-dots">
          {tracks.map((track, idx) => (
            <button
              key={track.id}
              type="button"
              className={`carousel-dot ${idx === currentIndex ? 'active' : ''}`}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
