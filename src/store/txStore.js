import { defineStore } from 'pinia';
import txApi from '../api/txApi';
import { startOfMonth, endOfMonth, format } from 'date-fns';

export const useTxStore = defineStore('tx', {
  state: () => ({
    transactions: [],
    loading: false,
  }),
  getters: {
    monthlyTransactions: (state) => {
      const start = format(startOfMonth(new Date()), 'yyyy-MM-dd');
      const end = format(endOfMonth(new Date()), 'yyyy-MM-dd');
      return state.transactions.filter(t => t.date >= start && t.date <= end);
    },
    totalIncome: (getters) => {
      return getters.monthlyTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
    },
    totalExpense: (getters) => {
      return getters.monthlyTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
    },
    netIncome: (getters) => getters.totalIncome - getters.totalExpense,
  },
  actions: {
    async fetchTransactions(userId) {
      this.loading = true;
      try {
        const response = await txApi.getTransactions({ userId });
        this.transactions = response.data;
      } finally {
        this.loading = false;
      }
    },
    async addTransaction(data) {
      // Dutch Pay Logic
      let finalData = { ...data };
      if (data.isDutchPay && data.dutchPayHeadcount > 1) {
        finalData.originalAmount = data.amount;
        finalData.amount = Math.floor(data.amount / data.dutchPayHeadcount);
      }
      const response = await txApi.addTransaction(finalData);
      this.transactions.push(response.data);
    },
    async updateTransaction(id, data) {
      let finalData = { ...data };
      if (data.isDutchPay && data.dutchPayHeadcount > 1) {
        finalData.originalAmount = data.amount;
        finalData.amount = Math.floor(data.amount / data.dutchPayHeadcount);
      }
      const response = await txApi.updateTransaction(id, finalData);
      const index = this.transactions.findIndex(t => t.id === id);
      if (index !== -1) {
        this.transactions[index] = response.data;
      }
    },
    async deleteTransaction(id) {
      await txApi.deleteTransaction(id);
      this.transactions = this.transactions.filter(t => t.id !== id);
    }
  },
});
