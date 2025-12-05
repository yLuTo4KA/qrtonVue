<script setup lang="ts">
import { useBackButton } from '@/composables/useBackButton';

useBackButton();
</script>

<template>
  <div class="scroll-container">
    <RouterView />
  </div>
</template>


<style>
.scroll-container {
  overflow-y: scroll;
  min-height: 100dvh;
}
</style>