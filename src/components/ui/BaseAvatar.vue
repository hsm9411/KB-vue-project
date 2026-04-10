<script setup>
const props = defineProps({
  src: String,
  size: {
    type: String,
    default: '40px'
  },
  fontSize: {
    type: String,
    default: '1.5rem'
  }
});

const isUrl = (str) => {
  if (!str) return false;
  return str.startsWith('http') || str.startsWith('/') || str.startsWith('data:');
};
</script>

<template>
  <div
    class="profile-avatar-container bg-light rounded-circle d-inline-flex align-items-center justify-content-center overflow-hidden border"
    :style="{ width: size, height: size }"
  >
    <img v-if="isUrl(src)" :src="src" class="w-100 h-100 object-fit-cover" />
    <span v-else :style="{ fontSize: fontSize }">{{ src || '👤' }}</span>
  </div>
</template>
