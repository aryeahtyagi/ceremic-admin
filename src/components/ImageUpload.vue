<template>
  <div class="image-upload-container">
    <div class="product-summary">
      <h2>Product Created Successfully!</h2>
      <div class="product-info">
        <h3>{{ product.name }}</h3>
        <p class="product-id">Product ID: {{ product.id }}</p>
        <p class="product-description">{{ product.description }}</p>
        <p class="product-price">Price: ₹{{ product.price }}</p>
      </div>
    </div>

    <div class="upload-section">
      <h2>Upload Product Images</h2>
      <form @submit.prevent="handleUpload" class="upload-form">
        <div class="form-group">
          <label for="image">Select Image</label>
          <input
            id="image"
            ref="fileInput"
            type="file"
            accept="image/*"
            @change="handleFileSelect"
            class="file-input"
            :disabled="isUploading"
          />
          <small class="form-hint">Select one image at a time to upload</small>
        </div>

        <div v-if="selectedFile" class="selected-file">
          <h4>Selected File</h4>
          <div class="file-item">
            <span>{{ selectedFile.name }}</span>
            <span class="file-size">({{ formatFileSize(selectedFile.size) }})</span>
            <button type="button" @click="clearFile" class="remove-btn">Remove</button>
          </div>
        </div>

        <div class="form-group">
          <label class="checkbox-label">
            <input
              type="checkbox"
              v-model="isCatalogImage"
              :disabled="isUploading || !selectedFile"
              class="checkbox-input"
            />
            <span>Set as Catalog Image</span>
          </label>
          <small class="form-hint">Check this if this image should be used as the catalog/display image</small>
        </div>

        <div class="form-actions">
          <button type="button" @click="goBack" class="btn btn-secondary">
            Back to Product Form
          </button>
          <button type="submit" :disabled="isUploading || !selectedFile" class="btn btn-primary">
            <span v-if="isUploading">Uploading...</span>
            <span v-else>Upload Image</span>
          </button>
        </div>

        <div v-if="uploadedImages.length > 0" class="continue-section">
          <button type="button" @click="continueToSEO" class="btn btn-continue">
            Continue to SEO Configuration →
          </button>
        </div>

        <div v-if="message" :class="['message', messageType]">
          {{ message }}
        </div>
      </form>

      <div v-if="uploadedImages.length > 0" class="uploaded-images-section">
        <h3>Uploaded Images ({{ uploadedImages.length }})</h3>
        <ul class="uploaded-list">
          <li v-for="(image, index) in uploadedImages" :key="index" class="uploaded-item">
            <span>{{ image.name }}</span>
            <span v-if="image.isCatalogImage" class="catalog-badge">Catalog Image</span>
            <span class="upload-status">✓ Uploaded</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { productService } from '../services/api'

export default {
  name: 'ImageUpload',
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      selectedFile: null,
      isCatalogImage: false,
      uploadedImages: [],
      isUploading: false,
      message: '',
      messageType: ''
    }
  },
  methods: {
    handleFileSelect(event) {
      const file = event.target.files[0]
      if (file) {
        this.selectedFile = file
      }
    },
    clearFile() {
      this.selectedFile = null
      this.isCatalogImage = false
      if (this.$refs.fileInput) {
        this.$refs.fileInput.value = ''
      }
    },
    formatFileSize(bytes) {
      if (bytes === 0) return '0 Bytes'
      const k = 1024
      const sizes = ['Bytes', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
    },
    async handleUpload() {
      if (!this.selectedFile) {
        this.message = 'Please select an image'
        this.messageType = 'error'
        return
      }

      this.isUploading = true
      this.message = ''
      this.messageType = ''

      try {
        await productService.uploadImage(this.product.id, this.selectedFile, this.isCatalogImage)
        
        // Add to uploaded images list
        this.uploadedImages.push({
          name: this.selectedFile.name,
          size: this.selectedFile.size,
          isCatalogImage: this.isCatalogImage
        })
        
        this.message = 'Image uploaded successfully! You can upload another image.'
        this.messageType = 'success'
        
        // Clear selected file and checkbox after successful upload
        const fileName = this.selectedFile.name
        this.clearFile()
        
        // Clear message after 3 seconds
        setTimeout(() => {
          this.message = ''
          this.messageType = ''
        }, 3000)
      } catch (error) {
        this.message = error.response?.data?.message || error.message || 'Failed to upload image. Please try again.'
        this.messageType = 'error'
        console.error('Error uploading image:', error)
      } finally {
        this.isUploading = false
      }
    },
    goBack() {
      this.$emit('go-back')
    },
    continueToSEO() {
      this.$emit('continue-to-seo')
    }
  }
}
</script>

<style scoped>
.image-upload-container {
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

.product-description {
  color: #555;
  margin: 0.5rem 0;
}

.product-price {
  color: #667eea;
  font-weight: 600;
  font-size: 1.1rem;
  margin: 0.5rem 0;
}

.upload-section h2 {
  color: #667eea;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
}

.upload-form {
  margin-top: 1rem;
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

.file-input {
  width: 100%;
  padding: 0.75rem;
  border: 2px dashed #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  cursor: pointer;
}

.file-input:hover:not(:disabled) {
  border-color: #667eea;
  background: #f8f9ff;
}

.file-input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.form-hint {
  display: block;
  margin-top: 0.25rem;
  color: #666;
  font-size: 0.85rem;
}

.selected-file {
  margin: 1.5rem 0;
  padding: 1rem;
  background: #f8f9ff;
  border-radius: 8px;
}

.selected-file h4 {
  color: #667eea;
  margin-bottom: 0.75rem;
  font-size: 1rem;
}

.uploaded-images-section {
  margin-top: 2rem;
  padding: 1.5rem;
  background: #f0f8f0;
  border-radius: 8px;
  border: 1px solid #c3e6cb;
}

.uploaded-images-section h3 {
  color: #155724;
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.uploaded-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.uploaded-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  margin-bottom: 0.5rem;
  background: white;
  border-radius: 6px;
  border: 1px solid #c3e6cb;
}

.uploaded-item span:first-child {
  flex: 1;
  color: #333;
}

.upload-status {
  color: #155724;
  font-weight: 600;
  font-size: 0.9rem;
}

.catalog-badge {
  background: #667eea;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  margin-right: 0.5rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
}

.checkbox-label span {
  margin-left: 0.5rem;
  color: #333;
  font-weight: 500;
}

.checkbox-input {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #667eea;
}

.checkbox-input:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.file-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.file-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  background: white;
  border-radius: 6px;
  border: 1px solid #e0e0e0;
}

.file-item span:first-child {
  flex: 1;
  color: #333;
}

.file-size {
  color: #666;
  font-size: 0.85rem;
  margin: 0 1rem;
}

.remove-btn {
  padding: 0.25rem 0.75rem;
  background: #ff4444;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;
  transition: background 0.3s ease;
}

.remove-btn:hover {
  background: #cc0000;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 2px solid #f0f0f0;
}

.continue-section {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 2px solid #f0f0f0;
  text-align: center;
}

.btn-continue {
  padding: 0.75rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.3s ease;
  cursor: pointer;
}

.btn-continue:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
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
  .image-upload-container {
    padding: 1.5rem;
  }

  .form-actions {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }

  .file-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .file-size {
    margin: 0.25rem 0;
  }
}
</style>

