import { useState } from 'react';
import { useAcademy } from '../../context/DataContext.jsx';
import Button from '../../components/Button.jsx';
import './AdminLayout.css';
import './admin-shared.css';

const SECTION_LABELS = {
  carousel: { title: 'Hero Carousel Banner', desc: 'Main title banner, interactive slide deck, and search trigger.' },
  quickLinks: { title: 'Quick Links & Search', desc: 'Search bar and 4 quick access shortcut cards.' },
  news: { title: 'News & Upcoming Events', desc: 'Announcements, cohort deadlines, and calendar events.' },
  team: { title: 'Team Presentation', desc: 'IT & Engineering team member showcase cards.' },
  courses: { title: 'Featured Courses Catalog', desc: 'Recommended course cards grid.' },
  resources: { title: 'Quick Resources Downloads', desc: 'SOPs, templates, and downloadable walk-through guides.' },
};

export default function AdminLayoutCustomizer() {
  const { data, updateLayout } = useAcademy();
  const currentLayout = data?.theme?.layout || ['carousel', 'quickLinks', 'news', 'team', 'courses', 'resources'];

  const [layout, setLayout] = useState(currentLayout);
  const [savedNotice, setSavedNotice] = useState(false);

  function moveUp(index) {
    if (index === 0) return;
    const next = [...layout];
    const temp = next[index - 1];
    next[index - 1] = next[index];
    next[index] = temp;
    setLayout(next);
  }

  function moveDown(index) {
    if (index === layout.length - 1) return;
    const next = [...layout];
    const temp = next[index + 1];
    next[index + 1] = next[index];
    next[index] = temp;
    setLayout(next);
  }

  function handleSave() {
    updateLayout(layout);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  }

  return (
    <div>
      <div className="admin-page-head">
        <div>
          <span className="eyebrow">Admin Layout Engine</span>
          <h1>Reusable Page Layout Customizer</h1>
          <p>Rearrange content section divs on the Home page to customize the layout. Click save to store your customized page design.</p>
        </div>
        <Button variant="primary" onClick={handleSave}>
          {savedNotice ? '✓ Layout Saved!' : 'Save Page Layout Design'}
        </Button>
      </div>

      {savedNotice && (
        <div className="admin-notice success">
          ⚡ Page layout order successfully saved to database!
        </div>
      )}

      <div className="admin-panel mb-6">
        <h2>Home Page Content Order</h2>
        <p style={{ color: '#9ca3af', marginBottom: '1.25rem' }}>
          Use the <strong>Move Up (▲)</strong> and <strong>Move Down (▼)</strong> buttons to change the order in which content divs appear to users.
        </p>

        <div className="admin-entity-list">
          {layout.map((sectionId, idx) => {
            const info = SECTION_LABELS[sectionId] || { title: sectionId, desc: 'Content section' };
            return (
              <div key={sectionId} className="admin-entity-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 32,
                      height: 32,
                      background: 'rgba(0, 120, 212, 0.15)',
                      color: '#0078d4',
                      fontWeight: 700,
                      borderRadius: '50%',
                    }}
                  >
                    {idx + 1}
                  </span>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#f3f4f6' }}>{info.title}</h3>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#9ca3af' }}>{info.desc}</p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <Button
                    size="sm"
                    variant="ghost"
                    disabled={idx === 0}
                    onClick={() => moveUp(idx)}
                    title="Move Up"
                  >
                    ▲ Up
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    disabled={idx === layout.length - 1}
                    onClick={() => moveDown(idx)}
                    title="Move Down"
                  >
                    ▼ Down
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
