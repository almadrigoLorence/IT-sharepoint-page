import { useMemo, useState } from 'react';
import { useAcademy } from '../context/DataContext.jsx';
import useLoading from '../hooks/useLoading.js';
import './Resources.css';

const typeIcon = {
  Guide: '📘',
  Video: '🎬',
  Template: '🧾',
  'SOP / Guide': '📋',
};

export default function Resources() {
  const { data } = useAcademy();
  const loading = useLoading([]);
  const [q, setQ] = useState('');
  const [types, setTypes] = useState([]);
  const [course, setCourse] = useState('All');

  const courseOptions = useMemo(() => ['All', ...new Set(data.resources.map((r) => r.course))], [data.resources]);
  const allTypes = useMemo(() => [...new Set(data.resources.map((r) => r.type))], [data.resources]);

  function toggleType(t) {
    setTypes((cur) => (cur.includes(t) ? cur.filter((x) => x !== t) : [...cur, t]));
  }

  const filtered = data.resources.filter((r) => {
    if (types.length && !types.includes(r.type)) return false;
    if (course !== 'All' && r.course !== course) return false;
    if (q && !r.name.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="container">
      <div className="page-head">
        <span className="eyebrow">Resource Library</span>
        <h1>One library, many views</h1>
        <p className="lede">All training materials in one tagged library. Course pages reuse this library with a filter.</p>
      </div>

      <div className="section resources-layout">
        <aside className="resource-filters card">
          <input
            type="text"
            placeholder="Search this library…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="filter-search"
          />
          <div className="filter-group">
            <h4>Type</h4>
            {allTypes.map((t) => (
              <label key={t} className="checkbox-row">
                <input type="checkbox" checked={types.includes(t)} onChange={() => toggleType(t)} />
                {t}
              </label>
            ))}
          </div>
          <div className="filter-group">
            <h4>Course</h4>
            <select value={course} onChange={(e) => setCourse(e.target.value)}>
              {courseOptions.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </aside>

        <div>
          {loading ? (
            <div className="stack">
              {[0, 1, 2, 3].map((i) => <div key={i} className="skeleton" style={{ height: 56 }} />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <h3>No materials match</h3>
              <p>Try a different filter.</p>
            </div>
          ) : (
            <ul className="resource-list stagger">
              {filtered.map((r) => (
                <li key={r.id} className="resource-item card card-hover">
                  <span className="resource-icon" aria-hidden="true">{typeIcon[r.type] || '📄'}</span>
                  <div className="resource-info">
                    {r.dataUrl ? (
                      <a href={r.dataUrl} download={r.name}>{r.name}</a>
                    ) : (
                      <strong>{r.name}</strong>
                    )}
                    <p>{r.type} · {r.course}</p>
                  </div>
                  <span className="resource-owner">{r.owner}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
