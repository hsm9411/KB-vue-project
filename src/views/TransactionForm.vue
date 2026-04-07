<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useBudgetStore } from '../store/budgetStore';
import budgetApi from '../api/budgetApi';
import BaseButton from '../components/ui/BaseButton.vue';
import BaseInput from '../components/ui/BaseInput.vue';
import BaseSelect from '../components/ui/BaseSelect.vue';
import BaseCard from '../components/ui/BaseCard.vue';

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
    <!-- Breadcrumb / Title -->
    <div class="d-flex align-items-center mb-4 pt-md-2">
      <button @click="router.back()" class="btn-back-mobile text-secondary me-3 shadow-sm d-md-none">
        <i class="bi bi-chevron-left fs-4"></i>
      </button>
      <nav aria-label="breadcrumb" class="d-none d-md-block">
        <ol class="breadcrumb mb-0">
          <li class="breadcrumb-item"><router-link to="/">홈</router-link></li>
          <li class="breadcrumb-item"><router-link to="/history">거래 내역</router-link></li>
          <li class="breadcrumb-item active" aria-current="page">{{ isEditMode ? '수정' : '추가' }}</li>
        </ol>
      </nav>
      <h4 class="fw-bold mb-0 d-md-none">{{ isEditMode ? '수정' : '추가' }}</h4>
    </div>

    <div class="row g-4 justify-content-center">
      <div class="col-12 col-md-8 col-lg-6">
        <BaseCard shadow="shadow-lg" padding="p-4 p-md-5">
          <template #header>
            <h2 class="fw-bold mb-0 d-none d-md-block text-center">{{ isEditMode ? '거래 내역 수정' : '새로운 거래 등록' }}</h2>
          </template>

          <form @submit.prevent="handleSubmit">
            <!-- Styled Segmented Type Switcher -->
            <div class="mb-4">
              <label class="form-label d-block fw-bold small text-muted text-uppercase mb-2">거래 유형</label>
              <div class="type-segment d-flex bg-light p-1 rounded-4 shadow-sm border border-light">
                <button
                  type="button"
                  @click="formData.type = 'income'; formData.category = '';"
                  class="btn-segment flex-grow-1 border-0 py-3 rounded-4 transition-all"
                  :class="formData.type === 'income' ? 'bg-success text-white shadow-sm fw-bold' : 'text-muted'"
                >
                  <i class="bi bi-arrow-down-left-circle me-1"></i> 수입
                </button>
                <button
                  type="button"
                  @click="formData.type = 'expense'; formData.category = '';"
                  class="btn-segment flex-grow-1 border-0 py-3 rounded-4 transition-all"
                  :class="formData.type === 'expense' ? 'bg-danger text-white shadow-sm fw-bold' : 'text-muted'"
                >
                  <i class="bi bi-arrow-up-right-circle me-1"></i> 지출
                </button>
              </div>
            </div>

            <div class="row g-3">
              <!-- Date Input -->
              <div class="col-md-6 mb-3">
                <BaseInput
                  id="date"
                  label="날짜"
                  type="date"
                  v-model="formData.date"
                  required
                />
              </div>

              <!-- Category Dropdown -->
              <div class="col-md-6 mb-3">
                <BaseSelect
                  id="category"
                  label="카테고리"
                  :options="categories"
                  placeholder="카테고리를 선택하세요"
                  v-model="formData.category"
                  required
                />
              </div>

              <!-- Amount Input -->
              <div class="col-12 mb-3">
                <BaseInput
                  id="amount"
                  label="금액 (원)"
                  type="number"
                  v-model.number="formData.amount"
                  placeholder="0"
                  required
                />
              </div>

              <!-- Memo Input -->
              <div class="col-12 mb-4 mb-md-5">
                <div class="base-input-container">
                  <label for="memo" class="form-label fw-bold small text-muted text-uppercase mb-2 d-block">메모 (선택)</label>
                  <textarea
                    class="form-control form-control-lg rounded-3 border-light bg-light"
                    id="memo"
                    rows="4"
                    v-model="formData.memo"
                    placeholder="지출 내역에 대해 간단히 메모해 보세요"
                  ></textarea>
                </div>
              </div>
            </div>

            <!-- Full-Width Bottom Button (Mobile) or Inline Button (Desktop) -->
            <div class="d-none d-md-flex gap-3">
              <BaseButton variant="outline-secondary" size="lg" isFullWidth @click="router.back()">취소</BaseButton>
              <BaseButton variant="primary" size="lg" isFullWidth type="submit">
                <i class="bi bi-save me-2"></i>{{ isEditMode ? '수정 완료' : '등록 완료' }}
              </BaseButton>
            </div>

            <div class="fixed-bottom p-4 d-md-none" style="z-index: 1050; max-width: 480px; margin: 0 auto; left: 0; right: 0;">
              <BaseButton variant="primary" size="lg" isFullWidth type="submit" shadow="shadow-lg">
                <i class="bi bi-save me-2"></i>{{ isEditMode ? '내용 수정하기' : '거래 등록하기' }}
              </BaseButton>
            </div>
          </form>
        </BaseCard>
      </div>
    </div>
  </div>
</template>

<style scoped>
.type-segment {
  background-color: #f1f3f5;
}

.btn-segment {
  background: transparent;
  outline: none;
}

.btn-back-mobile {
  width: 44px;
  height: 44px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background-color: white;
  border: none;
}

.form-control-lg {
  font-size: 1rem;
  padding: 0.8rem 1rem;
  border-width: 2px;
}

.form-control:focus {
  background-color: #fff !important;
  border-color: #0d6efd;
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.15);
  outline: none;
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

@media (max-width: 767.98px) {
  .transaction-form-view {
    padding-bottom: 120px;
  }
}
</style>
