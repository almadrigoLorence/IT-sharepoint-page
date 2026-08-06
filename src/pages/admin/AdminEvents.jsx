import { useState } from 'react';
import { useAcademy } from '../../context/DataContext.jsx';
import Button from '../../components/Button.jsx';
import './AdminLayout.css';
import './admin-shared.css';

const blank = { title: '', date: '', time: '', venue: '', seats: 20 };

export default function AdminEvents() {
  const { data, addItem, updateItem, removeItem } = useAcademy();
  const [openId, setOpenId] = useState(null);
  const [creating, setCreating] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const sorted = [...data.events].sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div>
      <div className="admin-page-head">
        <div>
          <span className="eyebrow">Events &amp; Calendar</span>
          <h1>Manage sessions</h1>
          <p>Every event feeds the home page, the calendar, and registration.</p>
        </div>
        <Button variant="primary" onClick={() => { setCreating((c) => !c); setOpenId(null); }}>
          {creating ? 'Close' : '+ New session'}
        </Button>
      </div>

      {creating && (
        <div className="admin-panel">
          <h2>New session</h2>
          <EventForm initial={blank} onCancel={() => setCreating(false)} onSubmit={(f) => { addItem('events', f, 'evt'); setCreating(false); }} />
        </div>
      )}

      <div className="admin-entity-list">
        {sorted.map((ev) => (
          <div key={ev.id} className={`admin-entity-row ${openId === ev.id ? 'is-editing' : ''}`}>
            <div className="admin-entity-summary" onClick={() => setOpenId(openId === ev.id ? null : ev.id)}>
              <div className="admin-entity-summary-main">
                <h3>{ev.title}</h3>
                <p>{ev.date} · {ev.time} · {ev.venue} · {ev.seats} seats</p>
              </div>
              <div className="admin-entity-actions" onClick={(e) => e.stopPropagation()}>
                <button className="admin-icon-btn" onClick={() => setOpenId(openId === ev.id ? null : ev.id)}>✎</button>
                <button className="admin-icon-btn danger" onClick={() => setConfirmDelete(ev.id)}>🗑</button>
              </div>
            </div>
            {confirmDelete === ev.id && (
              <div className="admin-entity-form">
                <div className="admin-confirm-bar">
                  <span>Delete "{ev.title}" on {ev.date}?</span>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <Button size="sm" variant="danger" onClick={() => { removeItem('events', ev.id); setConfirmDelete(null); }}>Delete</Button>
                    <Button size="sm" variant="ghost" onClick={() => setConfirmDelete(null)}>Cancel</Button>
                  </div>
                </div>
              </div>
            )}
            {openId === ev.id && confirmDelete !== ev.id && (
              <div className="admin-entity-form">
                <EventForm initial={ev} onCancel={() => setOpenId(null)} onSubmit={(f) => { updateItem('events', ev.id, f); setOpenId(null); }} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function EventForm({ initial, onSubmit, onCancel }) {
  const [form, setForm] = useState(initial);
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit({ ...form, seats: Number(form.seats) || 0 }); }}>
      <div className="field">
        <label>Session title</label>
        <input type="text" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
      </div>
      <div className="inline-fields">
        <div className="field" style={{ margin: 0 }}>
          <label>Date</label>
          <input type="date" required value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
        </div>
        <div className="field" style={{ margin: 0 }}>
          <label>Time</label>
          <input type="text" placeholder="9:00 AM" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
        </div>
        <div className="field" style={{ margin: 0 }}>
          <label>Venue</label>
          <input type="text" value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })} />
        </div>
        <div className="field" style={{ margin: 0 }}>
          <label>Seats</label>
          <input type="number" min="0" value={form.seats} onChange={(e) => setForm({ ...form, seats: e.target.value })} />
        </div>
      </div>
      <div className="admin-form-actions">
        <Button type="submit" variant="primary">Save session</Button>
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  );
}
