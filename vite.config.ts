import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Any request starting with /api will be sent to the Docker network Caddy is using
      '/api': {
        // Target Caddy's public address (if Caddy is running on port 3000)
        target: 'http://100.118.254.105:9000', 
        changeOrigin: true, // Needed for virtual hosting
        secure: false,      // Use false for local HTTP
      },
    },
  },
})