import { useState } from 'react';
import { useAcademy } from '../../context/DataContext.jsx';
import Button from '../../components/Button.jsx';
import './AdminLayout.css';
import './admin-shared.css';

const blank = { course: '', status: 'In progress', score: '', date: '' };

export default function AdminProgress() {
  const { data, updateProgress } = useAcademy();
  const [openId, setOpenId] = useState(null);
  const [creating, setCreating] = useState(false);
  const [pathTitle, setPathTitle] = useState(data.progress.pathProgress.path);
  const [pathPercent, setPathPercent] = useState(data.progress.pathProgress.percent);

  const completions = data.progress.completions;

  function saveList(list) {
    updateProgress({ completions: list });
  }

  function savePath(e) {
    e.preventDefault();
    updateProgress({ pathProgress: { path: pathTitle, percent: Number(pathPercent) || 0 } });
  }

  return (
    <div>
      <div className="admin-page-head">
        <div>
          <span className="eyebrow">Learner Progress</span>
          <h1>Progress &amp; completions</h1>
          <p>The record shown on the My Progress page — completions, scores, and current path.</p>
        </div>
        <Button variant="primary" onClick={() => { setCreating((c) => !c); setOpenId(null); }}>
          {creating ? 'Close' : '+ New record'}
        </Button>
      </div>

      <form className="admin-panel" onSubmit={savePath}>
        <h2>Active path</h2>
        <div className="inline-fields">
          <div className="field" style={{ margin: 0 }}>
            <label>Path name</label>
            <input type="text" value={pathTitle} onChange={(e) => setPathTitle(e.target.value)} />
          </div>
          <div className="field" style={{ margin: 0 }}>
            <label>Percent complete</label>
            <input type="number" min="0" max="100" value={pathPercent} onChange={(e) => setPathPercent(e.target.value)} />
          </div>
        </div>
        <Button type="submit" variant="secondary" size="sm">Save path progress</Button>
      </form>

      {creating && (
        <div className="admin-panel">
          <h2>New completion record</h2>
          <RecordForm
            initial={blank}
            onCancel={() => setCreating(false)}
            onSubmit={(f) => { saveList([...completions, { id: `c-${Date.now()}`, ...f, score: f.score === '' ? null : Number(f.score) }]); setCreating(false); }}
          />
        </div>
      )}

      <div className="admin-entity-list">
        {completions.map((c) => (
          <div key={c.id} className={`admin-entity-row ${openId === c.id ? 'is-editing' : ''}`}>
            <div className="admin-entity-summary" onClick={() => setOpenId(openId === c.id ? null : c.id)}>
              <div className="admin-entity-summary-main">
                <h3>{c.course}</h3>
                <p>{c.status} {c.score != null ? `· Quiz ${c.score}%` : ''} {c.date ? `· ${c.date}` : ''}</p>
              </div>
              <div className="admin-entity-actions" onClick={(e) => e.stopPropagation()}>
                <button className="admin-icon-btn" onClick={() => setOpenId(openId === c.id ? null : c.id)}>✎</button>
                <button className="admin-icon-btn danger" onClick={() => saveList(completions.filter((x) => x.id !== c.id))}>🗑</button>
              </div>
            </div>
            {openId === c.id && (
              <div className="admin-entity-form">
                <RecordForm
                  initial={{ ...c, score: c.score ?? '' }}
                  onCancel={() => setOpenId(null)}
                  onSubmit={(f) => { saveList(completions.map((x) => (x.id === c.id ? { ...x, ...f, score: f.score === '' ? null : Number(f.score) } : x))); setOpenId(null); }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function RecordForm({ initial, onSubmit, onCancel }) {
  const [form, setForm] = useState(initial);
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(form); }}>
      <div className="inline-fields">
        <div className="field" style={{ margin: 0 }}>
          <label>Course</label>
          <input type="text" required value={form.course} onChange={(e) => setForm({ ...form, course: e.target.value })} />
        </div>
        <div className="field" style={{ margin: 0 }}>
          <label>Status</label>
          <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
            <option>Completed</option><option>In progress</option>
          </select>
        </div>
        <div className="field" style={{ margin: 0 }}>
          <label>Quiz score</label>
          <input type="number" min="0" max="100" value={form.score} onChange={(e) => setForm({ ...form, score: e.target.value })} />
        </div>
        <div className="field" style={{ margin: 0 }}>
          <label>Date</label>
          <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
        </div>
      </div>
      <div className="admin-form-actions">
        <Button type="submit" variant="primary">Save record</Button>
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  );
}
