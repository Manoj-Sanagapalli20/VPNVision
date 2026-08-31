import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load active session from sessionStorage
  useEffect(() => {
    try {
      const storedToken = sessionStorage.getItem('vpn_vision_token');
      const storedUser = sessionStorage.getItem('vpn_vision_user');
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (err) {
      console.error('Failed to parse stored session:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await authService.login(email, password);
    if (res.user) {
      setUser(res.user);
      setToken(res.user.token);
      sessionStorage.setItem('vpn_vision_token', res.user.token);
      sessionStorage.setItem('vpn_vision_user', JSON.stringify(res.user));
    }
    return res;
  };

  const register = async (email, password, name, org) => {
    const res = await authService.register(email, password, name, org);
    if (res.user) {
      setUser(res.user);
      setToken(res.user.token);
      sessionStorage.setItem('vpn_vision_token', res.user.token);
      sessionStorage.setItem('vpn_vision_user', JSON.stringify(res.user));
    }
    return res;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    sessionStorage.removeItem('vpn_vision_token');
    sessionStorage.removeItem('vpn_vision_user');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
