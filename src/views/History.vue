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
    <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
      <h2 class="fw-bold mb-0">전체 거래 내역</h2>

      <!-- Styled Segmented Filter -->
      <div class="filter-segment d-flex bg-white p-1 rounded-4 shadow-sm border border-light" style="min-width: 300px;">
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

    <!-- Mobile-First List (Hidden on md and above) -->
    <div class="d-md-none transaction-list">
      <div v-if="filteredBudgets.length === 0" class="text-center py-5 text-muted bg-white rounded-4 shadow-sm border border-light">
        거래 내역이 없습니다.
      </div>
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
            <small class="ms-2 text-muted small extra-small">{{ item.date }}</small>
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

    <!-- Desktop Data Table (Visible on md and above) -->
    <div class="d-none d-md-block card border-0 shadow-sm rounded-4 overflow-hidden">
      <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
          <thead class="bg-light bg-opacity-50">
            <tr class="border-bottom text-muted">
              <th class="ps-4 py-3 fw-bold small text-uppercase">날짜</th>
              <th class="py-3 fw-bold small text-uppercase">거래 유형</th>
              <th class="py-3 fw-bold small text-uppercase">카테고리</th>
              <th class="py-3 fw-bold small text-uppercase">메모</th>
              <th class="py-3 fw-bold small text-uppercase text-end">금액</th>
              <th class="py-3 fw-bold small text-uppercase text-center pe-4">액션</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="filteredBudgets.length === 0">
              <td colspan="6" class="text-center py-5 text-muted">표시할 거래 내역이 없습니다.</td>
            </tr>
            <tr v-for="item in filteredBudgets" :key="item.id" class="border-bottom last-no-border">
              <td class="ps-4 py-4 text-muted small">{{ item.date }}</td>
              <td>
                <span
                  class="badge rounded-pill px-3 py-2 fw-semibold"
                  :class="item.type === 'income' ? 'bg-success-subtle text-success border border-success border-opacity-25' : 'bg-danger-subtle text-danger border border-danger border-opacity-25'"
                >
                  {{ item.type === 'income' ? '수입' : '지출' }}
                </span>
              </td>
              <td>
                <div class="d-flex align-items-center">
                  <div
                    class="category-icon-small rounded-circle me-3 d-flex align-items-center justify-content-center"
                    :class="item.type === 'income' ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'"
                    style="width: 36px; height: 36px;"
                  >
                    <i :class="getCategoryIcon(item.category)" class="fs-6"></i>
                  </div>
                  <span class="fw-bold">{{ item.category }}</span>
                </div>
              </td>
              <td class="text-muted">{{ item.memo || '-' }}</td>
              <td class="text-end pe-3 fw-bold" :class="item.type === 'income' ? 'text-success' : 'text-danger'">
                {{ item.type === 'income' ? '+' : '-' }} {{ formatCurrency(item.amount) }}
              </td>
              <td class="text-center pe-4">
                <div class="d-flex justify-content-center gap-2">
                  <router-link :to="`/transaction/edit/${item.id}`" class="btn btn-outline-secondary btn-sm px-3 rounded-3">
                    <i class="bi bi-pencil me-1"></i> 수정
                  </router-link>
                  <button @click="deleteTransaction(item.id)" class="btn btn-outline-danger btn-sm px-3 rounded-3">
                    <i class="bi bi-trash me-1"></i> 삭제
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
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
  border: 1px solid transparent;
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

.extra-small {
  font-size: 0.7rem;
}

.last-no-border:last-child {
  border-bottom: none !important;
}

.fade-in {
  animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
