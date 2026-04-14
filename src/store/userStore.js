import { defineStore } from 'pinia';
import userApi from '../api/userApi';

const SESSION_DURATION_MS = 1000 * 60 * 60 * 2; // 2시간

function saveSession(user) {
  const session = {
    user,
    expiresAt: Date.now() + SESSION_DURATION_MS,
  };
  localStorage.setItem('session', JSON.stringify(session));
}

function loadSession() {
  try {
    const raw = localStorage.getItem('session');
    if (!raw) return null;
    const session = JSON.parse(raw);
    if (Date.now() > session.expiresAt) {
      localStorage.removeItem('session');
      return null;
    }
    // Data Migration: Convert legacy string IDs
    if (session.user && String(session.user.groupId).toUpperCase() === 'G1') {
      session.user.groupId = 1;
    }
    return session.user;
  } catch (e) {
    console.error('Failed to parse session from localStorage', e);
    return null;
  }
}

export const useUserStore = defineStore('user', {
  state: () => ({
    user: loadSession(),
    loading: false,
  }),
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
          saveSession(user);
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
          isActive: true,
        });
        this.user = response.data;
        saveSession(this.user);
        return true;
      } finally {
        this.loading = false;
      }
    },
    logout() {
      this.user = null;
      localStorage.removeItem('session');
    },
    async updateProfile(data) {
      if (!this.user) return;
      const response = await userApi.updateUser(this.user.id, { ...this.user, ...data });
      this.user = response.data;
      saveSession(this.user);
    }
  },
});
