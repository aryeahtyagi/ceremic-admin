<template>
  <div class="faq-container">
    <div class="faq-header">
      <h2>FAQ Management</h2>
    </div>

    <div class="faq-content">
      <!-- Add FAQ Form -->
      <div class="add-faq-section">
        <h3>Add New FAQ</h3>
        <form @submit.prevent="handleSubmit" class="faq-form">
          <div class="form-group">
            <label for="question">Question *</label>
            <input
              id="question"
              v-model="formData.question"
              type="text"
              required
              placeholder="e.g., What is your return policy?"
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label for="answer">Answer *</label>
            <textarea
              id="answer"
              v-model="formData.answer"
              required
              rows="5"
              placeholder="e.g., We offer a 30-day return policy..."
              class="form-input"
            ></textarea>
          </div>

          <div class="form-actions">
            <button type="button" @click="resetForm" class="btn btn-secondary">
              Reset
            </button>
            <button type="submit" :disabled="isSubmitting" class="btn btn-primary">
              <span v-if="isSubmitting">Submitting...</span>
              <span v-else>Add FAQ</span>
            </button>
          </div>

          <div v-if="message" :class="['message', messageType]">
            {{ message }}
          </div>
        </form>
      </div>

      <!-- Existing FAQs List -->
      <div class="faqs-list-section">
        <div class="section-header">
          <h3>Existing FAQs ({{ faqs.length }})</h3>
          <button @click="fetchFAQs" class="refresh-btn" :disabled="isLoading">
            <span v-if="isLoading">Loading...</span>
            <span v-else>Refresh</span>
          </button>
        </div>

        <div v-if="isLoading && faqs.length === 0" class="loading-state">
          <p>Loading FAQs...</p>
        </div>

        <div v-else-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>

        <div v-else-if="faqs.length === 0" class="empty-state">
          <p>No FAQs found. Add your first FAQ above.</p>
        </div>

        <div v-else class="faqs-list">
          <div v-for="faq in faqs" :key="faq.id" class="faq-card">
            <div class="faq-question">
              <strong>Q:</strong> {{ faq.question }}
            </div>
            <div class="faq-answer">
              <strong>A:</strong> {{ faq.answer }}
            </div>
            <div class="faq-actions">
              <button @click="editFAQ(faq)" class="btn-edit">Edit</button>
              <button @click="deleteFAQ(faq.id)" class="btn-delete">Delete</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { faqService } from '../services/api'

export default {
  name: 'FAQForm',
  data() {
    return {
      formData: {
        question: '',
        answer: ''
      },
      faqs: [],
      isLoading: false,
      isSubmitting: false,
      message: '',
      messageType: '',
      errorMessage: '',
      editingId: null
    }
  },
  mounted() {
    try {
      this.fetchFAQs()
    } catch (error) {
      console.error('Error in FAQForm mounted:', error)
      // Don't let errors prevent the component from rendering
    }
  },
  methods: {
    async fetchFAQs() {
      this.isLoading = true
      this.errorMessage = ''
      
      try {
        this.faqs = await faqService.getFAQs()
      } catch (error) {
        this.errorMessage = error.response?.data?.message || error.message || 'Failed to fetch FAQs. Please try again.'
        console.error('Error fetching FAQs:', error)
      } finally {
        this.isLoading = false
      }
    },
    async handleSubmit() {
      this.isSubmitting = true
      this.message = ''
      this.messageType = ''

      try {
        if (this.editingId) {
          // Update existing FAQ
          await faqService.updateFAQ(this.editingId, this.formData)
          this.message = 'FAQ updated successfully!'
        } else {
          // Create new FAQ
          await faqService.createFAQ(this.formData)
          this.message = 'FAQ added successfully!'
        }
        
        this.messageType = 'success'
        this.resetForm()
        await this.fetchFAQs()
        
        // Clear message after 3 seconds
        setTimeout(() => {
          this.message = ''
          this.messageType = ''
        }, 3000)
      } catch (error) {
        this.message = error.response?.data?.message || error.message || 'Failed to save FAQ. Please try again.'
        this.messageType = 'error'
        console.error('Error saving FAQ:', error)
      } finally {
        this.isSubmitting = false
      }
    },
    editFAQ(faq) {
      this.formData.question = faq.question
      this.formData.answer = faq.answer
      this.editingId = faq.id
      
      // Scroll to form
      document.querySelector('.add-faq-section')?.scrollIntoView({ behavior: 'smooth' })
    },
    async deleteFAQ(id) {
      if (!confirm('Are you sure you want to delete this FAQ?')) {
        return
      }

      try {
        await faqService.deleteFAQ(id)
        this.message = 'FAQ deleted successfully!'
        this.messageType = 'success'
        await this.fetchFAQs()
        
        // Clear message after 3 seconds
        setTimeout(() => {
          this.message = ''
          this.messageType = ''
        }, 3000)
      } catch (error) {
        this.message = error.response?.data?.message || error.message || 'Failed to delete FAQ. Please try again.'
        this.messageType = 'error'
        console.error('Error deleting FAQ:', error)
      }
    },
    resetForm() {
      this.formData = {
        question: '',
        answer: ''
      }
      this.editingId = null
      this.message = ''
      this.messageType = ''
    }
  }
}
</script>

<style scoped>
.faq-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  padding: 2rem;
}

.faq-header {
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f0f0f0;
}

.faq-header h2 {
  color: #667eea;
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
}

.faq-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.add-faq-section {
  padding: 1.5rem;
  background: #f8f9ff;
  border-radius: 8px;
}

.add-faq-section h3 {
  color: #667eea;
  margin-bottom: 1.5rem;
  font-size: 1.2rem;
}

.faq-form {
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

.form-actions {
  display: flex;
  gap: 1rem;
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

.faqs-list-section {
  padding: 1.5rem;
  background: white;
  border-radius: 8px;
  border: 2px solid #f0f0f0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #f0f0f0;
}

.section-header h3 {
  color: #667eea;
  margin: 0;
  font-size: 1.2rem;
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
  padding: 2rem;
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

.faqs-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.faq-card {
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  padding: 1.5rem;
  transition: all 0.3s ease;
}

.faq-card:hover {
  border-color: #667eea;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.1);
}

.faq-question {
  color: #333;
  font-size: 1.1rem;
  margin-bottom: 1rem;
  line-height: 1.6;
}

.faq-question strong {
  color: #667eea;
}

.faq-answer {
  color: #555;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.faq-answer strong {
  color: #667eea;
}

.faq-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
  padding-top: 1rem;
  border-top: 1px solid #f0f0f0;
}

.btn-edit,
.btn-delete {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-edit {
  background: #667eea;
  color: white;
}

.btn-edit:hover {
  background: #5568d3;
  transform: translateY(-1px);
}

.btn-delete {
  background: #ff4444;
  color: white;
}

.btn-delete:hover {
  background: #cc0000;
  transform: translateY(-1px);
}

@media (max-width: 768px) {
  .faq-container {
    padding: 1.5rem;
  }

  .form-actions {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }

  .section-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .faq-actions {
    flex-direction: column;
  }

  .btn-edit,
  .btn-delete {
    width: 100%;
  }
}
</style>
