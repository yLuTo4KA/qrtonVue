import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export interface User {
  id: string;
  name: string;
  telegramId: number;
  avatar?: string;
}

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null);
  const loading = ref(true);
  const error = ref<string | null>(null);

  // Check if user is authenticated
  const isAuthenticated = computed(() => !!user.value);

  // Simulate fetching user data from server
  const fetchUser = async () => {
    loading.value = true;
    error.value = null;

    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Simulate getting user data from Telegram or API
      // In real app, this would be an API call like:
      // const response = await fetch('/api/user');
      // const data = await response.json();

      // Mock user data
      const mockUser: User = {
        id: '1',
        name: 'John Doe',
        telegramId: 123456789,
        avatar: 'https://via.placeholder.com/150'
      };

      user.value = mockUser;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch user';
      user.value = null;
    } finally {
      loading.value = false;
    }
  };

  // Clear user data
  const logout = () => {
    user.value = null;
    error.value = null;
  };

  // Set user data manually
  const setUser = (userData: User) => {
    user.value = userData;
    loading.value = false;
    error.value = null;
  };

  return {
    user,
    loading,
    error,
    isAuthenticated,
    fetchUser,
    logout,
    setUser
  };
});
