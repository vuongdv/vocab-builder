import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Thiết lập đường dẫn tương đối để chạy trên bất kỳ path nào (kể cả Github Pages sub-path)
})
