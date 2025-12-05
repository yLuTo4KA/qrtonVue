<script setup lang="ts">
interface Props {
  items: Array<{
    label: string;
    value: string | number;
  }>;
}

defineProps<Props>();
</script>

<template>
  <div class="stat-grid">
    <div v-for="item in items" :key="item.value" class="stat-item">
      <span class="stat-label">{{ item.label }}</span>
      <span class="stat-value">{{ item.value }}</span>
    </div>
  </div>
</template>

<style scoped>
.stat-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 16px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px 12px;
  background-color: var(--tg-theme-secondary-bg-color, #f0f0f0);
  border-radius: 12px;
  text-align: center;
}

.stat-label {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  color: var(--tg-theme-hint-color, #999999);
  letter-spacing: 0.5px;
}

.stat-value {
  font-size: 18px;
  font-weight: 700;
  color: var(--tg-theme-text-color, #000000);
}
</style>
