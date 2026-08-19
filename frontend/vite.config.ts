import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@labflow/ui': fileURLToPath(new URL('../packages/ui/src', import.meta.url)),
      '@labflow/utils': fileURLToPath(new URL('../packages/utils/src', import.meta.url)),
    },
  },
});