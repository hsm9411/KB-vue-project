<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useUserStore } from '../store/userStore';
import { useTxStore } from '../store/txStore';
import { useToastStore } from '../store/toastStore';
import BaseButton from '../components/ui/BaseButton.vue';
import BaseInput from '../components/ui/BaseInput.vue';
import BaseSelect from '../components/ui/BaseSelect.vue';
import BaseCard from '../components/ui/BaseCard.vue';

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();
const txStore = useTxStore();
const toastStore = useToastStore();

const isEditMode = computed(() => !!route.params.id);
const displayAmount = ref('');

const formData = reactive({
  date: new Date().toISOString().split('T')[0],
  type: 'expense',
  category: '',
  amount: 0,
  memo: '',
  isDutchPay: false,
  dutchPayHeadcount: 2,
});

// Watch displayAmount to update raw amount and format with commas
watch(displayAmount, (newVal) => {
  const numericValue = newVal.replace(/[^0-9]/g, '');
  formData.amount = numericValue ? parseInt(numericValue, 10) : 0;
  displayAmount.value = formData.amount ? new Intl.NumberFormat('ko-KR').format(formData.amount) : '';
});

const calculatedAmount = computed(() => {
  if (formData.isDutchPay && formData.dutchPayHeadcount > 1) {
    return Math.floor(formData.amount / formData.dutchPayHeadcount);
  }
  return formData.amount;
});

const categories = {
  income: ["월급", "용돈", "이자", "기타"],
  expense: ["식비", "교통비", "유흥", "공과금", "쇼핑", "기타"]
};

onMounted(() => {
  if (isEditMode.value) {
    const tx = txStore.transactions.find(t => String(t.id) === String(route.params.id));
    if (tx) {
      Object.assign(formData, tx);
      // Restore originalAmount if it exists (for editing Dutch Pay)
      if (tx.originalAmount) formData.amount = tx.originalAmount;
      displayAmount.value = new Intl.NumberFormat('ko-KR').format(formData.amount);
    }
  }
});

const handleSubmit = async () => {
  if (!formData.category) return toastStore.warning('카테고리를 선택하세요.');
  if (formData.amount <= 0) return toastStore.warning('금액을 입력하세요.');

  const payload = { ...formData, userId: userStore.user.id };
  try {
    if (isEditMode.value) {
      await txStore.updateTransaction(route.params.id, payload);
    } else {
      await txStore.addTransaction(payload);
    }
    toastStore.success('성공적으로 저장되었습니다.');
    router.push('/history');
  } catch (err) {
    // Handled by interceptor
  }
};
</script>

<template>
  <div class="transaction-form fade-in">
    <div class="mb-4">
      <h4 class="fw-bold mb-1">{{ isEditMode ? '거래 내역 수정' : '새로운 거래 등록' }}</h4>
      <p class="text-muted small">정확한 가계부 기록은 올바른 자산 관리의 시작입니다.</p>
    </div>

    <div class="row justify-content-center">
      <div class="col-12 col-md-10 col-lg-8">
        <BaseCard shadow="shadow-sm" padding="p-0" class="overflow-hidden">
          <form @submit.prevent="handleSubmit">
            <!-- Type Selector Header -->
            <div class="d-flex border-bottom">
              <button
                type="button"
                class="flex-grow-1 py-3 border-0 bg-transparent fw-bold"
                :class="{ 'text-danger border-bottom border-danger border-3': formData.type === 'expense', 'text-muted': formData.type !== 'expense' }"
                @click="formData.type = 'expense'"
              >
                <i class="bi bi-dash-circle me-2"></i>지출
              </button>
              <button
                type="button"
                class="flex-grow-1 py-3 border-0 bg-transparent fw-bold"
                :class="{ 'text-success border-bottom border-success border-3': formData.type === 'income', 'text-muted': formData.type !== 'income' }"
                @click="formData.type = 'income'"
              >
                <i class="bi bi-plus-circle me-2"></i>수입
              </button>
            </div>

            <div class="p-4">
              <div class="row g-3">
                <div class="col-md-6">
                  <BaseInput id="date" label="날짜" type="date" v-model="formData.date" required />
                </div>
                <div class="col-md-6">
                  <BaseSelect id="category" label="카테고리" :options="categories[formData.type]" v-model="formData.category" required />
                </div>
                <div class="col-12">
                  <div class="mb-3">
                    <label class="form-label fw-bold small text-muted text-uppercase mb-2 d-block">금액</label>
                    <div class="input-group input-group-lg">
                      <span class="input-group-text bg-light border-light text-muted">₩</span>
                      <input
                        type="text"
                        class="form-control bg-light border-light fw-bold"
                        v-model="displayAmount"
                        placeholder="0"
                        required
                      >
                    </div>
                  </div>
                </div>

                <!-- Dutch Pay Section -->
                <div v-if="formData.type === 'expense'" class="col-12">
                  <div class="bg-light p-3 rounded-4 border">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                      <div>
                        <h6 class="fw-bold mb-0">N빵(더치페이) 자동 계산</h6>
                        <small class="text-muted">그룹원들과 지출을 나눌 때 사용하세요.</small>
                      </div>
                      <div class="form-check form-switch">
                        <input class="form-check-input ms-0" type="checkbox" id="dutchSwitch" v-model="formData.isDutchPay">
                      </div>
                    </div>

                    <Transition name="slide">
                      <div v-if="formData.isDutchPay" class="row align-items-center pt-2 border-top">
                        <div class="col-6">
                          <BaseInput id="headcount" label="나눌 인원수" type="number" v-model.number="formData.dutchPayHeadcount" min="2" />
                        </div>
                        <div class="col-6 text-end">
                          <small class="text-muted d-block mb-1">1인당 실제 기록 금액</small>
                          <span class="fw-bold text-primary fs-5">{{ new Intl.NumberFormat('ko-KR').format(calculatedAmount) }}원</span>
                        </div>
                      </div>
                    </Transition>
                  </div>
                </div>

                <div class="col-12">
                  <div class="mb-4">
                    <label for="memo" class="form-label fw-bold small text-muted text-uppercase mb-2 d-block">메모 (선택사항)</label>
                    <textarea id="memo" class="form-control bg-light border-light rounded-3" rows="3" v-model="formData.memo" placeholder="거래에 대한 설명을 입력하세요."></textarea>
                  </div>
                </div>
              </div>

              <div class="d-flex gap-2">
                <BaseButton variant="light" size="lg" class="flex-grow-1" @click="router.back()">취소</BaseButton>
                <BaseButton variant="primary" size="lg" class="flex-grow-2" type="submit">
                  {{ isEditMode ? '수정 내용 저장' : '거래 내역 등록' }}
                </BaseButton>
              </div>
            </div>
          </form>
        </BaseCard>
      </div>
    </div>
  </div>
</template>

<style scoped>
.flex-grow-2 { flex-grow: 2; }
.slide-enter-active, .slide-leave-active { transition: all 0.3s ease; max-height: 100px; overflow: hidden; }
.slide-enter-from, .slide-leave-to { opacity: 0; max-height: 0; }
</style>
