<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <h1>Ceremic Admin Panel</h1>
        <p class="subtitle">Please login to continue</p>
      </div>
      
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="userid">User ID</label>
          <input
            id="userid"
            v-model="credentials.userid"
            type="text"
            required
            placeholder="Enter your user ID"
            class="form-input"
            :disabled="isLoggingIn"
            autocomplete="username"
          />
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input
            id="password"
            v-model="credentials.password"
            type="password"
            required
            placeholder="Enter your password"
            class="form-input"
            :disabled="isLoggingIn"
            autocomplete="current-password"
          />
        </div>

        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>

        <button type="submit" :disabled="isLoggingIn" class="btn btn-primary">
          <span v-if="isLoggingIn">Logging in...</span>
          <span v-else>Login</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      credentials: {
        userid: '',
        password: ''
      },
      isLoggingIn: false,
      errorMessage: ''
    }
  },
  methods: {
    handleLogin() {
      this.errorMessage = ''
      this.isLoggingIn = true

      // Simulate API call delay
      setTimeout(() => {
        // Validate credentials
        if (this.credentials.userid === 'arya' && this.credentials.password === 'dreamscumtrue') {
          // Store authentication state
          localStorage.setItem('isAuthenticated', 'true')
          localStorage.setItem('userid', this.credentials.userid)
          
          // Emit login success event
          this.$emit('login-success')
        } else {
          this.errorMessage = 'Invalid user ID or password. Please try again.'
          this.isLoggingIn = false
        }
      }, 300)
    }
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
}

.login-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  padding: 3rem;
  width: 100%;
  max-width: 400px;
}

.login-header {
  text-align: center;
  margin-bottom: 2rem;
}

.login-header h1 {
  color: #667eea;
  margin: 0;
  font-size: 2rem;
  font-weight: 700;
}

.subtitle {
  color: #666;
  margin: 0.5rem 0 0 0;
  font-size: 0.95rem;
}

.login-form {
  margin-top: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #333;
  font-size: 0.95rem;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background: #f5f5f5;
}

.form-input::placeholder {
  color: #999;
}

.error-message {
  background: #f8d7da;
  color: #721c24;
  padding: 0.75rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  border: 1px solid #f5c6cb;
  font-size: 0.9rem;
}

.btn {
  width: 100%;
  padding: 0.75rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.3s ease;
  cursor: pointer;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .login-card {
    padding: 2rem;
  }

  .login-header h1 {
    font-size: 1.5rem;
  }
}
</style>

