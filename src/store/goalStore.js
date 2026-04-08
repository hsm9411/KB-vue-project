import { defineStore } from 'pinia';
import goalApi from '../api/goalApi';

export const useGoalStore = defineStore('goal', {
  state: () => ({
    goals: [],
    loading: false,
  }),
  actions: {
    async fetchGoals(userId) {
      this.loading = true;
      try {
        const response = await goalApi.getGoals(userId);
        this.goals = response.data;
      } finally {
        this.loading = false;
      }
    }
  }
});
