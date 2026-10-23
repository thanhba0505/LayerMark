import { defineConfig, build as viteBuild } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import fs from 'fs';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'bundle-content-script-and-assets',
      async closeBundle() {
        if (process.env.VITEST) return;
        // Ensure dist directory exists
        fs.mkdirSync('dist', { recursive: true });

        // Bundle content script as self-contained IIFE (no imports)
        await viteBuild({
          configFile: false,
          resolve: {
            alias: {
              '@': resolve(__dirname, 'src'),
            },
          },
          build: {
            emptyOutDir: false,
            outDir: 'dist/content',
            lib: {
              entry: resolve(__dirname, 'src/content/index.ts'),
              name: 'LayerMarkContentScript',
              formats: ['iife'],
              fileName: () => 'index.js',
            },
          },
        });

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
      },
      output: {
        entryFileNames: (chunkInfo) => {
          if (chunkInfo.name === 'background') {
            return 'background/index.js';
          }
          return 'assets/[name]-[hash].js';
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
  },
});
