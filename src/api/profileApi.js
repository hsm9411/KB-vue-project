import api from './index';

export default {
  // Get user profile
  getProfile() {
    return api.get('/profile');
  },
  // Update user profile
  updateProfile(data) {
    return api.put('/profile', data);
  }
};
