<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useUserStore } from '@/stores/user';
import PageLayout from '@/layouts/PageLayout.vue';
import { Eye, EyeOff, Crown, Plus, X, Trash2 } from 'lucide-vue-next';

const DEVICES = {
  'Xiaomi11p': 'Platonus/1.132.0 (Xiaomi Redmi 11 pro; Android 14)',
  'Xiaomi12p': 'Platonus/1.132.0 (Xiaomi Redmi 12 pro; Android 14)',
  'Xiaomi13p': 'Platonus/1.132.0 (Xiaomi Redmi 13 pro; Android 14)',
  'Samsung24': 'Platonus/1.132.0 (Samsung Galaxy S24; Android 16)',
  'Samsung24U': 'Platonus/1.132.0 (Samsung Galaxy S24 Ultra; Android 16)',
  'Samsung25+': 'Platonus/1.132.0 (Samsung Galaxy S25+; Android 16)',
  'Apple11': 'Platonus/1.132.0 (Apple Iphone 11; IOS 18)',
  'Apple12p': 'Platonus/1.132.0 (Apple Iphone 12 pro; IOS 26.2)',
  'Apple15p': 'Platonus/1.132.0 (Apple Iphone 15 pro; IOS 26.2)',
};

const userStore = useUserStore();
const showPassword = ref(false);
const isEditingPlt = ref(false);
const pltName = ref('');
const pltPass = ref('');
const pltDevice = ref('');
const showCreateGroup = ref(false);
const showChangeGroup = ref(false);
const newGroupTitle = ref('');
const creatingGroup = ref(false);
const joiningGroup = ref(false);

const currentGroup = computed(() => {
    return userStore.group;
});

const groupMembers = computed(() => {
    const members = userStore.group?.members || [];
    // Sort so admin is first
    return [...members].sort((a, b) => {
        if (a.isAdmin) return -1;
        if (b.isAdmin) return 1;
        return 0;
    });
});

const deviceName = computed(() => {
    if (!userStore.user?.device) return '-';
    // Find device name by user-agent string
    for (const [name, userAgent] of Object.entries(DEVICES)) {
        if (userAgent === userStore.user.device) {
            return name;
        }
    }
    return '-';
});

onMounted(async () => {
    // Fetch available groups when component mounts
    await userStore.fetchGroups();
});

