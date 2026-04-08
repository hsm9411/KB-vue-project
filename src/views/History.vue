<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useTxStore } from '../store/txStore';
import { useUserStore } from '../store/userStore';
import BaseCard from '../components/ui/BaseCard.vue';
import BaseBadge from '../components/ui/BaseBadge.vue';
import BaseButton from '../components/ui/BaseButton.vue';
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  parseISO
} from 'date-fns';
import { ko } from 'date-fns/locale';

const router = useRouter();
const txStore = useTxStore();
const userStore = useUserStore();

const currentMonth = ref(new Date());
const selectedDate = ref(new Date());

onMounted(() => {
  if (userStore.user) txStore.fetchTransactions(userStore.user.id);
});

const calendarDays = computed(() => {
  const start = startOfWeek(startOfMonth(currentMonth.value));
  const end = endOfWeek(endOfMonth(currentMonth.value));
  return eachDayOfInterval({ start, end });
});

const nextMonth = () => currentMonth.value = addMonths(currentMonth.value, 1);
const prevMonth = () => currentMonth.value = subMonths(currentMonth.value, 1);

const selectDate = (date) => {
  selectedDate.value = date;
};

const dayTransactions = computed(() => {
  const dateStr = format(selectedDate.value, 'yyyy-MM-dd');
  return txStore.transactions.filter(t => t.date === dateStr);
});

const getDayStats = (date) => {
  const dateStr = format(date, 'yyyy-MM-dd');
  const txs = txStore.transactions.filter(t => t.date === dateStr);
  const income = txs.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expense = txs.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  return { income, expense };
};

const handleDelete = async (id) => {
  if (confirm('정말 삭제하시겠습니까?')) {
    await txStore.deleteTransaction(id);
  }
};

const handleEdit = (id) => {
  router.push(`/transaction/edit/${id}`);
};

const formatCurrency = (val) => new Intl.NumberFormat('ko-KR').format(val);
</script>

