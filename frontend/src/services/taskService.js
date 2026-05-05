import api from './api';

export const taskService = {
  list: () => api.get('/tasks').then((response) => response.data),
  create: (payload) => api.post('/tasks', payload).then((response) => response.data),
  update: (id, payload) => api.put(`/tasks/${id}`, payload).then((response) => response.data),
  remove: (id) => api.delete(`/tasks/${id}`),
};
