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
    },
    async addGoal(data) {
      const response = await goalApi.addGoal({ ...data, isActive: true });
      this.goals.push(response.data);
    },
    async updateGoal(id, data) {
      const response = await goalApi.updateGoal(id, data);
      const index = this.goals.findIndex(g => g.id === id);
      if (index !== -1) this.goals[index] = response.data;
    },
    async deleteGoal(id) {
      await goalApi.deleteGoal(id);
      this.goals = this.goals.filter(g => g.id !== id);
    }
  }
});
