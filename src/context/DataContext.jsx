import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { seedData } from '../data/seed.js';

const STORAGE_KEY = 'aseph-academy-data-v1';
const AUTH_KEY = 'aseph-academy-admin-auth';
const ADMIN_PASSWORD = 'academy-admin'; // demo-only credential, change for production use

const DataContext = createContext(null);

function loadInitial() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Could not read saved academy data, starting from the guide defaults.', e);
  }
  return seedData;
}

const uid = (prefix) => `${prefix}-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

export function DataProvider({ children }) {
  const [data, setData] = useState(loadInitial);
  const [isAdmin, setIsAdmin] = useState(() => sessionStorage.getItem(AUTH_KEY) === '1');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setSaving(true);
    const t = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch (e) {
        console.error('Could not save changes locally — your browser storage may be full.', e);
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
    setData((d) => ({ ...d, site: { ...d.site, ...patch } }));
  }, []);

  // Generic collection helpers, used for courses / paths / resources / events / news / quickLinks
  const addItem = useCallback((collection, item, prefix) => {
    const withId = { id: item.id || uid(prefix || collection), ...item };
    setData((d) => ({ ...d, [collection]: [...d[collection], withId] }));
    return withId.id;
  }, []);

  const updateItem = useCallback((collection, id, patch) => {
    setData((d) => ({
      ...d,
      [collection]: d[collection].map((it) => (it.id === id ? { ...it, ...patch } : it)),
    }));
  }, []);

  const removeItem = useCallback((collection, id) => {
    setData((d) => ({
      ...d,
      [collection]: d[collection].filter((it) => it.id !== id),
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

  const value = {
    data,
    isAdmin,
    saving,
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
