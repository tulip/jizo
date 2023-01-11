import { defineConfig } from 'vite';
import path from 'path';
import legacy from '@vitejs/plugin-legacy';

export default defineConfig({
  plugins: [
    legacy({
      targets: ['defaults', 'not IE 11'],
    }),
  ],
  resolve: {
    alias: {
      '@components': path.resolve(__dirname, './src/components/'),
      '@styles': path.resolve(__dirname, './src/styles/'),
      '@utils': path.resolve(__dirname, './src/utils/'),
    },
  },
  build: {
    emptyOutDir: true,
    manifest: true,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
      },
    },
  },
  css: {
    devSourcemap: true,
  },
  server: {
    host: '0.0.0.0',
  },
});
