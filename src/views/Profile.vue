<script setup>
import { reactive, onMounted } from 'vue';
import { useProfileStore } from '../store/profileStore';

const profileStore = useProfileStore();

const formData = reactive({
  name: '',
  email: '',
});

onMounted(async () => {
  await profileStore.fetchProfile();
  formData.name = profileStore.profile.name;
  formData.email = profileStore.profile.email;
});

const handleUpdate = async () => {
  try {
    await profileStore.updateProfile(formData);
    alert('프로필 정보가 성공적으로 업데이트되었습니다.');
  } catch (err) {
    alert('프로필 업데이트에 실패했습니다.');
  }
};
</script>

<template>
  <div class="profile-view fade-in">
    <div class="header mb-5 text-center pt-4">
      <div
        class="profile-avatar-large mx-auto bg-primary text-white rounded-circle d-flex align-items-center justify-content-center shadow-lg position-relative mb-3"
        style="width: 100px; height: 100px; font-size: 40px;"
      >
        <i class="bi bi-person"></i>
        <div class="camera-badge bg-white text-primary rounded-circle shadow-sm position-absolute" style="bottom: 0; right: 0; width: 32px; height: 32px; font-size: 16px; display: flex; align-items: center; justify-content: center;">
          <i class="bi bi-camera-fill"></i>
        </div>
      </div>
      <h4 class="fw-bold mb-1">{{ formData.name || 'KB수강생' }}</h4>
      <small class="text-muted">{{ formData.email || 'kb_student@kb.com' }}</small>
    </div>

    <div class="settings-container">
      <h6 class="fw-bold small text-muted text-uppercase mb-3 ps-2">계정 설정</h6>

      <div class="form-container bg-white rounded-4 shadow-sm p-4 border border-light mb-4">
        <form @submit.prevent="handleUpdate">
          <div class="mb-3">
            <label for="name" class="form-label fw-bold small text-muted text-uppercase mb-2">사용자 이름</label>
            <input
              type="text"
              class="form-control form-control-lg rounded-3 border-light bg-light"
              id="name"
              v-model="formData.name"
              required
            />
          </div>

          <div class="mb-4">
            <label for="email" class="form-label fw-bold small text-muted text-uppercase mb-2">이메일 주소</label>
            <input
              type="email"
              class="form-control form-control-lg rounded-3 border-light bg-light"
              id="email"
              v-model="formData.email"
              required
            />
          </div>

          <button type="submit" class="btn btn-primary w-100 py-3 rounded-3 shadow-sm fw-bold">
            프로필 정보 저장
          </button>
        </form>
      </div>

      <h6 class="fw-bold small text-muted text-uppercase mb-3 ps-2">시스템</h6>
      <div class="list-group rounded-4 shadow-sm border border-light bg-white mb-4">
        <div class="list-group-item d-flex justify-content-between align-items-center py-3 border-bottom border-light">
          <div class="d-flex align-items-center">
            <i class="bi bi-bell-fill text-warning me-3"></i>
            <span>알림 설정</span>
          </div>
          <div class="form-check form-switch mb-0">
            <input class="form-check-input" type="checkbox" checked />
          </div>
        </div>
        <div class="list-group-item d-flex justify-content-between align-items-center py-3 border-bottom border-light">
          <div class="d-flex align-items-center">
            <i class="bi bi-shield-lock-fill text-success me-3"></i>
            <span>보안 및 비밀번호</span>
          </div>
          <i class="bi bi-chevron-right text-muted small"></i>
        </div>
        <div class="list-group-item d-flex justify-content-between align-items-center py-3">
          <div class="d-flex align-items-center">
            <i class="bi bi-question-circle-fill text-info me-3"></i>
            <span>고객 센터</span>
          </div>
          <i class="bi bi-chevron-right text-muted small"></i>
        </div>
      </div>

      <button type="button" class="btn btn-outline-danger w-100 py-3 rounded-4 border-2 fw-bold">
        <i class="bi bi-box-arrow-right me-2"></i>로그아웃
      </button>
    </div>
  </div>
</template>

<style scoped>
.form-control-lg {
  font-size: 1rem;
  padding: 0.8rem 1rem;
}

.profile-avatar-large {
  background: linear-gradient(135deg, #0d6efd 0%, #6610f2 100%);
}

.list-group-item {
  border: none;
  background-color: transparent;
  transition: background-color 0.2s;
  cursor: pointer;
}

.list-group-item:active {
  background-color: #f8f9fa;
}

.fade-in {
  animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
