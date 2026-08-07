import { useState } from 'react';
import { useAcademy } from '../../context/DataContext.jsx';
import Button from '../../components/Button.jsx';
import './AdminLayout.css';
import './admin-shared.css';

const SECTION_LABELS = {
  hero: { title: 'Hero Section (Video / Image / Gradient)', desc: 'Full-width hero banner with title, subtitle, CTA buttons, and floating metric pills.' },
  carousel: { title: 'Hero Carousel Banner', desc: 'Main title banner, interactive slide deck.' },
  quickLinks: { title: 'Quick Access Links', desc: '4 quick access shortcut cards for navigation.' },
  news: { title: 'News & Upcoming Events', desc: 'Announcements, cohort deadlines, and calendar events.' },
  team: { title: 'Team Presentation', desc: 'IT & Engineering team member showcase cards.' },
  courses: { title: 'Featured Courses Catalog', desc: 'Recommended course cards grid.' },
  resources: { title: 'Quick Resources Downloads', desc: 'SOPs, templates, and downloadable walk-through guides.' },
  events: { title: 'Events Calendar', desc: 'Upcoming events list and schedule.' },
  progress: { title: 'Learner Progress', desc: 'Individual path progress and completions.' },
};

const ALL_SECTIONS = ['hero', 'carousel', 'quickLinks', 'news', 'team', 'courses', 'resources', 'events', 'progress'];

export default function AdminLayoutCustomizer() {
  const { data, updateLayout } = useAcademy();
  const currentLayout = data?.theme?.layout || ['hero', 'quickLinks', 'news', 'team', 'courses', 'resources'];

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

  function removeSection(index) {
    setLayout((prev) => prev.filter((_, i) => i !== index));
  }

  function addSection(sectionId) {
    if (!layout.includes(sectionId)) {
      setLayout((prev) => [...prev, sectionId]);
    }
  }

  function handleSave() {
    updateLayout(layout);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  }

  const availableToAdd = ALL_SECTIONS.filter((s) => !layout.includes(s));

  return (
    <div>
      <div className="admin-page-head">
        <div>
          <span className="eyebrow">Admin Layout Engine</span>
          <h1>Reusable Page Layout Customizer</h1>
          <p>Rearrange, add, or remove content sections on the Home page. Click save to store your customized page design.</p>
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
        <p style={{ color: '#64748b', marginBottom: '1.25rem' }}>
          Use <strong>▲ Up</strong> / <strong>▼ Down</strong> to reorder, or <strong>✕ Remove</strong> sections you don't need.
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
                      background: 'rgba(59, 130, 246, 0.12)',
                      color: '#3b82f6',
                      fontWeight: 700,
                      borderRadius: '50%',
                    }}
                  >
                    {idx + 1}
                  </span>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#0f172a' }}>{info.title}</h3>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>{info.desc}</p>
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
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeSection(idx)}
                    title="Remove Section"
                  >
                    ✕
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Section Buttons */}
      {availableToAdd.length > 0 && (
        <div className="admin-panel mb-6">
          <h2>Add Sections</h2>
          <p style={{ color: '#64748b', marginBottom: '1rem' }}>Click to add a section back to the layout.</p>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {availableToAdd.map((sectionId) => {
              const info = SECTION_LABELS[sectionId] || { title: sectionId };
              return (
                <Button
                  key={sectionId}
                  size="sm"
                  variant="secondary"
                  onClick={() => addSection(sectionId)}
                >
                  + {info.title}
                </Button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
