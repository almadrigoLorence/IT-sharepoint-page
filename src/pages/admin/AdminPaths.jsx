import { useState } from 'react';
import { useAcademy } from '../../context/DataContext.jsx';
import Button from '../../components/Button.jsx';
import './AdminLayout.css';
import './admin-shared.css';

const blank = { title: '', sequence: [''], effort: '', recommendedStart: '' };

export default function AdminPaths() {
  const { data, addItem, updateItem, removeItem } = useAcademy();
  const [openId, setOpenId] = useState(null);
  const [creating, setCreating] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  return (
    <div>
      <div className="admin-page-head">
        <div>
          <span className="eyebrow">Learning Paths</span>
          <h1>Manage learning paths</h1>
          <p>Role-based journeys — a numbered course sequence with a time budget.</p>
        </div>
        <Button variant="primary" onClick={() => { setCreating((c) => !c); setOpenId(null); }}>
          {creating ? 'Close' : '+ New path'}
        </Button>
      </div>

      {creating && (
        <div className="admin-panel">
          <h2>New path</h2>
          <PathForm initial={blank} onCancel={() => setCreating(false)} onSubmit={(f) => { addItem('paths', f, 'path'); setCreating(false); }} />
        </div>
      )}

      <div className="admin-entity-list">
        {data.paths.map((p) => (
          <div key={p.id} className={`admin-entity-row ${openId === p.id ? 'is-editing' : ''}`}>
            <div className="admin-entity-summary" onClick={() => setOpenId(openId === p.id ? null : p.id)}>
              <div className="admin-entity-summary-main">
                <h3>{p.title}</h3>
                <p>{p.sequence.join(' → ')} · {p.effort}</p>
              </div>
              <div className="admin-entity-actions" onClick={(e) => e.stopPropagation()}>
                <button className="admin-icon-btn" onClick={() => setOpenId(openId === p.id ? null : p.id)}>✎</button>
                <button className="admin-icon-btn danger" onClick={() => setConfirmDelete(p.id)}>🗑</button>
              </div>
            </div>
            {confirmDelete === p.id && (
              <div className="admin-entity-form">
                <div className="admin-confirm-bar">
                  <span>Delete "{p.title}"?</span>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <Button size="sm" variant="danger" onClick={() => { removeItem('paths', p.id); setConfirmDelete(null); }}>Delete</Button>
                    <Button size="sm" variant="ghost" onClick={() => setConfirmDelete(null)}>Cancel</Button>
                  </div>
                </div>
              </div>
            )}
            {openId === p.id && confirmDelete !== p.id && (
              <div className="admin-entity-form">
                <PathForm initial={p} onCancel={() => setOpenId(null)} onSubmit={(f) => { updateItem('paths', p.id, f); setOpenId(null); }} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function PathForm({ initial, onSubmit, onCancel }) {
  const [form, setForm] = useState(initial);

  function setSeqItem(i, value) {
    setForm((f) => ({ ...f, sequence: f.sequence.map((v, idx) => (idx === i ? value : v)) }));
  }
  function addSeq() { setForm((f) => ({ ...f, sequence: [...f.sequence, ''] })); }
  function removeSeq(i) { setForm((f) => ({ ...f, sequence: f.sequence.filter((_, idx) => idx !== i) })); }

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(form); }}>
      <div className="inline-fields">
        <div className="field" style={{ margin: 0 }}>
          <label>Path title</label>
          <input type="text" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        </div>
        <div className="field" style={{ margin: 0 }}>
          <label>Effort</label>
          <input type="text" placeholder="e.g. 5 courses · ~6 weeks" value={form.effort} onChange={(e) => setForm({ ...form, effort: e.target.value })} />
        </div>
      </div>
      <div className="field">
        <label>Course sequence</label>
        <div className="admin-array-field">
          {form.sequence.map((s, i) => (
            <div className="admin-array-row" key={i}>
              <input type="text" value={s} onChange={(e) => setSeqItem(i, e.target.value)} />
              <button type="button" className="admin-remove-row-btn" onClick={() => removeSeq(i)}>×</button>
            </div>
          ))}
          <button type="button" className="admin-add-row-btn" onClick={addSeq}>+ Add step</button>
        </div>
      </div>
      <div className="field">
        <label>Recommended starting course</label>
        <input type="text" value={form.recommendedStart} onChange={(e) => setForm({ ...form, recommendedStart: e.target.value })} />
      </div>
      <div className="admin-form-actions">
        <Button type="submit" variant="primary">Save path</Button>
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  );
}
