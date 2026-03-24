import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    // Never expose source maps in production — they'd reveal full source code
    sourcemap: false,
    // Warn if any chunk exceeds 600 kB
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        // Split large vendor libraries into separate chunks for better caching
        manualChunks: {
          'react-vendor':  ['react', 'react-dom'],
          'map-vendor':    ['react-simple-maps', 'd3-scale', 'd3-scale-chromatic'],
          'chart-vendor':  ['recharts'],
        },
      },
    },
  },
})