<template>
  <div class="history-view fade-in pb-5">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h4 class="fw-bold mb-0">거래 내역 조회</h4>
      <BaseButton variant="primary" size="sm" @click="router.push('/transaction/add')">
        <i class="bi bi-plus-lg me-1"></i> 추가
      </BaseButton>
    </div>

    <div class="row g-4">
      <!-- Calendar Column -->
      <div class="col-12 col-xl-7">
        <BaseCard shadow="shadow-sm" padding="p-0 overflow-hidden">
          <!-- Calendar Header -->
          <div class="d-flex justify-content-between align-items-center p-3 border-bottom bg-light">
            <BaseButton variant="light" size="sm" @click="prevMonth">
              <i class="bi bi-chevron-left"></i>
            </BaseButton>
            <h5 class="fw-bold mb-0">{{ format(currentMonth, 'yyyy년 MM월') }}</h5>
            <BaseButton variant="light" size="sm" @click="nextMonth">
              <i class="bi bi-chevron-right"></i>
            </BaseButton>
          </div>

          <!-- Calendar Grid -->
          <div class="calendar-grid">
            <div v-for="day in ['일', '월', '화', '수', '목', '금', '토']" :key="day" class="calendar-weekday">
              {{ day }}
            </div>
            <div
              v-for="date in calendarDays"
              :key="date.toString()"
              class="calendar-day"
              :class="{
                'other-month': !isSameMonth(date, currentMonth),
                'selected': isSameDay(date, selectedDate),
                'today': isSameDay(date, new Date())
              }"
              @click="selectDate(date)"
            >
              <span class="day-number">{{ format(date, 'd') }}</span>
              <div class="day-stats" v-if="getDayStats(date).income > 0 || getDayStats(date).expense > 0">
                <div v-if="getDayStats(date).income > 0" class="stat-income">
                  {{ formatCurrency(getDayStats(date).income) }}
                </div>
                <div v-if="getDayStats(date).expense > 0" class="stat-expense">
                  {{ formatCurrency(getDayStats(date).expense) }}
                </div>
              </div>
            </div>
          </div>
        </BaseCard>
      </div>

      <!-- Detail List Column -->
      <div class="col-12 col-xl-5">
        <div class="sticky-top" style="top: 1rem;">
          <h6 class="fw-bold mb-3 d-flex justify-content-between align-items-center">
            <span>{{ format(selectedDate, 'yyyy-MM-dd') }} 내역</span>
            <small class="text-muted fw-normal">{{ dayTransactions.length }}건</small>
          </h6>

          <div v-if="dayTransactions.length === 0" class="text-center py-5 text-muted bg-white rounded-4 border">
            <i class="bi bi-journal-x d-block fs-1 mb-2 opacity-25"></i>
            해당 날짜의 내역이 없습니다.
          </div>

          <div v-else class="transaction-list">
            <BaseCard
              v-for="tx in dayTransactions"
              :key="tx.id"
              class="mb-3 border-0 shadow-sm"
              padding="p-3"
            >
              <div class="d-flex align-items-center mb-2">
                <div
                  class="rounded-circle d-flex align-items-center justify-content-center me-3 flex-shrink-0"
                  :class="tx.type === 'income' ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'"
                  style="width: 40px; height: 40px;"
                >
                  <i :class="tx.type === 'income' ? 'bi-plus-lg' : 'bi-dash-lg'"></i>
                </div>
                <div class="flex-grow-1">
                  <div class="d-flex justify-content-between align-items-start">
                    <div>
                      <span class="fw-bold d-block">{{ tx.category }}</span>
                      <small class="text-muted">{{ tx.memo || '-' }}</small>
                    </div>
                    <div class="text-end">
                      <span class="fw-bold d-block" :class="tx.type === 'income' ? 'text-success' : 'text-danger'">
                        {{ tx.type === 'income' ? '+' : '-' }}{{ formatCurrency(tx.amount) }}원
                      </span>
                      <BaseBadge v-if="tx.isDutchPay" variant="info" size="sm">N빵</BaseBadge>
                    </div>
                  </div>
                </div>
              </div>
              <div class="d-flex justify-content-end gap-2 pt-2 border-top">
                <BaseButton variant="light" size="sm" class="py-1 px-3" @click="handleEdit(tx.id)">
                  <i class="bi bi-pencil-square me-1"></i> 수정
                </BaseButton>
                <BaseButton variant="outline-danger" size="sm" class="py-1 px-3" @click="handleDelete(tx.id)">
                  <i class="bi bi-trash me-1"></i> 삭제
                </BaseButton>
              </div>
            </BaseCard>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  background-color: #eee;
  gap: 1px;
}

.calendar-weekday {
  background-color: #f8f9fa;
  padding: 10px 0;
  text-align: center;
  font-weight: bold;
  font-size: 0.8rem;
  color: #666;
}

.calendar-day {
  background-color: #fff;
  min-height: 100px;
  padding: 8px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
}

.calendar-day:hover {
  background-color: #f0f7ff;
}

.calendar-day.other-month {
  color: #ccc;
  background-color: #fafafa;
}

.calendar-day.selected {
  background-color: #e7f1ff;
  box-shadow: inset 0 0 0 2px #0d6efd;
  z-index: 1;
}

.calendar-day.today .day-number {
  background-color: #0d6efd;
  color: white;
  width: 24px;
  height: 24px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.day-number {
  font-weight: bold;
  font-size: 0.9rem;
  margin-bottom: 4px;
}

.day-stats {
  font-size: 0.7rem;
  margin-top: auto;
}

.stat-income {
  color: #198754;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.stat-income::before { content: '+'; }

.stat-expense {
  color: #dc3545;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.stat-expense::before { content: '-'; }

@media (max-width: 768px) {
  .calendar-day {
    min-height: 70px;
    padding: 4px;
  }
  .day-stats {
    display: none;
  }
}
</style>
