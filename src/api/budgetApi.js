import api from './index';

export default {
  // Get all budget entries
  getBudgets() {
    return api.get('/budget');
  },
  // Get a single budget entry by ID
  getBudget(id) {
    return api.get(`/budget/${id}`);
  },
  // Create a new budget entry
  addBudget(data) {
    return api.post('/budget', data);
  },
  // Update an existing budget entry
  updateBudget(id, data) {
    return api.put(`/budget/${id}`, data);
  },
  // Delete a budget entry
  deleteBudget(id) {
    return api.delete(`/budget/${id}`);
  },
  // Get income categories
  getIncomeCategories() {
    return api.get('/incomeCategory');
  },
  // Get expense categories
  getExpenseCategories() {
    return api.get('/expenseCategory');
  }
};
