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
  }
}

