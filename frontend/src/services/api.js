import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
});

api.interceptors.request.use((config) => {
  const stored = localStorage.getItem('project_workspace_auth');
  if (stored) {
    const { token } = JSON.parse(stored);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('project_workspace_auth');
    }
    return Promise.reject(error);
  },
);

export default api;
