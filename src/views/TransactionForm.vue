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
  <div class="transaction-form max-width-600 mx-auto">
    <div class="card border-0 shadow-sm">
      <div class="card-header bg-white py-3">
        <h4 class="mb-0 fw-bold">{{ isEditMode ? '거래 내역 수정' : '거래 내역 추가' }}</h4>
      </div>
      <div class="card-body p-4">
        <form @submit.prevent="handleSubmit">
          <!-- Type (Income/Expense) -->
          <div class="mb-4">
            <label class="form-label d-block fw-bold">구분</label>
            <div class="btn-group w-100" role="group">
              <input
                type="radio"
                class="btn-check"
                name="type"
                id="income"
                value="income"
                v-model="formData.type"
                @change="formData.category = ''"
              />
              <label class="btn btn-outline-success py-2" for="income">수입</label>

              <input
                type="radio"
                class="btn-check"
                name="type"
                id="expense"
                value="expense"
                v-model="formData.type"
                @change="formData.category = ''"
              />
              <label class="btn btn-outline-danger py-2" for="expense">지출</label>
            </div>
          </div>

          <!-- Date -->
          <div class="mb-3">
            <label for="date" class="form-label fw-bold">날짜</label>
            <input type="date" class="form-control" id="date" v-model="formData.date" required />
          </div>

          <!-- Category -->
          <div class="mb-3">
            <label for="category" class="form-label fw-bold">카테고리</label>
            <select class="form-select" id="category" v-model="formData.category" required>
              <option value="" disabled>카테고리 선택</option>
              <option v-for="cat in categories" :key="cat" :value="cat">
                {{ cat }}
              </option>
            </select>
          </div>

          <!-- Amount -->
          <div class="mb-3">
            <label for="amount" class="form-label fw-bold">금액</label>
            <div class="input-group">
              <span class="input-group-text">₩</span>
              <input
                type="number"
                class="form-control"
                id="amount"
                v-model.number="formData.amount"
                placeholder="금액을 입력하세요"
                required
              />
            </div>
          </div>

          <!-- Memo -->
          <div class="mb-4">
            <label for="memo" class="form-label fw-bold">메모</label>
            <textarea
              class="form-control"
              id="memo"
              rows="3"
              v-model="formData.memo"
              placeholder="메모를 입력하세요 (선택 사항)"
            ></textarea>
          </div>

          <!-- Submit Buttons -->
          <div class="d-flex gap-2">
            <button
              type="button"
              class="btn btn-light flex-grow-1"
              @click="router.back()"
            >
              취소
            </button>
            <button type="submit" class="btn btn-primary flex-grow-1">
              {{ isEditMode ? '수정 완료' : '추가 완료' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.max-width-600 {
  max-width: 600px;
}
</style>
