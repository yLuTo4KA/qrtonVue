<script setup lang="ts">
import { computed } from 'vue';
import { X, AlertCircle, CheckCircle, Info } from 'lucide-vue-next';
import type { Notification } from '@/stores/notifications';
import { useNotificationsStore } from '@/stores/notifications';

interface Props {
  notification: Notification;
}

const props = defineProps<Props>();
const notificationsStore = useNotificationsStore();

const notificationClass = computed(() => {
  return `notification notification--${props.notification.type}`;
});

const icon = computed(() => {
  switch (props.notification.type) {
    case 'error':
      return AlertCircle;
    case 'success':
      return CheckCircle;
    case 'info':
    default:
      return Info;
  }
});

const closeNotification = () => {
  notificationsStore.removeNotification(props.notification.id);
};
</script>

<template>
  <div :class="notificationClass">
    <div class="notification-content">
      <component :is="icon" class="notification-icon" :size="20" />
      <p class="notification-message">{{ notification.message }}</p>
    </div>
    <button class="notification-close" @click="closeNotification" aria-label="Close notification">
      <X :size="18" />
    </button>
  </div>
</template>

<style scoped>
.notification {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
  animation: slideIn 0.3s ease-out;
  pointer-events: auto;
  max-width: 100%;
}

.notification-content {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
  min-width: 0;
}

.notification-icon {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
}

.notification-message {
  margin: 0;
  word-break: break-word;
  white-space: normal;
}

.notification-close {
  flex-shrink: 0;
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s ease;
  opacity: 0.7;

  &:hover {
    opacity: 1;
    background-color: rgba(0, 0, 0, 0.1);
  }

  &:active {
    transform: scale(0.9);
  }
}

/* Error notification - soft red */
.notification--error {
  background-color: #fee2e2;
  color: #7f1d1d;
  border-left: 4px solid #dc2626;

  .notification-icon {
    color: #dc2626;
  }

  .notification-close {
    color: #7f1d1d;

    &:hover {
      background-color: rgba(127, 29, 29, 0.1);
    }
  }
}

/* Success notification - green */
.notification--success {
  background-color: #dcfce7;
  color: #166534;
  border-left: 4px solid #16a34a;

  .notification-icon {
    color: #16a34a;
  }

  .notification-close {
    color: #166534;

    &:hover {
      background-color: rgba(22, 101, 52, 0.1);
    }
  }
}

/* Info notification - blue */
.notification--info {
  background-color: #dbeafe;
  color: #0c4a6e;
  border-left: 4px solid #0ea5e9;

  .notification-icon {
    color: #0ea5e9;
  }

  .notification-close {
    color: #0c4a6e;

    &:hover {
      background-color: rgba(12, 74, 110, 0.1);
    }
  }
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

@media (max-width: 480px) {
  .notification {
    font-size: 13px;
    padding: 10px 12px;
  }

  .notification-icon {
    min-width: 18px;
  }
}
</style>
