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

  const upcomingEvents = [...(data.events || [])]
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 3);

  const featuredCourses = [...(data.courses || [])].filter((c) => c.featured).slice(0, 3);

  // Layout order array
  const layoutOrder = data?.theme?.layout || ['hero', 'quickLinks', 'news', 'team', 'courses', 'resources', 'events'];

  // Hero background media
  const bgMediaType = data?.theme?.bgMediaType || 'gradient';
  const bgMediaUrl = data?.theme?.bgMediaUrl || '';

  const sectionMap = {
    hero: (
      <section key="hero" className="hero-section">
        {/* Background media layer */}
        {bgMediaType === 'video' && bgMediaUrl && (
          <video className="hero-bg-video" autoPlay loop muted playsInline>
            <source src={bgMediaUrl} />
          </video>
        )}
        {bgMediaType === 'image' && bgMediaUrl && (
          <div className="hero-bg-image" style={{ backgroundImage: `url(${bgMediaUrl})` }} />
        )}
        {bgMediaType === 'gradient' && <div className="hero-bg-gradient" />}

        <div className="hero-overlay" />

        <div className="container hero-content">
          <span className="hero-eyebrow animate-fade-in">{data?.site?.deptTag || 'IT DEPARTMENT'}</span>
          <h1 className="hero-title animate-fade-in">{data?.theme?.headerTitle || data?.site?.name || 'SharePoint Academy'}</h1>
          <p className="hero-subtitle animate-fade-in">
            {data?.site?.heroSubtitle || data?.site?.tagline || 'Enterprise governance, cloud infrastructure, reliability, and modern IT skills.'}
          </p>
          <div className="hero-actions animate-fade-in">
            <Link to="/catalog"><Button variant="primary" size="lg">Browse Courses</Button></Link>
            <Link to="/paths"><Button variant="secondary" size="lg">View Paths</Button></Link>
          </div>

          {/* Floating metric cards */}
          <div className="hero-metrics-strip">
            <div className="metric-pill animate-card-float" style={{ animationDelay: '0s' }}>
              <span className="metric-value">{data.courses?.length || 6}</span>
              <span className="metric-label">Courses</span>
            </div>
            <div className="metric-pill animate-card-float" style={{ animationDelay: '0.15s' }}>
              <span className="metric-value">{data.paths?.length || 4}</span>
              <span className="metric-label">Paths</span>
            </div>
            <div className="metric-pill animate-card-float" style={{ animationDelay: '0.3s' }}>
              <span className="metric-value">{data.team?.members?.length || 4}</span>
              <span className="metric-label">Experts</span>
            </div>
            <div className="metric-pill animate-card-float" style={{ animationDelay: '0.45s' }}>
              <span className="metric-value">{data.events?.length || 4}</span>
              <span className="metric-label">Events</span>
            </div>
          </div>
        </div>
      </section>
    ),

    carousel: (
      <div key="carousel" className="home-carousel-wrapper">
        <Carousel slides={data?.theme?.carousel} />
      </div>
    ),

    quickLinks: (
      <section key="quickLinks" className="section container">
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

  // Render custom containers from database
  const customContainers = data.customContainers || [];

  return (
    <div className="home-page">
      {layoutOrder.map((sectionId) => sectionMap[sectionId] || null)}

      {/* Custom containers from admin */}
      {customContainers.length > 0 && (
        <section className="section container">
          {customContainers.map((container) => (
            <div key={container.id} className="custom-container-block">
              <div className="section-head-bar">
                <div>
                  <h2>{container.title}</h2>
                  {container.subtitle && <p className="subtitle">{container.subtitle}</p>}
                </div>
              </div>
              {container.type === 'metrics' && (
                <div className="custom-metrics-row">
                  {(typeof container.content_json === 'string'
                    ? JSON.parse(container.content_json)
                    : container.content_json || []
                  ).map((item, idx) => (
                    <div key={idx} className="custom-metric-card animate-card-float" style={{ animationDelay: `${idx * 0.1}s` }}>
                      <span className="custom-metric-value">{item.value}</span>
                      <span className="custom-metric-label">{item.label}</span>
                    </div>
                  ))}
                </div>
              )}
              {container.type === 'info_card' && (
                <div className="custom-info-card">
                  {(typeof container.content_json === 'string'
                    ? JSON.parse(container.content_json)
                    : container.content_json || []
                  ).map((item, idx) => (
                    <div key={idx} className="info-card-item">
                      <h4>{item.title || item.label}</h4>
                      <p>{item.body || item.value}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
