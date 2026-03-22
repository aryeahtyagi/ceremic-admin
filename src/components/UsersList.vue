<template>
  <div class="users-container">
    <div class="users-header">
      <h2>Users</h2>
      <button type="button" @click="fetchUsers" class="refresh-btn" :disabled="isLoading">
        <span v-if="isLoading">Loading...</span>
        <span v-else>Refresh</span>
      </button>
    </div>

    <div v-if="isLoading && users.length === 0" class="loading-state">
      <p>Loading users...</p>
    </div>

    <div v-else-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>

    <div v-else-if="users.length === 0" class="empty-state">
      <p>No users found.</p>
    </div>

    <div v-else class="users-list">
      <div v-for="user in users" :key="user.id" class="user-card">
        <div class="user-header">
          <div class="user-id">
            <strong>User ID:</strong> #{{ user.id }}
          </div>
        </div>

        <div class="user-details">
          <div class="detail-row">
            <span class="label">Username</span>
            <span class="value">{{ user.username || 'N/A' }}</span>
          </div>
          <div class="detail-row">
            <span class="label">Email</span>
            <span class="value">{{ user.email || 'N/A' }}</span>
          </div>
          <div class="detail-row">
            <span class="label">Phone</span>
            <span class="value">{{ user.phoneNumber || 'N/A' }}</span>
          </div>
          <div class="detail-row">
            <span class="label">Address</span>
            <span class="value address">{{ user.address || 'N/A' }}</span>
          </div>
          <div class="detail-row">
            <span class="label">Pincode</span>
            <span class="value">{{ user.pincode || 'N/A' }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { userService } from '../services/api'

export default {
  name: 'UsersList',
  data() {
    return {
      users: [],
      isLoading: false,
      errorMessage: ''
    }
  },
  mounted() {
    this.fetchUsers()
  },
  methods: {
    async fetchUsers() {
      this.isLoading = true
      this.errorMessage = ''

      try {
        const data = await userService.getUsers()
        this.users = Array.isArray(data) ? data : []
      } catch (error) {
        this.errorMessage =
          error.response?.data?.message || error.message || 'Failed to fetch users. Please try again.'
        console.error('Error fetching users:', error)
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>

<style scoped>
.users-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  padding: 2rem;
}

.users-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f0f0f0;
}

.users-header h2 {
  color: #667eea;
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
}

.refresh-btn {
  padding: 0.5rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.refresh-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.refresh-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.loading-state,
.empty-state {
  text-align: center;
  padding: 3rem;
  color: #666;
}

.error-message {
  background: #f8d7da;
  color: #721c24;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  border: 1px solid #f5c6cb;
}

.users-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.user-card {
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  padding: 1.5rem;
  transition: all 0.3s ease;
}

.user-card:hover {
  border-color: #667eea;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.1);
}

.user-header {
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #f0f0f0;
}

.user-id {
  color: #333;
  font-size: 1.05rem;
}

.user-details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.detail-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1rem;
  border-bottom: 1px solid #f5f5f5;
  padding: 0.5rem 0;
}

.detail-row:last-child {
  border-bottom: none;
}

.label {
  color: #666;
  font-weight: 500;
  min-width: 100px;
}

.value {
  color: #333;
  font-weight: 600;
  flex: 1;
}

.value.address {
  white-space: pre-wrap;
  word-break: break-word;
}

@media (max-width: 768px) {
  .users-container {
    padding: 1.5rem;
  }

  .users-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .detail-row {
    flex-direction: column;
    gap: 0.25rem;
  }
}
</style>
