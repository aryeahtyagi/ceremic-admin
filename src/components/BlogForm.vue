<template>
  <div class="blog-form-container">
    <div class="blog-form-header">
      <h2>{{ isEditMode ? 'Edit Blog Post' : 'Create New Blog Post' }}</h2>
      <button v-if="isEditMode" @click="goBack" class="btn-back">← Back to Blog List</button>
    </div>

    <form @submit.prevent="handleSubmit" class="blog-form">
      <div class="form-section">
        <h3>Basic Information</h3>
        
        <div class="form-group">
          <label for="title">Title *</label>
          <input
            id="title"
            v-model="formData.title"
            type="text"
            required
            placeholder="e.g., The Art of Ceramic Making"
            class="form-input"
          />
        </div>

        <div class="form-group">
          <label for="h1Title">H1 Title *</label>
          <input
            id="h1Title"
            v-model="formData.h1Title"
            type="text"
            required
            placeholder="e.g., Discover the Art of Ceramic Making"
            class="form-input"
          />
        </div>

        <div class="form-group">
          <label for="slug">Slug *</label>
          <input
            id="slug"
            v-model="formData.slug"
            type="text"
            required
            placeholder="e.g., art-of-ceramic-making"
            class="form-input"
          />
          <small class="form-hint">URL-friendly version (use hyphens, lowercase, no spaces)</small>
        </div>

        <div class="form-group">
          <label for="content">Content *</label>
          <textarea
            id="content"
            v-model="formData.content"
            required
            rows="10"
            placeholder="Write your blog content here..."
            class="form-input"
          ></textarea>
        </div>
      </div>

      <div class="form-section">
        <h3>SEO Information</h3>
        
        <div class="form-group">
          <label for="seoTitle">SEO Title *</label>
          <input
            id="seoTitle"
            v-model="formData.seoTitle"
            type="text"
            required
            placeholder="e.g., The Art of Ceramic Making - Complete Guide"
            class="form-input"
            maxlength="60"
          />
          <small class="form-hint">{{ formData.seoTitle.length }}/60 characters</small>
        </div>

        <div class="form-group">
          <label for="metaDescription">Meta Description *</label>
          <textarea
            id="metaDescription"
            v-model="formData.metaDescription"
            required
            rows="3"
            placeholder="e.g., Learn about the ancient art of ceramic making..."
            class="form-input"
            maxlength="160"
          ></textarea>
          <small class="form-hint">{{ formData.metaDescription.length }}/160 characters</small>
        </div>

        <div class="form-group">
          <label for="primaryKeyword">Primary Keyword *</label>
          <input
            id="primaryKeyword"
            v-model="formData.primaryKeyword"
            type="text"
            required
            placeholder="e.g., ceramic making"
            class="form-input"
          />
        </div>

        <div class="form-group">
          <label for="secondaryKeywords">Secondary Keywords</label>
          <input
            id="secondaryKeywords"
            v-model="formData.secondaryKeywords"
            type="text"
            placeholder="e.g., pottery, ceramics, handmade"
            class="form-input"
          />
          <small class="form-hint">Comma-separated keywords</small>
        </div>

        <div class="form-group">
          <label for="canonicalUrl">Canonical URL</label>
          <input
            id="canonicalUrl"
            v-model="formData.canonicalUrl"
            type="url"
            placeholder="e.g., https://example.com/blog/art-of-ceramic-making"
            class="form-input"
          />
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
            <option value="Article">Article</option>
            <option value="BlogPosting">BlogPosting</option>
            <option value="NewsArticle">NewsArticle</option>
            <option value="WebPage">WebPage</option>
          </select>
        </div>
      </div>

      <div class="form-section">
        <h3>Media & Publishing</h3>
        
        <div class="form-group">
          <label for="featuredImageUrl">Featured Image URL</label>
          <input
            id="featuredImageUrl"
            v-model="formData.featuredImageUrl"
            type="url"
            placeholder="e.g., https://example.com/images/blog-featured.jpg"
            class="form-input"
          />
        </div>

        <div class="form-group">
          <label for="category">Category</label>
          <input
            id="category"
            v-model="formData.category"
            type="text"
            placeholder="e.g., Ceramics, DIY, Tutorial"
            class="form-input"
          />
        </div>

        <div class="form-group">
          <label for="collectionCategory">Collection Category</label>
          <input
            id="collectionCategory"
            v-model="formData.collectionCategory"
            type="text"
            placeholder="e.g., STOCKHOLM, Collection Name"
            class="form-input"
          />
          <small class="form-hint">Optional: Category for collection-based blogs</small>
        </div>

        <div class="form-group">
          <label for="tags">Tags</label>
          <input
            id="tags"
            v-model="formData.tags"
            type="text"
            placeholder="e.g., ceramics, pottery, craft, tutorial"
            class="form-input"
          />
          <small class="form-hint">Comma-separated tags</small>
        </div>

        <div class="form-group">
          <label for="status">Status *</label>
          <select
            id="status"
            v-model="formData.status"
            required
            class="form-input"
          >
            <option value="">Select status</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <div class="form-group">
          <label for="publishedAt">Published At</label>
          <input
            id="publishedAt"
            v-model="formData.publishedAt"
            type="datetime-local"
            class="form-input"
          />
          <small class="form-hint">Leave empty to use current date/time</small>
        </div>

        <div class="form-group">
          <label for="readingTime">Reading Time (minutes)</label>
          <input
            id="readingTime"
            v-model.number="formData.readingTime"
            type="number"
            min="0"
            placeholder="e.g., 5"
            class="form-input"
          />
        </div>
      </div>

      <div class="form-actions">
        <button v-if="isEditMode" type="button" @click="goBack" class="btn btn-secondary">
          Cancel
        </button>
        <button type="button" @click="resetForm" class="btn btn-secondary" v-if="!isEditMode">
          Reset
        </button>
        <button type="submit" :disabled="isSubmitting" class="btn btn-primary">
          <span v-if="isSubmitting">Submitting...</span>
          <span v-else>{{ isEditMode ? 'Update Blog' : 'Create Blog' }}</span>
        </button>
      </div>

      <div v-if="message" :class="['message', messageType]">
        {{ message }}
      </div>
    </form>
  </div>
