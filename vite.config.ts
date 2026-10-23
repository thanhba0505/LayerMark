import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import fs from 'fs';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-extension-assets',
      closeBundle() {
        // Ensure dist directory exists
        fs.mkdirSync('dist', { recursive: true });

        // Copy manifest.json to dist/manifest.json
        if (fs.existsSync('src/manifest.json')) {
          fs.copyFileSync('src/manifest.json', 'dist/manifest.json');
        }

        // Copy public/icons to dist/icons
        if (fs.existsSync('public/icons')) {
          fs.mkdirSync('dist/icons', { recursive: true });
          const icons = fs.readdirSync('public/icons');
          for (const icon of icons) {
            fs.copyFileSync(`public/icons/${icon}`, `dist/icons/${icon}`);
          }
        }
      },
    },
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'src/popup/index.html'),
        options: resolve(__dirname, 'src/options/index.html'),
        background: resolve(__dirname, 'src/background/index.ts'),
        content: resolve(__dirname, 'src/content/index.ts'),
      },
      output: {
        entryFileNames: (chunkInfo) => {
          if (chunkInfo.name === 'background') {
            return 'background/index.js';
          }
          if (chunkInfo.name === 'content') {
            return 'content/index.js';
          }
          return 'assets/[name]-[hash].js';
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
  },
});
