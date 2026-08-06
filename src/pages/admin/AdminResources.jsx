import { useState } from 'react';
import { useAcademy } from '../../context/DataContext.jsx';
import Button from '../../components/Button.jsx';
import FileUpload from '../../components/FileUpload.jsx';
import './AdminLayout.css';
import './admin-shared.css';

const blank = { name: '', type: 'Guide', course: '', owner: '', reviewDate: '', dataUrl: null };

export default function AdminResources() {
  const { data, addItem, updateItem, removeItem } = useAcademy();
  const [openId, setOpenId] = useState(null);
  const [creating, setCreating] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  return (
    <div>
      <div className="admin-page-head">
        <div>
          <span className="eyebrow">Resource Library</span>
          <h1>Manage the resource library</h1>
          <p>Upload materials once — course pages filter this same library by course.</p>
        </div>
        <Button variant="primary" onClick={() => { setCreating((c) => !c); setOpenId(null); }}>
          {creating ? 'Close' : '+ New item'}
        </Button>
      </div>

      {creating && (
        <div className="admin-panel">
          <h2>New library item</h2>
          <ResourceForm initial={blank} onCancel={() => setCreating(false)} onSubmit={(f) => { addItem('resources', f, 'res'); setCreating(false); }} />
        </div>
      )}

      <div className="admin-entity-list">
        {data.resources.map((r) => (
          <div key={r.id} className={`admin-entity-row ${openId === r.id ? 'is-editing' : ''}`}>
            <div className="admin-entity-summary" onClick={() => setOpenId(openId === r.id ? null : r.id)}>
              <div className="admin-entity-summary-main">
                <h3>{r.name} {r.dataUrl && <span className="badge neutral">File attached</span>}</h3>
                <p>{r.type} · {r.course} · owner {r.owner}</p>
              </div>
              <div className="admin-entity-actions" onClick={(e) => e.stopPropagation()}>
                <button className="admin-icon-btn" onClick={() => setOpenId(openId === r.id ? null : r.id)}>✎</button>
                <button className="admin-icon-btn danger" onClick={() => setConfirmDelete(r.id)}>🗑</button>
              </div>
            </div>
            {confirmDelete === r.id && (
              <div className="admin-entity-form">
                <div className="admin-confirm-bar">
                  <span>Delete "{r.name}"?</span>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <Button size="sm" variant="danger" onClick={() => { removeItem('resources', r.id); setConfirmDelete(null); }}>Delete</Button>
                    <Button size="sm" variant="ghost" onClick={() => setConfirmDelete(null)}>Cancel</Button>
                  </div>
                </div>
              </div>
            )}
            {openId === r.id && confirmDelete !== r.id && (
              <div className="admin-entity-form">
                <ResourceForm initial={r} onCancel={() => setOpenId(null)} onSubmit={(f) => { updateItem('resources', r.id, f); setOpenId(null); }} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function ResourceForm({ initial, onSubmit, onCancel }) {
  const [form, setForm] = useState(initial);

  function attach(file) {
    setForm((f) => ({ ...f, name: f.name || file.name, dataUrl: file.dataUrl }));
  }

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(form); }}>
      <div className="inline-fields">
        <div className="field" style={{ margin: 0 }}>
          <label>Name</label>
          <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div className="field" style={{ margin: 0 }}>
          <label>Type</label>
          <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
            <option>Guide</option><option>Video</option><option>Template</option><option>SOP / Guide</option>
          </select>
        </div>
      </div>
      <div className="inline-fields">
        <div className="field" style={{ margin: 0 }}>
          <label>Course</label>
          <input type="text" value={form.course} onChange={(e) => setForm({ ...form, course: e.target.value })} />
        </div>
        <div className="field" style={{ margin: 0 }}>
          <label>Owner</label>
          <input type="text" value={form.owner} onChange={(e) => setForm({ ...form, owner: e.target.value })} />
        </div>
        <div className="field" style={{ margin: 0 }}>
          <label>Review date</label>
          <input type="date" value={form.reviewDate} onChange={(e) => setForm({ ...form, reviewDate: e.target.value })} />
        </div>
      </div>
      <div className="field">
        <label>File</label>
        {form.dataUrl ? (
          <FileUpload existing={{ name: form.name, dataUrl: form.dataUrl }} onRemove={() => setForm({ ...form, dataUrl: null })} />
        ) : (
          <FileUpload onAttached={attach} label="Attach a file" />
        )}
      </div>
      <div className="admin-form-actions">
        <Button type="submit" variant="primary">Save item</Button>
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  );
}
