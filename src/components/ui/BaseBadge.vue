<script setup>
import { computed } from 'vue';

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'].includes(value)
  },
  pill: {
    type: Boolean,
    default: true
  },
  soft: {
    type: Boolean,
    default: true
  }
});

const badgeClasses = computed(() => {
  const base = props.soft ? `bg-${props.variant}-subtle text-${props.variant} border border-${props.variant} border-opacity-25` : `bg-${props.variant} text-white`;
  return [
    'badge',
    base,
    { 'rounded-pill': props.pill, 'rounded-3': !props.pill },
    'px-3',
    'py-2',
    'fw-bold'
  ];
});
</script>

<template>
  <span :class="badgeClasses">
    <slot />
  </span>
</template>

<style scoped>
.badge {
  font-size: 0.8rem;
  letter-spacing: -0.01em;
}
</style>
