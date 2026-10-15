import { defineConfig } from 'vite';

export default defineConfig(({ mode }) => ({
  base: './',
  define: {
    __ENABLE_SW__: JSON.stringify(mode !== 'artifact'),
  },
  oxc: { jsx: { runtime: 'automatic', importSource: 'preact' } },
  build: {
    outDir: mode === 'artifact' ? 'dist-artifact' : 'dist',
    target: 'es2022',
    assetsInlineLimit: 0,
    chunkSizeWarningLimit: 1500,
  },
  server: { host: true },
}));
