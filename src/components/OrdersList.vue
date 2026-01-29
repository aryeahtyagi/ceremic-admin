<template>
  <div class="orders-container">
    <div class="orders-header">
      <h2>Orders Management</h2>
      <button @click="fetchOrders" class="refresh-btn" :disabled="isLoading">
        <span v-if="isLoading">Loading...</span>
        <span v-else>Refresh</span>
      </button>
    </div>

    <div v-if="isLoading && orders.length === 0" class="loading-state">
      <p>Loading orders...</p>
    </div>

    <div v-else-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>

    <div v-else-if="orders.length === 0" class="empty-state">
      <p>No orders found.</p>
    </div>

    <div v-else class="orders-list">
      <div v-for="order in orders" :key="order.id" class="order-card">
        <div class="order-header">
          <div class="order-id">
            <strong>Order ID:</strong> #{{ order.id }}
          </div>
          <div class="order-status" :class="getStatusClass(order.status)">
            {{ order.status || 'Pending' }}
          </div>
        </div>

        <div class="order-details">
          <div class="detail-row">
            <span class="label">Customer Name:</span>
            <span class="value">{{ order.customerName || order.name || 'N/A' }}</span>
          </div>
          <div class="detail-row">
            <span class="label">Email:</span>
            <span class="value">{{ order.email || 'N/A' }}</span>
          </div>
          <div class="detail-row">
            <span class="label">Phone:</span>
            <span class="value">{{ order.phone || order.phoneNumber || 'N/A' }}</span>
          </div>
          <div class="detail-row">
            <span class="label">Total Amount:</span>
            <span class="value amount">₹{{ formatPrice(order.totalAmount || order.total || order.amount || 0) }}</span>
          </div>
          <div class="detail-row" v-if="order.orderDate || order.createdAt">
            <span class="label">Order Date:</span>
            <span class="value">{{ formatDate(order.orderDate || order.createdAt) }}</span>
          </div>
        </div>

        <div v-if="order.items && order.items.length > 0" class="order-items">
          <h4>Items:</h4>
          <div v-for="(item, index) in order.items" :key="index" class="order-item">
            <span class="item-name">{{ item.productName || item.name || 'Product' }}</span>
            <span class="item-quantity">Qty: {{ item.quantity || 1 }}</span>
            <span class="item-price">₹{{ formatPrice(item.price || 0) }}</span>
          </div>
        </div>

        <div v-if="order.shippingAddress" class="shipping-address">
          <h4>Shipping Address:</h4>
          <p>{{ formatAddress(order.shippingAddress) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { orderService } from '../services/api'

export default {
  name: 'OrdersList',
  data() {
    return {
      orders: [],
      isLoading: false,
      errorMessage: ''
    }
  },
  mounted() {
    try {
      this.fetchOrders()
    } catch (error) {
      console.error('Error in OrdersList mounted:', error)
      // Don't let errors prevent the component from rendering
    }
  },
  methods: {
    async fetchOrders() {
      this.isLoading = true
      this.errorMessage = ''
      
      try {
        this.orders = await orderService.getOrders()
      } catch (error) {
        this.errorMessage = error.response?.data?.message || error.message || 'Failed to fetch orders. Please try again.'
        console.error('Error fetching orders:', error)
      } finally {
        this.isLoading = false
      }
    },
    formatPrice(price) {
      return Number(price).toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })
    },
    formatDate(dateString) {
      if (!dateString) return 'N/A'
      const date = new Date(dateString)
      return date.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    },
    formatAddress(address) {
      if (typeof address === 'string') return address
      if (typeof address === 'object') {
        const parts = [
          address.street,
          address.city,
          address.state,
          address.zipCode || address.pincode,
          address.country
        ].filter(Boolean)
        return parts.join(', ')
      }
      return 'N/A'
    },
    getStatusClass(status) {
      const statusLower = (status || '').toLowerCase()
      if (statusLower.includes('completed') || statusLower.includes('delivered')) {
        return 'status-completed'
      } else if (statusLower.includes('pending')) {
        return 'status-pending'
      } else if (statusLower.includes('processing') || statusLower.includes('shipped')) {
        return 'status-processing'
      } else if (statusLower.includes('cancelled')) {
        return 'status-cancelled'
      }
      return 'status-pending'
    }
  }
}
</script>

<style scoped>
.orders-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  padding: 2rem;
}

.orders-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f0f0f0;
}

.orders-header h2 {
  color: #667eea;
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
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

.orders-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.order-card {
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  padding: 1.5rem;
  transition: all 0.3s ease;
}

.order-card:hover {
  border-color: #667eea;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.1);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #f0f0f0;
}

.order-id {
  color: #333;
  font-size: 1.1rem;
}

.order-status {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
}

.status-pending {
  background: #fff3cd;
  color: #856404;
}

.status-processing {
  background: #cfe2ff;
  color: #084298;
}

.status-completed {
  background: #d1e7dd;
  color: #0f5132;
}

.status-cancelled {
  background: #f8d7da;
  color: #721c24;
}

.order-details {
  margin-bottom: 1rem;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid #f5f5f5;
}

.detail-row:last-child {
  border-bottom: none;
}

.label {
  color: #666;
  font-weight: 500;
}

.value {
  color: #333;
  font-weight: 600;
}

.value.amount {
  color: #667eea;
  font-size: 1.1rem;
}

.order-items {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #f0f0f0;
}

.order-items h4 {
  color: #667eea;
  margin-bottom: 0.75rem;
  font-size: 1rem;
}

.order-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  background: #f8f9ff;
  border-radius: 6px;
}

.item-name {
  flex: 1;
  color: #333;
}

.item-quantity {
  color: #666;
  margin: 0 1rem;
}

.item-price {
  color: #667eea;
  font-weight: 600;
}

.shipping-address {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #f0f0f0;
}

.shipping-address h4 {
  color: #667eea;
  margin-bottom: 0.5rem;
  font-size: 1rem;
}

.shipping-address p {
  color: #555;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .orders-container {
    padding: 1.5rem;
  }

  .orders-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .order-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .detail-row {
    flex-direction: column;
    gap: 0.25rem;
  }

  .order-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }
}
</style>
