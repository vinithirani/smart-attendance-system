import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { useNotification } from './NotificationContext';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToast } = useNotification();

  useEffect(() => {
    // Load persisted login session
    const savedUser = localStorage.getItem('smart_att_user');
    const savedToken = localStorage.getItem('smart_att_token');
    if (savedUser && savedToken) {
      try {
        setUser(JSON.parse(savedUser));
        setToken(savedToken);
      } catch (e) {
        localStorage.removeItem('smart_att_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.login(email, password);
      setUser(res.user);
      setToken(res.access_token);
      localStorage.setItem('smart_att_user', JSON.stringify(res.user));
      localStorage.setItem('smart_att_token', res.access_token);
      addToast(`Welcome back, ${res.user.name}!`, 'success');
      return res.user;
    } catch (err) {
      addToast(err.message || 'Login failed', 'error');
      throw err;
    }
  };

  const switchDemoRole = async (roleType) => {
    let email = 'admin@smartattendance.edu';
    if (roleType === 'faculty_devanshi') email = 'devanshi@smartattendance.edu';
    else if (roleType === 'faculty_risha') email = 'risha@smartattendance.edu';
    else if (roleType === 'faculty_dhruv') email = 'dhruv@smartattendance.edu';
    else if (roleType === 'faculty_shyam') email = 'shyam@smartattendance.edu';

    return await login(email, 'password123');
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('smart_att_user');
    localStorage.removeItem('smart_att_token');
    addToast('Logged out successfully', 'info');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, switchDemoRole }}>
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
