import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
 
  server: {
    host: '0.0.0.0',
    port: 5174,
  },

  build: {
    target: 'esnext',
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor-react';
            }
            if (id.includes('chart.js') || id.includes('react-chartjs-2')) {
              return 'vendor-charts';
            }
            if (id.includes('jspdf') || id.includes('pdf')) {
              return 'vendor-pdf';
            }
            return 'vendor';
          }
        }
      }
    }
  },

  optimizeDeps: {
    include: ['react', 'react-dom']
  }
})
