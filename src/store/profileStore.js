import { defineStore } from 'pinia';
import profileApi from '../api/profileApi';

export const useProfileStore = defineStore('profile', {
  state: () => ({
    profile: {
      name: '',
      email: '',
    },
    loading: false,
    error: null,
  }),
  actions: {
    async fetchProfile() {
      this.loading = true;
      try {
        const response = await profileApi.getProfile();
        this.profile = response.data;
      } catch (err) {
        this.error = '프로필을 불러오는 중 오류가 발생했습니다.';
        console.error(err);
      } finally {
        this.loading = false;
      }
    },
    async updateProfile(profileData) {
      this.loading = true;
      try {
        const response = await profileApi.updateProfile(profileData);
        this.profile = response.data;
      } catch (err) {
        this.error = '프로필 업데이트 중 오류가 발생했습니다.';
        throw err;
      } finally {
        this.loading = false;
      }
    },
  },
});
