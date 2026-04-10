<script setup>
import { onMounted, computed, ref } from 'vue';
import { useUserStore } from '../store/userStore';
import { useGroupStore } from '../store/groupStore';
import { useToastStore } from '../store/toastStore';
import BaseCard from '../components/ui/BaseCard.vue';
import BaseBadge from '../components/ui/BaseBadge.vue';
import BaseButton from '../components/ui/BaseButton.vue';
import BaseInput from '../components/ui/BaseInput.vue';
import BaseAvatar from '../components/ui/BaseAvatar.vue';

const userStore = useUserStore();
const groupStore = useGroupStore();
const toastStore = useToastStore();

const newGroupName = ref('');
const inviteCode = ref('');
const showJoinForm = ref(false);

onMounted(() => {
  if (userStore.user?.groupId) {
    groupStore.fetchGroupData(userStore.user.groupId);
  }
});

const sortedMembers = computed(() => {
  if (!groupStore.members.length) return [];
  return [...groupStore.members].sort((a, b) => {
    const aSpending = groupStore.memberSpendings[a.id] || 0;
    const bSpending = groupStore.memberSpendings[b.id] || 0;
    return aSpending - bSpending; // Least spender first
  });
});

const maxSpending = computed(() => {
  const values = Object.values(groupStore.memberSpendings);
  return values.length > 0 ? Math.max(...values, 1000) : 1000;
});

const handleCreateGroup = async () => {
  if (!newGroupName.value) return toastStore.warning('그룹 이름을 입력해주세요.');
  try {
    const group = await groupStore.createGroup(newGroupName.value, userStore.user.id);
    await userStore.updateProfile({ groupId: group.id });
    toastStore.success(`'${group.name}' 그룹이 생성되었습니다!`);
    groupStore.fetchGroupData(group.id);
  } catch (err) {
    toastStore.error('그룹 생성에 실패했습니다.');
  }
};

const handleJoinGroup = async () => {
  if (!inviteCode.value) return toastStore.warning('초대 코드를 입력해주세요.');
  try {
    const group = await groupStore.joinGroup(inviteCode.value, userStore.user.id);
    await userStore.updateProfile({ groupId: group.id });
    toastStore.success(`'${group.name}' 그룹에 참여했습니다!`);
    groupStore.fetchGroupData(group.id);
  } catch (err) {
    toastStore.error(err.message || '그룹 참여에 실패했습니다.');
  }
};

const handleLeaveGroup = async () => {
  if (!confirm('정말 그룹을 탈퇴하시겠습니까?')) return;
  try {
    const groupId = userStore.user.groupId;
    await groupStore.leaveGroup(groupId, userStore.user.id);
    await userStore.updateProfile({ groupId: null });
    toastStore.info('그룹에서 탈퇴했습니다.');
  } catch (err) {
    toastStore.error('그룹 탈퇴에 실패했습니다.');
  }
};

const formatCurrency = (val) => new Intl.NumberFormat('ko-KR').format(val) + '원';
</script>

