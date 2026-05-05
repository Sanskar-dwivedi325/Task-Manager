import api from './api';

export const dashboardService = {
  get: () => api.get('/dashboard').then((response) => response.data),
};
