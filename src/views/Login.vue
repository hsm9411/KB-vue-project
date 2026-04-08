<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../store/userStore';
import BaseButton from '../components/ui/BaseButton.vue';
import BaseInput from '../components/ui/BaseInput.vue';
import BaseCard from '../components/ui/BaseCard.vue';

const router = useRouter();
const userStore = useUserStore();

const formData = reactive({
  email: '',
  password: '',
});
const error = ref('');

const handleLogin = async () => {
  error.value = '';
  const success = await userStore.login(formData.email, formData.password);
  if (success) {
    router.push('/');
  } else {
    error.value = '이메일 또는 비밀번호가 올바르지 않습니다.';
  }
};
</script>

<template>
  <div class="login-view d-flex align-items-center justify-content-center min-vh-100 bg-light">
    <div class="col-12 col-md-5 col-lg-4 p-3">
      <BaseCard shadow="shadow-lg" padding="p-4 p-md-5">
        <div class="text-center mb-5">
          <div class="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style="width: 64px; height: 64px;">
            <i class="bi bi-wallet2 fs-2"></i>
          </div>
          <h3 class="fw-bold">가계부 서비스</h3>
          <p class="text-muted">다시 오신 것을 환영합니다!</p>
        </div>

        <form @submit.prevent="handleLogin">
          <div class="mb-3">
            <BaseInput
              id="email"
              label="이메일"
              type="email"
              v-model="formData.email"
              placeholder="example@kb.com"
              required
            />
          </div>
          <div class="mb-4">
            <BaseInput
              id="password"
              label="비밀번호"
              type="password"
              v-model="formData.password"
              placeholder="••••••••"
              required
            />
          </div>

          <div v-if="error" class="alert alert-danger py-2 small mb-4">
            {{ error }}
          </div>

          <BaseButton variant="primary" size="lg" isFullWidth type="submit" :loading="userStore.loading">
            로그인하기
          </BaseButton>
        </form>

        <div class="mt-4 text-center">
          <p class="small text-muted mb-0">계정이 없으신가요? <a href="#" class="text-primary text-decoration-none fw-bold">회원가입</a></p>
        </div>
      </BaseCard>
    </div>
  </div>
</template>
