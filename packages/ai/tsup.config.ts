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
    '@tanstack/react-query',
    '@tanstack/react-virtual',
    'react-markdown',
    'remark-gfm',
    'rehype-raw',
    'framer-motion',
    '@react-sigma/core',
    'sigma',
    'graphology',
    '@dnd-kit/core',
    '@dnd-kit/sortable',
    '@dnd-kit/utilities'
  ],
  esbuildOptions(options) {
    options.banner = {
      js: '"use client";',
    };
  },
});
