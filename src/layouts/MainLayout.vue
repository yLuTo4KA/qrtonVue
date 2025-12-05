<script setup lang="ts">
import { useBackButton } from '@/composables/useBackButton';
import AppFooter from '@/components/AppFooter.vue';
import { onMounted } from 'vue';

// Initialize back button handling
onMounted(() => {
  useBackButton();
});
</script>

<template>
  <div class="layout">
    <header class="layout__header" v-if="$slots.header">
      <slot name="header" />
    </header>
    
    <main class="layout__content">
      <slot />
    </main>
    
    <footer class="layout__footer">
      <AppFooter />
      <slot name="footer" />
    </footer>
  </div>
</template>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--tg-theme-bg-color, #ffffff);
}

.layout__header {
  flex-shrink: 0;
  padding: 16px;
  border-bottom: 1px solid var(--tg-theme-hint-color, #e0e0e0);
}

.layout__content {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 16px;
  box-sizing: border-box;
  padding-bottom: 100px;
}

.layout__footer {
  flex-shrink: 0;
  padding: 16px 12px;
  border-top: 1px solid var(--tg-theme-hint-color, #e0e0e0);
  background: var(--tg-theme-secondary-bg-color, #f5f5f5);
  display: flex;
  justify-content: center;
}
</style>
