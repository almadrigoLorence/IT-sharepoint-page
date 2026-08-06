import { useAcademy } from '../context/DataContext.jsx';
import useLoading from '../hooks/useLoading.js';
import './Paths.css';

export default function Paths() {
  const { data } = useAcademy();
  const loading = useLoading([]);

  return (
    <div className="container">
      <div className="page-head">
        <span className="eyebrow">Learning Paths</span>
        <h1>Choose your path</h1>
        <p className="lede">Role-based journeys — a sequence of courses with a stated time budget, not a pile of options.</p>
      </div>

      <div className="section">
        {loading ? (
          <div className="grid grid-2">
            {[0, 1, 2, 3].map((i) => <div key={i} className="skeleton skeleton-card" style={{ height: 220 }} />)}
          </div>
        ) : (
          <div className="grid grid-2 stagger">
            {data.paths.map((p) => (
              <div key={p.id} className="path-card card card-hover">
                <h3>{p.title}</h3>
                <ol className="path-steps">
                  {p.sequence.map((s, i) => (
                    <li key={i} className={s === p.recommendedStart ? 'is-start' : ''}>
                      <span className="path-step-num">{i + 1}</span>
                      {s}
                      {s === p.recommendedStart && <span className="badge amber">Start here</span>}
                    </li>
                  ))}
                </ol>
                <p className="path-effort">{p.effort}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
