import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { seedData } from '../data/seed.js';

const STORAGE_KEY = 'ita-sharepoint-data-v2';
const AUTH_KEY = 'ita-sharepoint-admin-auth';
const ADMIN_PASSWORD = 'academy-admin';
const GH_TOKEN_KEY = 'ita-github-pat';

// GitHub repo coordinates — change these if you fork the repo
const GH_OWNER = 'almadrigoLorence';
const GH_REPO = 'IT-sharepoint-page';
const GH_BRANCH = 'main';
const GH_DATA_PATH = 'db/data.json';

const RAW_URL = `https://raw.githubusercontent.com/${GH_OWNER}/${GH_REPO}/${GH_BRANCH}/${GH_DATA_PATH}`;
const API_URL = `https://api.github.com/repos/${GH_OWNER}/${GH_REPO}/contents/${GH_DATA_PATH}`;

const DataContext = createContext(null);

function loadInitialLocal() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Could not read saved academy data from localStorage', e);
  }
  return seedData;
}

const uid = (prefix) => `${prefix}-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

export function DataProvider({ children }) {
  const [data, setData] = useState(loadInitialLocal);
  const [isAdmin, setIsAdmin] = useState(() => sessionStorage.getItem(AUTH_KEY) === '1');
  const [saving, setSaving] = useState(false);
  const [isDbConnected, setIsDbConnected] = useState(false);
  const [githubToken, setGithubTokenState] = useState(() => localStorage.getItem(GH_TOKEN_KEY) || '');
  const fileShaRef = useRef(null);
  const commitTimerRef = useRef(null);

  // Persist GitHub token to localStorage
  const setGithubToken = useCallback((token) => {
    const trimmed = (token || '').trim();
    setGithubTokenState(trimmed);
    if (trimmed) {
      localStorage.setItem(GH_TOKEN_KEY, trimmed);
    } else {
      localStorage.removeItem(GH_TOKEN_KEY);
    }
  }, []);

  // Fetch the latest data.json from GitHub (public read — no auth needed)
  useEffect(() => {
    async function fetchFromGitHub() {
      try {
        // Use the API endpoint to also get the SHA (needed for commits)
        const res = await fetch(RAW_URL, { cache: 'no-store' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const remoteData = await res.json();
        setData(remoteData);
        setIsDbConnected(true);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(remoteData));
        console.log('⚡ Loaded data from GitHub repo');

        // Also get the SHA for future commits
        if (githubToken) {
          try {
            const metaRes = await fetch(API_URL, {
              headers: { Authorization: `token ${githubToken}` },
            });
            if (metaRes.ok) {
              const meta = await metaRes.json();
              fileShaRef.current = meta.sha;
            }
          } catch (e) {
            // SHA fetch failed — will retry on first commit
          }
        }
      } catch (err) {
        console.warn('Could not fetch from GitHub, using localStorage fallback:', err.message);
        setIsDbConnected(false);
      }
    }
    fetchFromGitHub();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Commit data.json to GitHub via the Contents API (debounced)
  const commitToGitHub = useCallback(async (newData) => {
    const token = localStorage.getItem(GH_TOKEN_KEY);
    if (!token) {
      console.warn('No GitHub token — skipping cloud sync');
      return false;
    }

    try {
      // Get current SHA if we don't have it
      if (!fileShaRef.current) {
        const metaRes = await fetch(API_URL, {
          headers: { Authorization: `token ${token}` },
        });
        if (metaRes.ok) {
          const meta = await metaRes.json();
          fileShaRef.current = meta.sha;
        } else {
          console.error('Failed to get file SHA from GitHub');
          return false;
        }
      }

      const content = btoa(unescape(encodeURIComponent(JSON.stringify(newData, null, 2))));

      const res = await fetch(API_URL, {
        method: 'PUT',
        headers: {
          Authorization: `token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `Update site data — ${new Date().toISOString()}`,
          content,
          sha: fileShaRef.current,
          branch: GH_BRANCH,
        }),
      });

      if (res.ok) {
        const result = await res.json();
        fileShaRef.current = result.content.sha;
        setIsDbConnected(true);
        console.log('✅ Data committed to GitHub');
        return true;
      } else {
        const err = await res.json();
        console.error('❌ GitHub commit failed:', err.message);
        // If SHA conflict, refetch it
        if (res.status === 409 || (err.message && err.message.includes('sha'))) {
          fileShaRef.current = null;
        }
        return false;
      }
    } catch (err) {
      console.error('❌ GitHub commit error:', err);
      return false;
    }
  }, []);

  // Save to localStorage immediately + debounced GitHub commit
  useEffect(() => {
    setSaving(true);

    // Save to localStorage right away (instant)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Could not save changes locally', e);
    }

    // Debounce GitHub commits (wait 2s after last change)
    if (commitTimerRef.current) clearTimeout(commitTimerRef.current);
    commitTimerRef.current = setTimeout(async () => {
      await commitToGitHub(data);
      setSaving(false);
    }, 2000);

    return () => {
      if (commitTimerRef.current) clearTimeout(commitTimerRef.current);
    };
  }, [data, commitToGitHub]);

  const login = useCallback((password) => {
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem(AUTH_KEY, '1');
      setIsAdmin(true);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(AUTH_KEY);
    setIsAdmin(false);
  }, []);

  const updateSite = useCallback((patch) => {
    setData((d) => ({ ...d, site: { ...d.site, ...patch } }));
  }, []);

  const addItem = useCallback((collection, item, prefix) => {
    const withId = { id: item.id || uid(prefix || collection), ...item };
    setData((d) => ({
      ...d,
      [collection]: [...(d[collection] || []), withId],
    }));
    return withId.id;
  }, []);

  const updateItem = useCallback((collection, id, patch) => {
    setData((d) => ({
      ...d,
      [collection]: (d[collection] || []).map((it) => (it.id === id ? { ...it, ...patch } : it)),
    }));
  }, []);

  const removeItem = useCallback((collection, id) => {
    setData((d) => ({
      ...d,
      [collection]: (d[collection] || []).filter((it) => it.id !== id),
    }));
  }, []);

  const reorderCollection = useCallback((collection, items) => {
    setData((d) => ({ ...d, [collection]: items }));
  }, []);

  const updateProgress = useCallback((patch) => {
    setData((d) => ({ ...d, progress: { ...d.progress, ...patch } }));
  }, []);

  const resetToDefaults = useCallback(() => {
    setData(seedData);
  }, []);

  // Apply Theme CSS variables dynamically to document element
  useEffect(() => {
    if (!data?.theme) return;
    const root = document.documentElement;
    if (data.theme.primaryColor) root.style.setProperty('--brand', data.theme.primaryColor);
    if (data.theme.secondaryColor) root.style.setProperty('--brand-secondary', data.theme.secondaryColor);
    if (data.theme.bgColor) root.style.setProperty('--bg-dark', data.theme.bgColor);
    if (data.theme.cardBg) root.style.setProperty('--bg-card', data.theme.cardBg);
    if (data.theme.textColor) root.style.setProperty('--text-main', data.theme.textColor);
  }, [data?.theme]);

  const updateTheme = useCallback((patch) => {
    setData((d) => ({ ...d, theme: { ...(d.theme || seedData.theme), ...patch } }));
  }, []);

  const updateLayout = useCallback((layoutArray) => {
    setData((d) => ({ ...d, theme: { ...(d.theme || seedData.theme), layout: layoutArray } }));
  }, []);

  const updateTeamSettings = useCallback((patch) => {
    setData((d) => ({ ...d, team: { ...(d.team || seedData.team), ...patch } }));
  }, []);

  const addTeamMember = useCallback((member) => {
    const withId = { id: member.id || uid('tm'), ...member };
    setData((d) => ({
      ...d,
      team: { ...d.team, members: [...(d.team?.members || []), withId] },
    }));
  }, []);

  const updateTeamMember = useCallback((id, patch) => {
    setData((d) => ({
      ...d,
      team: {
        ...d.team,
        members: (d.team?.members || []).map((m) => (m.id === id ? { ...m, ...patch } : m)),
      },
    }));
  }, []);

  const removeTeamMember = useCallback((id) => {
    setData((d) => ({
      ...d,
      team: {
        ...d.team,
        members: (d.team?.members || []).filter((m) => m.id !== id),
      },
    }));
  }, []);

  const addCustomContainer = useCallback((container) => {
    const withId = { id: container.id || uid('cc'), ...container };
    setData((d) => ({
      ...d,
      customContainers: [...(d.customContainers || []), withId],
    }));
  }, []);

  const updateCustomContainer = useCallback((id, patch) => {
    setData((d) => ({
      ...d,
      customContainers: (d.customContainers || []).map((c) => (c.id === id ? { ...c, ...patch } : c)),
    }));
  }, []);

  const removeCustomContainer = useCallback((id) => {
    setData((d) => ({
      ...d,
      customContainers: (d.customContainers || []).filter((c) => c.id !== id),
    }));
  }, []);

  const value = {
    data,
    isAdmin,
    saving,
    isDbConnected,
    githubToken,
    setGithubToken,
    login,
    logout,
    updateSite,
    addItem,
    updateItem,
    removeItem,
    reorderCollection,
    updateProgress,
    resetToDefaults,
    updateTheme,
    updateLayout,
    updateTeamSettings,
    addTeamMember,
    updateTeamMember,
    removeTeamMember,
    addCustomContainer,
    updateCustomContainer,
    removeCustomContainer,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useAcademy() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useAcademy must be used inside a DataProvider');
  return ctx;
}
