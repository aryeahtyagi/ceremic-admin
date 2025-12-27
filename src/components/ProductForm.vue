<template>
  <div class="product-form-container">
    <form @submit.prevent="handleSubmit" class="product-form">
      <div class="form-section">
        <h2>Product Information</h2>
        
        <div class="form-group">
          <label for="name">Product Name *</label>
          <input
            id="name"
            v-model="formData.name"
            type="text"
            required
            placeholder="e.g., Terracotta Plate"
            class="form-input"
          />
        </div>

        <div class="form-group">
          <label for="description">Description *</label>
          <textarea
            id="description"
            v-model="formData.description"
            required
            rows="4"
            placeholder="e.g., Handcrafted ceramic plate"
            class="form-input"
          ></textarea>
        </div>

        <div class="form-group">
          <label for="about">About *</label>
          <textarea
            id="about"
            v-model="formData.about"
            required
            rows="3"
            placeholder="e.g., Made by skilled artisans"
            class="form-input"
          ></textarea>
        </div>

        <div class="form-group">
          <label for="price">Price (₹) *</label>
          <input
            id="price"
            v-model.number="formData.price"
            type="number"
            required
            min="0"
            step="0.01"
            placeholder="e.g., 1299"
            class="form-input"
          />
        </div>
      </div>

      <div class="form-section">
        <h2>Product Associations</h2>
        
        <div class="form-group">
          <label for="benefitIds">Benefits</label>
          <select
            id="benefitIds"
            v-model="formData.benefitIds"
            multiple
            class="form-input form-select-multiple"
            :disabled="loadingBenefits"
          >
            <option v-if="loadingBenefits" value="" disabled>Loading benefits...</option>
            <option v-else-if="benefits.length === 0" value="" disabled>No benefits available</option>
            <option v-for="benefit in benefits" :key="'benefit-' + benefit.id" :value="benefit.id">
              {{ benefit.value }} - {{ benefit.description }}
            </option>
          </select>
          <small class="form-hint">Hold Ctrl/Cmd to select multiple</small>
        </div>

        <div class="form-group">
          <label for="productLovePointIds">Product Love Points</label>
          <select
            id="productLovePointIds"
            v-model="formData.productLovePointIds"
            multiple
            class="form-input form-select-multiple"
            :disabled="loadingLovePoints"
          >
            <option v-if="loadingLovePoints" value="" disabled>Loading love points...</option>
            <option v-else-if="lovePoints.length === 0" value="" disabled>No love points available</option>
            <option v-for="lovePoint in lovePoints" :key="'love-' + lovePoint.id" :value="lovePoint.id">
              {{ lovePoint.value }}
            </option>
          </select>
          <small class="form-hint">Hold Ctrl/Cmd to select multiple</small>
        </div>

        <div class="form-group">
          <label for="productDetailIds">Product Details</label>
          <select
            id="productDetailIds"
            v-model="formData.productDetailIds"
            multiple
            class="form-input form-select-multiple"
            :disabled="loadingProductDetails"
          >
            <option v-if="loadingProductDetails" value="" disabled>Loading product details...</option>
            <option v-else-if="productDetails.length === 0" value="" disabled>No product details available</option>
            <option v-for="detail in productDetails" :key="'detail-' + detail.id" :value="detail.id">
              {{ detail.dimension.name }}: {{ detail.value }}{{ detail.dimension.unit ? ' ' + detail.dimension.unit : '' }}
            </option>
          </select>
          <small class="form-hint">Hold Ctrl/Cmd to select multiple</small>
        </div>

        <div class="form-group">
          <label for="discountIds">Discounts</label>
          <select
            id="discountIds"
            v-model="formData.discountIds"
            multiple
            class="form-input form-select-multiple"
            :disabled="loadingDiscounts"
          >
            <option v-if="loadingDiscounts" value="" disabled>Loading discounts...</option>
            <option v-else-if="enabledDiscounts.length === 0" value="" disabled>No discounts available</option>
            <option v-for="discount in enabledDiscounts" :key="'discount-' + discount.id" :value="discount.id">
              {{ discount.discount }}% Off
            </option>
          </select>
          <small class="form-hint">Hold Ctrl/Cmd to select multiple</small>
        </div>

      </div>

      <div class="form-actions">
        <button type="button" @click="resetForm" class="btn btn-secondary">
          Reset
        </button>
        <button type="submit" :disabled="isSubmitting" class="btn btn-primary">
          <span v-if="isSubmitting">Submitting...</span>
          <span v-else>Create Product</span>
        </button>
      </div>

      <div v-if="message" :class="['message', messageType]">
        {{ message }}
      </div>
    </form>
  </div>
</template>

<script>
import { productService } from '../services/api'