</template>

<script>
import { blogService } from '../services/api'

export default {
  name: 'BlogForm',
  props: {
    blog: {
      type: Object,
      default: null
    },
    isEditMode: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      formData: {
        title: '',
        h1Title: '',
        seoTitle: '',
        metaDescription: '',
        slug: '',
        content: '',
        primaryKeyword: '',
        secondaryKeywords: '',
        featuredImageUrl: '',
        canonicalUrl: '',
        indexStatus: 'index',
        category: '',
        tags: '',
        status: 'draft',
        publishedAt: '',
        readingTime: 0,
        schemaType: '',
        collectionCategory: ''
      },
      isSubmitting: false,
      message: '',
      messageType: ''
    }
  },
  mounted() {
    if (this.isEditMode && this.blog) {
      this.loadBlogData()
    } else {
      // Auto-generate slug from title
      this.$watch('formData.title', (newTitle) => {
        if (!this.isEditMode && newTitle) {
          this.formData.slug = newTitle
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
        }
      })
    }
  },
  methods: {
    loadBlogData() {
      if (this.blog) {
        this.formData.title = this.blog.title || ''
        this.formData.h1Title = this.blog.h1Title || ''
        this.formData.seoTitle = this.blog.seoTitle || ''
        this.formData.metaDescription = this.blog.metaDescription || ''
        this.formData.slug = this.blog.slug || ''
        this.formData.content = this.blog.content || ''
        this.formData.primaryKeyword = this.blog.primaryKeyword || ''
        this.formData.secondaryKeywords = this.blog.secondaryKeywords || ''
        this.formData.featuredImageUrl = this.blog.featuredImageUrl || ''
        this.formData.canonicalUrl = this.blog.canonicalUrl || ''
        this.formData.indexStatus = this.blog.indexStatus || 'index'
        this.formData.category = this.blog.category || ''
        this.formData.collectionCategory = this.blog.collectionCategory || ''
        this.formData.tags = this.blog.tags || ''
        this.formData.status = this.blog.status || 'draft'
        this.formData.readingTime = this.blog.readingTime || 0
        this.formData.schemaType = this.blog.schemaType || ''
        
        // Format publishedAt for datetime-local input
        if (this.blog.publishedAt) {
          const date = new Date(this.blog.publishedAt)
          this.formData.publishedAt = date.toISOString().slice(0, 16)
        }
      }
    },
    async handleSubmit() {
      this.isSubmitting = true
      this.message = ''
      this.messageType = ''

      try {
        const payload = {
          id: this.isEditMode && this.blog ? this.blog.id : 0,
          title: this.formData.title,
          h1Title: this.formData.h1Title,
          seoTitle: this.formData.seoTitle,
          metaDescription: this.formData.metaDescription,
          slug: this.formData.slug,
          content: this.formData.content,
          primaryKeyword: this.formData.primaryKeyword,
          secondaryKeywords: this.formData.secondaryKeywords || '',
          featuredImageUrl: this.formData.featuredImageUrl || '',
          canonicalUrl: this.formData.canonicalUrl || '',
          indexStatus: this.formData.indexStatus,
          category: this.formData.category || '',
          collectionCategory: this.formData.collectionCategory || null,
          tags: this.formData.tags || '',
          status: this.formData.status,
          publishedAt: this.formData.publishedAt ? new Date(this.formData.publishedAt).toISOString() : new Date().toISOString(),
          readingTime: Number(this.formData.readingTime) || 0,
          schemaType: this.formData.schemaType || ''
        }

        if (this.isEditMode && this.blog && this.blog.id) {
          // Update existing blog using PUT with ID in URL
          await blogService.updateBlog(this.blog.id, payload)
          this.message = 'Blog updated successfully!'
        } else {
          // Create new blog using POST
          await blogService.createBlog(payload)
          this.message = 'Blog created successfully!'
        }
        
        this.messageType = 'success'
        
        // Emit event
        setTimeout(() => {
          this.$emit('blog-saved')
          if (!this.isEditMode) {
            this.resetForm()
          }
        }, 1500)
      } catch (error) {
        this.message = error.response?.data?.message || error.message || 'Failed to save blog. Please try again.'
        this.messageType = 'error'
        console.error('Error saving blog:', error)
      } finally {
        this.isSubmitting = false
      }
    },
    resetForm() {
      this.formData = {
        title: '',
        h1Title: '',
        seoTitle: '',
        metaDescription: '',
        slug: '',
        content: '',
        primaryKeyword: '',
        secondaryKeywords: '',
        featuredImageUrl: '',
        canonicalUrl: '',
        indexStatus: 'index',
        category: '',
        tags: '',
        status: 'draft',
        publishedAt: '',
        readingTime: 0,
        schemaType: '',
        collectionCategory: ''
      }
      this.message = ''
      this.messageType = ''
    },
    goBack() {
      this.$emit('go-back')
    }
  }
}
</script>

<style scoped>
.blog-form-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  padding: 2rem;
}

.blog-form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f0f0f0;
}

.blog-form-header h2 {
  color: #667eea;
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
}

.btn-back {
  padding: 0.5rem 1rem;
  background: #f5f5f5;
  color: #333;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-back:hover {
  background: #e0e0e0;
}

.blog-form {
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
  .blog-form-container {
    padding: 1.5rem;
  }

  .blog-form-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .form-actions {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }
}
</style>
