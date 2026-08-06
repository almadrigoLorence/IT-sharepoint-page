import { useState } from 'react';
import { useAcademy } from '../context/DataContext.jsx';
import useLoading from '../hooks/useLoading.js';
import Button from '../components/Button.jsx';
import './Progress.css';

const statusStyle = {
  Completed: 'amber',
  'In progress': 'neutral',
};

export default function ProgressPage() {
  const { data } = useAcademy();
  const loading = useLoading([]);
  const [downloadingId, setDownloadingId] = useState(null);

  const { completions, pathProgress } = data.progress;
  const completedCount = completions.filter((c) => c.status === 'Completed').length;
  const inProgressCount = completions.filter((c) => c.status === 'In progress').length;

  function handleCertificate(id) {
    setDownloadingId(id);
    setTimeout(() => setDownloadingId(null), 900);
  }

  return (
    <div className="container">
      <div className="page-head">
        <span className="eyebrow">My Progress</span>
        <h1>My learning record</h1>
        <p className="lede">Your completions, quiz scores, and certificates — visible only to you.</p>
      </div>

      <div className="section">
        {loading ? (
          <div className="skeleton" style={{ height: 90, marginBottom: 24 }} />
        ) : (
          <div className="stats-row fade-up">
            <div className="stat-pill"><strong>{completedCount}</strong><span>completed</span></div>
            <div className="stat-pill"><strong>{inProgressCount}</strong><span>in progress</span></div>
            <div className="stat-pill path-pill">
              <span>Path: {pathProgress.path}</span>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${pathProgress.percent}%` }} />
              </div>
              <strong>{pathProgress.percent}%</strong>
            </div>
          </div>
        )}

        {loading ? (
          <div className="stack" style={{ marginTop: 24 }}>
            {[0, 1, 2].map((i) => <div key={i} className="skeleton" style={{ height: 60 }} />)}
          </div>
        ) : (
          <ul className="completion-list stagger">
            {completions.map((c) => (
              <li key={c.id} className="completion-item card">
                <div>
                  <h3>{c.course}</h3>
                  <p>
                    <span className={`badge ${statusStyle[c.status] || 'neutral'}`}>{c.status}</span>
                    {c.score != null && <span className="score"> Quiz {c.score}%</span>}
                    {c.date && <span className="date"> · {c.date}</span>}
                  </p>
                </div>
                {c.status === 'Completed' && (
                  <Button
                    variant="secondary"
                    size="sm"
                    loading={downloadingId === c.id}
                    onClick={() => handleCertificate(c.id)}
                  >
                    Download certificate
                  </Button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
