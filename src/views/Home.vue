<script setup>
import { computed } from 'vue';
import { useBudgetStore } from '../store/budgetStore';
import { useProfileStore } from '../store/profileStore';

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
    <!-- Header/Profile Brief -->
    <header class="d-flex justify-content-between align-items-center mb-4 pt-2">
      <div>
        <small class="text-muted d-block">반가워요!</small>
        <h5 class="fw-bold mb-0">{{ userName }}님</h5>
      </div>
      <div class="profile-avatar bg-primary-subtle text-primary rounded-circle d-flex align-items-center justify-content-center fw-bold" style="width: 44px; height: 44px;">
        {{ userName.substring(0, 2) }}
      </div>
    </header>

    <!-- Balance Card -->
    <section class="balance-card bg-primary text-white p-4 rounded-4 shadow-lg mb-5">
      <div class="mb-4">
        <small class="text-white-50">현재 총 잔액</small>
        <h2 class="fw-bold mb-0 mt-1">{{ formatCurrency(netIncome) }}</h2>
      </div>

      <div class="row g-3 pt-3 border-top border-white-10">
        <div class="col-6">
          <div class="d-flex align-items-center">
            <div class="income-icon bg-white bg-opacity-20 rounded-circle me-2 d-flex align-items-center justify-content-center" style="width: 32px; height: 32px;">
              <i class="bi bi-arrow-down-short"></i>
            </div>
            <div>
              <small class="text-white-50 d-block">수입</small>
              <span class="fw-bold small">{{ formatCurrency(totalIncome) }}</span>
            </div>
          </div>
        </div>
        <div class="col-6">
          <div class="d-flex align-items-center">
            <div class="expense-icon bg-white bg-opacity-20 rounded-circle me-2 d-flex align-items-center justify-content-center" style="width: 32px; height: 32px;">
              <i class="bi bi-arrow-up-short"></i>
            </div>
            <div>
              <small class="text-white-50 d-block">지출</small>
              <span class="fw-bold small">{{ formatCurrency(totalExpense) }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Recent Transactions Header -->
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h6 class="fw-bold mb-0">최근 거래 내역</h6>
      <router-link to="/history" class="text-primary text-decoration-none small">더보기</router-link>
    </div>

    <!-- Transaction List Tiles -->
    <div v-if="recentTransactions.length === 0" class="text-center py-5 text-muted bg-white rounded-4 shadow-sm border border-light">
      <i class="bi bi-inbox fs-1 d-block mb-2"></i>
      거래 내역이 없습니다.
    </div>
    <div v-else class="transaction-list">
      <div
        v-for="item in recentTransactions"
        :key="item.id"
        class="transaction-tile d-flex align-items-center bg-white p-3 rounded-4 shadow-sm mb-3"
      >
        <div
          class="category-icon rounded-4 me-3 d-flex align-items-center justify-content-center"
          :class="item.type === 'income' ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'"
          style="width: 50px; height: 50px; flex-shrink: 0;"
        >
          <i :class="getCategoryIcon(item.category)" class="fs-4"></i>
        </div>
        <div class="flex-grow-1 overflow-hidden">
          <h6 class="fw-bold mb-0 text-truncate">{{ item.category }}</h6>
          <small class="text-muted d-block text-truncate">{{ item.memo || item.date }}</small>
        </div>
        <div class="text-end ms-2" :class="item.type === 'income' ? 'text-success fw-bold' : 'text-danger fw-bold'">
          {{ item.type === 'income' ? '+' : '-' }} {{ formatCurrency(item.amount) }}
        </div>
      </div>
    </div>

    <!-- FAB (Floating Action Button) -->
    <router-link
      to="/transaction/add"
      class="fab-button btn btn-primary rounded-circle shadow-lg position-absolute d-flex align-items-center justify-content-center"
      style="width: 60px; height: 60px; bottom: 85px; right: 20px; z-index: 1000;"
    >
      <i class="bi bi-plus-lg fs-2"></i>
    </router-link>
  </div>
</template>

<style scoped>
.balance-card {
  background: linear-gradient(135deg, #0d6efd 0%, #0046b8 100%);
  border: none;
}

.border-white-10 {
  border-color: rgba(255, 255, 255, 0.1) !important;
}

.transaction-tile {
  border: 1px solid #f8f9fa;
  transition: transform 0.2s ease;
}

.transaction-tile:active {
  transform: scale(0.98);
  background-color: #f8f9fa;
}

.fab-button {
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.fab-button:active {
  transform: scale(0.9) rotate(45deg);
}

.fade-in {
  animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
