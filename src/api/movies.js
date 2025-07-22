import axios from 'axios';

const API_URL = import.meta.env.REACT_APP_API_URL;

const instance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Add JWT token to requests
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getMovies = () => instance.get('/api/movies');
export const createMovie = (data) => instance.post('/api/movies', data);
export const updateMovie = (id, data) =>
  instance.put(`/api/movies/${id}`, data);
export const deleteMovie = (id) => instance.delete(`/api/movies/${id}`);
