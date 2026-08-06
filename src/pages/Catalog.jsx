import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAcademy } from '../context/DataContext.jsx';
import useLoading from '../hooks/useLoading.js';
import './Catalog.css';

const stars = { Beginner: '★', Intermediate: '★★', Advanced: '★★★' };

export default function Catalog() {
  const { data } = useAcademy();
  const loading = useLoading([], 380);
  const [params] = useSearchParams();
  const [q, setQ] = useState(params.get('q') || '');
  const [category, setCategory] = useState('All');
  const [level, setLevel] = useState('All');
  const [format, setFormat] = useState('All');

  const categories = useMemo(() => ['All', ...new Set(data.courses.map((c) => c.category))], [data.courses]);
  const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];
  const formats = useMemo(() => ['All', ...new Set(data.courses.map((c) => c.format))], [data.courses]);

  const filtered = data.courses.filter((c) => {
    if (category !== 'All' && c.category !== category) return false;
    if (level !== 'All' && c.level !== level) return false;
    if (format !== 'All' && c.format !== format) return false;
    if (q && !`${c.title} ${c.category}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="container">
      <div className="page-head">
        <span className="eyebrow">Course Catalog</span>
        <h1>All courses in one place</h1>
        <p className="lede">Filter by category, level, or format. Every card links to the full course page.</p>
      </div>

      <div className="section">
        <div className="filter-bar">
          <input
            type="text"
            placeholder="Search courses…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="filter-search"
          />
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {categories.map((c) => <option key={c} value={c}>{c === 'All' ? 'Category ▾' : c}</option>)}
          </select>
          <select value={level} onChange={(e) => setLevel(e.target.value)}>
            {levels.map((l) => <option key={l} value={l}>{l === 'All' ? 'Level ▾' : l}</option>)}
          </select>
          <select value={format} onChange={(e) => setFormat(e.target.value)}>
            {formats.map((f) => <option key={f} value={f}>{f === 'All' ? 'Format ▾' : f}</option>)}
          </select>
        </div>

        {loading ? (
          <div className="grid grid-3">
            {[0, 1, 2, 3, 4, 5].map((i) => <div key={i} className="skeleton skeleton-card" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <h3>No courses match those filters</h3>
            <p>Try clearing a filter or search term.</p>
          </div>
        ) : (
          <div className="grid grid-3 stagger">
            {filtered.map((c) => (
              <Link to={`/catalog/${c.id}`} key={c.id} className="course-card card card-hover">
                <div className="course-card-thumb" aria-hidden="true">{c.title.slice(0, 2).toUpperCase()}</div>
                <h3>{c.title}</h3>
                <p className="course-card-meta">
                  <span>{stars[c.level] || '★'} {c.level}</span> · <span>{c.duration}</span>
                </p>
                <span className="badge neutral">{c.category}</span>
              </Link>
            ))}
          </div>
        )}

        <div className="request-course">
          <p>Don't see the course you need?</p>
          <a href="#request" className="request-link">Request a course →</a>
        </div>
      </div>
    </div>
  );
}
