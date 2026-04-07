<script setup>
import { reactive, onMounted } from 'vue';
import { useProfileStore } from '../store/profileStore';
import BaseButton from '../components/ui/BaseButton.vue';
import BaseInput from '../components/ui/BaseInput.vue';
import BaseCard from '../components/ui/BaseCard.vue';

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
    alert('프로필이 수정되었습니다.');
  } catch (err) {
    alert('수정에 실패했습니다.');
  }
};
</script>

<template>
  <div class="profile-view fade-in">
    <h2 class="fw-bold mb-5 d-none d-md-block">사용자 프로필 설정</h2>
    <h4 class="fw-bold mb-4 d-md-none">프로필 설정</h4>

    <div class="row justify-content-center">
      <div class="col-12 col-md-8 col-lg-6">
        <BaseCard shadow="shadow-lg" padding="p-4 p-md-5">
          <div class="text-center mb-5">
            <div class="profile-avatar bg-primary-subtle text-primary rounded-circle d-flex align-items-center justify-content-center fw-bold mx-auto mb-3" style="width: 100px; height: 100px; font-size: 2.5rem;">
              {{ formData.name ? formData.name.substring(0, 2) : 'KB' }}
            </div>
            <h5 class="fw-bold mb-1">{{ formData.name || 'KB수강생' }}</h5>
            <p class="text-muted small">{{ formData.email || 'kb_student@kb.com' }}</p>
          </div>

          <form @submit.prevent="handleUpdate">
            <div class="mb-4">
              <BaseInput
                id="profileName"
                label="사용자 이름"
                v-model="formData.name"
                required
                placeholder="이름을 입력하세요"
              />
            </div>
            <div class="mb-5">
              <BaseInput
                id="profileEmail"
                label="이메일 주소"
                type="email"
                v-model="formData.email"
                required
                placeholder="email@example.com"
              />
            </div>
            <BaseButton variant="primary" size="lg" isFullWidth type="submit">
              프로필 정보 저장하기
            </BaseButton>
          </form>
        </BaseCard>

        <div class="mt-5">
          <h6 class="fw-bold text-muted small text-uppercase mb-3 px-1">계정 관리</h6>
          <BaseCard padding="p-0" noBorder class="overflow-hidden">
            <div class="list-group list-group-flush">
              <button class="list-group-item list-group-item-action d-flex justify-content-between align-items-center p-3 border-0">
                <span>알림 설정</span>
                <i class="bi bi-chevron-right text-muted"></i>
              </button>
              <button class="list-group-item list-group-item-action d-flex justify-content-between align-items-center p-3 border-0">
                <span>데이터 백업 및 복원</span>
                <i class="bi bi-chevron-right text-muted"></i>
              </button>
              <button class="list-group-item list-group-item-action d-flex justify-content-between align-items-center p-3 border-0 text-danger">
                <span>로그아웃</span>
                <i class="bi bi-box-arrow-right"></i>
              </button>
            </div>
          </BaseCard>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fade-in {
  animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.list-group-item {
  font-weight: 500;
  transition: background-color 0.2s;
}

.list-group-item:active {
  background-color: #f1f3f5;
}
</style>
