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

// Response interceptor to handle token expiration
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const register = (data) => instance.post('/api/users', data);
export const login = (data) => instance.post('/api/auth/', data);
export const logout = () => {
  localStorage.removeItem('token');
  return Promise.resolve();
};
export const getCurrentUser = () => instance.get('/api/users/me');
