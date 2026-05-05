import api from './api';

export const userService = {
  members: () => api.get('/users/members').then((response) => response.data),
};
