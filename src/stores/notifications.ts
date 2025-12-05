import { defineStore } from 'pinia';
import { ref } from 'vue';

export type NotificationType = 'error' | 'success' | 'info';

export interface Notification {
  id: string;
  message: string;
  type: NotificationType;
  duration?: number;
}

export const useNotificationsStore = defineStore('notifications', () => {
  const notifications = ref<Notification[]>([]);
  let notificationId = 0;

  const addNotification = (
    message: string,
    type: NotificationType = 'info',
    duration: number = 4000
  ) => {
    const id = `notification-${++notificationId}`;
    const notification: Notification = {
      id,
      message,
      type,
      duration,
    };

    notifications.value.push(notification);

    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }

    return id;
  };

  const removeNotification = (id: string) => {
    const index = notifications.value.findIndex(n => n.id === id);
    if (index > -1) {
      notifications.value.splice(index, 1);
    }
  };

  const addError = (message: string, duration?: number) => {
    return addNotification(message, 'error', duration);
  };

  const addSuccess = (message: string, duration?: number) => {
    return addNotification(message, 'success', duration);
  };

  const addInfo = (message: string, duration?: number) => {
    return addNotification(message, 'info', duration);
  };

  return {
    notifications,
    addNotification,
    removeNotification,
    addError,
    addSuccess,
    addInfo,
  };
});
