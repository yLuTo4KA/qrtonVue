import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { initData } from '@tma.js/sdk-vue';

export interface User {
  id: string;
  telegramId: number;
  firstName?: string;
  lastName?: string;
  username?: string;
  photoUrl?: string;
  nickname?: string;
  plt_login?: string;
  plt_pass?: string;
  device?: string;
  groupId?: string;
  admin?: boolean;
}

export interface GroupMember extends User {
  groupMemberStatus?: string;
  joinedAt?: string;
  isAdmin?: boolean;
}

export interface Group {
  id: string;
  title: string;
  adminId: string;
  isActive: boolean;
  members: GroupMember[];
}

export interface GroupPreview {
  id: string;
  title: string;
  adminId: string;
  isActive: boolean;
  _count: {
    groupMembers: number;
  }
}

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null);
  const token = ref<string | null>(null);
  const group = ref<Group | null>(null);
  const groups = ref<GroupPreview[]>([]);
  const loading = ref(true);
  const error = ref<string | null>(null);

  // Check if user is authenticated
  const isAuthenticated = computed(() => !!user.value && !!token.value);

  // Fetch user data from backend API
  const fetchUser = async () => {
    loading.value = true;
    error.value = null;

    try {
      const initDataRaw = initData.raw();
      
      if (!initDataRaw) {
        throw new Error('No Telegram init data available');
      }

      const response = await fetch('http://localhost:3001/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ initData: initDataRaw })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      const data = await response.json();
      user.value = data.user;
      token.value = data.token;

      // Store token in localStorage for persistence
      if (data.token) {
        localStorage.setItem('auth_token', data.token);
      }

      // Fetch user's group if they have one
      if (data.user.groupId && data.token) {
        await fetchGroup(data.user.groupId, data.token);
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch user';
      user.value = null;
      token.value = null;
    } finally {
      loading.value = false;
    }
  };

  // Fetch group with members
  const fetchGroup = async (groupId: string, token?: string) => {
    try {
      const authToken = token || useUserStore().token;
      if (!authToken) {
        throw new Error('No authentication token');
      }

      const response = await fetch(`http://localhost:3001/api/group/${groupId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`,
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch group');
      }

      const data = await response.json();
      group.value = data;
    } catch (err) {
      console.error('Failed to fetch group:', err);
    }
  };

  // Create new group
  const createGroup = async (title: string) => {
    try {
      if (!token.value) {
        throw new Error('No authentication token');
      }

      const response = await fetch('http://localhost:3001/api/group/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token.value}`,
        },
        body: JSON.stringify({ title })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create group');
      }

      const data = await response.json();
      
      // Update user with new groupId
      if (user.value) {
        user.value.groupId = data.group.id;
      }

      // Fetch the created group
      await fetchGroup(data.group.id, token.value);

      return data.group;
    } catch (err) {
      console.error('Failed to create group:', err);
      throw err;
    }
  };

  // Fetch all available groups
  const fetchGroups = async () => {
    try {
      if (!token.value) {
        throw new Error('No authentication token');
      }

      const response = await fetch('http://localhost:3001/api/groups', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token.value}`,
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch groups');
      }

      const data = await response.json();
      groups.value = data;
    } catch (err) {
      console.error('Failed to fetch groups:', err);
    }
  };

  // Join or change to a different group
  const joinGroup = async (groupId: string) => {
    try {
      if (!token.value) {
        throw new Error('No authentication token');
      }

      const response = await fetch(`http://localhost:3001/api/group/join/${groupId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token.value}`,
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to join group');
      }

      const data = await response.json();
      
      // Update user with new groupId
      if (user.value) {
        user.value.groupId = data.user.groupId;
      }

      // Fetch the group
      await fetchGroup(groupId, token.value);

      return data;
    } catch (err) {
      console.error('Failed to join group:', err);
      throw err;
    }
  };

  // Remove member from group (admin only)
  const removeMemberFromGroup = async (groupId: string, userId: string) => {
    try {
      if (!token.value) {
        throw new Error('No authentication token');
      }

      const response = await fetch(`http://localhost:3001/api/group/${groupId}/member/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token.value}`,
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to remove member');
      }

      // Refresh the group data
      await fetchGroup(groupId, token.value);

      return await response.json();
    } catch (err) {
      console.error('Failed to remove member:', err);
      throw err;
    }
  };

  // Delete group (admin only)
  const deleteGroup = async (groupId: string) => {
    try {
      if (!token.value) {
        throw new Error('No authentication token');
      }

      const response = await fetch(`http://localhost:3001/api/group/${groupId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token.value}`,
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete group');
      }

      // Clear group data if we deleted our current group
      if (group.value?.id === groupId) {
        group.value = null;
      }

      // Clear groupId from user
      if (user.value?.groupId === groupId) {
        user.value.groupId = undefined;
      }

      // Refresh groups list
      await fetchGroups();

      return await response.json();
    } catch (err) {
      console.error('Failed to delete group:', err);
      throw err;
    }
  };

  // Clear user data
  const logout = () => {
    user.value = null;
    token.value = null;
    group.value = null;
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
    token,
    group,
    groups,
    loading,
    error,
    isAuthenticated,
    fetchUser,
    fetchGroup,
    createGroup,
    fetchGroups,
    joinGroup,
    removeMemberFromGroup,
    deleteGroup,
    logout,
    setUser,
  };
});
