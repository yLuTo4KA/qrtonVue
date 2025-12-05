<script setup lang="ts">
import { useBackButton } from '@/composables/useBackButton';
import NotificationsContainer from '@/components/NotificationsContainer.vue';

useBackButton();
</script>

<template>
  <div class="scroll-container">
    <RouterView />
    <NotificationsContainer />
  </div>
</template>


<style>
.scroll-container {
  overflow-y: scroll;
  min-height: 100dvh;
}
</style>