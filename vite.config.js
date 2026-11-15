import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base './' keeps every asset path relative, so the built site works from
// any GitHub Pages sub-folder (username.github.io/anything/).
export default defineConfig({
  base: './',
  plugins: [react()],
  build: { chunkSizeWarningLimit: 1400 },
})
