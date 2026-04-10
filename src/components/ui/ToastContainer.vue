<script setup>
import { useToastStore } from '../../store/toastStore';

const toastStore = useToastStore();
</script>

<template>
  <div class="toast-container position-fixed top-0 end-0 p-3" style="z-index: 2000;">
    <TransitionGroup name="toast">
      <div
        v-for="toast in toastStore.toasts"
        :key="toast.id"
        class="toast show align-items-center border-0 mb-2 shadow-lg"
        :class="[`text-bg-${toast.type}`]"
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
      >
        <div class="d-flex">
          <div class="toast-body fw-bold">
            <i v-if="toast.type === 'success'" class="bi bi-check-circle-fill me-2"></i>
            <i v-else-if="toast.type === 'danger'" class="bi bi-exclamation-triangle-fill me-2"></i>
            <i v-else class="bi bi-info-circle-fill me-2"></i>
            {{ toast.message }}
          </div>
          <button
            type="button"
            class="btn-close btn-close-white me-2 m-auto"
            @click="toastStore.remove(toast.id)"
          ></button>
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}
.toast-enter-from {
  opacity: 0;
  transform: translateX(30px);
}
.toast-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>
