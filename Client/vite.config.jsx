import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig({
  // Order matters: svgr must be before react
  plugins: [svgr(), react()],
  base: '/',
});
