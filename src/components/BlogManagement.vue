<template>
  <div class="blog-management-container">
    <div class="blog-header">
      <h2>Blog Management</h2>
      <p class="subtitle">Create and manage blog posts</p>
    </div>

    <div class="blog-sections">
      <div class="section-tabs">
        <button
          @click="activeSection = 'create'"
          :class="['tab-button', { active: activeSection === 'create' }]"
        >
          Create Blog
        </button>
        <button
          @click="activeSection = 'edit'"
          :class="['tab-button', { active: activeSection === 'edit' }]"
        >
          Edit Blog
        </button>
      </div>

      <!-- Create Blog Section -->
      <div v-if="activeSection === 'create'" class="section-content">
        <BlogForm @blog-saved="handleBlogSaved" />
      </div>

      <!-- Edit Blog Section -->
      <div v-if="activeSection === 'edit'" class="section-content">
        <div v-if="!selectedBlog" class="blog-selection">
          <h3>Select a Blog to Edit</h3>
          <div v-if="isLoading" class="loading-state">
            <p>Loading blogs...</p>
          </div>
          <div v-else-if="errorMessage" class="error-message">
            {{ errorMessage }}
          </div>
          <div v-else-if="blogs.length === 0" class="empty-state">
            <p>No blogs found.</p>
          </div>
          <div v-else class="blogs-list">
            <div
              v-for="blog in blogs"
              :key="blog.id"
              @click="selectBlog(blog)"
              class="blog-card"
            >
              <div class="blog-card-content">
                <div class="blog-info">
                  <h4>{{ blog.title }}</h4>
                  <p class="blog-id">ID: {{ blog.id }}</p>
                  <p class="blog-meta">
                    <span v-if="blog.category">Category: {{ blog.category }}</span>
                    <span v-if="blog.status"> | Status: {{ blog.status }}</span>
                  </p>
                  <p class="blog-description">{{ truncateContent(blog.content) }}</p>
                </div>
                <div class="blog-action">
                  <button class="btn-select">Edit Blog →</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <BlogForm
          v-else
          :blog="selectedBlog"
          :is-edit-mode="true"
          @go-back="selectedBlog = null"
          @blog-saved="handleBlogSaved"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { blogService } from '../services/api'
import BlogForm from './BlogForm.vue'

export default {
  name: 'BlogManagement',
  components: {
    BlogForm
  },
  data() {
    return {
      activeSection: 'create',
      blogs: [],
      selectedBlog: null,
      isLoading: false,
      errorMessage: ''
    }
  },
  mounted() {
    this.fetchBlogs()
  },
  methods: {
    async fetchBlogs() {
      this.isLoading = true
      this.errorMessage = ''
      
      try {
        this.blogs = await blogService.getBlogs()
      } catch (error) {
        this.errorMessage = error.response?.data?.message || error.message || 'Failed to fetch blogs. Please try again.'
        console.error('Error fetching blogs:', error)
      } finally {
        this.isLoading = false
      }
    },
    selectBlog(blog) {
      this.selectedBlog = blog
    },
    handleBlogSaved() {
      this.selectedBlog = null
      this.fetchBlogs() // Refresh the list
      if (this.activeSection === 'create') {
        // Optionally switch to edit section after creating
      }
    },
    truncateContent(content) {
      if (!content) return ''
      return content.length > 150 ? content.substring(0, 150) + '...' : content
    }
  }
}
</script>

<style scoped>
.blog-management-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  padding: 2rem;
}

.blog-header {
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f0f0f0;
}

.blog-header h2 {
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

.blog-sections {
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

.blog-selection h3 {
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

.blogs-list {
  display: grid;
  gap: 1rem;
}

.blog-card {
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.blog-card:hover {
  border-color: #667eea;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.1);
  transform: translateY(-2px);
}

.blog-card-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.blog-info {
  flex: 1;
}

.blog-info h4 {
  color: #333;
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
}

.blog-id {
  color: #666;
  font-size: 0.85rem;
  margin: 0.25rem 0;
}

.blog-meta {
  color: #666;
  font-size: 0.85rem;
  margin: 0.5rem 0;
}

.blog-description {
  color: #555;
  font-size: 0.9rem;
  margin: 0.5rem 0 0 0;
  line-height: 1.5;
}

.blog-action {
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
  .blog-management-container {
    padding: 1.5rem;
  }

  .section-tabs {
    flex-direction: column;
  }

  .blog-card-content {
    flex-direction: column;
    align-items: flex-start;
  }

  .btn-select {
    width: 100%;
  }
}
</style>
