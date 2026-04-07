<script setup>
import { ref, computed } from 'vue';
import { useBudgetStore } from '../store/budgetStore';

const budgetStore = useBudgetStore();
const filter = ref('all');

const filteredBudgets = computed(() => {
  if (filter.value === 'income') {
    return budgetStore.sortedBudgets.filter((item) => item.type === 'income');
  } else if (filter.value === 'expense') {
    return budgetStore.sortedBudgets.filter((item) => item.type === 'expense');
  }
  return budgetStore.sortedBudgets;
});

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

const deleteTransaction = async (id) => {
  if (confirm('정말로 삭제하시겠습니까?')) {
    try {
      await budgetStore.deleteBudget(id);
      alert('성공적으로 삭제되었습니다.');
    } catch (err) {
      alert('삭제에 실패했습니다.');
    }
  }
};
</script>

<template>
  <div class="history-view fade-in">
    <div class="header mb-4">
      <h4 class="fw-bold mb-3">거래 내역 조회</h4>

      <!-- Styled Segmented Filter -->
      <div class="filter-segment d-flex bg-white-50 p-1 rounded-4 shadow-sm border border-light">
        <button
          v-for="f in ['all', 'income', 'expense']"
          :key="f"
          @click="filter = f"
          class="btn flex-grow-1 border-0 py-2 rounded-4 transition-all"
          :class="filter === f ? 'btn-primary shadow-sm' : 'text-muted'"
        >
          {{ f === 'all' ? '전체' : f === 'income' ? '수입' : '지출' }}
        </button>
      </div>
    </div>

    <!-- Grouped Transactions by Date -->
    <div v-if="filteredBudgets.length === 0" class="text-center py-5 text-muted bg-white rounded-4 shadow-sm border border-light">
      <i class="bi bi-calendar-x fs-1 d-block mb-2"></i>
      해당 조건의 거래 내역이 없습니다.
    </div>
    <div v-else class="transaction-list">
      <div
        v-for="item in filteredBudgets"
        :key="item.id"
        class="transaction-tile d-flex align-items-center bg-white p-3 rounded-4 shadow-sm mb-3 position-relative overflow-hidden"
      >
        <div
          class="category-icon rounded-4 me-3 d-flex align-items-center justify-content-center"
          :class="item.type === 'income' ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'"
          style="width: 48px; height: 48px; flex-shrink: 0;"
        >
          <i :class="getCategoryIcon(item.category)" class="fs-4"></i>
        </div>
        <div class="flex-grow-1 overflow-hidden me-2">
          <div class="d-flex align-items-center">
            <h6 class="fw-bold mb-0 text-truncate">{{ item.category }}</h6>
            <small class="ms-2 text-muted-extra small">{{ item.date }}</small>
          </div>
          <small class="text-muted d-block text-truncate small">{{ item.memo || '기록 없음' }}</small>
        </div>
        <div class="text-end d-flex flex-column align-items-end">
          <div :class="item.type === 'income' ? 'text-success fw-bold' : 'text-danger fw-bold'" class="mb-1">
            {{ item.type === 'income' ? '+' : '-' }} {{ formatCurrency(item.amount) }}
          </div>
          <div class="action-buttons d-flex gap-1">
            <router-link :to="`/transaction/edit/${item.id}`" class="btn btn-sm btn-icon-only text-secondary rounded-circle">
              <i class="bi bi-pencil"></i>
            </router-link>
            <button @click="deleteTransaction(item.id)" class="btn btn-sm btn-icon-only text-danger rounded-circle">
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.filter-segment {
  background-color: #f1f3f5;
}

.transition-all {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.transaction-tile {
  border: 1px solid #f8f9fa;
  animation: slideIn 0.3s ease-out;
}

.btn-icon-only {
  width: 32px;
  height: 32px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8f9fa;
}

.btn-icon-only:active {
  background-color: #e9ecef;
}

.text-muted-extra {
  font-size: 0.7rem;
  color: #adb5bd;
}

@keyframes slideIn {
  from { opacity: 0; transform: translateX(-10px); }
  to { opacity: 1; transform: translateX(0); }
}

.fade-in {
  animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
