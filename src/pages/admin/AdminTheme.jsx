import { useState } from 'react';
import { useAcademy } from '../../context/DataContext.jsx';
import Button from '../../components/Button.jsx';
import FileUpload from '../../components/FileUpload.jsx';
import './AdminLayout.css';
import './admin-shared.css';

const THEME_PRESETS = [
  { name: 'SharePoint Blue', primary: '#0078d4', secondary: '#107c41', bg: '#0b0f19', card: '#161e2e', text: '#f3f4f6' },
  { name: 'Enterprise Dark', primary: '#2563eb', secondary: '#059669', bg: '#090d16', card: '#111827', text: '#f9fafb' },
  { name: 'Oceanic Teal', primary: '#0d9488', secondary: '#0284c7', bg: '#04151f', card: '#092537', text: '#f0fdfa' },
  { name: 'Sunset Amber', primary: '#d97706', secondary: '#dc2626', bg: '#1c1917', card: '#292524', text: '#fafaf9' },
  { name: 'Cyber Neon', primary: '#8b5cf6', secondary: '#ec4899', bg: '#0f0728', card: '#1c0f38', text: '#f5f3ff' },
];

export default function AdminTheme() {
  const { data, updateTheme, updateSite } = useAcademy();
  const theme = data.theme || {};
  const site = data.site || {};

  const [primaryColor, setPrimaryColor] = useState(theme.primaryColor || '#3b82f6');
  const [secondaryColor, setSecondaryColor] = useState(theme.secondaryColor || '#8b5cf6');
  const [bgColor, setBgColor] = useState(theme.bgColor || '#f8fafc');
  const [cardBg, setCardBg] = useState(theme.cardBg || '#ffffff');
  const [textColor, setTextColor] = useState(theme.textColor || '#0f172a');
  const [headerTitle, setHeaderTitle] = useState(theme.headerTitle || 'SharePoint Academy');
  const [bgMediaType, setBgMediaType] = useState(theme.bgMediaType || 'gradient');
  const [bgMediaUrl, setBgMediaUrl] = useState(theme.bgMediaUrl || '');
  const [deptTag, setDeptTag] = useState(site.deptTag || 'IT DEPARTMENT');
  const [logoUrl, setLogoUrl] = useState(site.logoUrl || '');
  const [carousel, setCarousel] = useState(theme.carousel || []);
  const [savedNotice, setSavedNotice] = useState(false);

  function applyPreset(preset) {
    setPrimaryColor(preset.primary);
    setSecondaryColor(preset.secondary);
    setBgColor(preset.bg);
    setCardBg(preset.card);
    setTextColor(preset.text);
  }

  function handleSave(e) {
    e.preventDefault();
    updateTheme({
      primaryColor,
      secondaryColor,
      bgColor,
      cardBg,
      textColor,
      headerTitle,
      bgMediaType,
      bgMediaUrl,
      carousel,
    });
    updateSite({
      deptTag,
      logoUrl,
    });
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  }

  function updateSlide(idx, field, val) {
    setCarousel((slides) => slides.map((s, i) => (i === idx ? { ...s, [field]: val } : s)));
  }

  function addSlide() {
    setCarousel((slides) => [
      ...slides,
      {
        id: `slide-${Date.now()}`,
        title: 'New Headline Banner',
        subtitle: 'Add subtitle description for your new training banner here.',
        image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&auto=format&fit=crop&q=80',
        buttonText: 'Explore',
        buttonUrl: '/catalog',
      },
    ]);
  }

  function removeSlide(idx) {
    setCarousel((slides) => slides.filter((_, i) => i !== idx));
  }

  return (
    <div>
      <div className="admin-page-head">
        <div>
          <span className="eyebrow">Admin Settings</span>
          <h1>Theme &amp; Header Customizer</h1>
          <p>Modify color themes, header branding, and hero carousel banners across the entire application.</p>
        </div>
        <Button variant="primary" onClick={handleSave}>
          {savedNotice ? '✓ Saved & Applied!' : 'Save Theme Changes'}
        </Button>
      </div>

      {savedNotice && (
        <div className="admin-notice success">
          ⚡ Theme settings updated successfully and saved to database!
        </div>
      )}

      {/* Preset Pickers */}
      <div className="admin-panel mb-6">
        <h2>Theme Color Presets</h2>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '1rem' }}>
          {THEME_PRESETS.map((preset) => (
            <button
              key={preset.name}
              type="button"
              className="admin-preset-btn"
              onClick={() => applyPreset(preset)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                background: preset.card,
                color: preset.text,
                border: `1px solid ${preset.primary}`,
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              <span
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: '50%',
                  background: preset.primary,
                }}
              />
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Color Customization */}
      <div className="admin-panel mb-6">
        <h2>Custom Theme Colors</h2>
        <div className="admin-form-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
          <label>
            Primary Brand Color
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <input type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} />
              <input type="text" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} />
            </div>
          </label>

          <label>
            Secondary Color
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <input type="color" value={secondaryColor} onChange={(e) => setSecondaryColor(e.target.value)} />
              <input type="text" value={secondaryColor} onChange={(e) => setSecondaryColor(e.target.value)} />
            </div>
          </label>

          <label>
            Page Background Color
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} />
              <input type="text" value={bgColor} onChange={(e) => setBgColor(e.target.value)} />
            </div>
          </label>

          <label>
            Card Background Color
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <input type="color" value={cardBg} onChange={(e) => setCardBg(e.target.value)} />
              <input type="text" value={cardBg} onChange={(e) => setCardBg(e.target.value)} />
            </div>
          </label>
        </div>
      </div>

      {/* Department Branding & Logo */}
      <div className="admin-panel mb-6">
        <h2>Department Branding &amp; Logo (Multi-Department Reuse)</h2>
        <div className="admin-form-grid">
          <label>
            Header Title / Academy Name
            <input
              type="text"
              value={headerTitle}
              onChange={(e) => setHeaderTitle(e.target.value)}
              placeholder="e.g. SharePoint Academy"
            />
          </label>

          <label>
            Department Badge Label
            <input
              type="text"
              value={deptTag}
              onChange={(e) => setDeptTag(e.target.value)}
              placeholder="e.g. IT DEPARTMENT or HR DEPARTMENT"
            />
          </label>

          <label>
            Custom Department Logo Image URL / Upload
            <input
              type="text"
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              placeholder="https://... logo image"
            />
            <FileUpload
              onDataUrl={(url) => setLogoUrl(url)}
              accept="image/*"
              label="Upload Custom Logo File"
            />
          </label>
        </div>
      </div>

      {/* Hero Background Video / Image Customization */}
      <div className="admin-panel mb-6">
        <h2>Hero Background Media (Video or Image)</h2>
        <div className="admin-form-grid">
          <label>
            Background Type
            <select
              value={bgMediaType}
              onChange={(e) => setBgMediaType(e.target.value)}
              style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}
            >
              <option value="gradient">Default Gradient / Clean Light</option>
              <option value="image">Custom Background Image</option>
              <option value="video">Custom Background Video (MP4 / WebM)</option>
            </select>
          </label>

          {bgMediaType !== 'gradient' && (
            <label>
              Media URL or File Upload ({bgMediaType === 'video' ? 'Video File' : 'Image File'})
              <input
                type="text"
                value={bgMediaUrl}
                onChange={(e) => setBgMediaUrl(e.target.value)}
                placeholder={bgMediaType === 'video' ? 'https://...video.mp4' : 'https://...image.jpg'}
              />
              <FileUpload
                onDataUrl={(url) => setBgMediaUrl(url)}
                accept={bgMediaType === 'video' ? 'video/*' : 'image/*'}
                label={`Upload ${bgMediaType === 'video' ? 'Video' : 'Image'} File`}
              />
            </label>
          )}
        </div>
      </div>

      {/* Hero Carousel Editor */}
      <div className="admin-panel">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Hero Carousel Banners</h2>
          <Button variant="secondary" size="sm" onClick={addSlide}>
            + Add Slide Banner
          </Button>
        </div>

        <div className="admin-entity-list" style={{ marginTop: '1rem' }}>
          {carousel.map((slide, idx) => (
            <div key={slide.id || idx} className="admin-entity-row" style={{ padding: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <strong style={{ color: '#0078d4' }}>Slide #{idx + 1}</strong>
                <button className="admin-icon-btn danger" type="button" onClick={() => removeSlide(idx)}>
                  🗑 Remove
                </button>
              </div>

              <div className="admin-form-grid">
                <label>
                  Banner Title
                  <input
                    type="text"
                    value={slide.title}
                    onChange={(e) => updateSlide(idx, 'title', e.target.value)}
                  />
                </label>

                <label>
                  Subtitle
                  <input
                    type="text"
                    value={slide.subtitle}
                    onChange={(e) => updateSlide(idx, 'subtitle', e.target.value)}
                  />
                </label>

                <label>
                  Background Image URL / Upload
                  <input
                    type="text"
                    value={slide.image}
                    onChange={(e) => updateSlide(idx, 'image', e.target.value)}
                    placeholder="https://..."
                  />
                  <FileUpload
                    onDataUrl={(url) => updateSlide(idx, 'image', url)}
                    accept="image/*"
                    label="Upload Custom Banner Image"
                  />
                </label>

                <label>
                  Button Label
                  <input
                    type="text"
                    value={slide.buttonText}
                    onChange={(e) => updateSlide(idx, 'buttonText', e.target.value)}
                  />
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
