<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useUserStore } from '@/stores/user';
import PageLayout from '@/layouts/PageLayout.vue';
import { Calendar } from 'lucide-vue-next';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

interface AttendanceUser {
  id: string;
  firstName: string | null;
  lastName: string | null;
  username: string | null;
  photoUrl: string | null;
  nickname: string | null;
  plt_login: string | null;
  telegramId: number;
}

interface AttendanceRecord {
  id: string;
  userId: string;
  groupId: string;
  date: string;
  authStatus: string;
  scanStatus: string;
  createdAt: string;
  updatedAt: string;
  user: AttendanceUser;
}

interface ScanSession {
  scanTime: string;
  records: AttendanceRecord[];
}

const userStore = useUserStore();
const attendance = ref<ScanSession[]>([]);
const loading = ref(false);

const groupId = computed(() => userStore.user?.groupId);

const getAuthStatusColor = (status: string): string => {
  // Check if message contains keywords to determine color
  if (status.includes('успешно') || status.includes('Авторизована')) {
    return 'bg-green-100 text-green-800';
  }
  if (status.includes('отклонена') || status.includes('Отклонена')) {
    return 'bg-red-100 text-red-800';
  }
  if (status.includes('ожидание') || status.includes('Ожидание')) {
    return 'bg-yellow-100 text-yellow-800';
  }
  return 'bg-gray-100 text-gray-800';
};

const getScanStatusColor = (status: string): string => {
  // Check if message contains keywords to determine color
  if (status.includes('успешно') || status.includes('Сканирование прошло') || status.includes('present')) {
    return 'bg-blue-100 text-blue-800';
  }
  if (status.includes('Ручная')) {
    return 'bg-purple-100 text-purple-800';
  }
  if (status.includes('Отсутствует') || status.includes('отсутствует') || status.includes('absent')) {
    return 'bg-gray-100 text-gray-800';
  }
  return 'bg-gray-100 text-gray-800';
};

const formatDateTime = (dateStr: string): string => {
  try {
    const date = new Date(dateStr);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      console.error('[formatDateTime] Invalid date:', dateStr);
      return dateStr || 'Unknown date';
    }
    
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(date);
  } catch (error) {
    console.error('[formatDateTime] Error formatting date:', dateStr, error);
    return dateStr || 'Unknown date';
  }
};

