<script setup>
import { computed } from 'vue';

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark', 'outline-primary', 'outline-secondary', 'outline-danger'].includes(value)
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  isFullWidth: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    default: 'button'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  }
});

const buttonClasses = computed(() => {
  const baseClass = props.variant.startsWith('outline-') ? `btn-${props.variant}` : `btn-${props.variant}`;
  return [
    'btn',
    baseClass,
    `btn-${props.size}`,
    { 'w-100': props.isFullWidth },
    'rounded-4',
    'fw-bold',
    'transition-all',
    'shadow-sm'
  ];
});
</script>

<template>
  <button :type="type" :class="buttonClasses" :disabled="disabled || loading">
    <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
    <slot />
  </button>
</template>

<style scoped>
.btn {
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1) !important;
}

.btn:active:not(:disabled) {
  transform: translateY(0);
}

.btn-lg {
  padding: 0.8rem 1.5rem;
  font-size: 1.1rem;
}

.btn-sm {
  min-height: 32px;
  padding: 0.25rem 0.75rem;
  font-size: 0.875rem;
}
</style>
