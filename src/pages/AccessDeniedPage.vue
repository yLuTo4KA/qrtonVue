<script setup lang="ts">
import { ref } from 'vue';
import { useNotificationsStore } from '@/stores/notifications';
import { useUserStore } from '@/stores/user';
import { useRouter } from 'vue-router';

const notificationsStore = useNotificationsStore();
const userStore = useUserStore();
const router = useRouter();
const loading = ref(false);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const requestAccess = async () => {
  loading.value = true;
  try {
    const response = await fetch(`${API_URL}/api/user/request-access`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userStore.token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      notificationsStore.addError(error.error || 'Ошибка при отправке запроса');
      return;
    }

    notificationsStore.addSuccess('✅ Запрос отправлен администратору. Дождитесь подтверждения');
  } catch (error) {
    notificationsStore.addError('Ошибка сети при отправке запроса');
    console.error('Request error:', error);
  } finally {
    loading.value = false;
  }
};

const goHome = () => {
  router.push({ name: 'loading' });
};
</script>

<template>
  <div class="access-denied-container">
    <div class="access-denied-content">
      <div class="access-denied-icon">
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
          <circle cx="32" cy="32" r="30" stroke="currentColor" stroke-width="2" />
          <path d="M32 20v24" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
          <circle cx="32" cy="48" r="2" fill="currentColor" />
        </svg>
      </div>
      
      <h1>У вас нет доступа</h1>
      <p class="subtitle">Дождитесь подтверждения администратором</p>
      
      <button class="btn btn--primary" @click="requestAccess" :disabled="loading">
        {{ loading ? 'Отправка...' : 'Запросить подтверждение' }}
      </button>
      
      <button class="btn btn--secondary" @click="goHome" :disabled="loading">
        Назад
      </button>
    </div>
  </div>
</template>

<style scoped>
.access-denied-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100dvh;
  padding: 16px;
  background: linear-gradient(135deg, var(--tg-theme-secondary-bg-color, #f0f0f0) 0%, var(--tg-theme-bg-color, #ffffff) 100%);
}

.access-denied-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  text-align: center;
  max-width: 400px;
}

.access-denied-icon {
  color: #0ea5e9;
  opacity: 0.8;
  animation: pulse 2s infinite;
}

h1 {
  margin: 0;
  font-size: 28px;
  font-weight: 600;
  color: var(--tg-theme-text-color, #000000);
}

.subtitle {
  margin: 0;
  font-size: 16px;
  color: var(--tg-theme-hint-color, #999999);
  line-height: 1.5;
}

.btn {
  width: 100%;
  max-width: 320px;
  padding: 12px 24px;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  &:active {
    transform: scale(0.98);
  }
}

.btn--primary {
  background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%);
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.3);

  &:hover {
    box-shadow: 0 6px 16px rgba(14, 165, 233, 0.4);
  }
}

.btn--secondary {
  background: var(--tg-theme-secondary-bg-color, #f0f0f0);
  color: var(--tg-theme-text-color, #000000);
  margin-top: 8px;

  &:hover {
    background: var(--tg-theme-hint-color, #e0e0e0);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.8;
  }
  50% {
    opacity: 1;
  }
}

@media (max-width: 480px) {
  .access-denied-content {
    gap: 16px;
  }

  h1 {
    font-size: 24px;
  }

  .subtitle {
    font-size: 14px;
  }
}
</style>
