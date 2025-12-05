<script setup lang="ts">
import { QrCode, User, List } from 'lucide-vue-next';
</script>

<template>
  <div class="footer-wrapper">
    <!-- Left button group -->
    <div class="footer-group">
      <button class="footer-btn" aria-label="History">
        <List :size="20" />
      </button>
    </div>

    <!-- Center QR button -->
    <button class="footer-btn footer-btn--center" aria-label="QR Code Scanner">
      <QrCode :size="40" />
    </button>

    <!-- Right button group -->
    <div class="footer-group">
      <button class="footer-btn" aria-label="Profile">
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
  justify-content: flex-start;
}

.footer-group:last-child {
  justify-content: flex-end;
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

  &:active {
    opacity: 0.8;
    transform: scale(0.95);
  }

  &:hover {
    background-color: var(--tg-theme-accent-text-color, #0066aa);
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
