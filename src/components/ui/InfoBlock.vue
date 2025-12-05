<script setup lang="ts">
interface Props {
  /** Поддерживает HTML контент через slot */
  asCard?: boolean;
}

withDefaults(defineProps<Props>(), {
  asCard: false,
});
</script>

<template>
  <div :class="['info-block', { 'info-block--card': asCard }]">
    <slot />
  </div>
</template>

<style scoped>
.info-block {
  background-color: var(--tg-theme-section-bg-color, #ffffff);
  border-radius: 12px;
  padding: 16px;
  transition: all 0.2s ease;
}

.info-block--card {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>
