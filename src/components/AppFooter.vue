<script setup lang="ts">
import { QrCode, User, ShoppingBagIcon, Calendar } from 'lucide-vue-next';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { useNotificationsStore } from '@/stores/notifications';

const router = useRouter();
const userStore = useUserStore();
const notificationsStore = useNotificationsStore();

const navigateToProfile = () => {
  router.push({ name: 'profile' });
};

const navigateToAttendance = () => {
  router.push({ name: 'attendance' });
};

const handleQRClick = () => {
  // Check if user has plt_login and plt_pass
  if (!userStore.user?.plt_login || !userStore.user?.plt_pass) {
    notificationsStore.addError('Заполните данные в профиле (plt_login и plt_pass)');
    // Navigate to profile page
    router.push({ name: 'profile' });
    return;
  }

  // TODO: Add QR scanner functionality here
  notificationsStore.addInfo('QR функция вскоре');
};
</script>

<template>
    <div class="footer-wrapper">
        <!-- Left button group -->
        <div class="footer-group">
            <button class="footer-btn" aria-label="Shop" disabled> 
                <ShoppingBagIcon :size="20" />
            </button>
            <button class="footer-btn" aria-label="Attendance" @click="navigateToAttendance">
                <Calendar :size="20" />
            </button>
        </div>

        <!-- Center QR button -->
        <button class="footer-btn footer-btn--center" aria-label="QR Code Scanner" @click="handleQRClick">
            <QrCode :size="40" />
        </button>

        <!-- Right button group -->
        <div class="footer-group">
            <button class="footer-btn" aria-label="Not" disabled>
                <ShoppingBagIcon :size="20" />
            </button>
            <button class="footer-btn" aria-label="Profile" @click="navigateToProfile">
                <User :size="20" />
            </button>
        </div>
    </div>
</template>

<style scoped>
.footer-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    width: 100%;
}

.footer-group {
    display: flex;
    gap: 12px;
    flex: 1;
    justify-content: space-evenly;
}


.footer-btn {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    background-color: var(--tg-theme-button-color, #0088cc);
    color: var(--tg-theme-button-text-color, #ffffff);
    transition: all 0.2s ease;
    flex-shrink: 0;

    &:active:not(:disabled) {
        opacity: 0.8;
        transform: scale(0.95);
    }

    &:hover:not(:disabled) {
        background-color: var(--tg-theme-accent-text-color, #0066aa);
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        background-color: var(--tg-theme-hint-color, #999999);
    }
}

.footer-btn--center {
    background-color: var(--tg-theme-accent-text-color, #0088cc);
    position: relative;
    z-index: 10;
    width: 60px;
    height: 60px;
    border-radius: 50%;
}
</style>
