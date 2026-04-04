import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@spacedrive/tokens': path.resolve(__dirname, '../../packages/tokens/src'),
      '@spacedrive/primitives': path.resolve(__dirname, '../../packages/primitives/src'),
      '@spacedrive/forms': path.resolve(__dirname, '../../packages/forms/src'),
      '@spacedrive/ai': path.resolve(__dirname, '../../packages/ai/src'),
      '@spacedrive/explorer': path.resolve(__dirname, '../../packages/explorer/src'),
    },
  },
  server: {
    port: 19850,
  },
})
