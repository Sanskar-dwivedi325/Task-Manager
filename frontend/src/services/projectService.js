import api from './api';

export const projectService = {
  list: () => api.get('/projects').then((response) => response.data),
  get: (id) => api.get(`/projects/${id}`).then((response) => response.data),
  create: (payload) => api.post('/projects', payload).then((response) => response.data),
  update: (id, payload) => api.put(`/projects/${id}`, payload).then((response) => response.data),
  remove: (id) => api.delete(`/projects/${id}`),
};
