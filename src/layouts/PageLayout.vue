<script setup lang="ts">
import MainLayout from './MainLayout.vue';

</script>

<template>
  <MainLayout>
    <div class="page-content">
      <slot />
    </div>

    <template #footer>
      <slot name="footer" />
    </template>
  </MainLayout>
</template>

<style scoped>
.page-header {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.page-header__title {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: var(--tg-theme-text-color, #000000);
}

.page-header__disclaimer {
  font-size: 13px;
  color: var(--tg-theme-hint-color, #888888);
  margin: 0;
}

.page-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
