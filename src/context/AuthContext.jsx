import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../utils/api.js';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('wh_auth_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('wh_auth_token') || null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('wh_auth_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('wh_auth_user');
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('wh_auth_token', token);
    } else {
      localStorage.removeItem('wh_auth_token');
    }
  }, [token]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await api.login(email, password);
      if (res.success && res.data) {
        setUser(res.data.user);
        setToken(res.data.token);
        return res.data;
      }
      throw new Error(res.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const res = await api.register(userData);
      if (res.success && res.data) {
        setUser(res.data.user);
        setToken(res.data.token);
        return res.data;
      }
      throw new Error(res.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('wh_auth_user');
    localStorage.removeItem('wh_auth_token');
  };

  const updateProfile = async (updates) => {
    if (!user) return;
    const res = await api.updateProfile({ id: user.id, ...updates });
    if (res.success && res.data) {
      setUser(res.data);
      return res.data;
    }
  };

  // Quick Demo Login for Aptech Evaluators
  const quickLogin = async (role) => {
    if (role === 'admin') {
      return await login('admin@timuse.luxury', 'TimuseAdmin2026!');
    } else {
      return await login('client@timuse.luxury', 'client123');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        login,
        register,
        logout,
        updateProfile,
        quickLogin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
