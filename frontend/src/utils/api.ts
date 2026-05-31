import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api';
const api = axios.create({ baseURL });

api.interceptors.request.use(config => {
  const token = localStorage.getItem('moneta_token');
  if (token && token !== 'demo-session') {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  res => res,
  err => Promise.reject(err)
);

export default api;
