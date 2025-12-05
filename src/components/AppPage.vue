<script setup lang="ts">
</script>

<template>
  <div class="page">
    <slot />
  </div>
</template>

<style>
.page {
  padding: 0 10px;
  box-sizing: border-box;
  height: 100%;
}

.page__disclaimer {
  margin-bottom: 16px;
}
</style>