import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Allow /manager and any other paths to fall back to index.html (SPA routing)
    historyApiFallback: true,
  }
})
