import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '',
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('am_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Normalize errors
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status  = err.response?.status;
    const message = err.response?.data?.message || err.response?.data || err.message;
    if (status === 401) {
      localStorage.removeItem('am_token');
      window.location.href = '/login';
    }
    return Promise.reject(new Error(
      typeof message === 'string' ? message : `Request failed (${status})`
    ));
  }
);

export default api;