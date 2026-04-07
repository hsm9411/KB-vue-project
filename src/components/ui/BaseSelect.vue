<script setup>
const props = defineProps({
  label: {
    type: String,
    default: ''
  },
  id: {
    type: String,
    required: true
  },
  options: {
    type: Array,
    default: () => []
  },
  required: {
    type: Boolean,
    default: false
  },
  placeholder: {
    type: String,
    default: ''
  },
  error: {
    type: String,
    default: ''
  },
  modelValue: {
    type: [String, Number],
    default: ''
  }
});

const emit = defineEmits(['update:modelValue']);

const onChange = (event) => {
  emit('update:modelValue', event.target.value);
};
</script>

<template>
  <div class="base-select-container">
    <label v-if="label" :for="id" class="form-label fw-bold small text-muted text-uppercase mb-2 d-block">
      {{ label }} <span v-if="required" class="text-danger small ms-1">*</span>
    </label>
    <select
      :id="id"
      class="form-select form-select-lg rounded-3 border-light bg-light shadow-sm"
      :class="{ 'is-invalid': error }"
      :value="modelValue"
      @change="onChange"
      v-bind="$attrs"
      :required="required"
    >
      <option value="" disabled>{{ placeholder || '선택하세요' }}</option>
      <option v-for="opt in options" :key="opt" :value="opt">
        {{ opt }}
      </option>
    </select>
    <div v-if="error" class="invalid-feedback d-block mt-1 small text-danger">
      {{ error }}
    </div>
  </div>
</template>

<style scoped>
.form-select {
  min-height: 48px;
  font-size: 1rem;
  padding: 0.8rem 1rem;
  transition: all 0.2s ease;
  border-width: 2px;
  cursor: pointer;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23adb5bd' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m2 5 6 6 6-6'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 16px 12px;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}

.form-select:focus {
  background-color: #fff !important;
  border-color: #0d6efd;
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.15);
  outline: none;
}
</style>
