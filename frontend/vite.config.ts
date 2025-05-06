/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'build', // Standard for production builds
  },
  test: {
    globals: true,                // Use `describe`, `it`, `expect` globally
    environment: 'jsdom',         // DOM simulation for React components
    setupFiles: './src/setupTests.ts', // Init logic or mocks before tests
    css: true,                    // Allow importing .css into components during tests
  },
  server: {
    proxy: {
      '/api': 'http://localhost:8080', // Route /api calls to Spring Boot backend
    },
  },
})