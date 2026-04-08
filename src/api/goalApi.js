import api from './index';

export default {
  getGoals: (userId) => api.get(`/goals?userId=${userId}`),
};
