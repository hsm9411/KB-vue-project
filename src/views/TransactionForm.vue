<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useUserStore } from '../store/userStore';
import { useTxStore } from '../store/txStore';
import BaseButton from '../components/ui/BaseButton.vue';
import BaseInput from '../components/ui/BaseInput.vue';
import BaseSelect from '../components/ui/BaseSelect.vue';
import BaseCard from '../components/ui/BaseCard.vue';

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();
const txStore = useTxStore();

const isEditMode = computed(() => !!route.params.id);
const formData = reactive({
  date: new Date().toISOString().split('T')[0],
  type: 'expense',
  category: '',
  amount: 0,
  memo: '',
  isDutchPay: false,
  dutchPayHeadcount: 2,
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
    const tx = txStore.transactions.find(t => t.id === route.params.id);
    if (tx) Object.assign(formData, tx);
  }
});

const handleSubmit = async () => {
  if (!formData.category) return alert('카테고리를 선택하세요.');
  if (formData.amount <= 0) return alert('금액을 입력하세요.');

  const payload = { ...formData, userId: userStore.user.id };
  try {
    if (isEditMode.value) {
      await txStore.updateTransaction(route.params.id, payload);
    } else {
      await txStore.addTransaction(payload);
    }
    alert('저장되었습니다.');
    router.push('/history');
  } catch (err) {
    alert('저장 실패');
  }
};
</script>

<template>
  <div class="transaction-form fade-in">
    <h4 class="fw-bold mb-4">{{ isEditMode ? '거래 수정' : '거래 등록' }}</h4>

    <div class="row justify-content-center">
      <div class="col-12 col-md-8 col-lg-6">
        <BaseCard shadow="shadow-sm">
          <form @submit.prevent="handleSubmit">
            <div class="d-flex gap-2 mb-4">
              <BaseButton
                type="button"
                variant="outline-primary"
                class="flex-grow-1"
                :class="{ active: formData.type === 'income' }"
                @click="formData.type = 'income'"
              >수입</BaseButton>
              <BaseButton
                type="button"
                variant="outline-danger"
                class="flex-grow-1"
                :class="{ active: formData.type === 'expense' }"
                @click="formData.type = 'expense'"
              >지출</BaseButton>
            </div>

            <BaseInput id="date" label="날짜" type="date" v-model="formData.date" class="mb-3" required />
            <BaseSelect id="category" label="카테고리" :options="categories[formData.type]" v-model="formData.category" class="mb-3" required />
            <BaseInput id="amount" label="금액" type="number" v-model.number="formData.amount" class="mb-3" required />

            <!-- Dutch Pay Section -->
            <div v-if="formData.type === 'expense'" class="bg-light p-3 rounded-3 mb-3 border">
              <div class="form-check form-switch mb-2">
                <input class="form-check-input" type="checkbox" id="dutchSwitch" v-model="formData.isDutchPay">
                <label class="form-check-label fw-bold" for="dutchSwitch">N빵(더치페이) 계산기</label>
              </div>
              <div v-if="formData.isDutchPay" class="row align-items-center">
                <div class="col-6">
                  <BaseInput id="headcount" label="인원수" type="number" v-model.number="formData.dutchPayHeadcount" min="2" />
                </div>
                <div class="col-6 text-end">
                  <small class="text-muted d-block">1인당 예상 금액</small>
                  <span class="fw-bold text-primary">{{ new Intl.NumberFormat().format(calculatedAmount) }}원</span>
                </div>
              </div>
            </div>

            <div class="mb-4">
              <label for="memo" class="form-label fw-bold small text-muted text-uppercase mb-2 d-block">메모</label>
              <textarea id="memo" class="form-control bg-light border-light" rows="3" v-model="formData.memo"></textarea>
            </div>

            <BaseButton variant="primary" size="lg" isFullWidth type="submit">
              {{ isEditMode ? '수정하기' : '등록하기' }}
            </BaseButton>
          </form>
        </BaseCard>
      </div>
    </div>
  </div>
</template>

<style scoped>
.btn-outline-primary.active { background-color: #0d6efd; color: white; }
.btn-outline-danger.active { background-color: #dc3545; color: white; }
</style>
