import api from './index';

export default {
  getGoals: (userId) => api.get(`/goals?userId=${userId}`),
  addGoal: (data) => api.post('/goals', data),
  updateGoal: (id, data) => api.put(`/goals/${id}`, data),
  deleteGoal: (id) => api.delete(`/goals/${id}`),
};
