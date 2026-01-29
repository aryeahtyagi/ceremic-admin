<template>
  <div class="seo-form-container">
    <div class="product-summary">
      <h2>{{ isEditMode ? 'Edit Product SEO' : 'Product SEO Configuration' }}</h2>
      <div class="product-info">
        <h3>{{ product.name }}</h3>
        <p class="product-id">Product ID: {{ product.id }}</p>
      </div>
      <div v-if="isLoadingSEO" class="loading-seo">
        <p>Loading existing SEO data...</p>
      </div>
    </div>

    <form @submit.prevent="handleSubmit" class="seo-form">
      <div class="form-section">
        <h3>Basic SEO Information</h3>
        
        <div class="form-group">
          <label for="seoTitle">SEO Title *</label>
          <input
            id="seoTitle"
            v-model="formData.seoTitle"
            type="text"
            required
            placeholder="e.g., Handcrafted Ceramic Plate - Premium Quality"
            class="form-input"
            maxlength="60"
          />
          <small class="form-hint">{{ formData.seoTitle.length }}/60 characters (recommended for search engines)</small>
        </div>

        <div class="form-group">
          <label for="metaDescription">Meta Description *</label>
          <textarea
            id="metaDescription"
            v-model="formData.metaDescription"
            required
            rows="3"
            placeholder="e.g., Discover our premium handcrafted ceramic plate. Made by skilled artisans with eco-friendly materials..."
            class="form-input"
            maxlength="160"
          ></textarea>
          <small class="form-hint">{{ formData.metaDescription.length }}/160 characters (recommended for search engines)</small>
        </div>

        <div class="form-group">
          <label for="seoSlug">SEO Slug *</label>
          <input
            id="seoSlug"
            v-model="formData.seoSlug"
            type="text"
            required
            placeholder="e.g., handcrafted-ceramic-plate"
            class="form-input"
          />
          <small class="form-hint">URL-friendly version (use hyphens, lowercase, no spaces)</small>
        </div>
      </div>

      <div class="form-section">
        <h3>Keywords</h3>
        
        <div class="form-group">
          <label for="primaryKeyword">Primary Keyword *</label>
          <input
            id="primaryKeyword"
            v-model="formData.primaryKeyword"
            type="text"
            required
            placeholder="e.g., ceramic plate"
            class="form-input"
          />
        </div>

        <div class="form-group">
          <label for="secondaryKeywords">Secondary Keywords</label>
          <input
            id="secondaryKeywords"
            v-model="formData.secondaryKeywords"
            type="text"
            placeholder="e.g., handmade pottery, artisan ceramics, dinnerware"
            class="form-input"
          />
          <small class="form-hint">Comma-separated keywords</small>
        </div>
      </div>

      <div class="form-section">
        <h3>Advanced SEO Settings</h3>
        
        <div class="form-group">
          <label for="canonicalUrl">Canonical URL</label>
          <input
            id="canonicalUrl"
            v-model="formData.canonicalUrl"
            type="url"
            placeholder="e.g., https://example.com/products/ceramic-plate"
            class="form-input"
          />
          <small class="form-hint">Preferred URL for this page (prevents duplicate content issues)</small>
        </div>

        <div class="form-group">
          <label for="indexStatus">Index Status *</label>
          <select
            id="indexStatus"
            v-model="formData.indexStatus"
            required
            class="form-input"
          >
            <option value="">Select index status</option>
            <option value="index">Index (Allow search engines to index)</option>
            <option value="noindex">No Index (Prevent search engines from indexing)</option>
          </select>
        </div>

        <div class="form-group">
          <label for="schemaType">Schema Type</label>
          <select
            id="schemaType"
            v-model="formData.schemaType"
            class="form-input"
          >
            <option value="">Select schema type</option>
            <option value="Product">Product</option>
            <option value="ItemPage">ItemPage</option>
            <option value="WebPage">WebPage</option>
            <option value="Article">Article</option>
          </select>
          <small class="form-hint">Structured data type for rich snippets</small>
        </div>
      </div>

      <div class="form-section">
        <h3>Open Graph (Social Media)</h3>
        
        <div class="form-group">
          <label for="ogTitle">OG Title</label>
          <input
            id="ogTitle"
            v-model="formData.ogTitle"
            type="text"
            placeholder="e.g., Premium Handcrafted Ceramic Plate"
            class="form-input"
          />
          <small class="form-hint">Title shown when shared on social media (defaults to SEO Title if empty)</small>
        </div>

        <div class="form-group">
          <label for="ogDescription">OG Description</label>
          <textarea
            id="ogDescription"
            v-model="formData.ogDescription"
            rows="2"
            placeholder="e.g., Beautiful handcrafted ceramic plate perfect for your dining table"
            class="form-input"
          ></textarea>
          <small class="form-hint">Description shown when shared on social media (defaults to Meta Description if empty)</small>
        </div>

        <div class="form-group">
          <label for="ogImageUrl">OG Image URL</label>
          <input
            id="ogImageUrl"
            v-model="formData.ogImageUrl"
            type="url"
            placeholder="e.g., https://example.com/images/product-og.jpg"
            class="form-input"
          />
          <small class="form-hint">Image URL for social media sharing (recommended: 1200x630px)</small>
        </div>
      </div>

      <div class="form-section">
        <h3>Navigation</h3>
        
        <div class="form-group">
          <label for="breadcrumbTitle">Breadcrumb Title</label>
          <input
            id="breadcrumbTitle"
            v-model="formData.breadcrumbTitle"
            type="text"
            placeholder="e.g., Ceramic Plate"
            class="form-input"
          />
          <small class="form-hint">Shorter title for breadcrumb navigation</small>
        </div>
      </div>

      <div class="form-actions">
        <button type="button" @click="goBack" class="btn btn-secondary">
          {{ isEditMode ? 'Back to Product List' : 'Back to Image Upload' }}
        </button>
        <button type="submit" :disabled="isSubmitting || isLoadingSEO" class="btn btn-primary">
          <span v-if="isLoadingSEO">Loading...</span>
          <span v-else-if="isSubmitting">Submitting...</span>
          <span v-else>{{ isEditMode ? 'Update SEO Data' : 'Save SEO Data' }}</span>
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
  name: 'SEOForm',
  props: {
    product: {
      type: Object,
      required: true
    },
    isEditMode: {
      type: Boolean,
      default: false
    },
    existingSeoId: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      formData: {
        productId: null,
        seoTitle: '',
        metaDescription: '',
        seoSlug: '',
        primaryKeyword: '',
        secondaryKeywords: '',
        canonicalUrl: '',
        indexStatus: 'index',
        schemaType: '',
        ogTitle: '',
        ogDescription: '',
        ogImageUrl: '',
        breadcrumbTitle: ''
      },
      isSubmitting: false,
      message: '',
      messageType: '',
      existingSeo: null,
      isLoadingSEO: false
    }
  },
  async mounted() {
    // Set the product ID
    this.formData.productId = this.product.id
    
    if (this.isEditMode) {
      // Try to fetch existing SEO data
      await this.fetchExistingSEO()
    }
    
    // Pre-fill some fields with product data (only if not editing or if no existing SEO)
    if (!this.existingSeo) {
      if (this.product.name) {
        this.formData.seoTitle = this.product.name
        this.formData.ogTitle = this.product.name
        this.formData.breadcrumbTitle = this.product.name
        
        // Generate a basic slug from product name
        this.formData.seoSlug = this.product.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '')
      }
      
      if (this.product.description) {
        this.formData.metaDescription = this.product.description.substring(0, 160)
        this.formData.ogDescription = this.product.description.substring(0, 160)
      }
    }
  },
  methods: {
    async fetchExistingSEO() {
      this.isLoadingSEO = true
      try {
        this.existingSeo = await productService.getProductSEO(this.product.id)
        if (this.existingSeo) {
          // Populate form with existing SEO data
          this.formData.seoTitle = this.existingSeo.seoTitle || ''
          this.formData.metaDescription = this.existingSeo.metaDescription || ''
          this.formData.seoSlug = this.existingSeo.seoSlug || ''
          this.formData.primaryKeyword = this.existingSeo.primaryKeyword || ''
          this.formData.secondaryKeywords = this.existingSeo.secondaryKeywords || ''
          this.formData.canonicalUrl = this.existingSeo.canonicalUrl || ''
          this.formData.indexStatus = this.existingSeo.indexStatus || 'index'
          this.formData.schemaType = this.existingSeo.schemaType || ''
          this.formData.ogTitle = this.existingSeo.ogTitle || ''
          this.formData.ogDescription = this.existingSeo.ogDescription || ''
          this.formData.ogImageUrl = this.existingSeo.ogImageUrl || ''
          this.formData.breadcrumbTitle = this.existingSeo.breadcrumbTitle || ''
        }
      } catch (error) {
        // If SEO doesn't exist yet, that's okay - we'll create it
        console.log('No existing SEO found, will create new one')
      } finally {
        this.isLoadingSEO = false
      }
    },
    async handleSubmit() {
      this.isSubmitting = true
      this.message = ''
      this.messageType = ''

      try {
        const payload = {
          id: this.existingSeo?.id || 0,
          productId: Number(this.formData.productId),
          seoTitle: this.formData.seoTitle,
          metaDescription: this.formData.metaDescription,
          seoSlug: this.formData.seoSlug,
          primaryKeyword: this.formData.primaryKeyword,
          secondaryKeywords: this.formData.secondaryKeywords || '',
          canonicalUrl: this.formData.canonicalUrl || '',
          indexStatus: this.formData.indexStatus,
          schemaType: this.formData.schemaType || '',
          ogTitle: this.formData.ogTitle || '',
          ogDescription: this.formData.ogDescription || '',
          ogImageUrl: this.formData.ogImageUrl || '',
          breadcrumbTitle: this.formData.breadcrumbTitle || ''
        }

        if (this.isEditMode && this.existingSeo?.id) {
          // Update existing SEO
          await productService.updateProductSEO(this.existingSeo.id, payload)
          this.message = 'SEO data updated successfully!'
        } else {
          // Create new SEO
          await productService.createProductSEO(payload)
          this.message = 'SEO data saved successfully!'
        }
        
        this.messageType = 'success'
        
        // Emit event
        setTimeout(() => {
          this.$emit('seo-completed')
        }, 1500)
      } catch (error) {
        this.message = error.response?.data?.message || error.message || 'Failed to save SEO data. Please try again.'
        this.messageType = 'error'
        console.error('Error saving SEO data:', error)
      } finally {
        this.isSubmitting = false
      }
    },
    goBack() {
      this.$emit('go-back')
    }
  }
}
</script>

<style scoped>
.seo-form-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  padding: 2rem;
}

.product-summary {
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 2px solid #f0f0f0;
}

.product-summary h2 {
  color: #667eea;
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.product-info h3 {
  color: #333;
  margin-bottom: 0.5rem;
  font-size: 1.3rem;
}

.product-id {
  color: #666;
  font-size: 0.9rem;
  margin: 0.5rem 0;
}

.loading-seo {
  margin-top: 1rem;
  padding: 1rem;
  background: #f8f9ff;
  border-radius: 8px;
  text-align: center;
  color: #667eea;
}

.seo-form {
  margin-top: 1rem;
}

.form-section {
  margin-bottom: 2rem;
}

.form-section:not(:last-child) {
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 2rem;
}

.form-section h3 {
  color: #667eea;
  margin-bottom: 1.5rem;
  font-size: 1.2rem;
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
  font-family: inherit;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-input::placeholder {
  color: #999;
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
  .seo-form-container {
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
