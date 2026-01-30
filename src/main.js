import { createApp } from 'vue'
import App from './App.vue'
import './style.css'

try {
  const app = createApp(App)
  app.mount('#app')
  console.log('Vue app mounted successfully')
} catch (error) {
  console.error('Error mounting Vue app:', error)
  document.getElementById('app').innerHTML = `
    <div style="padding: 2rem; text-align: center; font-family: sans-serif;">
      <h1>Application Error</h1>
      <p>Failed to load the application. Please check the console for details.</p>
      <p style="color: #666; font-size: 0.9rem;">Error: ${error.message}</p>
    </div>
  `
}

