import axios from 'axios';

const API_URL = import.meta.env.REACT_APP_API_URL;

const instance = axios.create({
  baseURL: API_URL,
  withCredentials: true, // For session-based auth
});

// Add JWT token to requests if available
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const register = (data) => instance.post('/api/auth/register', data);
export const login = (data) => instance.post('/api/auth/login', data);
export const logout = () => instance.post('/api/auth/logout');
export const getCurrentUser = () => instance.get('/api/auth/me');