onMounted(async () => {
  if (!groupId.value) {
    console.log('[AttendancePage] No groupId');
    return;
  }

  loading.value = true;
  console.log('[AttendancePage] Loading attendance for group:', groupId.value);
  
  try {
    const response = await fetch(`${API_URL}/api/group/${groupId.value}/attendance`, {
      headers: {
        'Authorization': `Bearer ${userStore.token}`,
      },
    });

    console.log('[AttendancePage] Response status:', response.status);

    if (response.ok) {
      const data = await response.json();
      console.log('[AttendancePage] Received data:', data);
      attendance.value = data.attendance || [];
      console.log('[AttendancePage] Scan sessions count:', attendance.value.length);
    } else {
      console.error('[AttendancePage] Response not ok:', response.status);
    }
  } catch (error) {
    console.error('[AttendancePage] Failed to load attendance:', error);
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <PageLayout>
    <div class="attendance-container">
      <div class="header">
        <div class="header-icon">
          <Calendar :size="24" />
        </div>
        <h1>Attendance</h1>
      </div>

      <div v-if="!groupId" class="no-group">
        <p>You are not in any group</p>
      </div>

      <div v-else-if="loading" class="loading">
        <p>Loading attendance records...</p>
      </div>

      <div v-else-if="attendance.length === 0" class="no-data">
        <p>No attendance records found</p>
      </div>

      <div v-else class="attendance-list">
        <div v-for="session in attendance" :key="session.scanTime" class="scan-session">
          <div class="session-header">
            <Calendar :size="18" />
            <span class="session-time">{{ formatDateTime(session.scanTime) }}</span>
            <span class="record-count">{{ session.records.length }} members</span>
          </div>

          <div class="session-records">
            <div v-for="record in session.records" :key="record.id" class="attendance-record">
              <div class="user-section">
                <div v-if="record.user.photoUrl" class="user-avatar">
                  <img :src="record.user.photoUrl" :alt="record.user.firstName || 'User'" />
                </div>
                <div v-else class="user-avatar-placeholder">
                  {{ record.user.firstName?.charAt(0) || 'U' }}
                </div>

                <div class="user-info">
                  <div class="user-name">
                    {{ record.user.firstName }} {{ record.user.lastName }}
                  </div>
                  <div v-if="record.user.username" class="user-username">
                    @{{ record.user.username }}
                  </div>
                  <div v-if="record.user.plt_login" class="user-plt-login">
                    {{ record.user.plt_login }}
                  </div>
                </div>
              </div>

              <div class="status-section">
                <div class="status-item">
                  <span :class="['status-message', getScanStatusColor(record.scanStatus)]">
                    {{ record.scanStatus }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </PageLayout>
</template>

<style scoped>
.attendance-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 16px;
}

.header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
}

.header-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--tg-theme-button-color, #0088cc);
}

.header h1 {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  color: var(--tg-theme-text-color, #000000);
}

.no-group,
.no-data,
.loading {
  text-align: center;
  padding: 40px 20px;
  color: var(--tg-theme-hint-color, #999999);
  font-size: 14px;
}

.attendance-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.scan-session {
  background: var(--tg-theme-secondary-bg-color, #f0f0f0);
  border-radius: 12px;
  overflow: hidden;
}

.session-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  background: var(--tg-theme-button-color, #0088cc);
  color: var(--tg-theme-button-text-color, #ffffff);
  font-weight: 600;
}

.session-time {
  flex: 1;
}

.record-count {
  font-size: 12px;
  opacity: 0.8;
}

.session-records {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.attendance-record {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid var(--tg-theme-hint-color, #cccccc);
  gap: 12px;
}

.attendance-record:last-child {
  border-bottom: none;
}

.user-section {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  flex: 1;
  min-width: 0;
}

.user-avatar,
.user-avatar-placeholder {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  flex-shrink: 0;
  background: var(--tg-theme-button-color, #0088cc);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-avatar-placeholder {
  color: var(--tg-theme-button-text-color, #ffffff);
  font-weight: 600;
  font-size: 18px;
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.user-name {
  font-weight: 600;
  font-size: 14px;
  color: var(--tg-theme-text-color, #000000);
}

.user-username {
  font-size: 12px;
  color: var(--tg-theme-hint-color, #999999);
}

.user-plt-login {
  font-size: 12px;
  color: var(--tg-theme-text-color, #000000);
  opacity: 0.7;
}

.status-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex-shrink: 0;
  max-width: 200px;
}

.status-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: flex-start;
}

.status-label {
  font-size: 10px;
  font-weight: 600;
  color: var(--tg-theme-hint-color, #999999);
  text-transform: uppercase;
}

.status-message {
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  line-height: 1.4;
  word-break: break-word;
}

.bg-green-100 {
  background-color: #d1fae5;
}

.text-green-800 {
  color: #065f46;
}

.bg-red-100 {
  background-color: #fee2e2;
}

.text-red-800 {
  color: #7f1d1d;
}

.bg-yellow-100 {
  background-color: #fef3c7;
}

.text-yellow-800 {
  color: #78350f;
}

.bg-blue-100 {
  background-color: #dbeafe;
}

.text-blue-800 {
  color: #1e3a8a;
}

.bg-purple-100 {
  background-color: #ede9fe;
}

.text-purple-800 {
  color: #4c1d95;
}

.bg-gray-100 {
  background-color: #f3f4f6;
}

.text-gray-800 {
  color: #1f2937;
}
</style>
