import React, { createContext, useState, useEffect } from 'react';
import { authApi } from '../api/auth';
import { apiClient } from '../api/client';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // If we had a verify endpoint we'd call it here
          // For now, assume token is valid and user info will be loaded by UserContext
          setUser({ token });
        } catch (error) {
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    initAuth();

    const handleUnauthorized = () => {
      setUser(null);
    };
    window.addEventListener('unauthorized', handleUnauthorized);
    return () => window.removeEventListener('unauthorized', handleUnauthorized);
  }, []);

  const login = async (credentials) => {
    const data = await authApi.login(credentials);
    const token = data.accessToken || data.token;
    localStorage.setItem('token', token);
    setUser({ token, ...data.user });
    return data;
  };

  const register = async (userData) => {
    const data = await authApi.register(userData);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
