<script setup>
import { computed, onMounted } from 'vue';
import { useUserStore } from '../store/userStore';
import { useTxStore } from '../store/txStore';
import { useGoalStore } from '../store/goalStore';
import BaseCard from '../components/ui/BaseCard.vue';
import BaseButton from '../components/ui/BaseButton.vue';
import { Doughnut } from 'vue-chartjs';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const userStore = useUserStore();
const txStore = useTxStore();
const goalStore = useGoalStore();

const user = computed(() => userStore.user);
const expenseLimit = computed(() => user.value?.expenseLimit || 1000000);
const currentExpense = computed(() => txStore.totalExpense);
const limitPercent = computed(() => Math.min(Math.round((currentExpense.value / expenseLimit.value) * 100), 100));

const progressColorClass = computed(() => {
  if (limitPercent.value >= 90) return 'bg-danger';
  if (limitPercent.value >= 60) return 'bg-warning';
  return 'bg-success';
});

onMounted(() => {
  if (user.value) {
    txStore.fetchTransactions(user.value.id);
    goalStore.fetchGoals(user.value.id);
  }
});

const formatCurrency = (val) => new Intl.NumberFormat('ko-KR').format(val) + '원';

// Goal Chart Data
const getGoalChartData = (goal) => ({
  labels: ['달성', '잔여'],
  datasets: [{
    data: [goal.currentAmount, Math.max(goal.targetAmount - goal.currentAmount, 0)],
    backgroundColor: ['#0d6efd', '#e9ecef'],
    borderWidth: 0,
  }]
});

const chartOptions = {
  cutout: '70%',
  plugins: { legend: { display: false }, tooltip: { enabled: false } },
};
</script>

<template>
  <div class="home-view fade-in">
    <header class="mb-4">
      <h3 class="fw-bold">안녕하세요, {{ user?.name }}님!</h3>
      <p class="text-muted">오늘도 현명한 소비 습관을 만들어봐요.</p>
    </header>

    <div class="row g-4 mb-4">
      <!-- Spending Limit Card -->
      <div class="col-12 col-lg-7">
        <BaseCard shadow="shadow-sm">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h5 class="fw-bold mb-0">이번 달 지출 한도</h5>
            <span class="badge rounded-pill" :class="progressColorClass">{{ limitPercent }}% 사용</span>
          </div>
          <div class="mb-2 d-flex justify-content-between small">
            <span>{{ formatCurrency(currentExpense) }}</span>
            <span class="text-muted">한도: {{ formatCurrency(expenseLimit) }}</span>
          </div>
          <div class="progress rounded-pill mb-3" style="height: 12px;">
            <div
              class="progress-bar progress-bar-striped progress-bar-animated"
              :class="progressColorClass"
              :style="{ width: limitPercent + '%' }"
            ></div>
          </div>
          <p class="small mb-0 text-center" :class="limitPercent > 90 ? 'text-danger fw-bold' : 'text-muted'">
            {{ limitPercent > 90 ? '🚨 한도에 도달했습니다! 소비를 멈추세요!' : '아직 여유가 있습니다. 파이팅!' }}
          </p>
        </BaseCard>
      </div>

      <!-- Summary Stats -->
      <div class="col-12 col-lg-5">
        <div class="row g-3">
          <div class="col-6">
            <BaseCard variant="success-light" padding="p-3" noBorder>
              <small class="d-block mb-1">총 수입</small>
              <h5 class="fw-bold mb-0 text-success">{{ formatCurrency(txStore.totalIncome) }}</h5>
            </BaseCard>
          </div>
          <div class="col-6">
            <BaseCard variant="danger-light" padding="p-3" noBorder>
              <small class="d-block mb-1">총 지출</small>
              <h5 class="fw-bold mb-0 text-danger">{{ formatCurrency(txStore.totalExpense) }}</h5>
            </BaseCard>
          </div>
          <div class="col-12">
            <BaseCard variant="primary-light" padding="p-3" noBorder>
              <small class="d-block mb-1">이번 달 순수익</small>
              <h4 class="fw-bold mb-0 text-primary">{{ formatCurrency(txStore.netIncome) }}</h4>
            </BaseCard>
          </div>
        </div>
      </div>
    </div>

    <!-- Goals Section -->
    <section class="mb-5">
      <h5 class="fw-bold mb-3">나의 구매 목표</h5>
      <div class="row g-3">
        <div v-for="goal in goalStore.goals" :key="goal.id" class="col-12 col-md-4">
          <BaseCard padding="p-3">
            <div class="d-flex align-items-center">
              <div style="width: 60px; height: 60px;" class="me-3">
                <Doughnut :data="getGoalChartData(goal)" :options="chartOptions" />
              </div>
              <div class="overflow-hidden">
                <h6 class="fw-bold mb-1 text-truncate">{{ goal.title }}</h6>
                <small class="text-muted">{{ Math.round((goal.currentAmount/goal.targetAmount)*100) }}% 달성</small>
              </div>
            </div>
            <div v-if="goal.currentAmount >= goal.targetAmount" class="mt-2 text-center">
              <span class="badge bg-warning text-dark w-100">🎉 목표 달성 축하합니다!</span>
            </div>
          </BaseCard>
        </div>
      </div>
    </section>

    <!-- FAB for Quick Add -->
    <router-link to="/transaction/add" class="fab-btn">
      <BaseButton variant="primary" size="lg" class="rounded-circle shadow-lg" style="width: 60px; height: 60px; padding:0;">
        <i class="bi bi-plus-lg fs-2"></i>
      </BaseButton>
    </router-link>
  </div>
</template>

<style scoped>
.fab-btn {
  position: fixed;
  bottom: 90px;
  right: 24px;
  z-index: 1000;
}
@media (min-width: 768px) {
  .fab-btn { bottom: 40px; right: 40px; }
}
</style>
