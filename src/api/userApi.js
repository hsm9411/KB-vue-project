import api from './index';

export default {
  login: (email, password) => api.get(`/users?email=${email}&password=${password}`),
  register: (data) => api.post('/users', data),
  getUser: (id) => api.get(`/users/${id}`),
  updateUser: (id, data) => api.put(`/users/${id}`, data),
  deleteUser: (id) => api.delete(`/users/${id}`),
};
