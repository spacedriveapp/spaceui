import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: true,
  splitting: true,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-dom', 'react-hook-form', 'zod', '@spacedrive/primitives'],
  esbuildOptions(options) {
    options.banner = {
      js: '"use client";',
    };
  },
});
