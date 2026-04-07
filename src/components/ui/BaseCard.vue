<script setup>
const props = defineProps({
  padding: {
    type: String,
    default: 'p-4'
  },
  shadow: {
    type: String,
    default: 'shadow-sm'
  },
  variant: {
    type: String,
    default: 'white'
  },
  noBorder: {
    type: Boolean,
    default: false
  }
});
</script>

<template>
  <div
    class="base-card rounded-4 h-100 overflow-hidden"
    :class="[
      padding,
      shadow,
      `bg-${variant}`,
      { 'border-0': noBorder, 'border border-light': !noBorder && variant === 'white' }
    ]"
  >
    <div v-if="$slots.header" class="card-header-slot mb-3 border-bottom pb-2">
      <slot name="header" />
    </div>
    <div class="card-body-slot">
      <slot />
    </div>
    <div v-if="$slots.footer" class="card-footer-slot mt-4 border-top pt-3">
      <slot name="footer" />
    </div>
  </div>
</template>

<style scoped>
.base-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.bg-white {
  background-color: #ffffff;
}

.bg-primary-light {
  background-color: #e7f1ff;
  color: #084298;
}

.bg-success-light {
  background-color: #d1e7dd;
  color: #0f5132;
}

.bg-danger-light {
  background-color: #f8d7da;
  color: #842029;
}

.card-header-slot :deep(h1),
.card-header-slot :deep(h2),
.card-header-slot :deep(h3),
.card-header-slot :deep(h4),
.card-header-slot :deep(h5),
.card-header-slot :deep(h6) {
  margin-bottom: 0;
  font-weight: 700;
}
</style>
