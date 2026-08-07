import { useState } from 'react';
import { useAcademy } from '../../context/DataContext.jsx';
import Button from '../../components/Button.jsx';
import './AdminLayout.css';
import './admin-shared.css';

export default function AdminSite() {
  const { data, updateSite, addItem, updateItem, removeItem, apiUrl, updateApiUrl, isDbConnected } = useAcademy();
  const [siteForm, setSiteForm] = useState(data.site);
  const [savedSite, setSavedSite] = useState(false);
  const [customApiUrlInput, setCustomApiUrlInput] = useState(apiUrl);
  const [savedApiNotice, setSavedApiNotice] = useState(false);
  const [newLink, setNewLink] = useState({ label: '', to: '', description: '' });
  const [newNews, setNewNews] = useState({ title: '', body: '', tag: 'New course', date: new Date().toISOString().slice(0, 10) });
  const [editingNewsId, setEditingNewsId] = useState(null);
  const [editingLinkId, setEditingLinkId] = useState(null);

  function saveApiUrl(e) {
    e.preventDefault();
    updateApiUrl(customApiUrlInput);
    setSavedApiNotice(true);
    setTimeout(() => setSavedApiNotice(false), 2500);
  }

  function saveSite(e) {
    e.preventDefault();
    updateSite(siteForm);
    setSavedSite(true);
    setTimeout(() => setSavedSite(false), 1600);
  }

  function addNews(e) {
    e.preventDefault();
    if (!newNews.title.trim()) return;
    addItem('news', newNews, 'n');
    setNewNews({ title: '', body: '', tag: 'New course', date: new Date().toISOString().slice(0, 10) });
  }

  function addLink(e) {
    e.preventDefault();
    if (!newLink.label.trim()) return;
    addItem('quickLinks', newLink, 'ql');
    setNewLink({ label: '', to: '', description: '' });
  }

  return (
    <div>
      <div className="admin-page-head">
        <div>
          <span className="eyebrow">Site &amp; Home</span>
          <h1>Home page content</h1>
          <p>Controls the hero banner, quick links, and news feed shown on the home page.</p>
        </div>
      </div>

      {/* Database Connection & API Server Endpoint Panel */}
      <form className="admin-panel mb-6" onSubmit={saveApiUrl}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <h2>🌐 Database &amp; API Server Endpoint Settings</h2>
          <span
            style={{
              padding: '6px 14px',
              borderRadius: '9999px',
              fontSize: '12px',
              fontWeight: 700,
              background: isDbConnected ? '#dcfce7' : '#fef3c7',
              color: isDbConnected ? '#15803d' : '#b45309',
              border: `1px solid ${isDbConnected ? '#bbf7d0' : '#fde68a'}`,
            }}
          >
            {isDbConnected ? '⚡ MySQL Database Connected' : '⚠️ Offline / Browser Storage'}
          </span>
        </div>

        <p style={{ fontSize: '0.88rem', color: '#64748b', marginBottom: '1.25rem' }}>
          When testing locally on <code>http://localhost:5173</code>, use <code>http://localhost:5000/api</code>.<br />
          To connect <strong>GitHub Pages (HTTPS)</strong> live to your computer's XAMPP MySQL, run <code>npx localtunnel --port 5000</code> in your terminal and paste the generated <code>https://...loca.lt/api</code> URL below!
        </p>

        <div className="field">
          <label>API Endpoint Server URL</label>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <input
              type="text"
              value={customApiUrlInput}
              onChange={(e) => setCustomApiUrlInput(e.target.value)}
              placeholder="http://localhost:5000/api or https://xxxx.loca.lt/api"
              style={{ flex: 1 }}
            />
            <Button type="submit" variant="primary">
              {savedApiNotice ? 'Updated ✓' : 'Connect API URL'}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setCustomApiUrlInput('http://localhost:5000/api');
                updateApiUrl('http://localhost:5000/api');
              }}
            >
              Reset Default
            </Button>
          </div>
        </div>
      </form>

      <form className="admin-panel mb-6" onSubmit={saveSite}>
        <h2>Hero banner</h2>
        <div className="field">
          <label>Academy name</label>
          <input type="text" value={siteForm.name} onChange={(e) => setSiteForm({ ...siteForm, name: e.target.value })} />
        </div>
        <div className="field">
          <label>Hero headline</label>
          <input type="text" value={siteForm.tagline} onChange={(e) => setSiteForm({ ...siteForm, tagline: e.target.value })} />
        </div>
        <div className="field">
          <label>Hero subtitle</label>
          <textarea value={siteForm.heroSubtitle} onChange={(e) => setSiteForm({ ...siteForm, heroSubtitle: e.target.value })} />
        </div>
        <div className="field">
          <label>Footer note</label>
          <input type="text" value={siteForm.footerNote} onChange={(e) => setSiteForm({ ...siteForm, footerNote: e.target.value })} />
        </div>
        <Button type="submit" variant="primary">{savedSite ? 'Saved ✓' : 'Save hero content'}</Button>
      </form>

      <div className="admin-panel">
        <h2>Quick links</h2>
        <div className="admin-entity-list" style={{ marginBottom: 16 }}>
          {data.quickLinks.map((q) => (
            <QuickLinkRow
              key={q.id}
              link={q}
              editing={editingLinkId === q.id}
              onToggle={() => setEditingLinkId(editingLinkId === q.id ? null : q.id)}
              onSave={(patch) => { updateItem('quickLinks', q.id, patch); setEditingLinkId(null); }}
              onDelete={() => removeItem('quickLinks', q.id)}
            />
          ))}
        </div>
        <form className="inline-fields" onSubmit={addLink} style={{ alignItems: 'end' }}>
          <div className="field" style={{ margin: 0 }}>
            <label>Label</label>
            <input type="text" value={newLink.label} onChange={(e) => setNewLink({ ...newLink, label: e.target.value })} placeholder="e.g. Browse courses" />
          </div>
          <div className="field" style={{ margin: 0 }}>
            <label>Links to</label>
            <input type="text" value={newLink.to} onChange={(e) => setNewLink({ ...newLink, to: e.target.value })} placeholder="/catalog" />
          </div>
          <div className="field" style={{ margin: 0 }}>
            <label>Description</label>
            <input type="text" value={newLink.description} onChange={(e) => setNewLink({ ...newLink, description: e.target.value })} placeholder="Short description" />
          </div>
          <Button type="submit" variant="secondary" size="md">Add link</Button>
        </form>
      </div>

      <div className="admin-panel">
        <h2>News &amp; announcements</h2>
        <div className="admin-entity-list" style={{ marginBottom: 16 }}>
          {data.news.map((n) => (
            <NewsRow
              key={n.id}
              item={n}
              editing={editingNewsId === n.id}
              onToggle={() => setEditingNewsId(editingNewsId === n.id ? null : n.id)}
              onSave={(patch) => { updateItem('news', n.id, patch); setEditingNewsId(null); }}
              onDelete={() => removeItem('news', n.id)}
            />
          ))}
        </div>
        <form onSubmit={addNews}>
          <div className="inline-fields">
            <div className="field" style={{ margin: 0 }}>
              <label>Title</label>
              <input type="text" value={newNews.title} onChange={(e) => setNewNews({ ...newNews, title: e.target.value })} placeholder="Post title" />
            </div>
            <div className="field" style={{ margin: 0 }}>
              <label>Tag</label>
              <select value={newNews.tag} onChange={(e) => setNewNews({ ...newNews, tag: e.target.value })}>
                <option>New course</option>
                <option>Deadline</option>
                <option>Spotlight</option>
              </select>
            </div>
            <div className="field" style={{ margin: 0 }}>
              <label>Date</label>
              <input type="date" value={newNews.date} onChange={(e) => setNewNews({ ...newNews, date: e.target.value })} />
            </div>
          </div>
          <div className="field">
            <label>Body</label>
            <textarea value={newNews.body} onChange={(e) => setNewNews({ ...newNews, body: e.target.value })} placeholder="What's the news?" />
          </div>
          <Button type="submit" variant="secondary">Publish news post</Button>
        </form>
      </div>
    </div>
  );
}

