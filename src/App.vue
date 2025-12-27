<template>
  <div id="app">
    <Login v-if="!isAuthenticated" @login-success="handleLoginSuccess" />
    <div v-else>
      <header class="header">
        <div class="header-content">
          <div>
            <h1>Ceremic Admin Panel</h1>
            <p class="subtitle">{{ currentView === 'form' ? 'Product Upload System' : 'Image Upload' }}</p>
          </div>
          <button @click="handleLogout" class="logout-btn">
            Logout
          </button>
        </div>
      </header>
      <main class="main-content">
        <ProductForm v-if="currentView === 'form'" @product-created="handleProductCreated" />
        <ImageUpload v-else :product="createdProduct" @go-back="handleGoBack" />
      </main>
    </div>
  </div>
</template>

<script>
import ProductForm from './components/ProductForm.vue'
import ImageUpload from './components/ImageUpload.vue'
import Login from './components/Login.vue'

export default {
  name: 'App',
  components: {
    ProductForm,
    ImageUpload,
    Login
  },
  data() {
    return {
      isAuthenticated: false,
      currentView: 'form',
      createdProduct: null
    }
  },
  mounted() {
    // Check if user is already authenticated
    const authStatus = localStorage.getItem('isAuthenticated')
    this.isAuthenticated = authStatus === 'true'
  },
  methods: {
    handleLoginSuccess() {
      this.isAuthenticated = true
    },
    handleLogout() {
      localStorage.removeItem('isAuthenticated')
      localStorage.removeItem('userid')
      this.isAuthenticated = false
      this.currentView = 'form'
      this.createdProduct = null
    },
    handleProductCreated(product) {
      this.createdProduct = product
      this.currentView = 'upload'
    },
    handleGoBack() {
      this.currentView = 'form'
      this.createdProduct = null
    }
  }
}
</script>

<style scoped>
#app {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.header {
  padding: 2rem;
  color: white;
}

.header-content {
  max-width: 900px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-content > div {
  text-align: center;
  flex: 1;
}

.header h1 {
  margin: 0;
  font-size: 2.5rem;
  font-weight: 700;
}

.subtitle {
  margin: 0.5rem 0 0 0;
  font-size: 1.1rem;
  opacity: 0.9;
}

.logout-btn {
  padding: 0.5rem 1.5rem;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.logout-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.5);
}

.main-content {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 1rem;
  }

  .header h1 {
    font-size: 2rem;
  }

  .logout-btn {
    width: 100%;
    max-width: 200px;
  }
}
</style>

