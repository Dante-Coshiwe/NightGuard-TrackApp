import React, { createContext, useState, useContext, useEffect } from 'react';
import { login as apiLogin, logout as apiLogout, getCurrentUser } from '../services/api';
import api from '../services/api';

const AuthContext = createContext();
const CACHED_USER_KEY = "cached_user";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Optional: implement if needed
  const scheduleTokenRefresh = () => {
    // You can decode JWT and refresh before expiry if needed
  };

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      getCurrentUser()
        .then(response => {
          setUser(response.data);
        })
        .catch((error) => {
          console.error('Failed to fetch current user:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('refresh_token');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  // ✅ REGULAR LOGIN
  const login = async (email, password) => {
    const response = await apiLogin({ email, password });

    const { token, refresh_token, user: userData } = response.data;

    localStorage.setItem('token', token);
    if (refresh_token) localStorage.setItem('refresh_token', refresh_token);

    setUser(userData);
    scheduleTokenRefresh();

    return userData;
  };

  // ✅ GUARD LOGIN
  const guardLogin = async (guardId, pin) => {
    const response = await api.post("/auth/guard-login", {
      guard_id: guardId,
      pin
    });

    const { token, refresh_token, user: userData } = response.data;

    localStorage.setItem("token", token);
    if (refresh_token) localStorage.setItem("refresh_token", refresh_token);

    localStorage.setItem(CACHED_USER_KEY, JSON.stringify(userData));

    setUser(userData);
    scheduleTokenRefresh();

    return userData;
  };

  // ✅ LOGOUT
  const logout = async () => {
    await apiLogout();

    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem(CACHED_USER_KEY);

    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, guardLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);