<template>
  <div class="race-view fade-in">
    <div class="mb-4 d-flex justify-content-between align-items-center">
      <div>
        <h4 class="fw-bold mb-1">🏁 소비 레이스</h4>
        <p class="text-muted mb-0">누가 누가 가장 적게 썼을까요? 이번 달의 거지왕을 가려봅시다!</p>
      </div>
      <BaseButton v-if="userStore.user?.groupId" variant="outline-danger" size="sm" @click="handleLeaveGroup">
        그룹 탈퇴
      </BaseButton>
    </div>

    <!-- No Group State -->
    <div v-if="!userStore.user?.groupId" class="row justify-content-center mt-5">
      <div class="col-12 col-md-8 col-lg-6">
        <BaseCard shadow="shadow-lg" class="text-center py-5">
          <i class="bi bi-people-fill fs-1 text-primary mb-3 d-block"></i>
          <h4 class="fw-bold">함께하면 더 즐거운 소비 절약!</h4>
          <p class="text-muted mb-4">친구들과 그룹을 만들어 서로의 소비를 자극해보세요.</p>

          <div v-if="!showJoinForm">
            <div class="mb-4">
              <BaseInput v-model="newGroupName" placeholder="새로운 그룹 이름 입력" class="mb-2" />
              <BaseButton variant="primary" isFullWidth @click="handleCreateGroup">새 그룹 만들기</BaseButton>
            </div>
            <div class="divider mb-4"><span>또는</span></div>
            <BaseButton variant="outline-primary" isFullWidth @click="showJoinForm = true">초대 코드로 참여하기</BaseButton>
          </div>

          <div v-else>
            <div class="mb-4">
              <BaseInput v-model="inviteCode" placeholder="초대 코드 입력 (예: AB1234)" class="mb-2" />
              <BaseButton variant="primary" isFullWidth @click="handleJoinGroup">참여하기</BaseButton>
            </div>
            <BaseButton variant="link" class="text-muted" @click="showJoinForm = false">뒤로 가기</BaseButton>
          </div>
        </BaseCard>
      </div>
    </div>

    <!-- Group Race Content -->
    <div v-else class="row g-4">
      <div class="col-12 col-lg-8">
        <BaseCard shadow="shadow-sm">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h5 class="fw-bold mb-0">🏆 실시간 레이스 현황: {{ groupStore.group?.name }}</h5>
            <div class="small bg-light px-2 py-1 rounded">
              코드: <span class="fw-bold text-primary">{{ groupStore.group?.inviteCode }}</span>
            </div>
          </div>

          <div v-for="(member, index) in sortedMembers" :key="member.id" class="mb-4 member-track">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <div class="d-flex align-items-center">
                <div class="rank-badge me-2" :class="{ 'gold': index === 0 }">
                  {{ index === 0 ? '🥇' : index + 1 }}
                </div>
                <BaseAvatar :src="member.profileImg" size="32px" fontSize="1.2rem" class="me-2" />
                <span class="fw-bold">{{ member.name }}</span>
                <BaseBadge v-if="member.id === userStore.user.id" class="ms-2" variant="info">나</BaseBadge>
              </div>
              <span class="small fw-bold text-danger">{{ formatCurrency(groupStore.memberSpendings[member.id] || 0) }}</span>
            </div>
            <div class="progress rounded-pill position-relative overflow-visible" style="height: 16px; background-color: #f1f3f5;">
              <div
                class="progress-bar rounded-pill transition-all"
                :class="index === 0 ? 'bg-success' : 'bg-primary'"
                :style="{ width: (100 - ((groupStore.memberSpendings[member.id] || 0) / maxSpending * 100)) + '%' }"
              >
                <div class="runner-icon position-absolute top-50 translate-middle-y" :style="{ left: 'calc(' + (100 - ((groupStore.memberSpendings[member.id] || 0) / maxSpending * 100)) + '% - 10px)' }">
                  🏃
                </div>
              </div>
            </div>
          </div>

          <div class="mt-4 p-3 bg-light rounded-4 small text-muted border-start border-4 border-primary">
            <i class="bi bi-info-circle-fill me-2 text-primary"></i>
            지출액이 적을수록 선두에 위치합니다. 이번 달 <strong>거지왕</strong> 타이틀을 쟁취하세요!
          </div>
        </BaseCard>
      </div>

      <div class="col-12 col-lg-4">
        <!-- King Card -->
        <BaseCard variant="dark" class="text-white border-0 text-center py-4 mb-4" shadow="shadow-lg">
          <div class="mb-2">
            <span class="badge bg-warning text-dark fw-bold px-3">CURRENT KING</span>
          </div>
          <div class="mb-3">
             <BaseAvatar :src="sortedMembers[0]?.profileImg" size="100px" fontSize="4rem" style="border: 4px solid rgba(255,215,0,0.3);" />
          </div>
          <h4 class="fw-bold mb-1">{{ sortedMembers[0]?.name }}</h4>
          <p class="small opacity-75 mb-0">절약의 신, 현재 1위입니다!</p>
        </BaseCard>

        <!-- Stats Card -->
        <BaseCard padding="p-4" shadow="shadow-sm">
          <h6 class="fw-bold mb-4 border-bottom pb-2">그룹 대시보드</h6>
          <div class="mb-3">
            <label class="small text-muted mb-1 d-block">전체 참여 인원</label>
            <div class="fw-bold d-flex align-items-center">
              <i class="bi bi-people me-2"></i> {{ groupStore.members.length }}명
            </div>
          </div>
          <div class="mb-3">
            <label class="small text-muted mb-1 d-block">그룹 지출 한도</label>
            <div class="fw-bold d-flex align-items-center">
              <i class="bi bi-lightning-charge me-2"></i> {{ formatCurrency(groupStore.group?.limit || 0) }}
            </div>
          </div>
          <div class="mb-0">
            <label class="small text-muted mb-1 d-block">초대 코드</label>
            <div class="input-group input-group-sm">
              <input type="text" class="form-control fw-mono" :value="groupStore.group?.inviteCode" readonly>
              <button class="btn btn-outline-secondary" type="button" @click="toastStore.info('코드가 복사되었습니다 (데모)')">
                <i class="bi bi-copy"></i>
              </button>
            </div>
          </div>
        </BaseCard>
      </div>
    </div>
  </div>
</template>

<style scoped>
.transition-all { transition: width 1s cubic-bezier(0.34, 1.56, 0.64, 1); }
.member-track { position: relative; }
.runner-icon { font-size: 1.2rem; filter: drop-shadow(0 2px 2px rgba(0,0,0,0.2)); z-index: 2; transition: left 1s cubic-bezier(0.34, 1.56, 0.64, 1); }
.rank-badge { width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; border-radius: 50%; background: #eee; font-weight: bold; }
.rank-badge.gold { background: #ffd700; color: #000; }
.profile-emoji { font-size: 1.5rem; }
.divider { display: flex; align-items: center; text-align: center; color: #adb5bd; }
.divider::before, .divider::after { content: ''; flex: 1; border-bottom: 1px solid #dee2e6; }
.divider:not(:empty)::before { margin-right: .5em; }
.divider:not(:empty)::after { margin-left: .5em; }
.bg-dark { background-color: #2D2D2D !important; }
</style>