function QuickLinkRow({ link, editing, onToggle, onSave, onDelete }) {
  const [form, setForm] = useState(link);
  return (
    <div className={`admin-entity-row ${editing ? 'is-editing' : ''}`}>
      <div className="admin-entity-summary" onClick={onToggle}>
        <div className="admin-entity-summary-main">
          <h3>{link.label}</h3>
          <p>{link.to} — {link.description}</p>
        </div>
        <div className="admin-entity-actions" onClick={(e) => e.stopPropagation()}>
          <button className="admin-icon-btn" onClick={onToggle} aria-label="Edit">✎</button>
          <button className="admin-icon-btn danger" onClick={onDelete} aria-label="Delete">🗑</button>
        </div>
      </div>
      {editing && (
        <div className="admin-entity-form">
          <div className="inline-fields">
            <div className="field" style={{ margin: 0 }}>
              <label>Label</label>
              <input type="text" value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} />
            </div>
            <div className="field" style={{ margin: 0 }}>
              <label>Links to</label>
              <input type="text" value={form.to} onChange={(e) => setForm({ ...form, to: e.target.value })} />
            </div>
            <div className="field" style={{ margin: 0 }}>
              <label>Description</label>
              <input type="text" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
          </div>
          <div className="admin-form-actions">
            <Button size="sm" onClick={() => onSave(form)}>Save</Button>
            <Button size="sm" variant="ghost" onClick={onToggle}>Cancel</Button>
          </div>
        </div>
      )}
    </div>
  );
}

function NewsRow({ item, editing, onToggle, onSave, onDelete }) {
  const [form, setForm] = useState(item);
  return (
    <div className={`admin-entity-row ${editing ? 'is-editing' : ''}`}>
      <div className="admin-entity-summary" onClick={onToggle}>
        <div className="admin-entity-summary-main">
          <h3>{item.title}</h3>
          <p>{item.tag} · {item.date}</p>
        </div>
        <div className="admin-entity-actions" onClick={(e) => e.stopPropagation()}>
          <button className="admin-icon-btn" onClick={onToggle} aria-label="Edit">✎</button>
          <button className="admin-icon-btn danger" onClick={onDelete} aria-label="Delete">🗑</button>
        </div>
      </div>
      {editing && (
        <div className="admin-entity-form">
          <div className="inline-fields">
            <div className="field" style={{ margin: 0 }}>
              <label>Title</label>
              <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div className="field" style={{ margin: 0 }}>
              <label>Tag</label>
              <select value={form.tag} onChange={(e) => setForm({ ...form, tag: e.target.value })}>
                <option>New course</option>
                <option>Deadline</option>
                <option>Spotlight</option>
              </select>
            </div>
            <div className="field" style={{ margin: 0 }}>
              <label>Date</label>
              <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            </div>
          </div>
          <div className="field">
            <label>Body</label>
            <textarea value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} />
          </div>
          <div className="admin-form-actions">
            <Button size="sm" onClick={() => onSave(form)}>Save</Button>
            <Button size="sm" variant="ghost" onClick={onToggle}>Cancel</Button>
          </div>
        </div>
      )}
    </div>
  );
}
