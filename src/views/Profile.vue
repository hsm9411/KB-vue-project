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
  <div class="profile max-width-600 mx-auto">
    <div class="card border-0 shadow-sm">
      <div class="card-header bg-white py-3 text-center">
        <div
          class="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center mx-auto mb-3"
          style="width: 80px; height: 80px; font-size: 32px;"
        >
          <i class="bi bi-person"></i>
        </div>
        <h4 class="mb-0 fw-bold">사용자 설정 및 프로필</h4>
      </div>
      <div class="card-body p-4">
        <form @submit.prevent="handleUpdate">
          <!-- Name -->
          <div class="mb-3">
            <label for="name" class="form-label fw-bold">이름</label>
            <input
              type="text"
              class="form-control"
              id="name"
              v-model="formData.name"
              placeholder="이름을 입력하세요"
              required
            />
          </div>

          <!-- Email -->
          <div class="mb-4">
            <label for="email" class="form-label fw-bold">이메일</label>
            <input
              type="email"
              class="form-control"
              id="email"
              v-model="formData.email"
              placeholder="이메일을 입력하세요"
              required
            />
          </div>

          <!-- Submit Button -->
          <button type="submit" class="btn btn-primary w-100 py-2 fw-bold">
            <i class="bi bi-save me-2"></i>프로필 저장하기
          </button>
        </form>
      </div>
    </div>

    <!-- Info Card -->
    <div class="card border-0 shadow-sm mt-4 bg-light">
      <div class="card-body">
        <h6 class="fw-bold mb-3"><i class="bi bi-info-circle me-2"></i>도움말</h6>
        <ul class="small text-muted mb-0">
          <li>사용자 이름과 이메일은 모든 기기에서 동기화됩니다.</li>
          <li>이메일 형식에 맞춰 입력해 주세요.</li>
          <li>변경 사항은 즉시 반영됩니다.</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.max-width-600 {
  max-width: 600px;
}
</style>
