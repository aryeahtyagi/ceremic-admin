<template>
  <div class="native-upload-container">
    <div class="upload-header">
      <h2>Upload Native Image</h2>
      <p class="subtitle">Upload images and get direct URL links</p>
    </div>

    <div class="upload-section">
      <form @submit.prevent="handleUpload" class="upload-form">
        <div class="form-group">
          <label for="image">Select Image *</label>
          <input
            id="image"
            ref="fileInput"
            type="file"
            accept="image/*"
            @change="handleFileSelect"
            class="file-input"
            :disabled="isUploading"
            required
          />
          <small class="form-hint">Select an image file to upload</small>
        </div>

        <div v-if="selectedFile" class="selected-file">
          <h4>Selected File</h4>
          <div class="file-item">
            <span class="file-name">{{ selectedFile.name }}</span>
            <span class="file-size">({{ formatFileSize(selectedFile.size) }})</span>
            <button type="button" @click="clearFile" class="remove-btn">Remove</button>
          </div>
          <div v-if="selectedFile" class="image-preview">
            <img :src="previewUrl" alt="Preview" />
          </div>
        </div>

        <div class="form-actions">
          <button type="submit" :disabled="isUploading || !selectedFile" class="btn btn-primary">
            <span v-if="isUploading">Uploading...</span>
            <span v-else>Upload Image</span>
          </button>
        </div>

        <div v-if="message" :class="['message', messageType]">
          {{ message }}
        </div>
      </form>

      <div v-if="uploadedUrl" class="result-section">
        <h3>Upload Successful!</h3>
        <div class="url-display">
          <label>Image URL:</label>
          <div class="url-container">
            <input
              type="text"
              :value="uploadedUrl"
              readonly
              class="url-input"
              ref="urlInput"
            />
            <button @click="copyUrl" class="btn-copy" :class="{ copied: isCopied }">
              <span v-if="isCopied">✓ Copied!</span>
              <span v-else>Copy URL</span>
            </button>
          </div>
        </div>
        <div v-if="uploadedUrl" class="uploaded-image-preview">
          <h4>Preview:</h4>
          <img :src="uploadedUrl" alt="Uploaded image" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { imageService } from '../services/api'

export default {
  name: 'NativeImageUpload',
  data() {
    return {
      selectedFile: null,
      previewUrl: null,
      uploadedUrl: null,
      isUploading: false,
      message: '',
      messageType: '',
      isCopied: false
    }
  },
  methods: {
    handleFileSelect(event) {
      const file = event.target.files[0]
      if (file) {
        this.selectedFile = file
        // Create preview URL
        this.previewUrl = URL.createObjectURL(file)
        this.uploadedUrl = null
        this.message = ''
        this.messageType = ''
        this.isCopied = false
      }
    },
    clearFile() {
      this.selectedFile = null
      if (this.previewUrl) {
        URL.revokeObjectURL(this.previewUrl)
        this.previewUrl = null
      }
      this.uploadedUrl = null
      this.message = ''
      this.messageType = ''
      this.isCopied = false
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
        this.message = 'Please select an image file'
        this.messageType = 'error'
        return
      }

      this.isUploading = true
      this.message = ''
      this.messageType = ''
      this.uploadedUrl = null

      try {
        const response = await imageService.uploadNativeImage(this.selectedFile)
        // Handle response as object with url property: {"url":"http://localhost:9090/16"}
        console.log('Upload response:', response)
        // Extract URL from response object
        if (response && typeof response === 'object' && response.url) {
          this.uploadedUrl = response.url
        } else if (typeof response === 'string') {
          this.uploadedUrl = response
        } else {
          this.uploadedUrl = response
        }
        console.log('Extracted URL:', this.uploadedUrl)
        this.message = 'Image uploaded successfully!'
        this.messageType = 'success'
        
        // Don't clear file - keep it so user can see what was uploaded
      } catch (error) {
        this.message = error.response?.data?.message || error.message || 'Failed to upload image. Please try again.'
        this.messageType = 'error'
        console.error('Error uploading image:', error)
      } finally {
        this.isUploading = false
      }
    },
    async copyUrl() {
      try {
        await navigator.clipboard.writeText(this.uploadedUrl)
        this.isCopied = true
        setTimeout(() => {
          this.isCopied = false
        }, 2000)
      } catch (error) {
        // Fallback for older browsers
        const urlInput = this.$refs.urlInput
        if (urlInput) {
          urlInput.select()
          document.execCommand('copy')
          this.isCopied = true
          setTimeout(() => {
            this.isCopied = false
          }, 2000)
        }
      }
    }
  },
  beforeUnmount() {
    // Clean up preview URL
    if (this.previewUrl) {
      URL.revokeObjectURL(this.previewUrl)
    }
  }
}
</script>

<style scoped>
.native-upload-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  padding: 2rem;
}

.upload-header {
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f0f0f0;
}

.upload-header h2 {
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

.upload-section {
  margin-top: 1.5rem;
}

.upload-form {
  margin-bottom: 2rem;
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
  background: #fafafa;
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

.file-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  margin-bottom: 1rem;
  background: white;
  border-radius: 6px;
  border: 1px solid #e0e0e0;
}

.file-name {
  flex: 1;
  color: #333;
  font-weight: 500;
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

.image-preview {
  margin-top: 1rem;
  text-align: center;
}

.image-preview img {
  max-width: 100%;
  max-height: 300px;
  border-radius: 8px;
  border: 2px solid #e0e0e0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 2rem;
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

.result-section {
  margin-top: 2rem;
  padding: 1.5rem;
  background: #f0f8f0;
  border-radius: 8px;
  border: 1px solid #c3e6cb;
}

.result-section h3 {
  color: #155724;
  margin-bottom: 1rem;
  font-size: 1.2rem;
}

.url-display {
  margin-bottom: 1.5rem;
}

.url-display label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #333;
}

.url-container {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.url-input {
  flex: 1;
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 0.9rem;
  background: white;
  color: #333;
}

.btn-copy {
  padding: 0.75rem 1.5rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.btn-copy:hover {
  background: #5568d3;
  transform: translateY(-1px);
}

.btn-copy.copied {
  background: #28a745;
}

.uploaded-image-preview {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #c3e6cb;
}

.uploaded-image-preview h4 {
  color: #155724;
  margin-bottom: 1rem;
  font-size: 1rem;
}

.uploaded-image-preview img {
  max-width: 100%;
  max-height: 400px;
  border-radius: 8px;
  border: 2px solid #c3e6cb;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .native-upload-container {
    padding: 1.5rem;
  }

  .file-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .file-size {
    margin: 0;
  }

  .url-container {
    flex-direction: column;
  }

  .btn-copy {
    width: 100%;
  }
}
</style>
