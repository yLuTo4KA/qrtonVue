<script setup lang="ts">
interface Props {
  type?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
}

withDefaults(defineProps<Props>(), {
  type: 'primary',
  size: 'md',
  disabled: false,
  loading: false,
  fullWidth: false,
});
</script>

<template>
  <button
    :class="[
      'btn',
      `btn--${type}`,
      `btn--${size}`,
      { 'btn--disabled': disabled },
      { 'btn--loading': loading },
      { 'btn--full-width': fullWidth }
    ]"
    :disabled="disabled || loading"
  >
    <span v-if="loading" class="btn-loader"></span>
    <slot />
  </button>
</template>

<style scoped>
.btn {
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-family: inherit;

  &:active:not(:disabled) {
    transform: scale(0.98);
  }

  &:hover:not(:disabled) {
    opacity: 0.9;
  }
}

/* Sizes */
.btn--sm {
  padding: 8px 16px;
  font-size: 12px;
}

.btn--md {
  padding: 12px 24px;
  font-size: 14px;
}

.btn--lg {
  padding: 16px 32px;
  font-size: 16px;
}

/* Types */
.btn--primary {
  background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%);
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.3);
}

.btn--secondary {
  background: var(--tg-theme-secondary-bg-color, #f0f0f0);
  color: var(--tg-theme-text-color, #000000);
}

.btn--danger {
  background: #dc2626;
  color: #ffffff;
}

.btn--ghost {
  background: transparent;
  color: var(--tg-theme-text-color, #000000);
  border: 1px solid var(--tg-theme-hint-color, #999999);
}

/* States */
.btn--disabled,
.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn--loading {
  pointer-events: none;
}

.btn--full-width {
  width: 100%;
}

/* Loader animation */
.btn-loader {
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
