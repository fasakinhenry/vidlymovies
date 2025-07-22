import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const instance = axios.create({
  baseURL: API_URL,
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  console.log('Sending request to:', config.url, 'with token:', token); // Debug
  if (token) {
    config.headers['x-auth-token'] = token;
  }
  return config;
});

export const getMovies = () =>
  instance.get('/api/movies').then((response) => ({
    ...response,
    data: Array.isArray(response.data)
      ? response.data
      : response.data.movies || [],
  }));
export const createMovie = (data) => instance.post('/api/movies', data);
export const updateMovie = (id, data) =>
  instance.put(`/api/movies/${id}`, data);
export const deleteMovie = (id) => instance.delete(`/api/movies/${id}`);
