import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const instance = axios.create({
  baseURL: API_URL,
});

// Add JWT token to requests if available
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['x-auth-token'] = token; // Use x-auth-token instead of Authorization
  }
  return config;
});

export const register = (data) => instance.post('/api/users', data);
export const login = (data) => instance.post('/api/auth/', data);
export const logout = () => instance.post('/api/auth/logout');
export const getCurrentUser = () => instance.get('/api/users/me');
