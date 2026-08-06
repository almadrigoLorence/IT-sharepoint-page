import { useState } from 'react';
import { useAcademy } from '../../context/DataContext.jsx';
import Button from '../../components/Button.jsx';
import FileUpload from '../../components/FileUpload.jsx';
import './AdminLayout.css';
import './admin-shared.css';

const blankCourse = {
  title: '',
  category: '',
  level: 'Beginner',
  format: 'Classroom',
  duration: '',
  owner: '',
  featured: false,
  audience: '',
  trainer: '',
  prerequisites: '',
  nextSession: '',
  objectives: [''],
  modules: ['Intro', 'Theory', 'Hands-on', 'Assessment'],
  materials: [],
};

export default function AdminCourses() {
  const { data, addItem, updateItem, removeItem } = useAcademy();
  const [openId, setOpenId] = useState(null);
  const [creating, setCreating] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  return (
    <div>
      <div className="admin-page-head">
        <div>
          <span className="eyebrow">Courses</span>
          <h1>Manage courses</h1>
          <p>One template, every course. Edit objectives, modules, and attach materials.</p>
        </div>
        <Button variant="primary" onClick={() => { setCreating((c) => !c); setOpenId(null); }}>
          {creating ? 'Close' : '+ New course'}
        </Button>
      </div>

      {creating && (
        <div className="admin-panel">
          <h2>New course</h2>
          <CourseForm
            initial={blankCourse}
            onCancel={() => setCreating(false)}
            onSubmit={(form) => { addItem('courses', form, 'course'); setCreating(false); }}
          />
        </div>
      )}

      <div className="admin-entity-list">
        {data.courses.map((c) => (
          <div key={c.id} className={`admin-entity-row ${openId === c.id ? 'is-editing' : ''}`}>
            <div className="admin-entity-summary" onClick={() => setOpenId(openId === c.id ? null : c.id)}>
              <div className="admin-entity-summary-main">
                <h3>{c.title} {c.featured && <span className="badge amber">Featured</span>}</h3>
                <p>{c.category} · {c.level} · {c.duration} · {c.materials.length} material(s)</p>
              </div>
              <div className="admin-entity-actions" onClick={(e) => e.stopPropagation()}>
                <button className="admin-icon-btn" onClick={() => setOpenId(openId === c.id ? null : c.id)} aria-label="Edit">✎</button>
                <button className="admin-icon-btn danger" onClick={() => setConfirmDelete(c.id)} aria-label="Delete">🗑</button>
              </div>
            </div>
            {confirmDelete === c.id && (
              <div className="admin-entity-form">
                <div className="admin-confirm-bar">
                  <span>Delete "{c.title}"? This cannot be undone.</span>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <Button size="sm" variant="danger" onClick={() => { removeItem('courses', c.id); setConfirmDelete(null); }}>Delete</Button>
                    <Button size="sm" variant="ghost" onClick={() => setConfirmDelete(null)}>Cancel</Button>
                  </div>
                </div>
              </div>
            )}
            {openId === c.id && confirmDelete !== c.id && (
              <div className="admin-entity-form">
                <CourseForm
                  initial={c}
                  onCancel={() => setOpenId(null)}
                  onSubmit={(form) => { updateItem('courses', c.id, form); setOpenId(null); }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function CourseForm({ initial, onSubmit, onCancel }) {
  const [form, setForm] = useState(initial);

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function setArrayItem(field, i, value) {
    setForm((f) => ({ ...f, [field]: f[field].map((v, idx) => (idx === i ? value : v)) }));
  }

  function addArrayItem(field, value = '') {
    setForm((f) => ({ ...f, [field]: [...f[field], value] }));
  }

  function removeArrayItem(field, i) {
    setForm((f) => ({ ...f, [field]: f[field].filter((_, idx) => idx !== i) }));
  }

  function attachMaterial(file) {
    setForm((f) => ({
      ...f,
      materials: [...f.materials, { id: `mat-${Date.now()}`, name: file.name, type: 'Guide', dataUrl: file.dataUrl }],
    }));
  }

  function removeMaterial(id) {
    setForm((f) => ({ ...f, materials: f.materials.filter((m) => m.id !== id) }));
  }

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(form); }}>
      <div className="inline-fields">
        <div className="field" style={{ margin: 0 }}>
          <label>Title</label>
          <input type="text" required value={form.title} onChange={(e) => set('title', e.target.value)} />
        </div>
        <div className="field" style={{ margin: 0 }}>
          <label>Category</label>
          <input type="text" required value={form.category} onChange={(e) => set('category', e.target.value)} />
        </div>
        <div className="field" style={{ margin: 0 }}>
          <label>Level</label>
          <select value={form.level} onChange={(e) => set('level', e.target.value)}>
            <option>Beginner</option><option>Intermediate</option><option>Advanced</option>
          </select>
        </div>
      </div>
      <div className="inline-fields" style={{ marginTop: 16 }}>
        <div className="field" style={{ margin: 0 }}>
          <label>Format</label>
          <select value={form.format} onChange={(e) => set('format', e.target.value)}>
            <option>Classroom</option><option>E-learning</option><option>Hybrid</option>
          </select>
        </div>
        <div className="field" style={{ margin: 0 }}>
          <label>Duration</label>
          <input type="text" placeholder="e.g. 2h" value={form.duration} onChange={(e) => set('duration', e.target.value)} />
        </div>
        <div className="field" style={{ margin: 0 }}>
          <label>Owner</label>
          <input type="text" value={form.owner} onChange={(e) => set('owner', e.target.value)} />
        </div>
      </div>

      <label className="checkbox-row" style={{ margin: '16px 0' }}>
        <input type="checkbox" checked={form.featured} onChange={(e) => set('featured', e.target.checked)} />
        Feature on home page
      </label>

      <div className="field">
        <label>Audience</label>
        <input type="text" value={form.audience} onChange={(e) => set('audience', e.target.value)} />
      </div>

      <div className="inline-fields">
        <div className="field" style={{ margin: 0 }}>
          <label>Trainer</label>
          <input type="text" value={form.trainer} onChange={(e) => set('trainer', e.target.value)} />
        </div>
        <div className="field" style={{ margin: 0 }}>
          <label>Prerequisites</label>
          <input type="text" value={form.prerequisites} onChange={(e) => set('prerequisites', e.target.value)} />
        </div>
        <div className="field" style={{ margin: 0 }}>
          <label>Next session</label>
          <input type="text" value={form.nextSession} onChange={(e) => set('nextSession', e.target.value)} />
        </div>
      </div>

      <div className="field">
        <label>Learning objectives</label>
        <div className="admin-array-field">
          {form.objectives.map((o, i) => (
            <div className="admin-array-row" key={i}>
              <input type="text" value={o} onChange={(e) => setArrayItem('objectives', i, e.target.value)} />
              <button type="button" className="admin-remove-row-btn" onClick={() => removeArrayItem('objectives', i)}>×</button>
            </div>
          ))}
          <button type="button" className="admin-add-row-btn" onClick={() => addArrayItem('objectives')}>+ Add objective</button>
        </div>
      </div>

      <div className="field">
        <label>Modules / outline</label>
        <div className="admin-array-field">
          {form.modules.map((m, i) => (
            <div className="admin-array-row" key={i}>
              <input type="text" value={m} onChange={(e) => setArrayItem('modules', i, e.target.value)} />
              <button type="button" className="admin-remove-row-btn" onClick={() => removeArrayItem('modules', i)}>×</button>
            </div>
          ))}
          <button type="button" className="admin-add-row-btn" onClick={() => addArrayItem('modules')}>+ Add module</button>
        </div>
      </div>

      <div className="field">
        <label>Materials</label>
        <div className="admin-array-field">
          {form.materials.map((m) => (
            <FileUpload key={m.id} existing={m} onRemove={() => removeMaterial(m.id)} />
          ))}
          <FileUpload onAttached={attachMaterial} label="Attach a material" />
        </div>
      </div>

      <div className="admin-form-actions">
        <Button type="submit" variant="primary">Save course</Button>
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  );
}
