<script setup lang="ts">
interface Props {
  label?: string;
  modelValue?: string | number;
  type?: 'text' | 'password' | 'email' | 'number';
  placeholder?: string;
  disabled?: boolean;
  readonly?: boolean;
  error?: string;
}

defineProps<Props>();
defineEmits<{
  'update:modelValue': [value: string | number];
}>();
</script>

<template>
  <div class="input-field">
    <label v-if="label" class="input-label">{{ label }}</label>
    <input
      :value="modelValue"
      :type="type"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :class="['input-control', { 'input-control--error': error }]"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <span v-if="error" class="input-error">{{ error }}</span>
  </div>
</template>

<style scoped>
.input-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.input-label {
  font-size: 14px;
  font-weight: 600;
  color: var(--tg-theme-text-color, #000000);
}

.input-control {
  padding: 12px 16px;
  border: 1px solid var(--tg-theme-hint-color, #e0e0e0);
  border-radius: 8px;
  background-color: var(--tg-theme-bg-color, #ffffff);
  color: var(--tg-theme-text-color, #000000);
  font-size: 16px;
  font-family: inherit;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: var(--tg-theme-accent-text-color, #0088cc);
    box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background-color: var(--tg-theme-secondary-bg-color, #f0f0f0);
  }

  &:readonly {
    background-color: var(--tg-theme-secondary-bg-color, #f0f0f0);
  }

  &.input-control--error {
    border-color: #dc2626;
  }
}

.input-error {
  font-size: 12px;
  color: #dc2626;
}
</style>
