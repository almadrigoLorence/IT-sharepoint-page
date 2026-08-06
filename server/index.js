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
    res.json({ status: 'connected', db: 'MySQL XAMPP' });
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

    res.json({
      site: siteRow || {
        name: 'SharePoint Academy',
        tagline: 'Core Training Tracks',
        heroSubtitle: 'A training hub for reliability, calibration, and lab skills',
        footerNote: 'SharePoint Academy · IT Department',
      },
      quickLinks,
      news,
      courses,
      paths,
      resources,
      events,
      progress,
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

// COURSE CRUD
app.post('/api/courses', async (req, res) => {
  const c = req.body;
  try {
    await pool.query(
      `INSERT INTO courses (id, title, category, level, format, duration, labsCount, owner, featured, audience, trainer, prerequisites, nextSession, description, modules_json, materials_json)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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

app.listen(PORT, () => {
  console.log(`🚀 SharePoint Academy API server running on http://localhost:${PORT}`);
});
