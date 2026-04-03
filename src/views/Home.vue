<script setup>
import { computed } from 'vue';
import { useBudgetStore } from '../store/budgetStore';

const budgetStore = useBudgetStore();

const totalIncome = computed(() => budgetStore.totalIncome);
const totalExpense = computed(() => budgetStore.totalExpense);
const netIncome = computed(() => budgetStore.netIncome);
const recentTransactions = computed(() => budgetStore.recentBudgets);

const formatCurrency = (value) => {
  return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(value);
};
</script>

<template>
  <div class="home">
    <h2 class="mb-4">대시보드</h2>

    <!-- Summary Cards -->
    <div class="row g-4 mb-5">
      <div class="col-md-4">
        <div class="card border-0 shadow-sm bg-success text-white">
          <div class="card-body py-4">
            <h6 class="card-title text-white-50 mb-2">이번 달 총 수입</h6>
            <h3 class="card-text fw-bold">{{ formatCurrency(totalIncome) }}</h3>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card border-0 shadow-sm bg-danger text-white">
          <div class="card-body py-4">
            <h6 class="card-title text-white-50 mb-2">이번 달 총 지출</h6>
            <h3 class="card-text fw-bold">{{ formatCurrency(totalExpense) }}</h3>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card border-0 shadow-sm bg-info text-white">
          <div class="card-body py-4">
            <h6 class="card-title text-white-50 mb-2">순이익</h6>
            <h3 class="card-text fw-bold">{{ formatCurrency(netIncome) }}</h3>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Transactions -->
    <div class="card border-0 shadow-sm mb-4">
      <div class="card-header bg-white py-3 d-flex justify-content-between align-items-center">
        <h5 class="mb-0 fw-bold">최근 거래 내역</h5>
        <router-link to="/history" class="btn btn-sm btn-outline-primary">전체 보기</router-link>
      </div>
      <div class="card-body p-0">
        <div v-if="recentTransactions.length === 0" class="p-5 text-center text-muted">
          거래 내역이 없습니다.
        </div>
        <div v-else class="list-group list-group-flush">
          <div
            v-for="item in recentTransactions"
            :key="item.id"
            class="list-group-item d-flex justify-content-between align-items-center py-3"
          >
            <div>
              <div class="fw-bold">{{ item.category }}</div>
              <small class="text-muted">{{ item.date }} | {{ item.memo }}</small>
            </div>
            <div :class="item.type === 'income' ? 'text-success fw-bold' : 'text-danger fw-bold'">
              {{ item.type === 'income' ? '+' : '-' }} {{ formatCurrency(item.amount) }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- FAB (Floating Action Button) -->
    <router-link
      to="/transaction/add"
      class="btn btn-primary rounded-circle shadow-lg position-fixed"
      style="width: 60px; height: 60px; bottom: 30px; right: 30px; display: flex; align-items: center; justify-content: center; font-size: 24px; z-index: 1000;"
      title="빠른 거래 추가"
    >
      <i class="bi bi-plus-lg"></i>
    </router-link>
  </div>
</template>
