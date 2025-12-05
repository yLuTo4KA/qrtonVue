<script setup lang="ts">
import { initData } from '@tma.js/sdk-vue';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';

const router = useRouter();
const userStore = useUserStore();

onMounted(async () => {
  const initDataRaw = initData.raw();
  if (initDataRaw) {
    console.log(initDataRaw);
  }

  // Fetch user data from "server"
  await userStore.fetchUser();

  // After 3 seconds, redirect to home
  const timer = setTimeout(() => {
    if (userStore.isAuthenticated) {
      router.push({ name: 'home' });
    } else {
      console.error('User not authenticated');
      // Optionally stay on loading page or show error
    }
  }, 3000);

  // Cleanup timer on component unmount
  return () => clearTimeout(timer);
})
</script>

<template>

  <div class="loading-page">
    <div class="loading-container">
      <img alt="Telegram sticker" src="https://xelene.me/telegram.gif" class="sticker" />
      <div class="loader"></div>

    </div>
  </div>

</template>

<style scoped>
.loading-page {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 44px;
  padding: 40px 20px;
}

.sticker {
  width: 120px;
  height: 120px;
  object-fit: contain;
}

.loader {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-top: 4px solid var(--tg-theme-accent-text-color, #0088cc);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.loading-text {
  font-size: 14px;
  color: var(--tg-theme-text-color, #000);
  margin: 0;
}

.index-page__links {
  list-style: none;
  padding-left: 0;
}

.index-page__link {
  font-weight: bold;
  display: inline-flex;
  gap: 5px;
}

.index-page__link-item+.index-page__link-item {
  margin-top: 10px;
}

.index-page__link-icon {
  width: 20px;
  display: block;
}

.index-page__link-icon svg {
  display: block;
}
</style>