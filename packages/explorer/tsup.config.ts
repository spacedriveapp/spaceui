import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: true,
  splitting: true,
  sourcemap: true,
  clean: true,
  external: [
    'react',
    'react-dom',
    '@spacedrive/primitives',
    '@phosphor-icons/react',
    '@tanstack/react-virtual'
  ],
  esbuildOptions(options) {
    options.banner = {
      js: '"use client";',
    };
  },
});
