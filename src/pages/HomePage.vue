<script setup lang="ts">
import PageLayout from '@/layouts/PageLayout.vue';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();
</script>

<template>
    <PageLayout>
        <div class="home-content">
            <!-- Приветствие -->
            <div v-if="userStore.user" class="greeting-card">
                <div class="greeting-content">
                    <div class="greeting-text">
                        <h1 class="greeting-title">👋 Добро пожаловать!</h1>
                        <p class="greeting-subtitle">{{ userStore.user.firstName }}, рады видеть тебя в QRtonus</p>
                    </div>
                    <div v-if="userStore.user.photoUrl" class="user-avatar-large">
                        <img :src="userStore.user.photoUrl" :alt="userStore.user.firstName" />
                    </div>
                </div>
            </div>

            <!-- Статус доступа -->
            <div class="status-card">
                <div class="status-item">
                    <span class="status-label">Статус доступа:</span>
                    <span v-if="userStore.user?.access" class="status-badge access-granted">✅ Доступ получен</span>
                    <span v-else class="status-badge access-pending">⏳ Ожидание одобрения</span>
                </div>
            </div>

            <!-- Предупреждения и инструкции -->
            <div class="alerts-section">
                <h2 class="section-title">⚠️ Важно знать</h2>
                
                <!-- Предупреждение 1 -->
                <div class="alert alert-warning">
                    <div class="alert-icon">📚</div>
                    <div class="alert-content">
                        <h3>Используй только на лекциях</h3>
                        <p>Можно использовать и на лабараторных, но смотрите что бы не было такого что преподователь будет называть имя для проверки презентации или чего то, он отмечен а его нет.</p>
                    </div>
                </div>

                <!-- Предупреждение 2 -->
                <div class="alert alert-warning">
                    <div class="alert-icon">👥</div>
                    <div class="alert-content">
                        <h3>Группа сканирования 5-7 человек</h3>
                        <p>Добавляй в группу не более 5-7 людей для честной отметки. Если в аудитории 1 человек, а в системе отметилось 30 — это не честно и может привести к проблемам с преподавателем.</p>
                    </div>
                </div>



                <!-- Инструкция по настройке -->
                <div class="alert alert-instruction">
                    <div class="alert-icon">⚙️</div>
                    <div class="alert-content">
                        <h3>Настрой свой профиль</h3>
                        <p><strong>Шаг 1:</strong> Перейди в <strong>Профиль</strong> → заполни свой <strong>Platonus логин</strong> и <strong>пароль</strong></p>
                        <p><strong>Шаг 2:</strong> Выбери свою <strong>группу</strong> из списка</p>
                        <p><strong>Шаг 3:</strong> Сохрани данные</p>
                    </div>
                </div>
            </div>

            <!-- Быстрая информация пользователя -->
            <div v-if="userStore.user" class="user-info-card">
                <h3 class="info-title">Твоя информация</h3>
                <div class="info-row">
                    <span class="info-label">Юзернейм:</span>
                    <span class="info-value">@{{ userStore.user.username || 'не указан' }}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">ID Telegram:</span>
                    <span class="info-value">{{ userStore.user.telegramId }}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Группа:</span>
                    <span class="info-value">{{ userStore.group?.title || '❌ не выбрана' }}</span>
                </div>
            </div>
        </div>
    </PageLayout>
</template>

<style scoped>
.home-content {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 16px;
    min-height: 100vh;
}

/* Приветствие */
.greeting-card {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 16px;
    padding: 24px;
    color: white;
    box-shadow: 0 8px 16px rgba(102, 126, 234, 0.3);
}

.greeting-content {
    display: flex;
    align-items: center;
    gap: 20px;
    justify-content: space-between;
}

.greeting-text {
    flex: 1;
}

.greeting-title {
    font-size: 32px;
    font-weight: 700;
    margin: 0 0 8px 0;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.greeting-subtitle {
    font-size: 16px;
    margin: 0;
    opacity: 0.95;
}

.user-avatar-large {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    overflow: hidden;
    border: 3px solid white;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    flex-shrink: 0;
}

.user-avatar-large img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

/* Статус */
.status-card {
    background: var(--tg-theme-secondary-bg-color, #f5f5f5);
    border-radius: 12px;
    padding: 16px;
    border-left: 4px solid #667eea;
}

.status-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.status-label {
    font-weight: 600;
    color: var(--tg-theme-text-color, #000000);
}

.status-badge {
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 14px;
    font-weight: 600;
}

.access-granted {
    background: #d4f4dd;
    color: #2d6a3e;
}

.access-pending {
    background: #fff3cd;
    color: #856404;
}

/* Предупреждения */
.alerts-section {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.section-title {
    font-size: 20px;
    font-weight: 700;
    margin: 8px 0;
    color: var(--tg-theme-text-color, #000000);
}

.alert {
    display: flex;
    gap: 12px;
    padding: 16px;
    border-radius: 12px;
    border-left: 4px solid;
}

.alert-icon {
    font-size: 24px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
}

.alert-content {
    flex: 1;
}

.alert-content h3 {
    margin: 0 0 8px 0;
    font-size: 16px;
    font-weight: 600;
}

.alert-content p {
    margin: 0;
    font-size: 14px;
    line-height: 1.5;
}

.alert-content p + p {
    margin-top: 8px;
}

.alert-info {
    background: #e3f2fd;
    border-left-color: #2196f3;
    color: #1565c0;
}

.alert-warning {
    background: #fff3e0;
    border-left-color: #ff9800;
    color: #e65100;
}

.alert-instruction {
    background: #f0f4ff;
    border-left-color: #667eea;
    color: #4a5a9e;
}

/* Информация пользователя */
.user-info-card {
    background: var(--tg-theme-secondary-bg-color, #f5f5f5);
    border-radius: 12px;
    padding: 16px;
    border: 1px solid var(--tg-theme-hint-color, #e0e0e0);
}

.info-title {
    margin: 0 0 12px 0;
    font-size: 16px;
    font-weight: 600;
    color: var(--tg-theme-text-color, #000000);
}

.info-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
    border-bottom: 1px solid var(--tg-theme-hint-color, #e0e0e0);
}

.info-row:last-child {
    border-bottom: none;
}

.info-label {
    font-weight: 500;
    color: var(--tg-theme-hint-color, #999999);
}

.info-value {
    font-weight: 600;
    color: var(--tg-theme-text-color, #000000);
    word-break: break-all;
}

/* Адаптивность */
@media (max-width: 480px) {
    .greeting-content {
        flex-direction: column;
        align-items: center;
        text-align: center;
    }

    .greeting-title {
        font-size: 28px;
    }

    .user-avatar-large {
        width: 80px;
        height: 80px;
    }
}
</style>
