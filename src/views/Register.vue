<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../store/userStore';
import { useToastStore } from '../store/toastStore';
import BaseButton from '../components/ui/BaseButton.vue';
import BaseInput from '../components/ui/BaseInput.vue';
import BaseCard from '../components/ui/BaseCard.vue';
import BaseAvatar from '../components/ui/BaseAvatar.vue';
import EmojiPicker from 'vue3-emoji-picker';
import 'vue3-emoji-picker/css';

const router = useRouter();
const userStore = useUserStore();
const toastStore = useToastStore();

const formData = reactive({
  email: '',
  password: '',
  confirmPassword: '',
  name: '',
  profileImg: '😊',
});

const showEmojiPicker = ref(false);

const onSelectEmoji = (emoji) => {
  formData.profileImg = emoji.i;
  showEmojiPicker.value = false;
};

const handleRegister = async () => {
  if (formData.password !== formData.confirmPassword) {
    return toastStore.error('비밀번호가 일치하지 않습니다.');
  }

  try {
    const success = await userStore.register({
      email: formData.email,
      password: formData.password,
      name: formData.name,
      profileImg: formData.profileImg,
    });

    if (success) {
      toastStore.success('회원가입을 환영합니다!');
      router.push('/');
    }
  } catch (err) {
    // Error is handled by interceptor
  }
};
</script>

<template>
  <div class="register-view d-flex align-items-center justify-content-center min-vh-100 py-5">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-12 col-md-8 col-lg-5">
          <div class="text-center mb-4">
            <i class="bi bi-wallet2 fs-1 text-primary"></i>
            <h2 class="fw-bold mt-2">SavePoint 시작하기</h2>
            <p class="text-muted">나만의 스마트한 자산 관리를 시작해보세요.</p>
          </div>

          <BaseCard shadow="shadow-lg" padding="p-4 p-md-5">
            <form @submit.prevent="handleRegister">
              <div class="text-center mb-4 position-relative">
                <div class="cursor-pointer" @click="showEmojiPicker = !showEmojiPicker">
                  <BaseAvatar :src="formData.profileImg" size="80px" fontSize="2.5rem" />
                </div>
                <small class="text-primary d-block mt-2 cursor-pointer" @click="showEmojiPicker = !showEmojiPicker">이모지 변경</small>

                <div v-if="showEmojiPicker" class="position-absolute start-50 translate-middle-x mt-2" style="z-index: 100;">
                  <EmojiPicker :native="true" @select="onSelectEmoji" />
                </div>
              </div>

              <BaseInput
                id="regName"
                label="닉네임"
                v-model="formData.name"
                class="mb-3"
                required
                placeholder="사용할 닉네임을 입력하세요"
              />

              <BaseInput
                id="regEmail"
                label="이메일"
                type="email"
                v-model="formData.email"
                class="mb-3"
                required
                placeholder="email@example.com"
              />

              <BaseInput
                id="regPassword"
                label="비밀번호"
                type="password"
                v-model="formData.password"
                class="mb-3"
                required
                placeholder="비밀번호를 입력하세요"
              />

              <BaseInput
                id="regConfirmPassword"
                label="비밀번호 확인"
                type="password"
                v-model="formData.confirmPassword"
                class="mb-4"
                required
                placeholder="비밀번호를 다시 입력하세요"
              />

              <BaseButton variant="primary" size="lg" isFullWidth type="submit" :loading="userStore.loading">
                회원가입 완료
              </BaseButton>
            </form>

            <div class="text-center mt-4">
              <span class="text-muted small">이미 계정이 있으신가요? </span>
              <router-link to="/login" class="small fw-bold text-decoration-none">로그인하기</router-link>
            </div>
          </BaseCard>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cursor-pointer { cursor: pointer; }
.profile-emoji-select:hover { border-color: #0d6efd !important; }
</style>
