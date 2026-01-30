// API Configuration
// The API base URL is now controlled by environment variables
// Use .env.development for local development (localhost:9090)
// Use .env.production for production (https://api.svrve.com)

export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://api.svrve.com'
}

