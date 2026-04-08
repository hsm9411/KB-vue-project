<script setup>
import { computed } from 'vue';
import { useTxStore } from '../store/txStore';
import BaseCard from '../components/ui/BaseCard.vue';
import { Bar, Doughnut } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement
} from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement);

const txStore = useTxStore();

// Monthly Trend Data (Mocked for Demo Purpose)
const barData = {
  labels: ['2월', '3월', '4월(현재)'],
  datasets: [
    {
      label: '수입',
      backgroundColor: '#198754',
      data: [2800000, 3100000, txStore.totalIncome]
    },
    {
      label: '지출',
      backgroundColor: '#dc3545',
      data: [2100000, 1850000, txStore.totalExpense]
    }
  ]
};

// Category Data
const categoryMap = computed(() => {
  const map = {};
  txStore.monthlyTransactions
    .filter(t => t.type === 'expense')
    .forEach(t => {
      map[t.category] = (map[t.category] || 0) + t.amount;
    });
  return map;
});

const doughnutData = computed(() => ({
  labels: Object.keys(categoryMap.value),
  datasets: [{
    data: Object.values(categoryMap.value),
    backgroundColor: ['#0d6efd', '#fd7e14', '#20c997', '#ffc107', '#6f42c1', '#adb5bd'],
    borderWidth: 0
  }]
}));

const formatCurrency = (val) => new Intl.NumberFormat('ko-KR').format(val) + '원';
</script>

<template>
  <div class="summary-view fade-in">
    <h4 class="fw-bold mb-4">월별 재정 요약 리포트</h4>

    <div class="row g-4">
      <!-- 3-Month Trend -->
      <div class="col-12 col-lg-8">
        <BaseCard shadow="shadow-sm">
          <h6 class="fw-bold mb-4">최근 3개월 수입/지출 추이</h6>
          <div style="height: 300px;">
            <Bar :data="barData" :options="{ responsive: true, maintainAspectRatio: false }" />
          </div>
        </BaseCard>
      </div>

      <!-- Category Share -->
      <div class="col-12 col-lg-4">
        <BaseCard shadow="shadow-sm">
          <h6 class="fw-bold mb-4">카테고리별 지출 비중</h6>
          <div style="height: 250px;">
            <Doughnut :data="doughnutData" :options="{ responsive: true, maintainAspectRatio: false }" />
          </div>
          <div class="mt-4">
            <div v-for="(amount, cat) in categoryMap" :key="cat" class="d-flex justify-content-between mb-2 small">
              <span class="text-muted">{{ cat }}</span>
              <span class="fw-bold">{{ formatCurrency(amount) }}</span>
            </div>
          </div>
        </BaseCard>
      </div>
    </div>
  </div>
</template>
