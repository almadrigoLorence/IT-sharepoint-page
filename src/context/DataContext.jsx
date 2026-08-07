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

  // Attempt to fetch data from Express/MySQL API server on load
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
        console.warn('MySQL API server offline. Using local browser state.', err);
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
      if (isDbConnected) {
        fetch(`${API_URL}/site`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(nextSite),
        }).catch((err) => console.error('API sync error (site):', err));
      }
      return { ...d, site: nextSite };
    });
  }, [isDbConnected]);

  const addItem = useCallback((collection, item, prefix) => {
    const withId = { id: item.id || uid(prefix || collection), ...item };
    setData((d) => {
      const updatedList = [...(d[collection] || []), withId];
      if (isDbConnected && ['courses', 'paths', 'resources', 'events', 'news'].includes(collection)) {
        fetch(`${API_URL}/${collection}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(withId),
        }).catch((err) => console.error(`API sync error (add ${collection}):`, err));
      }
      return { ...d, [collection]: updatedList };
    });
    return withId.id;
  }, [isDbConnected]);

  const updateItem = useCallback((collection, id, patch) => {
    setData((d) => {
      const updatedList = (d[collection] || []).map((it) => (it.id === id ? { ...it, ...patch } : it));
      const targetItem = updatedList.find((it) => it.id === id);
      if (isDbConnected && targetItem && ['courses', 'paths', 'resources', 'events', 'news'].includes(collection)) {
        fetch(`${API_URL}/${collection}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(targetItem),
        }).catch((err) => console.error(`API sync error (update ${collection}):`, err));
      }
      return { ...d, [collection]: updatedList };
    });
  }, [isDbConnected]);

  const removeItem = useCallback((collection, id) => {
    setData((d) => {
      if (isDbConnected && ['courses', 'paths', 'resources', 'events', 'news'].includes(collection)) {
        fetch(`${API_URL}/${collection}/${id}`, {
          method: 'DELETE',
        }).catch((err) => console.error(`API sync error (delete ${collection}):`, err));
      }
      return {
        ...d,
        [collection]: (d[collection] || []).filter((it) => it.id !== id),
      };
    });
  }, [isDbConnected]);

  const reorderCollection = useCallback((collection, items) => {
    setData((d) => ({ ...d, [collection]: items }));
  }, []);

  const updateProgress = useCallback((patch) => {
    setData((d) => {
      const nextProgress = { ...d.progress, ...patch };
      if (isDbConnected) {
        fetch(`${API_URL}/progress`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(nextProgress),
        }).catch((err) => console.error('API sync error (progress):', err));
      }
      return { ...d, progress: nextProgress };
    });
  }, [isDbConnected]);

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
      if (isDbConnected) {
        fetch(`${API_URL}/theme`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(nextTheme),
        }).catch((err) => console.error('API sync error (theme):', err));
      }
      return { ...d, theme: nextTheme };
    });
  }, [isDbConnected]);

  const updateLayout = useCallback((layoutArray) => {
    setData((d) => {
      const nextTheme = { ...(d.theme || seedData.theme), layout: layoutArray };
      if (isDbConnected) {
        fetch(`${API_URL}/layout`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ layout: layoutArray }),
        }).catch((err) => console.error('API sync error (layout):', err));
      }
      return { ...d, theme: nextTheme };
    });
  }, [isDbConnected]);

  const updateTeamSettings = useCallback((patch) => {
    setData((d) => {
      const nextTeam = { ...(d.team || seedData.team), ...patch };
      if (isDbConnected) {
        fetch(`${API_URL}/team`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(nextTeam),
        }).catch((err) => console.error('API sync error (team):', err));
      }
      return { ...d, team: nextTeam };
    });
  }, [isDbConnected]);

  const addTeamMember = useCallback((member) => {
    const withId = { id: member.id || uid('tm'), ...member };
    setData((d) => {
      const currentMembers = d.team?.members || [];
      const updatedMembers = [...currentMembers, withId];
      if (isDbConnected) {
        fetch(`${API_URL}/team/members`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(withId),
        }).catch((err) => console.error('API sync error (add team member):', err));
      }
      return { ...d, team: { ...d.team, members: updatedMembers } };
    });
  }, [isDbConnected]);

  const updateTeamMember = useCallback((id, patch) => {
    setData((d) => {
      const currentMembers = d.team?.members || [];
      const updatedMembers = currentMembers.map((m) => (m.id === id ? { ...m, ...patch } : m));
      const target = updatedMembers.find((m) => m.id === id);
      if (isDbConnected && target) {
        fetch(`${API_URL}/team/members`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(target),
        }).catch((err) => console.error('API sync error (update team member):', err));
      }
      return { ...d, team: { ...d.team, members: updatedMembers } };
    });
  }, [isDbConnected]);

  const removeTeamMember = useCallback((id) => {
    setData((d) => {
      const currentMembers = d.team?.members || [];
      const updatedMembers = currentMembers.filter((m) => m.id !== id);
      if (isDbConnected) {
        fetch(`${API_URL}/team/members/${id}`, {
          method: 'DELETE',
        }).catch((err) => console.error('API sync error (delete team member):', err));
      }
      return { ...d, team: { ...d.team, members: updatedMembers } };
    });
  }, [isDbConnected]);

  const addCustomContainer = useCallback((container) => {
    const withId = { id: container.id || uid('cc'), ...container };
    setData((d) => {
      const updated = [...(d.customContainers || []), withId];
      if (isDbConnected) {
        fetch(`${API_URL}/containers`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(withId),
        }).catch((err) => console.error('API sync error (add container):', err));
      }
      return { ...d, customContainers: updated };
    });
  }, [isDbConnected]);

  const updateCustomContainer = useCallback((id, patch) => {
    setData((d) => {
      const updated = (d.customContainers || []).map((c) => (c.id === id ? { ...c, ...patch } : c));
      const target = updated.find((c) => c.id === id);
      if (isDbConnected && target) {
        fetch(`${API_URL}/containers`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(target),
        }).catch((err) => console.error('API sync error (update container):', err));
      }
      return { ...d, customContainers: updated };
    });
  }, [isDbConnected]);

  const removeCustomContainer = useCallback((id) => {
    setData((d) => {
      const updated = (d.customContainers || []).filter((c) => c.id !== id);
      if (isDbConnected) {
        fetch(`${API_URL}/containers/${id}`, {
          method: 'DELETE',
        }).catch((err) => console.error('API sync error (delete container):', err));
      }
      return { ...d, customContainers: updated };
    });
  }, [isDbConnected]);

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

