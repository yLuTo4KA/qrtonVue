<script setup lang="ts" name="AppAlert">
interface Props {
  variant?: 'success' | 'info' | 'warning' | 'error';
  closeable?: boolean;
  title?: string;
}

withDefaults(defineProps<Props>(), {
  variant: 'info',
  closeable: false,
});

const isVisible = defineModel<boolean>('visible', { default: true });
</script>

<template>
  <div v-if="isVisible" :class="['alert', `alert--${variant}`]">
    <div class="alert-content">
      <div v-if="title" class="alert-title">{{ title }}</div>
      <div class="alert-message">
        <slot />
      </div>
    </div>
    <button
      v-if="closeable"
      class="alert-close"
      @click="isVisible = false"
      aria-label="Close alert"
    >
      ×
    </button>
  </div>
</template>

<style scoped>
.alert {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 8px;
  border-left: 4px solid;
  animation: slideIn 0.3s ease-out;
}

.alert-content {
  flex: 1;
}

.alert-title {
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 4px;
}

.alert-message {
  font-size: 14px;
  line-height: 1.5;
}

.alert-close {
  flex-shrink: 0;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.2s;

  &:hover {
    opacity: 1;
  }
}

/* Variants */
.alert--success {
  background-color: #dcfce7;
  color: #166534;
  border-left-color: #16a34a;
}

.alert--info {
  background-color: #dbeafe;
  color: #0c4a6e;
  border-left-color: #0ea5e9;
}

.alert--warning {
  background-color: #fef3c7;
  color: #92400e;
  border-left-color: #f59e0b;
}

.alert--error {
  background-color: #fee2e2;
  color: #7f1d1d;
  border-left-color: #dc2626;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
