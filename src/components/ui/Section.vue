<script setup lang="ts" name="AppSection">
interface Props {
  title?: string;
  description?: string;
  gap?: 'sm' | 'md' | 'lg';
}

withDefaults(defineProps<Props>(), {
  gap: 'md',
});
</script>

<template>
  <div :class="['section', `section--gap-${gap}`]">
    <div v-if="title" class="section-header">
      <h3 class="section-title">{{ title }}</h3>
      <p v-if="description" class="section-description">{{ description }}</p>
    </div>
    <div class="section-content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.section {
  display: flex;
  flex-direction: column;
}

.section-header {
  margin-bottom: 12px;
}

.section-title {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: var(--tg-theme-text-color, #000000);
}

.section-description {
  margin: 4px 0 0;
  font-size: 14px;
  color: var(--tg-theme-hint-color, #999999);
}

.section-content {
  display: flex;
  flex-direction: column;
  gap: var(--gap-size);
}

/* Gap variants */
.section--gap-sm {
  --gap-size: 8px;
}

.section--gap-md {
  --gap-size: 12px;
}

.section--gap-lg {
  --gap-size: 16px;
}
</style>
