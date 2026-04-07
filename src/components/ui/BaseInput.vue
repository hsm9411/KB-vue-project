<script setup>
const props = defineProps({
  label: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'text'
  },
  placeholder: {
    type: String,
    default: ''
  },
  id: {
    type: String,
    required: true
  },
  required: {
    type: Boolean,
    default: false
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

const onInput = (event) => {
  emit('update:modelValue', event.target.value);
};
</script>

<template>
  <div class="base-input-container">
    <label v-if="label" :for="id" class="form-label fw-bold small text-muted text-uppercase mb-2 d-block">
      {{ label }} <span v-if="required" class="text-danger small ms-1">*</span>
    </label>
    <div class="input-wrapper position-relative">
      <input
        :type="type"
        :id="id"
        class="form-control form-control-lg rounded-3 border-light bg-light"
        :class="{ 'is-invalid': error }"
        :placeholder="placeholder"
        :value="modelValue"
        @input="onInput"
        v-bind="$attrs"
        :required="required"
      />
    </div>
    <div v-if="error" class="invalid-feedback d-block mt-1 small">
      {{ error }}
    </div>
  </div>
</template>

<style scoped>
.form-control {
  min-height: 44px;
  font-size: 1rem;
  padding: 0.8rem 1rem;
  transition: all 0.2s ease;
  border-width: 2px;
}

.form-control:focus {
  background-color: #fff !important;
  border-color: #0d6efd;
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.15);
  outline: none;
}

.form-label {
  letter-spacing: 0.05em;
}

.invalid-feedback {
  font-weight: 500;
  color: #dc3545;
}

/* Chrome, Safari, Edge, Opera: Remove arrows from number input */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox: Remove arrows from number input */
input[type=number] {
  -moz-appearance: textfield;
}
</style>
