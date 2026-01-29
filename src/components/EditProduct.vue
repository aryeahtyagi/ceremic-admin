<template>
  <div class="edit-product-container">
    <div class="edit-header">
      <h2>Edit Product</h2>
      <p class="subtitle">Manage product images and SEO settings</p>
    </div>

    <div class="edit-sections">
      <div class="section-tabs">
        <button
          @click="activeSection = 'images'"
          :class="['tab-button', { active: activeSection === 'images' }]"
        >
          Edit Images
        </button>
        <button
          @click="activeSection = 'seo'"
          :class="['tab-button', { active: activeSection === 'seo' }]"
        >
          Edit SEO
        </button>
      </div>

      <!-- Edit Images Section -->
      <div v-if="activeSection === 'images'" class="section-content">
        <div class="section-placeholder">
          <h3>Edit Images</h3>
          <p>Image editing functionality coming soon...</p>
        </div>
      </div>

      <!-- Edit SEO Section -->
      <div v-if="activeSection === 'seo'" class="section-content">
        <div v-if="!selectedProduct" class="product-selection">
          <h3>Select a Product to Edit SEO</h3>
          <div v-if="isLoading" class="loading-state">
            <p>Loading products...</p>
          </div>
          <div v-else-if="errorMessage" class="error-message">
            {{ errorMessage }}
          </div>
          <div v-else-if="products.length === 0" class="empty-state">
            <p>No products found.</p>
          </div>
          <div v-else class="products-list">
            <div
              v-for="product in products"
              :key="product.id"
              @click="selectProduct(product)"
              class="product-card"
            >
              <div class="product-card-content">
                <div class="product-info">
                  <h4>{{ product.name }}</h4>
                  <p class="product-id">ID: {{ product.id }}</p>
                  <p class="product-price">₹{{ formatPrice(product.price) }}</p>
                  <p class="product-description">{{ truncateDescription(product.description) }}</p>
                </div>
                <div class="product-action">
                  <button class="btn-select">Edit SEO →</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <SEOForm
          v-else
          :product="selectedProduct"
          :is-edit-mode="true"
          @go-back="selectedProduct = null"
          @seo-completed="handleSEOCompleted"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { productService } from '../services/api'
import SEOForm from './SEOForm.vue'

export default {
  name: 'EditProduct',
  components: {
    SEOForm
  },
  data() {
    return {
      activeSection: 'images',
      products: [],
      selectedProduct: null,
      isLoading: false,
      errorMessage: ''
    }
  },
  mounted() {
    this.fetchProducts()
  },
  methods: {
    async fetchProducts() {
      this.isLoading = true
      this.errorMessage = ''
      
      try {
        this.products = await productService.getProducts()
      } catch (error) {
        this.errorMessage = error.response?.data?.message || error.message || 'Failed to fetch products. Please try again.'
        console.error('Error fetching products:', error)
      } finally {
        this.isLoading = false
      }
    },
    selectProduct(product) {
      this.selectedProduct = product
    },
    handleSEOCompleted() {
      this.selectedProduct = null
      this.fetchProducts() // Refresh the list
    },
    formatPrice(price) {
      return Number(price).toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })
    },
    truncateDescription(description) {
      if (!description) return ''
      return description.length > 100 ? description.substring(0, 100) + '...' : description
    }
  }
}
</script>

<style scoped>
.edit-product-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  padding: 2rem;
}

.edit-header {
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f0f0f0;
}

.edit-header h2 {
  color: #667eea;
  margin: 0 0 0.5rem 0;
  font-size: 1.5rem;
  font-weight: 600;
}

.subtitle {
  color: #666;
  margin: 0;
  font-size: 0.95rem;
}

.edit-sections {
  margin-top: 1.5rem;
}

.section-tabs {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 2px solid #f0f0f0;
}

.tab-button {
  padding: 0.75rem 1.5rem;
  border: none;
  background: transparent;
  color: #666;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  border-bottom: 3px solid transparent;
  transition: all 0.3s ease;
}

.tab-button:hover {
  color: #667eea;
}

.tab-button.active {
  color: #667eea;
  border-bottom-color: #667eea;
}

.section-content {
  min-height: 300px;
}

.section-placeholder {
  text-align: center;
  padding: 3rem;
  color: #666;
}

.section-placeholder h3 {
  color: #667eea;
  margin-bottom: 1rem;
}

.product-selection h3 {
  color: #667eea;
  margin-bottom: 1.5rem;
  font-size: 1.2rem;
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

.products-list {
  display: grid;
  gap: 1rem;
}

.product-card {
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.product-card:hover {
  border-color: #667eea;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.1);
  transform: translateY(-2px);
}

.product-card-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.product-info {
  flex: 1;
}

.product-info h4 {
  color: #333;
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
}

.product-id {
  color: #666;
  font-size: 0.85rem;
  margin: 0.25rem 0;
}

.product-price {
  color: #667eea;
  font-weight: 600;
  font-size: 1.1rem;
  margin: 0.5rem 0;
}

.product-description {
  color: #555;
  font-size: 0.9rem;
  margin: 0.5rem 0 0 0;
  line-height: 1.5;
}

.product-action {
  flex-shrink: 0;
}

.btn-select {
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-select:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

@media (max-width: 768px) {
  .edit-product-container {
    padding: 1.5rem;
  }

  .section-tabs {
    flex-direction: column;
  }

  .product-card-content {
    flex-direction: column;
    align-items: flex-start;
  }

  .btn-select {
    width: 100%;
  }
}
</style>