const handleUpdatePlt = async () => {
    try {
        const response = await fetch('http://localhost:3001/api/user/profile', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userStore.token}`
            },
            body: JSON.stringify({
                nickname: pltName.value,
                plt_pass: pltPass.value,
                ...(pltDevice.value && { device: pltDevice.value })
            })
        });

        if (response.ok) {
            const data = await response.json();
            // Обновляем стор с новыми данными
            userStore.user = data;
            isEditingPlt.value = false;
            pltName.value = '';
            pltPass.value = '';
            pltDevice.value = '';
        }
    } catch (error) {
        console.error('Failed to update profile:', error);
    }
};

const handleStartEdit = () => {
    pltName.value = userStore.user?.nickname || '';
    pltPass.value = userStore.user?.plt_pass || '';
    pltDevice.value = userStore.user?.device || '';
    isEditingPlt.value = true;
};

const handleCancelEdit = () => {
    isEditingPlt.value = false;
    pltName.value = '';
    pltPass.value = '';
    pltDevice.value = '';
};

const handleCreateGroup = async () => {
    if (!newGroupTitle.value.trim()) {
        return;
    }

    creatingGroup.value = true;
    try {
        await userStore.createGroup(newGroupTitle.value);
        showCreateGroup.value = false;
        newGroupTitle.value = '';
        // Refresh groups list
        await userStore.fetchGroups();
    } catch (error) {
        console.error('Failed to create group:', error);
    } finally {
        creatingGroup.value = false;
    }
};

const handleJoinGroup = async (groupId: string) => {
    joiningGroup.value = true;
    try {
        await userStore.joinGroup(groupId);
        showChangeGroup.value = false;
    } catch (error) {
        console.error('Failed to join group:', error);
    } finally {
        joiningGroup.value = false;
    }
};

const handleRemoveMember = async (memberId: string) => {
    if (!currentGroup.value) return;

    try {
        await userStore.removeMemberFromGroup(currentGroup.value.id, memberId);
    } catch (error) {
        console.error('Failed to remove member:', error);
    }
};

const handleDeleteGroup = async () => {
    if (!currentGroup.value) return;

    if (!confirm(`Delete group "${currentGroup.value.title}"? This cannot be undone.`)) {
        return;
    }

    try {
        await userStore.deleteGroup(currentGroup.value.id);
    } catch (error) {
        console.error('Failed to delete group:', error);
    }
};

const handleDeleteGroupFromList = async (groupId: string, groupTitle: string) => {
    if (!confirm(`Delete group "${groupTitle}"? This cannot be undone.`)) {
        return;
    }

    try {
        await userStore.deleteGroup(groupId);
    } catch (error) {
        console.error('Failed to delete group:', error);
    }
};
</script>

<template>
    <PageLayout>
        <div class="profile-container">
            <!-- Avatar Section -->
            <div class="avatar-section">
                <div v-if="userStore.user?.photoUrl" class="avatar">
                    <img :src="userStore.user.photoUrl" :alt="userStore.user.firstName" />
                </div>
                <div v-else class="avatar-placeholder">
                    {{ userStore.user?.firstName?.charAt(0) || 'U' }}
                </div>
            </div>

            <!-- Block 1: Telegram Info -->
            <div class="info-block">
                <h2 class="block-title">Telegram</h2>
                <div class="info-row">
                    <span class="label">Name:</span>
                    <span class="value">{{ userStore.user?.firstName }} {{ userStore.user?.lastName }}</span>
                </div>
                <div class="info-row">
                    <span class="label">Username:</span>
                    <span class="value">@{{ userStore.user?.username }}</span>
                </div>
                <div class="info-row">
                    <span class="label">Telegram ID:</span>
                    <span class="value">{{ userStore.user?.telegramId }}</span>
                </div>
            </div>

            <!-- Block 2: Platonus Info -->
            <div class="info-block">
                <div class="block-header">
                    <h2 class="block-title">Platonus</h2>
                    <button v-if="!isEditingPlt" class="edit-btn" @click="handleStartEdit">
                        Edit
                    </button>
                </div>

                <div v-if="!isEditingPlt" class="info-content">
                    <div class="info-row">
                        <span class="label">Nickname:</span>
                        <span class="value">{{ userStore.user?.nickname || '-' }}</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Password:</span>
                        <div class="password-row">
                            <input type="password" class="password-input" :value="userStore.user?.plt_pass || ''"
                                disabled />
                            <button class="toggle-btn" @click="showPassword = !showPassword">
                                <Eye v-if="!showPassword" :size="18" />
                                <EyeOff v-else :size="18" />
                            </button>
                        </div>
                        <input v-if="showPassword" type="text" class="password-preview"
                            :value="userStore.user?.plt_pass || ''" disabled readonly />
                    </div>
                    <div class="info-row">
                        <span class="label">Device:</span>
                        <span class="value">{{ deviceName }}</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Group:</span>
                        <div class="group-selector">
                            <span class="group-title">{{ currentGroup?.title || 'No Group' }}</span>
                            <div class="group-buttons">

                                <button class="change-group-btn" @click="showChangeGroup = true">
                                    Change
                                </button>
                                <button v-if="currentGroup && userStore.user?.id === currentGroup.adminId"
                                    class="btn-delete-group" @click="handleDeleteGroup" title="Delete group">
                                    <Trash2 :size="16" />
                                </button>
                            </div>

                            <!-- Create Group Modal -->
                            <div v-if="showCreateGroup" class="create-group-modal">
                                <div class="modal-content">
                                    <h3>Create New Group</h3>
                                    <input v-model="newGroupTitle" type="text" class="form-input"
                                        placeholder="Group name" @keyup.enter="handleCreateGroup" />
                                    <div class="modal-actions">
                                        <button class="btn-save" @click="handleCreateGroup"
                                            :disabled="creatingGroup || !newGroupTitle.trim()">
                                            {{ creatingGroup ? 'Creating...' : 'Create' }}
                                        </button>
                                        <button class="btn-cancel" @click="showCreateGroup = false"
                                            :disabled="creatingGroup">
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <!-- Change Group Modal -->
                            <div v-if="showChangeGroup" class="change-group-modal">
                                <div class="modal-content">
                                    <h3>Select Group</h3>
                                    <div class="groups-list">
                                        <div v-for="g in userStore.groups" :key="g.id" class="group-item-wrapper">
                                            <button class="group-item" @click="handleJoinGroup(g.id)"
                                                :disabled="joiningGroup || g.id === currentGroup?.id">
                                                <div class="group-item-title">{{ g.title }}</div>
                                                <div class="group-item-meta">{{ g._count.groupMembers }} members</div>
                                            </button>
                                            <button v-if="userStore.user?.admin" class="btn-delete-group-item"
                                                @click="handleDeleteGroupFromList(g.id, g.title)" title="Delete group">
                                                <Trash2 :size="18" />
                                            </button>
                                        </div>
                                    </div>
                                    <div class="modal-actions">
                                        <button class="btn-create-new"
                                            @click="showChangeGroup = false; showCreateGroup = true">
                                            <Plus :size="16" />
                                            Create New Group
                                        </button>
                                        <button class="btn-cancel" @click="showChangeGroup = false"
                                            :disabled="joiningGroup">
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div v-else class="edit-form">
                    <div class="form-group">
                        <label>Nickname:</label>
                        <input v-model="pltName" type="text" class="form-input" />
                    </div>
                    <div class="form-group">
                        <label>Password:</label>
                        <input v-model="pltPass" type="password" class="form-input" />
                    </div>
                    <div class="form-group">
                        <label>Device:</label>
                        <select v-model="pltDevice" class="form-input">
                            <option value="">Select device...</option>
                            <option v-for="(userAgent, deviceName) in DEVICES" :key="deviceName" :value="userAgent">
                                {{ deviceName }}
                            </option>
                        </select>
                    </div>
                    <div class="form-actions">
                        <button class="btn-save" @click="handleUpdatePlt">Save</button>
                        <button class="btn-cancel" @click="handleCancelEdit">Cancel</button>
                    </div>
                </div>
            </div>

            <!-- Group Members Section -->
            <div v-if="currentGroup && groupMembers.length > 0" class="members-section">
                <h2 class="section-title">Group Members</h2>
                <div class="members-list">
                    <div v-for="member in groupMembers" :key="member.id" class="member-card">
                        <div class="member-avatar-wrapper">
                            <div v-if="member.photoUrl" class="member-avatar">
                                <img :src="member.photoUrl" :alt="member.firstName" />
                            </div>
                            <div v-else class="member-avatar-placeholder">
                                {{ member.firstName?.charAt(0) || 'M' }}
                            </div>
                            <div v-if="member.isAdmin" class="admin-badge">
                                <Crown :size="14" />
                            </div>
                        </div>
                        <div class="member-info">
                            <div class="member-name">{{ member.firstName }} {{ member.lastName }}</div>
                            <a v-if="member.username" :href="`https://t.me/${member.username}`" target="_blank"
                                class="member-username">
                                @{{ member.username }}
                            </a>
                            <div class="member-id">ID: {{ member.telegramId }}</div>
                            <div v-if="member.nickname" class="member-nickname">{{ member.nickname }}</div>
                            <div v-if="member.plt_login" class="member-plt">{{ member.plt_login }}</div>
                        </div>
                        <div v-if="userStore.user?.id === currentGroup?.adminId && member.id !== userStore.user?.id"
                            class="member-actions">
                            <button class="btn-remove-member" @click="handleRemoveMember(member.id)"
                                title="Remove member">
                                <X :size="18" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </PageLayout>
</template>

<style scoped>
.profile-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 16px;
}

.avatar-section {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
}

.avatar {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    overflow: hidden;
    background: var(--tg-theme-secondary-bg-color, #f0f0f0);
    flex-shrink: 0;
}

.avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.avatar-placeholder {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    background: var(--tg-theme-button-color, #0088cc);
    color: var(--tg-theme-button-text-color, #ffffff);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 48px;
    font-weight: bold;
}

.info-block {
    background: var(--tg-theme-secondary-bg-color, #f0f0f0);
    border-radius: 12px;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.block-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.block-title {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    color: var(--tg-theme-text-color, #000000);
}

.edit-btn {
    padding: 6px 12px;
    background: var(--tg-theme-button-color, #0088cc);
    color: var(--tg-theme-button-text-color, #ffffff);
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 12px;
    font-weight: 600;
    transition: all 0.2s;
}

.edit-btn:active {
    opacity: 0.8;
    transform: scale(0.95);
}

.info-content {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.info-row {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
}

.label {
    font-size: 13px;
    font-weight: 600;
    color: var(--tg-theme-hint-color, #999999);
    min-width: 100px;
}

.value {
    font-size: 14px;
    color: var(--tg-theme-text-color, #000000);
    word-break: break-all;
}

.password-row {
    display: flex;
    gap: 8px;
    align-items: center;
    flex: 1;
}

.password-input {
    flex: 1;
    padding: 8px;
    background: var(--tg-theme-bg-color, #ffffff);
    border: 1px solid var(--tg-theme-hint-color, #cccccc);
    border-radius: 6px;
    color: var(--tg-theme-text-color, #000000);
    font-size: 14px;
}

.toggle-btn {
    padding: 6px 12px;
    background: var(--tg-theme-button-color, #0088cc);
    color: var(--tg-theme-button-text-color, #ffffff);
    border: none;
    border-radius: 6px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
}

.password-preview {
    width: 100%;
    padding: 8px;
    background: var(--tg-theme-bg-color, #ffffff);
    border: 1px solid var(--tg-theme-button-color, #0088cc);
    border-radius: 6px;
    color: var(--tg-theme-text-color, #000000);
    font-size: 14px;
    margin-top: 8px;
}

.group-selector {
    display: flex;
    align-items: center;
    gap: 8px;
    position: relative;
    flex: 1;
}

.group-title {
    font-size: 14px;
    color: var(--tg-theme-text-color, #000000);
    flex: 1;
}

.change-btn {
    padding: 6px 12px;
    background: var(--tg-theme-button-color, #0088cc);
    color: var(--tg-theme-button-text-color, #ffffff);
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 12px;
    font-weight: 600;
}

.create-group-btn {
    padding: 6px 12px;
    background: var(--tg-theme-button-color, #0088cc);
    color: var(--tg-theme-button-text-color, #ffffff);
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 12px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 4px;
}

.create-group-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.modal-content {
    background: var(--tg-theme-secondary-bg-color, #f0f0f0);
    border-radius: 12px;
    padding: 20px;
    min-width: 280px;
    max-width: 90%;
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.modal-content h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    color: var(--tg-theme-text-color, #000000);
}

.modal-actions {
    display: flex;
    gap: 8px;
}

.group-dropdown {
    position: absolute;
    top: 100%;
    right: 0;
    background: var(--tg-theme-secondary-bg-color, #f0f0f0);
    border: 1px solid var(--tg-theme-hint-color, #cccccc);
    border-radius: 8px;
    min-width: 150px;
    z-index: 100;
    margin-top: 4px;
}

.group-option {
    display: block;
    width: 100%;
    padding: 10px 12px;
    background: none;
    border: none;
    cursor: pointer;
    text-align: left;
    font-size: 14px;
    color: var(--tg-theme-text-color, #000000);
    transition: background 0.2s;

    &:hover {
        background: var(--tg-theme-button-color, #0088cc);
        color: var(--tg-theme-button-text-color, #ffffff);
    }

    &.active {
        background: var(--tg-theme-button-color, #0088cc);
        color: var(--tg-theme-button-text-color, #ffffff);
        font-weight: 600;
    }
}

.edit-form {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.form-group label {
    font-size: 13px;
    font-weight: 600;
    color: var(--tg-theme-text-color, #000000);
}

.form-input {
    padding: 10px;
    background: var(--tg-theme-bg-color, #ffffff);
    border: 1px solid var(--tg-theme-hint-color, #cccccc);
    border-radius: 6px;
    color: var(--tg-theme-text-color, #000000);
    font-size: 14px;
}

.form-actions {
    display: flex;
    gap: 8px;
    margin-top: 8px;
}

.btn-save {
    flex: 1;
    padding: 10px;
    background: var(--tg-theme-button-color, #0088cc);
    color: var(--tg-theme-button-text-color, #ffffff);
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
    font-size: 14px;
}

.btn-cancel {
    flex: 1;
    padding: 10px;
    background: var(--tg-theme-hint-color, #cccccc);
    color: var(--tg-theme-text-color, #000000);
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
    font-size: 14px;
}

.members-section {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.section-title {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    color: var(--tg-theme-text-color, #000000);
}

.members-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.member-card {
    display: flex;
    gap: 12px;
    padding: 12px;
    background: var(--tg-theme-secondary-bg-color, #f0f0f0);
    border-radius: 10px;
}

.member-avatar-wrapper {
    position: relative;
    width: 48px;
    height: 48px;
    flex-shrink: 0;
}

.member-avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    overflow: hidden;
    flex-shrink: 0;
    background: var(--tg-theme-button-color, #0088cc);
}

.member-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.member-avatar-placeholder {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: var(--tg-theme-button-color, #0088cc);
    color: var(--tg-theme-button-text-color, #ffffff);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    flex-shrink: 0;
}

.member-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
    flex: 1;
}

.member-name {
    font-size: 14px;
    font-weight: 600;
    color: var(--tg-theme-text-color, #000000);
}

.member-username {
    font-size: 12px;
    color: var(--tg-theme-button-color, #0088cc);
    text-decoration: none;

    &:hover {
        text-decoration: underline;
    }
}

.member-id {
    font-size: 12px;
    color: var(--tg-theme-hint-color, #999999);
}

.member-nickname {
    font-size: 12px;
    color: var(--tg-theme-text-color, #000000);
    font-weight: 500;
}

.member-plt {
    font-size: 12px;
    color: var(--tg-theme-button-color, #0088cc);
    font-weight: 500;
}

.admin-badge {
    position: absolute;
    top: -6px;
    right: -6px;
    width: 28px;
    height: 28px;
    background: var(--tg-theme-button-color, #0088cc);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--tg-theme-button-text-color, #ffffff);
    border: 2px solid var(--tg-theme-secondary-bg-color, #f0f0f0);
}

.member-actions {
    display: flex;
    align-items: center;
    gap: 8px;
}

.btn-remove-member {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    background: #ff4444;
    border: none;
    border-radius: 6px;
    color: white;
    cursor: pointer;
    transition: background 0.2s, opacity 0.2s;
    flex-shrink: 0;
}

.btn-remove-member:hover {
    background: #ff2222;
    opacity: 0.9;
}

.btn-remove-member:active {
    background: #cc0000;
    opacity: 0.8;
}

.group-buttons {
    display: flex;
    gap: 8px;
}

.create-group-btn,
.change-group-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 12px;
    background: var(--tg-theme-button-color, #0088cc);
    color: var(--tg-theme-button-text-color, #ffffff);
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: opacity 0.2s;
}

.create-group-btn:hover,
.change-group-btn:hover {
    opacity: 0.8;
}

.create-group-btn:active,
.change-group-btn:active {
    opacity: 0.6;
}

.change-group-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: flex-end;
    z-index: 1000;
}

.change-group-modal .modal-content {
    width: 100%;
    max-width: 100%;
    background: var(--tg-theme-secondary-bg-color, #ffffff);
    border-radius: 16px 16px 0 0;
    padding: 20px;
    max-height: 70vh;
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.change-group-modal h3 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: var(--tg-theme-text-color, #000000);
}

.groups-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
    max-height: 40vh;
    overflow-y: auto;
}

.group-item-wrapper {
    display: flex;
    align-items: center;
    gap: 8px;
}

.group-item {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 12px;
    background: var(--tg-theme-bg-color, #f0f0f0);
    border: none;
    border-radius: 8px;
    text-align: left;
    cursor: pointer;
    transition: background 0.2s;
    flex: 1;
}

.group-item:hover:not(:disabled) {
    background: var(--tg-theme-hint-color, #e0e0e0);
}

.group-item:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.group-item-title {
    font-size: 14px;
    font-weight: 600;
    color: var(--tg-theme-text-color, #000000);
}

.group-item-meta {
    font-size: 12px;
    color: var(--tg-theme-hint-color, #999999);
}

.btn-create-new {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 12px;
    background: var(--tg-theme-button-color, #0088cc);
    color: var(--tg-theme-button-text-color, #ffffff);
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: opacity 0.2s;
}

.btn-create-new:hover {
    opacity: 0.8;
}

.btn-create-new:active {
    opacity: 0.6;
}

.btn-delete-group {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 8px 12px;
    background: #ff4444;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s, opacity 0.2s;
}

.btn-delete-group:hover {
    background: #ff2222;
    opacity: 0.9;
}

.btn-delete-group:active {
    background: #cc0000;
    opacity: 0.8;
}

.btn-delete-group-item {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    background: #ff4444;
    border: none;
    border-radius: 6px;
    color: white;
    cursor: pointer;
    transition: background 0.2s, opacity 0.2s;
    flex-shrink: 0;
}

.btn-delete-group-item:hover {
    background: #ff2222;
    opacity: 0.9;
}

.btn-delete-group-item:active {
    background: #cc0000;
    opacity: 0.8;
}
</style>
