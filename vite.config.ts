import { defineConfig } from 'vite';
import { crx } from '@crxjs/vite-plugin';
import manifest from './src/manifest';
import { resolve } from 'path';

export default defineConfig({
  build: {
    emptyOutDir: true,
    outDir: 'dist',
  },
  publicDir: 'public', // Explicitly set the public directory
  plugins: [crx({ manifest })],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  }
});
