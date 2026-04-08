import api from './index';

export default {
  getTransactions: (params) => api.get('/transactions', { params }),
  addTransaction: (data) => api.post('/transactions', data),
  updateTransaction: (id, data) => api.put(`/transactions/${id}`, data),
  deleteTransaction: (id) => api.delete(`/transactions/${id}`),
};
