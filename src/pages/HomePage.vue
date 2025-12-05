<script setup lang="ts">
import PageLayout from '@/layouts/PageLayout.vue';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();
</script>

<template>
    <PageLayout>
        <div class="home-content">
            <div v-if="userStore.user" class="user-profile">
                <div v-if="userStore.user.photoUrl" class="user-avatar">
                    <img :src="userStore.user.photoUrl" :alt="userStore.user.firstName" />
                </div>
                <div class="user-info">
                    <h1>{{ userStore.user.firstName }} {{ userStore.user.lastName }}</h1>
                    <p v-if="userStore.user.username" class="username">@{{ userStore.user.username }}</p>
                    <p class="telegram-id">ID: {{ userStore.user.telegramId }}</p>
                </div>
            </div>
            <div v-else class="loading">
                <p>Loading user data...</p>
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
}

.user-profile {
    display: flex;
    flex-direction: column;
    gap: 16px;
    align-items: center;
}

.user-avatar {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    overflow: hidden;
    background: var(--tg-theme-secondary-bg-color, #f0f0f0);
}

.user-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.user-info {
    text-align: center;
}

.user-info h1 {
    margin: 0;
    font-size: 24px;
    color: var(--tg-theme-text-color, #000000);
}

.username {
    margin: 8px 0 4px;
    color: var(--tg-theme-hint-color, #999999);
}

.telegram-id {
    margin: 4px 0;
    color: var(--tg-theme-hint-color, #999999);
    font-size: 14px;
}

.loading {
    text-align: center;
    padding: 32px 16px;
    color: var(--tg-theme-text-color, #000000);
}
</style>
