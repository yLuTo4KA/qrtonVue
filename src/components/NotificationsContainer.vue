<script setup lang="ts">
import { computed } from 'vue';
import { useNotificationsStore } from '@/stores/notifications';
import NotificationItem from './NotificationItem.vue';

const notificationsStore = useNotificationsStore();
const notifications = computed(() => notificationsStore.notifications);
</script>

<template>
  <div class="notifications-container">
    <transition-group name="slide-down" tag="div">
      <NotificationItem
        v-for="notification in notifications"
        :key="notification.id"
        :notification="notification"
      />
    </transition-group>
  </div>
</template>

<style scoped>
.notifications-container {
  position: fixed;
  top: 12px;
  left: 12px;
  right: 12px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-width: 100%;
  pointer-events: none;
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}

.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.slide-down-move {
  transition: transform 0.3s ease;
}
</style>
