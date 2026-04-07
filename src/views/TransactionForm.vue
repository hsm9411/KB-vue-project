<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useBudgetStore } from '../store/budgetStore';
import budgetApi from '../api/budgetApi';

const router = useRouter();
const route = useRoute();
const budgetStore = useBudgetStore();

const isEditMode = computed(() => !!route.params.id);
const loading = ref(false);

const formData = reactive({
  date: new Date().toISOString().split('T')[0],
  type: 'expense',
  category: '',
  amount: 0,
  memo: '',
});

const categories = computed(() => {
  return formData.type === 'income'
    ? budgetStore.incomeCategories
    : budgetStore.expenseCategories;
});

onMounted(async () => {
  if (isEditMode.value) {
    loading.value = true;
    try {
      const response = await budgetApi.getBudget(route.params.id);
      Object.assign(formData, response.data);
    } catch (err) {
      alert('데이터를 불러오지 못했습니다.');
      router.push('/history');
    } finally {
      loading.value = false;
    }
  }
});

const handleSubmit = async () => {
  if (!formData.category) {
    alert('카테고리를 선택해주세요.');
    return;
  }
  if (formData.amount <= 0) {
    alert('금액을 입력해주세요.');
    return;
  }

  try {
    if (isEditMode.value) {
      await budgetStore.updateBudget(route.params.id, formData);
      alert('성공적으로 수정되었습니다.');
    } else {
      await budgetStore.addBudget(formData);
      alert('성공적으로 추가되었습니다.');
    }
    router.push('/history');
  } catch (err) {
    alert('저장에 실패했습니다.');
  }
};
</script>

<template>
  <div class="transaction-form-view fade-in">
    <div class="d-flex align-items-center mb-4">
      <button @click="router.back()" class="btn btn-icon-only text-secondary me-3">
        <i class="bi bi-chevron-left fs-4"></i>
      </button>
      <h4 class="fw-bold mb-0">{{ isEditMode ? '거래 내역 수정' : '새 거래 추가' }}</h4>
    </div>

    <div class="form-container bg-white rounded-4 shadow-sm p-4 border border-light">
      <form @submit.prevent="handleSubmit">
        <!-- Styled Segmented Type Switcher -->
        <div class="mb-4">
          <label class="form-label d-block fw-bold small text-muted text-uppercase mb-2">거래 유형</label>
          <div class="type-segment d-flex bg-light p-1 rounded-4 shadow-sm border border-light">
            <button
              type="button"
              @click="formData.type = 'income'; formData.category = '';"
              class="btn flex-grow-1 border-0 py-2 rounded-4 transition-all"
              :class="formData.type === 'income' ? 'btn-success text-white shadow-sm' : 'text-muted'"
            >
              수입
            </button>
            <button
              type="button"
              @click="formData.type = 'expense'; formData.category = '';"
              class="btn flex-grow-1 border-0 py-2 rounded-4 transition-all"
              :class="formData.type === 'expense' ? 'btn-danger text-white shadow-sm' : 'text-muted'"
            >
              지출
            </button>
          </div>
        </div>

        <!-- Date Input -->
        <div class="mb-3">
          <label for="date" class="form-label fw-bold small text-muted text-uppercase mb-2">날짜</label>
          <input
            type="date"
            class="form-control form-control-lg rounded-3 border-light bg-light"
            id="date"
            v-model="formData.date"
            required
          />
        </div>

        <!-- Category Dropdown -->
        <div class="mb-3">
          <label for="category" class="form-label fw-bold small text-muted text-uppercase mb-2">카테고리</label>
          <select
            class="form-select form-select-lg rounded-3 border-light bg-light"
            id="category"
            v-model="formData.category"
            required
          >
            <option value="" disabled>카테고리를 선택하세요</option>
            <option v-for="cat in categories" :key="cat" :value="cat">
              {{ cat }}
            </option>
          </select>
        </div>

        <!-- Amount Input -->
        <div class="mb-3">
          <label for="amount" class="form-label fw-bold small text-muted text-uppercase mb-2">금액 (원)</label>
          <div class="input-group input-group-lg">
            <span class="input-group-text border-light bg-light text-muted">₩</span>
            <input
              type="number"
              class="form-control form-control-lg rounded-end-3 border-light bg-light fw-bold"
              id="amount"
              v-model.number="formData.amount"
              placeholder="0"
              required
            />
          </div>
        </div>

        <!-- Memo Input -->
        <div class="mb-5">
          <label for="memo" class="form-label fw-bold small text-muted text-uppercase mb-2">메모 (선택)</label>
          <textarea
            class="form-control form-control-lg rounded-3 border-light bg-light"
            id="memo"
            rows="3"
            v-model="formData.memo"
            placeholder="기록하고 싶은 내용을 입력하세요"
          ></textarea>
        </div>

        <!-- Full-Width Bottom Button -->
        <div class="fixed-bottom p-4 mx-auto" style="max-width: 480px; z-index: 1050;">
          <button type="submit" class="btn btn-primary btn-lg w-100 py-3 rounded-4 shadow-lg fw-bold">
            <i class="bi bi-check-lg me-2"></i>{{ isEditMode ? '내용 수정하기' : '거래 내역 저장하기' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.form-control-lg, .form-select-lg {
  font-size: 1rem;
  padding: 0.8rem 1rem;
}

.type-segment {
  background-color: #f1f3f5;
}

.btn-icon-only {
  width: 44px;
  height: 44px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #dee2e6;
  border-radius: 12px;
  background-color: white;
}

.btn-icon-only:active {
  background-color: #f8f9fa;
}

.transition-all {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-in {
  animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Ensure form doesn't overlap with FAB or Bottom Nav */
.transaction-form-view {
  padding-bottom: 120px;
}
</style>
