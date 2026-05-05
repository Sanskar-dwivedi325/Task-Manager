import api from './api';

export const authService = {
  login: (payload) => api.post('/auth/login', payload).then((response) => response.data),
  signup: (payload) => api.post('/auth/signup', payload).then((response) => response.data),
};
