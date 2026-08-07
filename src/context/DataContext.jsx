import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { seedData } from '../data/seed.js';

const STORAGE_KEY = 'ita-sharepoint-data-v2';
const AUTH_KEY = 'ita-sharepoint-admin-auth';
const ADMIN_PASSWORD = 'academy-admin';
const API_URL = 'http://localhost:5000/api';

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

  // Helper function to sync with MySQL API
  const syncApi = useCallback(async (endpoint, method, payload) => {
    try {
      const res = await fetch(`${API_URL}${endpoint}`, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: payload ? JSON.stringify(payload) : undefined,
      });
      if (res.ok) {
        setIsDbConnected(true);
        console.log(`⚡ MySQL API sync success: ${method} ${endpoint}`);
        return true;
      }
    } catch (err) {
      console.warn(`MySQL API sync failed (${method} ${endpoint}):`, err.message);
      setIsDbConnected(false);
    }
    return false;
  }, []);

  // Attempt to fetch data from Express/MySQL API server on load and poll health
  useEffect(() => {
    async function fetchFromApi() {
      try {
        const res = await fetch(`${API_URL}/data`);
        if (res.ok) {
          const apiData = await res.json();
          setData(apiData);
          setIsDbConnected(true);
          console.log('⚡ Connected to SharePoint Academy MySQL API server');
        }
      } catch (err) {
        console.warn('MySQL API server offline or blocked. Using local browser state.', err.message);
        setIsDbConnected(false);
      }
    }
    fetchFromApi();
  }, []);

  // Save to localStorage as fallback whenever data changes
  useEffect(() => {
    setSaving(true);
    const t = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch (e) {
        console.error('Could not save changes locally', e);
      }
      setSaving(false);
    }, 300);
    return () => clearTimeout(t);
  }, [data]);

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
    setData((d) => {
      const nextSite = { ...d.site, ...patch };
      syncApi('/site', 'POST', nextSite);
      return { ...d, site: nextSite };
    });
  }, [syncApi]);

  const addItem = useCallback((collection, item, prefix) => {
    const withId = { id: item.id || uid(prefix || collection), ...item };
    setData((d) => {
      const updatedList = [...(d[collection] || []), withId];
      if (['courses', 'paths', 'resources', 'events', 'news'].includes(collection)) {
        syncApi(`/${collection}`, 'POST', withId);
      }
      return { ...d, [collection]: updatedList };
    });
    return withId.id;
  }, [syncApi]);

  const updateItem = useCallback((collection, id, patch) => {
    setData((d) => {
      const updatedList = (d[collection] || []).map((it) => (it.id === id ? { ...it, ...patch } : it));
      const targetItem = updatedList.find((it) => it.id === id);
      if (targetItem && ['courses', 'paths', 'resources', 'events', 'news'].includes(collection)) {
        syncApi(`/${collection}`, 'POST', targetItem);
      }
      return { ...d, [collection]: updatedList };
    });
  }, [syncApi]);

  const removeItem = useCallback((collection, id) => {
    setData((d) => {
      if (['courses', 'paths', 'resources', 'events', 'news'].includes(collection)) {
        syncApi(`/${collection}/${id}`, 'DELETE');
      }
      return {
        ...d,
        [collection]: (d[collection] || []).filter((it) => it.id !== id),
      };
    });
  }, [syncApi]);

  const reorderCollection = useCallback((collection, items) => {
    setData((d) => ({ ...d, [collection]: items }));
  }, []);

  const updateProgress = useCallback((patch) => {
    setData((d) => {
      const nextProgress = { ...d.progress, ...patch };
      syncApi('/progress', 'POST', nextProgress);
      return { ...d, progress: nextProgress };
    });
  }, [syncApi]);

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
    setData((d) => {
      const nextTheme = { ...(d.theme || seedData.theme), ...patch };
      syncApi('/theme', 'POST', nextTheme);
      return { ...d, theme: nextTheme };
    });
  }, [syncApi]);

  const updateLayout = useCallback((layoutArray) => {
    setData((d) => {
      const nextTheme = { ...(d.theme || seedData.theme), layout: layoutArray };
      syncApi('/layout', 'POST', { layout: layoutArray });
      return { ...d, theme: nextTheme };
    });
  }, [syncApi]);

  const updateTeamSettings = useCallback((patch) => {
    setData((d) => {
      const nextTeam = { ...(d.team || seedData.team), ...patch };
      syncApi('/team', 'POST', nextTeam);
      return { ...d, team: nextTeam };
    });
  }, [syncApi]);

  const addTeamMember = useCallback((member) => {
    const withId = { id: member.id || uid('tm'), ...member };
    setData((d) => {
      const currentMembers = d.team?.members || [];
      const updatedMembers = [...currentMembers, withId];
      syncApi('/team/members', 'POST', withId);
      return { ...d, team: { ...d.team, members: updatedMembers } };
    });
  }, [syncApi]);

  const updateTeamMember = useCallback((id, patch) => {
    setData((d) => {
      const currentMembers = d.team?.members || [];
      const updatedMembers = currentMembers.map((m) => (m.id === id ? { ...m, ...patch } : m));
      const target = updatedMembers.find((m) => m.id === id);
      if (target) {
        syncApi('/team/members', 'POST', target);
      }
      return { ...d, team: { ...d.team, members: updatedMembers } };
    });
  }, [syncApi]);

  const removeTeamMember = useCallback((id) => {
    setData((d) => {
      const currentMembers = d.team?.members || [];
      const updatedMembers = currentMembers.filter((m) => m.id !== id);
      syncApi(`/team/members/${id}`, 'DELETE');
      return { ...d, team: { ...d.team, members: updatedMembers } };
    });
  }, [syncApi]);

  const addCustomContainer = useCallback((container) => {
    const withId = { id: container.id || uid('cc'), ...container };
    setData((d) => {
      const updated = [...(d.customContainers || []), withId];
      syncApi('/containers', 'POST', withId);
      return { ...d, customContainers: updated };
    });
  }, [syncApi]);

  const updateCustomContainer = useCallback((id, patch) => {
    setData((d) => {
      const updated = (d.customContainers || []).map((c) => (c.id === id ? { ...c, ...patch } : c));
      const target = updated.find((c) => c.id === id);
      if (target) {
        syncApi('/containers', 'POST', target);
      }
      return { ...d, customContainers: updated };
    });
  }, [syncApi]);

  const removeCustomContainer = useCallback((id) => {
    setData((d) => {
      const updated = (d.customContainers || []).filter((c) => c.id !== id);
      syncApi(`/containers/${id}`, 'DELETE');
      return { ...d, customContainers: updated };
    });
  }, [syncApi]);

  const value = {
    data,
    isAdmin,
    saving,
    isDbConnected,
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

