<script setup lang="ts">
import { QrCode, User, ShoppingBagIcon, Calendar, HomeIcon } from 'lucide-vue-next';
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

const navigateToHome = () => {
  router.push({ name: 'home' });
};

const scanAndRecord = async (): Promise<void> => {
  return new Promise((resolve) => {
    console.log('[scanAndRecord] Starting QR scan');
    
    // Use Telegram WebApp API to open QR scanner
    // @ts-expect-error - Telegram WebApp API
    if (!window.Telegram?.WebApp?.openScanQrPopup) {
      console.error('[scanAndRecord] QR scanner not available');
      notificationsStore.addError('QR сканер недоступен');
      resolve();
      return;
    }

    // @ts-expect-error - Telegram WebApp API
    window.Telegram.WebApp.openScanQrPopup(
      { text: 'Сканируйте QR код' },
      async (qrData: string | null) => {
        console.log('[scanAndRecord] QR popup callback called with:', qrData);
        
        if (!qrData) {
          console.log('[scanAndRecord] QR scan cancelled or no data');
          resolve();
          return;
        }

        try {
          const qrContent = qrData.trim();
          console.log('[scanAndRecord] QR Data received:', qrContent);

          // Get all group members with credentials
          const groupMembers = userStore.group?.members || [];
          const membersWithCredentials = groupMembers.filter(member => member.plt_login && member.plt_pass);

          if (membersWithCredentials.length === 0) {
            notificationsStore.addError('Нет пользователей с данными для входа');
            resolve();
            return;
          }

          console.log(`[scanAndRecord] Processing ${membersWithCredentials.length} members`);
          const api = "https://platonus.tau-edu.kz";
          // Process all members in parallel
          const results = await Promise.allSettled(
            membersWithCredentials.map(async (member) => {
              try {
                // Step 1: Login
                const loginResponse = await fetch(api + '/rest/api/login', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Referer': 'https://m.platonus.kz/',
                    'Origin': 'https://m.platonus.kz',
                    'User-Agent': userStore.user?.device || 'Platonus/1.132.0 (Unknown; Android 14)',
                  },
                  body: JSON.stringify({
                    authForDeductedStudentsAndGraduates: false,
                    icNumber: null,
                    iin: null,
                    login: member.plt_login,
                    password: member.plt_pass,
                  })
                });

                const loginData = await loginResponse.json();
                console.log(`[scanAndRecord] Login for ${member.plt_login}:`, loginData);

                // Step 2: Check login status and token
                if (loginData.login_status === 'success' && loginData.auth_token) {
                  const cookies = loginResponse.headers.get('set-cookie') || '';

                  // Step 3: Send to journalAttendance
                  console.log(`[scanAndRecord] Sending QR to journalAttendance for ${member.plt_login}`);

                  const journalResponse = await fetch(api + '/rest/mobile/qr-code/journalAttendance?lang=1', {
                    method: 'POST',
                    headers: {
                      'Connection': 'keep-alive',
                      'Host': 'platonus.tau-edu.kz',
                      'Accept': 'application/json, text/plain, */*',
                      'User-Agent': userStore.user?.device || 'Platonus/1.132.0 (Unknown; Android 14)',
                      'Content-Type': 'text/plain',
                      'Origin': 'https://m.platonus.kz',
                      'X-Requested-With': 'com.platonusstudent',
                      'Sec-Fetch-Site': 'cross-site',
                      'Sec-Fetch-Mode': 'cors',
                      'Sec-Fetch-Dest': 'empty',
                      'Referer': 'https://m.platonus.kz/',
                      'token': loginData.auth_token,
                      'Cookie': cookies,
                      'Accept-Encoding': 'gzip, deflate',
                    },
                    body: qrContent
                  });

                  const journalData = await journalResponse.json();
                  console.log(`[scanAndRecord] journalAttendance response for ${member.plt_login}:`, journalData);

                  return {
                    member: member.plt_login,
                    success: journalResponse.ok,
                    data: journalData
                  };
                } else {
                  console.warn(`[scanAndRecord] Login failed for ${member.plt_login}`);
                  return {
                    member: member.plt_login,
                    success: false,
                    error: 'Login failed'
                  };
                }
              } catch (error) {
                console.error(`[scanAndRecord] Error for ${member.plt_login}:`, error);
                return {
                  member: member.plt_login,
                  success: false,
                  error: String(error)
                };
              }
            })
          );

          // Check results
          const successCount = results.filter(r => r.status === 'fulfilled' && r.value?.success).length;
          const totalCount = results.length;

          console.log(`[scanAndRecord] Results: ${successCount}/${totalCount} successful`);

          // Find result for current user
          const currentUserResult = results.find(
            r => r.status === 'fulfilled' && r.value?.member === userStore.user?.plt_login
          );

          if (currentUserResult?.status === 'fulfilled') {
            const result = currentUserResult.value;
            
            // Save to database
            try {
              const saveResponse = await fetch('/api/attendance', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  qr_code: qrContent,
                  success: result.success,
                  message: result.data?.message || (result.success ? 'Успешно' : 'Ошибка'),
                  login: result.member,
                })
              });

              console.log(`[scanAndRecord] Saved to database:`, await saveResponse.json());
            } catch (error) {
              console.error('[scanAndRecord] Error saving to database:', error);
            }

            // Show notification for current user
            notificationsStore.addSuccess(`QR: ${qrContent}`);
            if (result.success) {
              notificationsStore.addSuccess(`Посещение записано: ${result.data?.message || 'Успешно'}`);
            } else {
              notificationsStore.addError(`Ошибка: ${result.data?.message || result.error || 'Неизвестная ошибка'}`);
            }
          } else {
            // Current user not found or failed
            notificationsStore.addSuccess(`QR: ${qrContent}`);
            notificationsStore.addError('Ошибка при отправке посещения для вашего аккаунта');
          }
        } catch (error) {
          console.error('[scanAndRecord] Error processing QR:', error);
          notificationsStore.addError('Ошибка обработки QR кода');
        } finally {
          resolve();
        }
      }
    );
  });
};

const handleQRClick = async () => {
  try {
    console.log('[handleQRClick] Starting QR flow');
    await scanAndRecord();
  } catch (error) {
    console.error('[handleQRClick] QR Scanner error:', error);
    notificationsStore.addError('Ошибка открытия сканера QR');
  }
};
</script>

<template>
    <div class="footer-wrapper">
        <!-- Left button group -->
        <div class="footer-group">
            <button class="footer-btn" aria-label="Shop" @click="navigateToHome"> 
                <HomeIcon :size="20" />
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
