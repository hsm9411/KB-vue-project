<script setup>
import { computed } from 'vue';
import { useBudgetStore } from '../store/budgetStore';
import { useProfileStore } from '../store/profileStore';
import BaseButton from '../components/ui/BaseButton.vue';
import BaseCard from '../components/ui/BaseCard.vue';

const budgetStore = useBudgetStore();
const profileStore = useProfileStore();

const totalIncome = computed(() => budgetStore.totalIncome);
const totalExpense = computed(() => budgetStore.totalExpense);
const netIncome = computed(() => budgetStore.netIncome);
const recentTransactions = computed(() => budgetStore.recentBudgets);
const userName = computed(() => profileStore.profile.name || 'KB수강생');

const formatCurrency = (value) => {
  return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(value);
};

const getCategoryIcon = (category) => {
  const icons = {
    '월급': 'bi-cash-stack',
    '용돈': 'bi-gift',
    '이자': 'bi-graph-up',
    '식비': 'bi-cart',
    '교통비': 'bi-bus-front',
    '유흥': 'bi-controller',
    '공과금': 'bi-house-heart',
    '기타': 'bi-three-dots'
  };
  return icons[category] || 'bi-bookmark-star';
};
</script>

<template>
  <div class="home-view fade-in">
    <!-- Header Summary (Visible on Desktop) -->
    <header class="d-none d-md-flex justify-content-between align-items-center mb-5">
      <div>
        <h2 class="fw-bold mb-1">대시보드</h2>
        <p class="text-muted mb-0">환영합니다, {{ userName }}님! 오늘은 어떤 지출이 있으셨나요?</p>
      </div>
      <router-link to="/transaction/add">
        <BaseButton variant="primary" size="lg" class="px-4">
          <i class="bi bi-plus-lg me-2"></i>새 거래 추가
        </BaseButton>
      </router-link>
    </header>

    <!-- Header (Mobile Only) -->
    <header class="d-flex d-md-none justify-content-between align-items-center mb-4 pt-1">
      <div>
        <small class="text-muted d-block">반가워요!</small>
        <h5 class="fw-bold mb-0">{{ userName }}님</h5>
      </div>
      <div class="profile-avatar bg-primary-subtle text-primary rounded-circle d-flex align-items-center justify-content-center fw-bold" style="width: 44px; height: 44px;">
        {{ userName.substring(0, 2) }}
      </div>
    </header>

    <!-- Summary Cards -->
    <div class="row g-4 mb-5">
      <!-- Main Balance Card -->
      <div class="col-12 col-lg-4 order-lg-2">
        <BaseCard variant="primary" shadow="shadow-lg" padding="p-4" class="text-white border-0 balance-card h-100 d-flex flex-column justify-content-between">
          <div class="mb-4">
            <small class="text-white-50">현재 총 잔액</small>
            <h2 class="fw-bold mb-0 mt-1">{{ formatCurrency(netIncome) }}</h2>
          </div>
          <div class="pt-3 border-top border-white-10">
            <div class="d-flex justify-content-between">
              <div>
                <small class="text-white-50 d-block">수입</small>
                <span class="fw-bold">{{ formatCurrency(totalIncome) }}</span>
              </div>
              <div class="text-end border-start ps-3 border-white-10">
                <small class="text-white-50 d-block">지출</small>
                <span class="fw-bold">{{ formatCurrency(totalExpense) }}</span>
              </div>
            </div>
          </div>
        </BaseCard>
      </div>

      <!-- Quick Income Card (Desktop Only) -->
      <div class="col-md-6 col-lg-4 d-none d-md-block">
        <BaseCard class="h-100 d-flex align-items-center">
          <div class="icon-box bg-success-subtle text-success rounded-circle me-3 d-flex align-items-center justify-content-center" style="width: 60px; height: 60px;">
            <i class="bi bi-arrow-down-left-circle fs-2"></i>
          </div>
          <div>
            <small class="text-muted d-block">이번 달 총 수입</small>
            <h4 class="fw-bold mb-0 text-success">{{ formatCurrency(totalIncome) }}</h4>
          </div>
        </BaseCard>
      </div>

      <!-- Quick Expense Card (Desktop Only) -->
      <div class="col-md-6 col-lg-4 d-none d-md-block">
        <BaseCard class="h-100 d-flex align-items-center">
          <div class="icon-box bg-danger-subtle text-danger rounded-circle me-3 d-flex align-items-center justify-content-center" style="width: 60px; height: 60px;">
            <i class="bi bi-arrow-up-right-circle fs-2"></i>
          </div>
          <div>
            <small class="text-muted d-block">이번 달 총 지출</small>
            <h4 class="fw-bold mb-0 text-danger">{{ formatCurrency(totalExpense) }}</h4>
          </div>
        </BaseCard>
      </div>
    </div>

    <!-- Content Grid -->
    <div class="row g-5">
      <!-- Recent Transactions Section -->
      <div class="col-12 col-lg-7">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h5 class="fw-bold mb-0">최근 거래 내역</h5>
          <router-link to="/history" class="text-primary text-decoration-none small">내역 전체보기 <i class="bi bi-chevron-right small"></i></router-link>
        </div>

        <div v-if="recentTransactions.length === 0" class="text-center py-5 text-muted bg-white rounded-4 shadow-sm border border-light">
          <i class="bi bi-inbox fs-1 d-block mb-2"></i>
          거래 내역이 없습니다.
        </div>
        <div v-else class="transaction-list">
          <BaseCard
            v-for="item in recentTransactions"
            :key="item.id"
            class="mb-3"
            padding="p-3 p-md-4"
            noBorder
          >
            <div class="d-flex align-items-center">
              <div
                class="category-icon rounded-4 me-3 d-flex align-items-center justify-content-center"
                :class="item.type === 'income' ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'"
                style="width: 52px; height: 52px; flex-shrink: 0;"
              >
                <i :class="getCategoryIcon(item.category)" class="fs-3"></i>
              </div>
              <div class="flex-grow-1 overflow-hidden">
                <h6 class="fw-bold mb-0 text-truncate">{{ item.category }}</h6>
                <small class="text-muted d-block text-truncate">{{ item.memo || item.date }}</small>
              </div>
              <div class="text-end ms-2" :class="item.type === 'income' ? 'text-success fw-bold' : 'text-danger fw-bold'">
                <span class="fs-5">{{ item.type === 'income' ? '+' : '-' }} {{ formatCurrency(item.amount) }}</span>
              </div>
            </div>
          </BaseCard>
        </div>
      </div>

      <!-- Quick Analysis / Tips Section (Desktop Only) -->
      <div class="col-12 col-lg-5 d-none d-lg-block">
        <h5 class="fw-bold mb-4">금융 리포트 인사이트</h5>
        <BaseCard padding="p-0" shadow="shadow-sm" class="mb-4 overflow-hidden border-0">
          <div class="p-4 bg-primary text-white bg-opacity-10 border-start border-primary border-5">
            <h6 class="fw-bold text-primary mb-2">지출 분석 알림</h6>
            <p class="small text-dark mb-0">식비 지출이 지난주보다 15% 증가했습니다. 건강한 외식 습관을 유지해 보세요!</p>
          </div>
        </BaseCard>
        <BaseCard padding="p-4">
          <h6 class="fw-bold mb-3">카테고리별 비중</h6>
          <div class="d-flex flex-column gap-3">
            <div v-for="(cat, index) in ['식비', '교통비', '유흥']" :key="index">
              <div class="d-flex justify-content-between mb-1 small fw-bold">
                <span>{{ cat }}</span>
                <span>{{ 50 - (index * 15) }}%</span>
              </div>
              <div class="progress rounded-pill" style="height: 8px;">
                <div class="progress-bar" :class="index === 0 ? 'bg-danger' : index === 1 ? 'bg-warning' : 'bg-info'" :style="`width: ${50 - (index * 15)}%`"></div>
              </div>
            </div>
          </div>
        </BaseCard>
      </div>
    </div>

    <!-- Mobile FAB -->
    <router-link to="/transaction/add" class="fab-button position-fixed d-md-none" style="bottom: 85px; right: 20px; z-index: 1000;">
      <BaseButton variant="primary" size="lg" class="rounded-circle shadow-lg" style="width: 60px; height: 60px; padding: 0;">
        <i class="bi bi-plus-lg fs-2"></i>
      </BaseButton>
    </router-link>
  </div>
</template>

<style scoped>
.balance-card {
  background: linear-gradient(135deg, #0d6efd 0%, #0046b8 100%) !important;
}

.border-white-10 {
  border-color: rgba(255, 255, 255, 0.1) !important;
}

.fab-button {
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.fade-in {
  animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
