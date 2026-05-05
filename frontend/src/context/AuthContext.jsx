import { createContext, useContext, useMemo, useState } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);
const STORAGE_KEY = 'project_workspace_auth';

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  });

  async function login(payload) {
    const auth = await authService.login(payload);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(auth));
    setSession(auth);
    return auth;
  }

  async function signup(payload) {
    const auth = await authService.signup(payload);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(auth));
    setSession(auth);
    return auth;
  }

  function logout() {
    localStorage.removeItem(STORAGE_KEY);
    setSession(null);
  }

  const value = useMemo(() => ({
    user: session,
    token: session?.token,
    isAdmin: session?.role === 'ADMIN',
    login,
    signup,
    logout,
  }), [session]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
}
