import axios from 'axios';
import { useUserStore } from '../store/userStore';
import { useToastStore } from '../store/toastStore';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    const userStore = useUserStore();
    if (userStore.user?.id) {
      config.headers['X-User-Id'] = userStore.user.id;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const toastStore = useToastStore();
    const message = error.response?.data?.message || '오류가 발생했습니다. 다시 시도해주세요.';

    if (error.response) {
      // Common error handling
      toastStore.error(message);
    } else if (error.request) {
      toastStore.error('서버와의 통신이 원활하지 않습니다.');
    } else {
      toastStore.error('알 수 없는 오류가 발생했습니다.');
    }

    return Promise.reject(error);
  }
);

export default api;
