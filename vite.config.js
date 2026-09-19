import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        process: resolve(__dirname, 'process.html'),
        portfolio: resolve(__dirname, 'portfolio.html'),
      },
    },
  },
});
