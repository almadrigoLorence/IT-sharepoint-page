import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { seedData } from '../data/seed.js';

const STORAGE_KEY = 'aseph-academy-data-v1';
const AUTH_KEY = 'aseph-academy-admin-auth';
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
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useAcademy() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useAcademy must be used inside a DataProvider');
  return ctx;
}
