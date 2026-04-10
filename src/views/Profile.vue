<script setup>
import { reactive, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../store/userStore';
import { useGoalStore } from '../store/goalStore';
import { useToastStore } from '../store/toastStore';
import BaseButton from '../components/ui/BaseButton.vue';
import BaseInput from '../components/ui/BaseInput.vue';
import BaseCard from '../components/ui/BaseCard.vue';
import BaseBadge from '../components/ui/BaseBadge.vue';
import BaseAvatar from '../components/ui/BaseAvatar.vue';
import EmojiPicker from 'vue3-emoji-picker';
import 'vue3-emoji-picker/css';

const router = useRouter();
const userStore = useUserStore();
const goalStore = useGoalStore();
const toastStore = useToastStore();

const profileData = reactive({
  name: '',
  email: '',
  profileImg: '',
});

const showEmojiPicker = ref(false);
const showGoalModal = ref(false);
const showDeleteConfirm = ref(false);

const currentGoal = reactive({
  id: null,
  title: '',
  targetAmount: 0,
  currentAmount: 0,
});

onMounted(async () => {
  if (userStore.user) {
    profileData.name = userStore.user.name;
    profileData.email = userStore.user.email;
    profileData.profileImg = userStore.user.profileImg || '👤';
    await goalStore.fetchGoals(userStore.user.id);
  }
});

const onSelectEmoji = (emoji) => {
  profileData.profileImg = emoji.i;
  showEmojiPicker.value = false;
};

const handleUpdateProfile = async () => {
  try {
    await userStore.updateProfile(profileData);
    toastStore.success('프로필 정보가 저장되었습니다.');
  } catch (err) {
    toastStore.error('프로필 저장에 실패했습니다.');
  }
};

const openGoalModal = (goal = null) => {
  if (goal) {
    Object.assign(currentGoal, goal);
  } else {
    currentGoal.id = null;
    currentGoal.title = '';
    currentGoal.targetAmount = 0;
    currentGoal.currentAmount = 0;
  }
  showGoalModal.value = true;
};

const handleSaveGoal = async () => {
  try {
    if (currentGoal.id) {
      await goalStore.updateGoal(currentGoal.id, { ...currentGoal });
      toastStore.success('목표가 수정되었습니다.');
    } else {
      await goalStore.addGoal({ ...currentGoal, userId: userStore.user.id, isAchieved: false });
      toastStore.success('새로운 목표가 등록되었습니다.');
    }
    showGoalModal.value = false;
  } catch (err) {
    toastStore.error('목표 저장에 실패했습니다.');
  }
};

const handleDeleteGoal = async (id) => {
  if (!confirm('이 목표를 삭제하시겠습니까?')) return;
  try {
    await goalStore.deleteGoal(id);
    toastStore.info('목표가 삭제되었습니다.');
  } catch (err) {
    toastStore.error('목표 삭제에 실패했습니다.');
  }
};

const handleDeleteAccount = async () => {
  try {
    // In a real app, this would call userApi.deleteUser
    toastStore.warning('계정이 삭제되었습니다. (데모)');
    userStore.logout();
    router.push('/login');
  } catch (err) {
    toastStore.error('계정 삭제 중 오류가 발생했습니다.');
  }
};

const formatCurrency = (val) => new Intl.NumberFormat('ko-KR').format(val) + '원';
</script>

<template>
  <div class="profile-view fade-in">
    <div class="mb-4">
      <h4 class="fw-bold">마이페이지</h4>
      <p class="text-muted">내 정보와 구매 목표를 관리하세요.</p>
    </div>

    <div class="row g-4">
      <!-- Profile Settings -->
      <div class="col-12 col-lg-5">
        <BaseCard shadow="shadow-sm">
          <h5 class="fw-bold mb-4">프로필 설정</h5>

          <div class="text-center mb-4 position-relative">
            <div class="cursor-pointer" @click="showEmojiPicker = !showEmojiPicker">
              <BaseAvatar :src="profileData.profileImg" size="100px" fontSize="3rem" />
            </div>
            <div v-if="showEmojiPicker" class="position-absolute start-50 translate-middle-x mt-2" style="z-index: 100;">
              <EmojiPicker :native="true" @select="onSelectEmoji" />
            </div>
            <small class="text-primary d-block mt-2 cursor-pointer" @click="showEmojiPicker = !showEmojiPicker">이모지 변경</small>
          </div>

          <form @submit.prevent="handleUpdateProfile">
            <BaseInput id="pName" label="닉네임" v-model="profileData.name" class="mb-3" required />
            <BaseInput id="pEmail" label="이메일 (변경 불가)" v-model="profileData.email" class="mb-4" disabled />

            <BaseButton variant="primary" isFullWidth type="submit" :loading="userStore.loading">
              프로필 저장하기
            </BaseButton>
          </form>

          <div class="mt-4 pt-4 border-top">
            <h6 class="fw-bold text-danger mb-3">위험 구역</h6>
            <BaseButton variant="outline-danger" size="sm" isFullWidth @click="showDeleteConfirm = true">
              계정 삭제하기
            </BaseButton>
          </div>
        </BaseCard>
      </div>

      <!-- Goals Management -->
      <div class="col-12 col-lg-7">
        <BaseCard shadow="shadow-sm">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h5 class="fw-bold mb-0">구매 목표 관리</h5>
            <BaseButton variant="outline-primary" size="sm" @click="openGoalModal()">
              <i class="bi bi-plus-lg me-1"></i>목표 추가
            </BaseButton>
          </div>

          <div v-if="goalStore.goals.length === 0" class="text-center py-5">
            <i class="bi bi-trophy fs-1 text-muted opacity-25 mb-3 d-block"></i>
            <p class="text-muted">설정된 목표가 없습니다.<br>사고 싶은 물건을 목표로 등록해보세요!</p>
          </div>

          <div v-for="goal in goalStore.goals" :key="goal.id" class="goal-item p-3 rounded-4 bg-light mb-3 border">
            <div class="d-flex justify-content-between align-items-start mb-2">
              <div>
                <h6 class="fw-bold mb-1">{{ goal.title }}</h6>
                <small class="text-muted">{{ formatCurrency(goal.targetAmount) }} 목표</small>
              </div>
              <div class="d-flex gap-1">
                <button class="btn btn-sm btn-light rounded-circle" @click="openGoalModal(goal)">
                  <i class="bi bi-pencil-fill text-primary"></i>
                </button>
                <button class="btn btn-sm btn-light rounded-circle" @click="handleDeleteGoal(goal.id)">
                  <i class="bi bi-trash-fill text-danger"></i>
                </button>
              </div>
            </div>

            <div class="progress rounded-pill mb-2" style="height: 10px;">
              <div
                class="progress-bar progress-bar-striped progress-bar-animated"
                :class="goal.currentAmount >= goal.targetAmount ? 'bg-success' : 'bg-primary'"
                :style="{ width: Math.min((goal.currentAmount / goal.targetAmount) * 100, 100) + '%' }"
              ></div>
            </div>
            <div class="d-flex justify-content-between small">
              <span class="fw-bold">{{ Math.round((goal.currentAmount / goal.targetAmount) * 100) }}% 달성</span>
              <span class="text-muted">{{ formatCurrency(goal.currentAmount) }} 모음</span>
            </div>
          </div>
        </BaseCard>
      </div>
    </div>

    <!-- Goal Modal -->
    <div v-if="showGoalModal" class="modal-backdrop fade show"></div>
    <div v-if="showGoalModal" class="modal fade show d-block" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 rounded-4 shadow">
          <div class="modal-header border-0 pb-0">
            <h5 class="modal-title fw-bold">{{ currentGoal.id ? '목표 수정' : '새 목표 등록' }}</h5>
            <button type="button" class="btn-close" @click="showGoalModal = false"></button>
          </div>
          <div class="modal-body p-4">
            <BaseInput label="목표 이름" v-model="currentGoal.title" class="mb-3" placeholder="예: 맥북 프로" />
            <BaseInput label="목표 금액" type="number" v-model.number="currentGoal.targetAmount" class="mb-3" />
            <BaseInput label="현재 모은 금액" type="number" v-model.number="currentGoal.currentAmount" class="mb-3" />

            <BaseButton variant="primary" isFullWidth class="mt-3" @click="handleSaveGoal">저장하기</BaseButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Account Modal -->
    <div v-if="showDeleteConfirm" class="modal-backdrop fade show"></div>
    <div v-if="showDeleteConfirm" class="modal fade show d-block" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 rounded-4 shadow">
          <div class="modal-body p-5 text-center">
            <div class="text-danger mb-4">
              <i class="bi bi-exclamation-triangle-fill" style="font-size: 4rem;"></i>
            </div>
            <h4 class="fw-bold mb-3">정말 떠나시나요?</h4>
            <p class="text-muted mb-4">계정을 삭제하면 모든 가계부 기록과 그룹 데이터가 영구적으로 삭제되며 복구할 수 없습니다.</p>
            <div class="d-grid gap-2">
              <BaseButton variant="danger" size="lg" @click="handleDeleteAccount">네, 삭제하겠습니다</BaseButton>
              <BaseButton variant="light" size="lg" @click="showDeleteConfirm = false">취소</BaseButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cursor-pointer { cursor: pointer; }
.profile-emoji-select:hover { border-color: #0d6efd !important; }
.goal-item { transition: transform 0.2s; }
.goal-item:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
.modal-backdrop { background-color: rgba(0,0,0,0.5); }
</style>
