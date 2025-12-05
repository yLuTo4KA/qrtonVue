<script setup lang="ts">
interface Props {
  title?: string;
  subtitle?: string;
  icon?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  clickable?: boolean;
}

defineProps<Props>();
defineEmits<{
  click: [];
}>();
</script>

<template>
  <div
    :class="['list-item', { 'list-item--clickable': clickable }]"
    @click="clickable && $emit('click')"
  >
    <component v-if="icon" :is="icon" class="list-item-icon" :size="20" />
    <div class="list-item-content">
      <div v-if="title" class="list-item-title">{{ title }}</div>
      <div v-if="subtitle" class="list-item-subtitle">{{ subtitle }}</div>
      <slot />
    </div>
  </div>
</template>

<style scoped>
.list-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid var(--tg-theme-hint-color, #e0e0e0);

  &:last-child {
    border-bottom: none;
  }

  &.list-item--clickable {
    cursor: pointer;
    transition: all 0.2s ease;

    &:active {
      opacity: 0.7;
    }
  }
}

.list-item-icon {
  flex-shrink: 0;
  color: var(--tg-theme-accent-text-color, #0088cc);
}

.list-item-content {
  flex: 1;
  min-width: 0;
}

.list-item-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--tg-theme-text-color, #000000);
}

.list-item-subtitle {
  font-size: 14px;
  color: var(--tg-theme-hint-color, #999999);
  margin-top: 4px;
}
</style>
