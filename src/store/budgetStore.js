import { defineStore } from 'pinia';
import budgetApi from '../api/budgetApi';

export const useBudgetStore = defineStore('budget', {
  state: () => ({
    budgets: [],
    incomeCategories: [],
    expenseCategories: [],
    loading: false,
    error: null,
  }),
  getters: {
    totalIncome: (state) =>
      state.budgets
        .filter((item) => item.type === 'income')
        .reduce((sum, item) => sum + Number(item.amount), 0),
    totalExpense: (state) =>
      state.budgets
        .filter((item) => item.type === 'expense')
        .reduce((sum, item) => sum + Number(item.amount), 0),
    netIncome() {
      return this.totalIncome - this.totalExpense;
    },
    sortedBudgets: (state) => {
      return [...state.budgets].sort((a, b) => new Date(b.date) - new Date(a.date));
    },
    recentBudgets() {
      return this.sortedBudgets.slice(0, 5);
    },
  },
  actions: {
    async fetchBudgets() {
      this.loading = true;
      try {
        const response = await budgetApi.getBudgets();
        this.budgets = response.data;
      } catch (err) {
        this.error = '거래 내역을 불러오는 중 오류가 발생했습니다.';
        console.error(err);
      } finally {
        this.loading = false;
      }
    },
    async fetchCategories() {
      try {
        const [incomeRes, expenseRes] = await Promise.all([
          budgetApi.getIncomeCategories(),
          budgetApi.getExpenseCategories(),
        ]);
        this.incomeCategories = incomeRes.data;
        this.expenseCategories = expenseRes.data;
      } catch (err) {
        console.error('카테고리를 불러오는 중 오류가 발생했습니다.', err);
      }
    },
    async addBudget(budget) {
      this.loading = true;
      try {
        await budgetApi.addBudget(budget);
        await this.fetchBudgets();
      } catch (err) {
        this.error = '거래 추가 중 오류가 발생했습니다.';
        throw err;
      } finally {
        this.loading = false;
      }
    },
    async updateBudget(id, budget) {
      this.loading = true;
      try {
        await budgetApi.updateBudget(id, budget);
        await this.fetchBudgets();
      } catch (err) {
        this.error = '거래 수정 중 오류가 발생했습니다.';
        throw err;
      } finally {
        this.loading = false;
      }
    },
    async deleteBudget(id) {
      this.loading = true;
      try {
        await budgetApi.deleteBudget(id);
        await this.fetchBudgets();
      } catch (err) {
        this.error = '거래 삭제 중 오류가 발생했습니다.';
        throw err;
      } finally {
        this.loading = false;
      }
    },
  },
});
