import axios from 'axios'
import { API_CONFIG } from '../config/api'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || API_CONFIG.BASE_URL

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'accept': '*/*'
  }
})

export const productService = {
  async createProduct(productData) {
    try {
      const response = await apiClient.post('/create', productData)
      return response.data
    } catch (error) {
      throw error
    }
  },
  async getBenefits() {
    try {
      const response = await apiClient.get('/benefits')
      return response.data
    } catch (error) {
      throw error
    }
  },
  async getLovePoints() {
    try {
      const response = await apiClient.get('/lovePoints')
      return response.data
    } catch (error) {
      throw error
    }
  },
  async getProductDetails() {
    try {
      const response = await apiClient.get('/productDetails')
      return response.data
    } catch (error) {
      throw error
    }
  },
  async getDiscounts() {
    try {
      const response = await apiClient.get('/discounts')
      return response.data
    } catch (error) {
      throw error
    }
  },
  async uploadImage(ceremicId, file, isCatalogImage = false) {
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('ceremicId', ceremicId.toString())
      
      // Only append isCatalogImage if it's true
      if (isCatalogImage) {
        formData.append('isCatalogImage', 'true')
      }

      const response = await axios.post(
        `${API_BASE_URL}/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'accept': '*/*'
          }
        }
      )
      return response.data
    } catch (error) {
      throw error
    }
  },
  async createProductSEO(seoData) {
    try {
      const response = await apiClient.post('/product-seo', seoData)
      return response.data
    } catch (error) {
      throw error
    }
  },
  async updateProductSEO(seoId, seoData) {
    try {
      const response = await apiClient.put(`/product-seo/${seoId}`, seoData)
      return response.data
    } catch (error) {
      throw error
    }
  },
  async getProducts() {
    try {
      const response = await apiClient.get('/collections')
      return response.data
    } catch (error) {
      throw error
    }
  },
  async getProductSEO(productId) {
    try {
      const response = await apiClient.get(`/product-seo/product/${productId}`)
      return response.data
    } catch (error) {
      throw error
    }
  }
}

export const orderService = {
  async getOrders() {
    try {
      const response = await apiClient.get('/orders')
      return response.data
    } catch (error) {
      throw error
    }
  },
  async getOrderById(orderId) {
    try {
      const response = await apiClient.get(`/orders/${orderId}`)
      return response.data
    } catch (error) {
      throw error
    }
  }
}

export const faqService = {
  async getFAQs() {
    try {
      const response = await apiClient.get('/faqs')
      return response.data
    } catch (error) {
      throw error
    }
  },
  async createFAQ(faqData) {
    try {
      const response = await apiClient.post('/faqs', faqData)
      return response.data
    } catch (error) {
      throw error
    }
  },
  async updateFAQ(faqId, faqData) {
    try {
      const response = await apiClient.put(`/faqs/${faqId}`, faqData)
      return response.data
    } catch (error) {
      throw error
    }
  },
  async deleteFAQ(faqId) {
    try {
      const response = await apiClient.delete(`/faqs/${faqId}`)
      return response.data
    } catch (error) {
      throw error
    }
  }
}

export const blogService = {
  async createBlog(blogData) {
    try {
      const response = await apiClient.post('/blog', blogData)
      return response.data
    } catch (error) {
      throw error
    }
  },
  async updateBlog(blogId, blogData) {
    try {
      const response = await apiClient.put(`/blog/${blogId}`, blogData)
      return response.data
    } catch (error) {
      throw error
    }
  },
  async getBlogs() {
    try {
      const response = await apiClient.get('/blog')
      return response.data
    } catch (error) {
      throw error
    }
  },
  async getBlogById(blogId) {
    try {
      const response = await apiClient.get(`/blog/${blogId}`)
      return response.data
    } catch (error) {
      throw error
    }
  }
}
