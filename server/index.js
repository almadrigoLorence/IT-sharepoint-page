import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// MySQL Database connection pool for XAMPP default settings
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'aseph_academy',
  port: Number(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1');
    res.json({ status: 'connected', db: 'MySQL XAMPP (aseph_academy)' });
  } catch (err) {
    res.status(500).json({ status: 'disconnected', error: err.message });
  }
});

// GET full site dataset
app.get('/api/data', async (req, res) => {
  try {
    const [[siteRow]] = await pool.query('SELECT name, tagline, heroSubtitle, footerNote FROM site_settings LIMIT 1');
    const [quickLinks] = await pool.query('SELECT id, label, to_url as `to`, description FROM quick_links ORDER BY sort_order ASC');
    const [news] = await pool.query('SELECT id, title, body, DATE_FORMAT(date, "%Y-%m-%d") as date, tag FROM news ORDER BY date DESC');
    const [coursesRows] = await pool.query('SELECT * FROM courses');
    const [pathsRows] = await pool.query('SELECT * FROM paths');
    const [resources] = await pool.query('SELECT id, name, type, course, owner, DATE_FORMAT(reviewDate, "%Y-%m-%d") as reviewDate FROM resources');
    const [events] = await pool.query('SELECT id, title, DATE_FORMAT(date, "%Y-%m-%d") as date, time, venue, seats FROM events');
    const [[progressRow]] = await pool.query('SELECT learner, path_title, path_percent, completions_json FROM learner_progress LIMIT 1');
    
    // Team & Theme queries
    let teamRow, teamMembers = [], themeRow;
    try {
      [[teamRow]] = await pool.query('SELECT title, description FROM team_settings LIMIT 1');
      [teamMembers] = await pool.query('SELECT id, name, role, avatar, bio, sort_order FROM team_members ORDER BY sort_order ASC');
      [[themeRow]] = await pool.query('SELECT * FROM theme_settings LIMIT 1');
    } catch (e) {
      console.warn('Optional team/theme tables not initialized yet:', e.message);
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
      primaryColor: themeRow?.primaryColor || '#0078d4',
      secondaryColor: themeRow?.secondaryColor || '#107c41',
      bgColor: themeRow?.bgColor || '#0b0f19',
      cardBg: themeRow?.cardBg || '#161e2e',
      textColor: themeRow?.textColor || '#f3f4f6',
      headerTitle: themeRow?.headerTitle || 'ASEPH Academy',
      carousel: themeRow?.carousel_json
        ? (typeof themeRow.carousel_json === 'string' ? JSON.parse(themeRow.carousel_json) : themeRow.carousel_json)
        : [
            { id: 'slide1', title: 'SharePoint & IT Training Hub', subtitle: 'Accelerate your technical mastery in security, reliability, and enterprise tools.', image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&auto=format&fit=crop&q=80', buttonText: 'Explore Courses', buttonUrl: '/catalog' },
            { id: 'slide2', title: 'Interactive Learning Paths', subtitle: 'Structured step-by-step career development tracks for engineers and technicians.', image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&auto=format&fit=crop&q=80', buttonText: 'View Paths', buttonUrl: '/paths' }
          ],
      layout: themeRow?.layout_json
        ? (typeof themeRow.layout_json === 'string' ? JSON.parse(themeRow.layout_json) : themeRow.layout_json)
        : ['carousel', 'quickLinks', 'news', 'team', 'courses', 'resources', 'events', 'progress']
    };

    res.json({
      site: siteRow || {
        name: 'SharePoint Academy',
        tagline: 'Core Training Tracks',
        heroSubtitle: 'A training hub for enterprise governance, cloud infrastructure, reliability, and modern IT skills.',
        footerNote: 'SharePoint Academy · IT Department',
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
    });
  } catch (err) {
    console.error('Error fetching data from MySQL:', err);
    res.status(500).json({ error: err.message });
  }
});

// UPDATE site settings
app.post('/api/site', async (req, res) => {
  const { name, tagline, heroSubtitle, footerNote } = req.body;
  try {
    await pool.query(
      'UPDATE site_settings SET name = ?, tagline = ?, heroSubtitle = ?, footerNote = ? WHERE id = 1',
      [name, tagline, heroSubtitle, footerNote]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// COURSES API (CREATE / UPDATE / DELETE)
app.post('/api/courses', async (req, res) => {
  const c = req.body;
  try {
    await pool.query(
      `INSERT INTO courses (id, title, category, level, format, duration, labsCount, owner, featured, audience, trainer, prerequisites, nextSession, description, modules_json, materials_json)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
       title=VALUES(title), category=VALUES(category), level=VALUES(level), format=VALUES(format),
       duration=VALUES(duration), labsCount=VALUES(labsCount), owner=VALUES(owner), featured=VALUES(featured),
       audience=VALUES(audience), trainer=VALUES(trainer), prerequisites=VALUES(prerequisites),
       nextSession=VALUES(nextSession), description=VALUES(description), modules_json=VALUES(modules_json), materials_json=VALUES(materials_json)`,
      [
        c.id, c.title, c.category, c.level, c.format, c.duration, c.labsCount || 0,
        c.owner, c.featured ? 1 : 0, c.audience, c.trainer, c.prerequisites, c.nextSession,
        c.description || '', JSON.stringify(c.modules || []), JSON.stringify(c.materials || []),
      ]
    );
    res.json({ success: true, id: c.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/courses/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM courses WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATHS API (CREATE / UPDATE / DELETE)
app.post('/api/paths', async (req, res) => {
  const p = req.body;
  try {
    await pool.query(
      `INSERT INTO paths (id, title, sequence_json, effort, recommendedStart)
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
       title=VALUES(title), sequence_json=VALUES(sequence_json), effort=VALUES(effort), recommendedStart=VALUES(recommendedStart)`,
      [p.id, p.title, JSON.stringify(p.sequence || []), p.effort, p.recommendedStart]
    );
    res.json({ success: true, id: p.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/paths/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM paths WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// RESOURCES API (CREATE / UPDATE / DELETE)
app.post('/api/resources', async (req, res) => {
  const r = req.body;
  try {
    await pool.query(
      `INSERT INTO resources (id, name, type, course, owner, reviewDate)
       VALUES (?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
       name=VALUES(name), type=VALUES(type), course=VALUES(course), owner=VALUES(owner), reviewDate=VALUES(reviewDate)`,
      [r.id, r.name, r.type, r.course, r.owner, r.reviewDate]
    );
    res.json({ success: true, id: r.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/resources/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM resources WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// EVENTS API (CREATE / UPDATE / DELETE)
app.post('/api/events', async (req, res) => {
  const e = req.body;
  try {
    await pool.query(
      `INSERT INTO events (id, title, date, time, venue, seats)
       VALUES (?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
       title=VALUES(title), date=VALUES(date), time=VALUES(time), venue=VALUES(venue), seats=VALUES(seats)`,
      [e.id, e.title, e.date, e.time, e.venue, e.seats || 0]
    );
    res.json({ success: true, id: e.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/events/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM events WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// NEWS API (CREATE / UPDATE / DELETE)
app.post('/api/news', async (req, res) => {
  const n = req.body;
  try {
    await pool.query(
      `INSERT INTO news (id, title, body, date, tag)
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
       title=VALUES(title), body=VALUES(body), date=VALUES(date), tag=VALUES(tag)`,
      [n.id, n.title, n.body, n.date, n.tag]
    );
    res.json({ success: true, id: n.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/news/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM news WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PROGRESS API (UPDATE)
app.post('/api/progress', async (req, res) => {
  const { learner, pathProgress, completions } = req.body;
  try {
    await pool.query(
      `UPDATE learner_progress SET learner = ?, path_title = ?, path_percent = ?, completions_json = ? WHERE id = 1`,
      [learner, pathProgress?.path, pathProgress?.percent, JSON.stringify(completions || [])]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// TEAM SETTINGS & MEMBERS API
app.post('/api/team', async (req, res) => {
  const { title, description } = req.body;
  try {
    await pool.query(
      `INSERT INTO team_settings (id, title, description) VALUES (1, ?, ?)
       ON DUPLICATE KEY UPDATE title = VALUES(title), description = VALUES(description)`,
      [title, description]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/team/members', async (req, res) => {
  const m = req.body;
  try {
    await pool.query(
      `INSERT INTO team_members (id, name, role, avatar, bio, sort_order)
       VALUES (?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE name=VALUES(name), role=VALUES(role), avatar=VALUES(avatar), bio=VALUES(bio), sort_order=VALUES(sort_order)`,
      [m.id, m.name, m.role, m.avatar, m.bio || '', m.sort_order || 0]
    );
    res.json({ success: true, id: m.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/team/members/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM team_members WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// THEME & LAYOUT API
app.post('/api/theme', async (req, res) => {
  const t = req.body;
  try {
    await pool.query(
      `INSERT INTO theme_settings (id, primaryColor, secondaryColor, bgColor, cardBg, textColor, headerTitle, carousel_json, layout_json)
       VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
       primaryColor=VALUES(primaryColor), secondaryColor=VALUES(secondaryColor), bgColor=VALUES(bgColor),
       cardBg=VALUES(cardBg), textColor=VALUES(textColor), headerTitle=VALUES(headerTitle),
       carousel_json=VALUES(carousel_json), layout_json=VALUES(layout_json)`,
      [
        t.primaryColor || '#0078d4',
        t.secondaryColor || '#107c41',
        t.bgColor || '#0b0f19',
        t.cardBg || '#161e2e',
        t.textColor || '#f3f4f6',
        t.headerTitle || 'ASEPH Academy',
        JSON.stringify(t.carousel || []),
        JSON.stringify(t.layout || []),
      ]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/layout', async (req, res) => {
  const { layout } = req.body;
  try {
    await pool.query(
      `UPDATE theme_settings SET layout_json = ? WHERE id = 1`,
      [JSON.stringify(layout || [])]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 SharePoint Academy API server running on http://localhost:${PORT}`);
});


