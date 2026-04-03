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
  <div class="history">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="mb-0">거래 내역 조회</h2>
      <router-link to="/transaction/add" class="btn btn-primary">
        <i class="bi bi-plus-lg me-1"></i>내역 추가
      </router-link>
    </div>

    <!-- Filter Buttons -->
    <div class="btn-group mb-4 shadow-sm" role="group">
      <button
        type="button"
        class="btn py-2 px-4"
        :class="filter === 'all' ? 'btn-primary' : 'btn-outline-primary'"
        @click="filter = 'all'"
      >
        전체
      </button>
      <button
        type="button"
        class="btn py-2 px-4"
        :class="filter === 'income' ? 'btn-success text-white' : 'btn-outline-success'"
        @click="filter = 'income'"
      >
        수입
      </button>
      <button
        type="button"
        class="btn py-2 px-4"
        :class="filter === 'expense' ? 'btn-danger text-white' : 'btn-outline-danger'"
        @click="filter = 'expense'"
      >
        지출
      </button>
    </div>

    <!-- History List -->
    <div class="card border-0 shadow-sm">
      <div class="card-body p-0">
        <div v-if="filteredBudgets.length === 0" class="p-5 text-center text-muted">
          해당 조건의 거래 내역이 없습니다.
        </div>
        <div v-else class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead class="table-light">
              <tr>
                <th class="ps-4">날짜</th>
                <th>구분</th>
                <th>카테고리</th>
                <th>메모</th>
                <th class="text-end">금액</th>
                <th class="text-center">관리</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in filteredBudgets" :key="item.id">
                <td class="ps-4">{{ item.date }}</td>
                <td>
                  <span
                    :class="
                      item.type === 'income'
                        ? 'badge bg-success-subtle text-success border border-success'
                        : 'badge bg-danger-subtle text-danger border border-danger'
                    "
                    class="rounded-pill px-3"
                  >
                    {{ item.type === 'income' ? '수입' : '지출' }}
                  </span>
                </td>
                <td class="fw-bold">{{ item.category }}</td>
                <td class="text-muted">{{ item.memo || '-' }}</td>
                <td
                  class="text-end fw-bold"
                  :class="item.type === 'income' ? 'text-success' : 'text-danger'"
                >
                  {{ item.type === 'income' ? '+' : '-' }} {{ formatCurrency(item.amount) }}
                </td>
                <td class="text-center">
                  <router-link
                    :to="`/transaction/edit/${item.id}`"
                    class="btn btn-sm btn-outline-secondary me-2"
                  >
                    <i class="bi bi-pencil"></i>
                  </router-link>
                  <button
                    @click="deleteTransaction(item.id)"
                    class="btn btn-sm btn-outline-danger"
                  >
                    <i class="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
