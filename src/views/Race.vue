<script setup>
import { onMounted, computed } from 'vue';
import { useUserStore } from '../store/userStore';
import { useGroupStore } from '../store/groupStore';
import BaseCard from '../components/ui/BaseCard.vue';
import BaseBadge from '../components/ui/BaseBadge.vue';

const userStore = useUserStore();
const groupStore = useGroupStore();

onMounted(() => {
  if (userStore.user?.groupId) {
    groupStore.fetchGroupData(userStore.user.groupId);
  }
});

const sortedMembers = computed(() => {
  return [...groupStore.members].sort((a, b) => {
    const aSpending = groupStore.memberSpendings[a.id] || 0;
    const bSpending = groupStore.memberSpendings[b.id] || 0;
    return aSpending - bSpending; // Least spender first
  });
});

const maxSpending = computed(() => {
  const values = Object.values(groupStore.memberSpendings);
  return values.length > 0 ? Math.max(...values, 1) : 1;
});

const formatCurrency = (val) => new Intl.NumberFormat('ko-KR').format(val) + '원';
</script>

<template>
  <div class="race-view fade-in">
    <div class="mb-4">
      <h4 class="fw-bold mb-1">🏁 소비 레이스: {{ groupStore.group?.name }}</h4>
      <p class="text-muted">누가 누가 가장 적게 썼을까요? 이번 달의 거지왕을 가려봅시다!</p>
    </div>

    <BaseCard v-if="!userStore.user?.groupId" class="text-center py-5">
      <i class="bi bi-people fs-1 text-muted mb-3 d-block"></i>
      <h5 class="fw-bold">소속된 그룹이 없습니다.</h5>
      <p class="text-muted">그룹에 참여하여 레이스를 시작해보세요!</p>
    </BaseCard>

    <div v-else class="row g-4">
      <!-- Race Tracks -->
      <div class="col-12 col-lg-8">
        <BaseCard shadow="shadow-sm">
          <h5 class="fw-bold mb-4">🏆 실시간 레이스 현황</h5>
          <div v-for="(member, index) in sortedMembers" :key="member.id" class="mb-4">
            <div class="d-flex justify-content-between align-items-center mb-1">
              <div class="d-flex align-items-center">
                <span class="me-2">{{ index === 0 ? '👑' : index + 1 }}</span>
                <span class="fw-bold">{{ member.name }}</span>
                <BaseBadge v-if="member.id === userStore.user.id" class="ms-2" variant="info">나</BaseBadge>
              </div>
              <span class="small fw-bold">{{ formatCurrency(groupStore.memberSpendings[member.id] || 0) }}</span>
            </div>
            <div class="progress rounded-pill" style="height: 12px; background-color: #f1f3f5;">
              <div
                class="progress-bar rounded-pill transition-all"
                :class="index === 0 ? 'bg-success' : 'bg-primary opacity-75'"
                :style="{ width: ((groupStore.memberSpendings[member.id] || 0) / maxSpending * 100) + '%' }"
              ></div>
            </div>
          </div>
          <div class="mt-4 p-3 bg-light rounded-3 small text-muted">
            <i class="bi bi-info-circle me-1"></i> 지출이 가장 적은 사람이 맨 위에 표시됩니다. 승리(거지왕)를 향해 달리세요!
          </div>
        </BaseCard>
      </div>

      <!-- Winners Box -->
      <div class="col-12 col-lg-4">
        <BaseCard variant="primary" class="text-white border-0 text-center py-4 mb-4">
          <small class="d-block mb-2 opacity-75">현재 1위 (거지왕)</small>
          <div class="bg-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style="width: 80px; height: 80px;">
             <img v-if="sortedMembers[0]" :src="sortedMembers[0].profileImg" class="rounded-circle" style="width: 70px;">
          </div>
          <h4 class="fw-bold mb-0">{{ sortedMembers[0]?.name }}</h4>
        </BaseCard>

        <BaseCard padding="p-3">
          <h6 class="fw-bold mb-3">그룹 정보</h6>
          <div class="d-flex justify-content-between mb-2">
            <span class="text-muted">그룹 한도</span>
            <span class="fw-bold">{{ formatCurrency(groupStore.group?.limit || 0) }}</span>
          </div>
          <div class="d-flex justify-content-between">
            <span class="text-muted">참여 인원</span>
            <span class="fw-bold">{{ groupStore.members.length }}명</span>
          </div>
        </BaseCard>
      </div>
    </div>
  </div>
</template>

<style scoped>
.transition-all { transition: width 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
</style>
