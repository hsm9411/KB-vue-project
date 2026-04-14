import { defineStore } from 'pinia';
import userApi from '../api/userApi';

export const useUserStore = defineStore('user', {
  state: () => {
    let savedUser = null;
    try {
      savedUser = JSON.parse(localStorage.getItem('user'));
      // Data Migration: Convert legacy string IDs (e.g., 'G1' or 'g1') to numeric or null
      if (savedUser && (String(savedUser.groupId).toUpperCase() === 'G1')) {
        savedUser.groupId = 1;
        localStorage.setItem('user', JSON.stringify(savedUser));
      }
    } catch (e) {
      console.error('Failed to parse user from localStorage', e);
    }

    return {
      user: savedUser,
      loading: false,
    };
  },
  getters: {
    isLoggedIn: (state) => !!state.user,
    currentUser: (state) => state.user,
  },
  actions: {
    async login(email, password) {
      this.loading = true;
      try {
        const response = await userApi.login(email, password);
        if (response.data && response.data.length > 0) {
          const user = response.data[0];
          this.user = user;
          localStorage.setItem('user', JSON.stringify(user));
          return true;
        }
        return false;
      } finally {
        this.loading = false;
      }
    },
    async register(userData) {
      this.loading = true;
      try {
        const response = await userApi.register({
          ...userData,
          expenseLimit: 1000000,
          groupId: null,
        });
        this.user = response.data;
        localStorage.setItem('user', JSON.stringify(this.user));
        return true;
      } finally {
        this.loading = false;
      }
    },
    logout() {
      this.user = null;
      localStorage.removeItem('user');
    },
    async updateProfile(data) {
      if (!this.user) return;
      const response = await userApi.updateUser(this.user.id, { ...this.user, ...data });
      this.user = response.data;
      localStorage.setItem('user', JSON.stringify(this.user));
    }
  },
});
