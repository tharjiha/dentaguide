import { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin, register as apiRegister, logout as apiLogout, getMe } from '../api/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]               = useState(null);
  const [accessToken, setAccessToken] = useState(() => localStorage.getItem('dg_token'));
  const [isLoggedIn, setIsLoggedIn]   = useState(false);
  const [loading, setLoading]         = useState(true);

  // On mount — verify any stored token
  useEffect(() => {
    const stored = localStorage.getItem('dg_token');
    if (!stored) {
      setLoading(false);
      return;
    }
    getMe(stored)
      .then(u => {
        setUser(u);
        setAccessToken(stored);
        setIsLoggedIn(true);
      })
      .catch(() => {
        localStorage.removeItem('dg_token');
        setAccessToken(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const _persist = (token, userData) => {
    localStorage.setItem('dg_token', token);
    setAccessToken(token);
    setUser(userData);
    setIsLoggedIn(true);
  };

  const register = async ({ firstName, lastName, email, password }) => {
    const res = await apiRegister({ firstName, lastName, email, password });
    if (!res.access_token) throw new Error('Registration succeeded but no token returned');
    _persist(res.access_token, res.user);
    return res;
  };

  const logIn = async ({ email, password }) => {
    const res = await apiLogin({ email, password });
    if (!res.access_token) throw new Error('Login succeeded but no token returned');
    _persist(res.access_token, res.user);
    return res;
  };

  const logOut = async () => {
    const token = localStorage.getItem('dg_token');
    if (token) {
      try { await apiLogout(token); } catch (_) {}
    }
    localStorage.removeItem('dg_token');
    setUser(null);
    setAccessToken(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, isLoggedIn, loading, register, logIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}