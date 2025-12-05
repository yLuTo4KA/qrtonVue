<script setup lang="ts" name="AppAvatar">
interface Props {
  src?: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

withDefaults(defineProps<Props>(), {
  size: 'md',
  alt: 'Avatar',
});
</script>

<template>
  <div :class="['avatar', `avatar--${size}`]">
    <img v-if="src" :src="src" :alt="alt" class="avatar-image" />
    <div v-else class="avatar-placeholder">👤</div>
  </div>
</template>

<style scoped>
.avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: var(--tg-theme-secondary-bg-color, #f0f0f0);
  overflow: hidden;
  flex-shrink: 0;
}

.avatar--sm {
  width: 32px;
  height: 32px;
  font-size: 16px;
}

.avatar--md {
  width: 48px;
  height: 48px;
  font-size: 24px;
}

.avatar--lg {
  width: 80px;
  height: 80px;
  font-size: 36px;
}

.avatar--xl {
  width: 120px;
  height: 120px;
  font-size: 48px;
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}
</style>