export default {
  name: 'ProductForm',
  data() {
    return {
      formData: {
        name: '',
        description: '',
        about: '',
        price: null,
        benefitIds: [],
        productLovePointIds: [],
        productDetailIds: [],
        discountIds: []
      },
      availableIds: Array.from({ length: 20 }, (_, i) => i + 1), // IDs 1-20, adjust as needed
      benefits: [],
      loadingBenefits: false,
      lovePoints: [],
      loadingLovePoints: false,
      productDetails: [],
      loadingProductDetails: false,
      discounts: [],
      loadingDiscounts: false,
      isSubmitting: false,
      message: '',
      messageType: ''
    }
  },
  computed: {
    enabledDiscounts() {
      return this.discounts.filter(discount => discount.enable === true)
    }
  },
  async mounted() {
    await Promise.all([
      this.fetchBenefits(),
      this.fetchLovePoints(),
      this.fetchProductDetails(),
      this.fetchDiscounts()
    ])
  },
  methods: {
    async fetchBenefits() {
      this.loadingBenefits = true
      try {
        this.benefits = await productService.getBenefits()
      } catch (error) {
        this.message = 'Failed to load benefits. Please refresh the page.'
        this.messageType = 'error'
        console.error('Error fetching benefits:', error)
      } finally {
        this.loadingBenefits = false
      }
    },
    async fetchLovePoints() {
      this.loadingLovePoints = true
      try {
        this.lovePoints = await productService.getLovePoints()
      } catch (error) {
        this.message = 'Failed to load love points. Please refresh the page.'
        this.messageType = 'error'
        console.error('Error fetching love points:', error)
      } finally {
        this.loadingLovePoints = false
      }
    },
    async fetchProductDetails() {
      this.loadingProductDetails = true
      try {
        this.productDetails = await productService.getProductDetails()
      } catch (error) {
        this.message = 'Failed to load product details. Please refresh the page.'
        this.messageType = 'error'
        console.error('Error fetching product details:', error)
      } finally {
        this.loadingProductDetails = false
      }
    },
    async fetchDiscounts() {
      this.loadingDiscounts = true
      try {
        this.discounts = await productService.getDiscounts()
      } catch (error) {
        this.message = 'Failed to load discounts. Please refresh the page.'
        this.messageType = 'error'
        console.error('Error fetching discounts:', error)
      } finally {
        this.loadingDiscounts = false
      }
    },
    async handleSubmit() {
      this.isSubmitting = true
      this.message = ''
      this.messageType = ''

      try {
        // Convert selected values to numbers
        const payload = {
          name: this.formData.name,
          description: this.formData.description,
          about: this.formData.about,
          price: Number(this.formData.price),
          benefitIds: this.formData.benefitIds.map(id => Number(id)),
          productLovePointIds: this.formData.productLovePointIds.map(id => Number(id)),
          productDetailIds: this.formData.productDetailIds.map(id => Number(id)),
          discountIds: this.formData.discountIds.map(id => Number(id))
        }

        const createdProduct = await productService.createProduct(payload)
        
        this.message = 'Product created successfully! Redirecting to image upload...'
        this.messageType = 'success'
        
        // Emit the created product data to parent component
        this.$emit('product-created', createdProduct)
      } catch (error) {
        this.message = error.response?.data?.message || error.message || 'Failed to create product. Please try again.'
        this.messageType = 'error'
        console.error('Error creating product:', error)
      } finally {
        this.isSubmitting = false
      }
    },
    resetForm() {
      this.formData = {
        name: '',
        description: '',
        about: '',
        price: null,
        benefitIds: [],
        productLovePointIds: [],
        productDetailIds: [],
        discountIds: []
      }
      this.message = ''
      this.messageType = ''
    }
  }
}
</script>

<style scoped>
.product-form-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.product-form {
  padding: 2rem;
}

.form-section {
  margin-bottom: 2rem;
}

.form-section:not(:last-child) {
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 2rem;
}

.form-section h2 {
  color: #667eea;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  font-weight: 600;
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
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-input::placeholder {
  color: #999;
}

.form-select-multiple {
  min-height: 120px;
  padding: 0.5rem;
}

.form-hint {
  display: block;
  margin-top: 0.25rem;
  color: #666;
  font-size: 0.85rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 2px solid #f0f0f0;
}

.btn {
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.3s ease;
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

.btn-secondary {
  background: #f5f5f5;
  color: #333;
}

.btn-secondary:hover {
  background: #e0e0e0;
}

.message {
  margin-top: 1.5rem;
  padding: 1rem;
  border-radius: 8px;
  font-weight: 500;
}

.message.success {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.message.error {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

@media (max-width: 768px) {
  .product-form {
    padding: 1.5rem;
  }

  .form-actions {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }
}
</style>

