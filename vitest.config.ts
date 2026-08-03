import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    include: ['src/tests/**/*.spec.ts', 'src/tests/**/*.test.ts'],
    environment: 'node',
  },
});