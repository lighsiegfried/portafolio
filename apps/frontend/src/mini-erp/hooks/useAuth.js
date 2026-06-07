import { useState, useEffect, useCallback } from 'react';
import { me as fetchMe } from '../../services/authApi';

const STORAGE_KEY = 'mini-erp-auth';

function loadAuth() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch { return null; }
}

function saveAuth(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function clearAuth() {
  localStorage.removeItem(STORAGE_KEY);
}

export function useAuth() {
  const [auth, setAuth] = useState(loadAuth);
  const [user, setUser] = useState(auth?.user || null);
  const [loading, setLoading] = useState(!auth);

  useEffect(() => {
    if (!auth) { setLoading(false); return; }
    fetchMe()
      .then((res) => {
        setUser(res.data);
        saveAuth({ ...auth, user: res.data });
      })
      .catch(() => {
        setAuth(null);
        setUser(null);
        clearAuth();
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (auth) {
      setUser(auth.user);
    }
  }, [auth]);

  const login = useCallback((token, userData) => {
    const data = { token, user: userData };
    saveAuth(data);
    setAuth(data);
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    clearAuth();
    setAuth(null);
    setUser(null);
  }, []);

  return { auth, user, loading, login, logout };
}
