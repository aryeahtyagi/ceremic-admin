<template>
  <nav class="navigation">
    <button
      v-for="item in navItems"
      :key="item.id"
      @click="$emit('navigate', item.id)"
      :class="['nav-button', { active: currentView === item.id }]"
    >
      {{ item.label }}
    </button>
  </nav>
</template>

<script>
export default {
  name: 'Navigation',
  props: {
    currentView: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      navItems: [
        { id: 'products', label: 'Product Upload' },
        { id: 'edit-product', label: 'Edit Product' },
        { id: 'blog', label: 'Blog' },
        { id: 'native-upload', label: 'Upload Native Image' },
        { id: 'orders', label: 'Orders' },
        { id: 'faqs', label: 'FAQs' }
      ]
    }
  }
}
</script>

<style scoped>
.navigation {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  background: white;
  padding: 1rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.nav-button {
  flex: 1;
  padding: 0.75rem 1.5rem;
  border: 2px solid #e0e0e0;
  background: white;
  color: #667eea;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.nav-button:hover {
  background: #f8f9ff;
  border-color: #667eea;
  transform: translateY(-2px);
}

.nav-button.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: transparent;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

@media (max-width: 768px) {
  .navigation {
    flex-direction: column;
  }

  .nav-button {
    width: 100%;
  }
}
</style>
