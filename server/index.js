import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const PORT = process.env.PORT || 5000;

// MySQL Database connection pool for XAMPP default settings
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'it_academy',
  port: Number(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Root info route
app.get('/', (req, res) => {
  res.json({
    name: 'IT Academy API Server',
    status: 'running',
    database: 'it_academy (MySQL/XAMPP)',
    endpoints: {
      health: '/api/health',
      data: '/api/data',
      site: 'POST /api/site',
      courses: 'GET/POST /api/courses, DELETE /api/courses/:id',
      paths: 'GET/POST /api/paths, DELETE /api/paths/:id',
      resources: 'GET/POST /api/resources, DELETE /api/resources/:id',
      events: 'GET/POST /api/events, DELETE /api/events/:id',
      news: 'GET/POST /api/news, DELETE /api/news/:id',
      team: 'POST /api/team, POST /api/team/members, DELETE /api/team/members/:id',
      theme: 'POST /api/theme',
      layout: 'POST /api/layout',
    },
  });
});

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1');
    res.json({ status: 'connected', db: 'MySQL XAMPP (it_academy)' });
  } catch (err) {
    res.status(500).json({ status: 'disconnected', error: err.message });
  }
});

// GET full site dataset
app.get('/api/data', async (req, res) => {
  try {
    const [[siteRow]] = await pool.query('SELECT name, tagline, heroSubtitle, footerNote, deptTag, logoUrl FROM ita_site_settings LIMIT 1');
    const [quickLinks] = await pool.query('SELECT id, label, to_url as `to`, description FROM ita_quick_links ORDER BY sort_order ASC');
    const [news] = await pool.query('SELECT id, title, body, DATE_FORMAT(date, "%Y-%m-%d") as date, tag FROM ita_news ORDER BY date DESC');
    const [coursesRows] = await pool.query('SELECT * FROM ita_courses');
    const [pathsRows] = await pool.query('SELECT * FROM ita_paths');
    const [resources] = await pool.query('SELECT id, name, type, course, owner, DATE_FORMAT(reviewDate, "%Y-%m-%d") as reviewDate FROM ita_resources');
    const [events] = await pool.query('SELECT id, title, DATE_FORMAT(date, "%Y-%m-%d") as date, time, venue, seats FROM ita_events');
    const [[progressRow]] = await pool.query('SELECT learner, path_title, path_percent, completions_json FROM ita_learner_progress LIMIT 1');
    
    // Team & Theme & Custom Containers queries
    let teamRow, teamMembers = [], themeRow, customContainers = [];
    try {
      [[teamRow]] = await pool.query('SELECT title, description FROM ita_team_settings LIMIT 1');
      [teamMembers] = await pool.query('SELECT id, name, role, avatar, bio, sort_order FROM ita_team_members ORDER BY sort_order ASC');
      [[themeRow]] = await pool.query('SELECT * FROM ita_theme_settings LIMIT 1');
      [customContainers] = await pool.query('SELECT * FROM ita_custom_containers ORDER BY sort_order ASC');
    } catch (e) {
      console.warn('Optional team/theme tables check:', e.message);
    }

    const courses = coursesRows.map((c) => ({
      ...c,
      featured: Boolean(c.featured),
      modules: typeof c.modules_json === 'string' ? JSON.parse(c.modules_json) : (c.modules_json || []),
      materials: typeof c.materials_json === 'string' ? JSON.parse(c.materials_json) : (c.materials_json || []),
    }));

    const paths = pathsRows.map((p) => ({
      ...p,
      sequence: typeof p.sequence_json === 'string' ? JSON.parse(p.sequence_json) : (p.sequence_json || []),
    }));

    const progress = {
      learner: progressRow?.learner || 'You',
      pathProgress: {
        path: progressRow?.path_title || 'Lab Technician',
        percent: progressRow?.path_percent || 60,
      },
      completions: progressRow?.completions_json
        ? (typeof progressRow.completions_json === 'string' ? JSON.parse(progressRow.completions_json) : progressRow.completions_json)
        : [],
    };

    const team = {
      title: teamRow?.title || 'Meet Our IT & Engineering Team',
      description: teamRow?.description || 'The dedicated experts leading reliability, training, cloud architecture, and compliance across ASEPH.',
      members: teamMembers.length > 0 ? teamMembers : [
        { id: 'tm1', name: 'J. Ramirez', role: 'Lead Reliability Engineer & Trainer', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80', bio: 'Specializes in TCT, HAST testing standards, and compliance training.' },
        { id: 'tm2', name: 'M. Santos', role: 'Senior Systems Architect', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80', bio: 'Leads SharePoint tenant governance, security policies, and infrastructure.' },
        { id: 'tm3', name: 'A. Dela Peña', role: 'Data Analytics Specialist', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80', bio: 'Drives Power BI dashboards, automated lab reporting, and Excel data models.' },
      ],
    };

    const theme = {
      primaryColor: themeRow?.primaryColor || '#3b82f6',
      secondaryColor: themeRow?.secondaryColor || '#8b5cf6',
      bgColor: themeRow?.bgColor || '#f8fafc',
      cardBg: themeRow?.cardBg || '#ffffff',
      textColor: themeRow?.textColor || '#0f172a',
      headerTitle: themeRow?.headerTitle || 'SharePoint Academy',
      bgMediaType: themeRow?.bgMediaType || 'gradient',
      bgMediaUrl: themeRow?.bgMediaUrl || '',
      carousel: themeRow?.carousel_json
        ? (typeof themeRow.carousel_json === 'string' ? JSON.parse(themeRow.carousel_json) : themeRow.carousel_json)
        : [
            { id: 'slide1', title: 'SharePoint & IT Training Hub', subtitle: 'Accelerate your technical mastery in security, reliability, and enterprise tools.', image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&auto=format&fit=crop&q=80', buttonText: 'Explore Courses', buttonUrl: '/catalog' },
            { id: 'slide2', title: 'Interactive Learning Paths', subtitle: 'Structured step-by-step career development tracks for engineers and technicians.', image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&auto=format&fit=crop&q=80', buttonText: 'View Paths', buttonUrl: '/paths' }
          ],
      layout: themeRow?.layout_json
        ? (typeof themeRow.layout_json === 'string' ? JSON.parse(themeRow.layout_json) : themeRow.layout_json)
        : ['hero', 'quickLinks', 'news', 'team', 'courses', 'resources', 'events', 'progress']
    };

    // Parse custom containers content_json
    const parsedContainers = customContainers.map((c) => ({
      ...c,
      content_json: typeof c.content_json === 'string' ? JSON.parse(c.content_json) : (c.content_json || []),
    }));

    res.json({
      site: siteRow || {
        name: 'SharePoint Academy',
        tagline: 'Core Training Tracks',
        heroSubtitle: 'A training hub for enterprise governance, cloud infrastructure, reliability, and modern IT skills.',
        footerNote: 'SharePoint Academy · IT Department',
        deptTag: 'IT DEPARTMENT',
        logoUrl: '',
      },
      quickLinks,
      news,
      courses,
      paths,
      resources,
      events,
      progress,
      team,
      theme,
      customContainers: parsedContainers,
    });
  } catch (err) {
    console.error('Error fetching data from MySQL:', err);
    res.status(500).json({ error: err.message });
  }
});

// UPDATE site settings
app.post('/api/site', async (req, res) => {
  const { name, tagline, heroSubtitle, footerNote, deptTag, logoUrl } = req.body;
  try {
    await pool.query(
      `INSERT INTO ita_site_settings (id, name, tagline, heroSubtitle, footerNote, deptTag, logoUrl)
       VALUES (1, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE name=VALUES(name), tagline=VALUES(tagline), heroSubtitle=VALUES(heroSubtitle), footerNote=VALUES(footerNote), deptTag=VALUES(deptTag), logoUrl=VALUES(logoUrl)`,
      [
        name || 'SharePoint Academy',
        tagline || 'Core Training Tracks',
        heroSubtitle || 'Welcome to the SharePoint Academy, hosted by the IT Department.',
        footerNote || 'SharePoint Academy · IT Department',
        deptTag || 'IT DEPARTMENT',
        logoUrl || '',
      ]
    );
    console.log('✅ Updated site settings in MySQL');
    res.json({ success: true });
  } catch (err) {
    console.error('❌ Error updating site settings:', err);
    res.status(500).json({ error: err.message });
  }
});

// COURSES API (CREATE / UPDATE / DELETE)
app.post('/api/courses', async (req, res) => {
  const c = req.body;
  try {
    await pool.query(
      `INSERT INTO ita_courses (id, title, category, level, format, duration, labsCount, owner, featured, audience, trainer, prerequisites, nextSession, description, modules_json, materials_json)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
       title=VALUES(title), category=VALUES(category), level=VALUES(level), format=VALUES(format),
       duration=VALUES(duration), labsCount=VALUES(labsCount), owner=VALUES(owner), featured=VALUES(featured),
       audience=VALUES(audience), trainer=VALUES(trainer), prerequisites=VALUES(prerequisites),
       nextSession=VALUES(nextSession), description=VALUES(description), modules_json=VALUES(modules_json), materials_json=VALUES(materials_json)`,
      [
        c.id,
        c.title || 'Untitled Course',
        c.category || 'General',
        c.level || 'Beginner',
        c.format || 'Hybrid',
        c.duration || '1 hour',
        c.labsCount || 0,
        c.owner || 'Admin',
        c.featured ? 1 : 0,
        c.audience || 'All Staff',
        c.trainer || 'Instructor',
        c.prerequisites || 'None',
        c.nextSession || 'TBD',
        c.description || '',
        JSON.stringify(c.modules || []),
        JSON.stringify(c.materials || []),
      ]
    );
    console.log('✅ Saved course to MySQL:', c.id);
    res.json({ success: true, id: c.id });
  } catch (err) {
    console.error('❌ Error saving course:', err);
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/courses/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM ita_courses WHERE id = ?', [req.params.id]);
    console.log('✅ Deleted course from MySQL:', req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error('❌ Error deleting course:', err);
    res.status(500).json({ error: err.message });
  }
});

// PATHS API (CREATE / UPDATE / DELETE)
app.post('/api/paths', async (req, res) => {
  const p = req.body;
  try {
    await pool.query(
      `INSERT INTO ita_paths (id, title, sequence_json, effort, recommendedStart)
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
       title=VALUES(title), sequence_json=VALUES(sequence_json), effort=VALUES(effort), recommendedStart=VALUES(recommendedStart)`,
      [p.id, p.title || 'New Path', JSON.stringify(p.sequence || []), p.effort || 'Self-paced', p.recommendedStart || 'Start']
    );
    console.log('✅ Saved path to MySQL:', p.id);
    res.json({ success: true, id: p.id });
  } catch (err) {
    console.error('❌ Error saving path:', err);
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/paths/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM ita_paths WHERE id = ?', [req.params.id]);
    console.log('✅ Deleted path from MySQL:', req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error('❌ Error deleting path:', err);
    res.status(500).json({ error: err.message });
  }
});

// RESOURCES API (CREATE / UPDATE / DELETE)
app.post('/api/resources', async (req, res) => {
  const r = req.body;
  try {
    await pool.query(
      `INSERT INTO ita_resources (id, name, type, course, owner, reviewDate)
       VALUES (?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
       name=VALUES(name), type=VALUES(type), course=VALUES(course), owner=VALUES(owner), reviewDate=VALUES(reviewDate)`,
      [r.id, r.name || 'Resource', r.type || 'Guide', r.course || 'All', r.owner || 'Admin', r.reviewDate || '2026-12-31']
    );
    console.log('✅ Saved resource to MySQL:', r.id);
    res.json({ success: true, id: r.id });
  } catch (err) {
    console.error('❌ Error saving resource:', err);
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/resources/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM ita_resources WHERE id = ?', [req.params.id]);
    console.log('✅ Deleted resource from MySQL:', req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error('❌ Error deleting resource:', err);
    res.status(500).json({ error: err.message });
  }
});

// EVENTS API (CREATE / UPDATE / DELETE)
app.post('/api/events', async (req, res) => {
  const e = req.body;
  try {
    await pool.query(
      `INSERT INTO ita_events (id, title, date, time, venue, seats)
       VALUES (?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
       title=VALUES(title), date=VALUES(date), time=VALUES(time), venue=VALUES(venue), seats=VALUES(seats)`,
      [e.id, e.title || 'Event', e.date || '2026-08-01', e.time || '10:00 AM', e.venue || 'Online', e.seats || 0]
    );
    console.log('✅ Saved event to MySQL:', e.id);
    res.json({ success: true, id: e.id });
  } catch (err) {
    console.error('❌ Error saving event:', err);
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/events/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM ita_events WHERE id = ?', [req.params.id]);
    console.log('✅ Deleted event from MySQL:', req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error('❌ Error deleting event:', err);
    res.status(500).json({ error: err.message });
  }
});

// NEWS API (CREATE / UPDATE / DELETE)
app.post('/api/news', async (req, res) => {
  const n = req.body;
  try {
    await pool.query(
      `INSERT INTO ita_news (id, title, body, date, tag)
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
       title=VALUES(title), body=VALUES(body), date=VALUES(date), tag=VALUES(tag)`,
      [n.id, n.title || 'Announcement', n.body || '', n.date || '2026-08-01', n.tag || 'General']
    );
    console.log('✅ Saved news item to MySQL:', n.id);
    res.json({ success: true, id: n.id });
  } catch (err) {
    console.error('❌ Error saving news:', err);
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/news/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM ita_news WHERE id = ?', [req.params.id]);
    console.log('✅ Deleted news from MySQL:', req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error('❌ Error deleting news:', err);
    res.status(500).json({ error: err.message });
  }
});

// PROGRESS API (UPDATE)
app.post('/api/progress', async (req, res) => {
  const { learner, pathProgress, completions } = req.body;
  try {
    await pool.query(
      `UPDATE ita_learner_progress SET learner = ?, path_title = ?, path_percent = ?, completions_json = ? WHERE id = 1`,
      [learner || 'You', pathProgress?.path || 'Lab Technician', pathProgress?.percent || 60, JSON.stringify(completions || [])]
    );
    console.log('✅ Updated learner progress in MySQL');
    res.json({ success: true });
  } catch (err) {
    console.error('❌ Error updating progress:', err);
    res.status(500).json({ error: err.message });
  }
});

// TEAM SETTINGS & MEMBERS API
app.post('/api/team', async (req, res) => {
  const { title, description } = req.body;
  try {
    await pool.query(
      `INSERT INTO ita_team_settings (id, title, description) VALUES (1, ?, ?)
       ON DUPLICATE KEY UPDATE title = VALUES(title), description = VALUES(description)`,
      [title || 'Meet Our IT & Engineering Team', description || '']
    );
    console.log('✅ Updated team settings in MySQL');
    res.json({ success: true });
  } catch (err) {
    console.error('❌ Error updating team settings:', err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/team/members', async (req, res) => {
  const m = req.body;
  try {
    await pool.query(
      `INSERT INTO ita_team_members (id, name, role, avatar, bio, sort_order)
       VALUES (?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE name=VALUES(name), role=VALUES(role), avatar=VALUES(avatar), bio=VALUES(bio), sort_order=VALUES(sort_order)`,
      [m.id, m.name || 'Team Member', m.role || 'Member', m.avatar || '', m.bio || '', m.sort_order || 0]
    );
    console.log('✅ Saved team member to MySQL:', m.id, m.name);
    res.json({ success: true, id: m.id });
  } catch (err) {
    console.error('❌ Error saving team member:', err);
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/team/members/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM ita_team_members WHERE id = ?', [req.params.id]);
    console.log('✅ Deleted team member from MySQL:', req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error('❌ Error deleting team member:', err);
    res.status(500).json({ error: err.message });
  }
});

// THEME & LAYOUT API
app.post('/api/theme', async (req, res) => {
  const t = req.body;
  try {
    await pool.query(
      `INSERT INTO ita_theme_settings (id, primaryColor, secondaryColor, bgColor, cardBg, textColor, headerTitle, bgMediaType, bgMediaUrl, carousel_json, layout_json)
       VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
       primaryColor=VALUES(primaryColor), secondaryColor=VALUES(secondaryColor), bgColor=VALUES(bgColor),
       cardBg=VALUES(cardBg), textColor=VALUES(textColor), headerTitle=VALUES(headerTitle),
       bgMediaType=VALUES(bgMediaType), bgMediaUrl=VALUES(bgMediaUrl),
       carousel_json=VALUES(carousel_json), layout_json=VALUES(layout_json)`,
      [
        t.primaryColor || '#3b82f6',
        t.secondaryColor || '#8b5cf6',
        t.bgColor || '#f8fafc',
        t.cardBg || '#ffffff',
        t.textColor || '#0f172a',
        t.headerTitle || 'SharePoint Academy',
        t.bgMediaType || 'gradient',
        t.bgMediaUrl || '',
        JSON.stringify(t.carousel || []),
        JSON.stringify(t.layout || []),
      ]
    );
    console.log('✅ Saved theme settings to MySQL');
    res.json({ success: true });
  } catch (err) {
    console.error('❌ Error saving theme settings:', err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/layout', async (req, res) => {
  const { layout } = req.body;
  try {
    await pool.query(
      `UPDATE ita_theme_settings SET layout_json = ? WHERE id = 1`,
      [JSON.stringify(layout || [])]
    );
    console.log('✅ Saved page layout order to MySQL');
    res.json({ success: true });
  } catch (err) {
    console.error('❌ Error saving page layout:', err);
    res.status(500).json({ error: err.message });
  }
});

// CUSTOM CONTAINERS API
app.post('/api/containers', async (req, res) => {
  const c = req.body;
  try {
    await pool.query(
      `INSERT INTO ita_custom_containers (id, title, subtitle, type, content_json, sort_order)
       VALUES (?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE title=VALUES(title), subtitle=VALUES(subtitle), type=VALUES(type), content_json=VALUES(content_json), sort_order=VALUES(sort_order)`,
      [c.id, c.title || 'Custom Container', c.subtitle || '', c.type || 'info_card', JSON.stringify(c.content || c.content_json || []), c.sort_order || 0]
    );
    console.log('✅ Saved custom container to MySQL:', c.id);
    res.json({ success: true, id: c.id });
  } catch (err) {
    console.error('❌ Error saving custom container:', err);
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/containers/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM ita_custom_containers WHERE id = ?', [req.params.id]);
    console.log('✅ Deleted custom container from MySQL:', req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error('❌ Error deleting custom container:', err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 IT Academy API server running on http://localhost:${PORT}`);
});



