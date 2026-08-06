# ASEPH Academy — Learning Hub

A React web app built from the "Building a Learning Academy on SharePoint" design
guide. It reproduces the 7-page learner journey (Home, Course Catalog, Course
Page, Learning Paths, Resource Library, Events & Calendar, My Progress) as a
standalone React site, plus a full **Admin tool** that can edit every piece of
content on the site, including file attachments.

## Getting started

Requires Node.js 18+.

```bash
npm install
npm run dev       # start the dev server (usually http://localhost:5173)
```

To build a production version:

```bash
npm run build      # outputs to dist/
npm run preview    # serve the production build locally
```

The `dist/` folder is a static site — you can host it on any static host
(SharePoint embed, Netlify, an internal web server, etc.) once built.

## Admin tool

Go to **Admin** in the top navigation (or `/#/admin/login`).

- **Demo password:** `academy-admin`
- Change this in `src/context/DataContext.jsx` (`ADMIN_PASSWORD`) before
  sharing this app with anyone else — it is a client-side demo credential,
  not real authentication.

From the admin panel you can:

- Edit the home page hero text, quick links, and news feed
- Create, edit, and delete courses — objectives, modules, and materials,
  including file attachments
- Create, edit, and delete learning paths and their course sequence
- Manage the resource library, including file attachments
- Manage events and sessions
- Review and edit learner progress / completion records
- Reset all content back to the guide's original defaults

## How content is stored

This is a front-end-only app: all content lives in the browser's
`localStorage`, seeded from `src/data/seed.js` (content extracted from the
original guide) on first load. Every admin edit is saved automatically —
there's no backend or database. That means:

- Content is **per-browser**. Edits made on one device/browser won't appear
  on another unless you wire up a real backend.
- Attached files are stored as base64 data URLs, capped at 4MB per file to
  stay within typical `localStorage` limits.
- To connect this to a real backend (SharePoint lists, an API, a database),
  replace the logic in `src/context/DataContext.jsx` — the rest of the app
  only talks to `useAcademy()`, so the UI won't need to change.

## Project structure

```
src/
  components/     Reusable UI: Button, Spinner, FileUpload, Navbar, Footer
  context/        DataContext — global state, persistence, admin auth
  data/           seed.js — starting content extracted from the guide
  hooks/          useLoading — simulated loading states
  pages/          Public pages: Home, Catalog, CourseDetail, Paths,
                  Resources, Events, Progress, AdminLogin
  pages/admin/    Admin tool: layout + CRUD pages per content type
  styles/         Shared UI patterns (cards, forms, grids)
```

## Design

Clean white theme with a deep teal accent, Space Grotesk for headings,
Inter for body text, and IBM Plex Mono for labels/metadata. Buttons and
loading states use CSS transitions and keyframe animations (hover lift,
press feedback, skeleton loaders, staggered fade-ins). Reduced-motion is
respected for accessibility.
