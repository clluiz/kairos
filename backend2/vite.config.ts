// vite.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    include: ['src/test/**/*.test.{js,ts}'],
    deps: {
     inline: true
    },
    coverage: {
      provider: 'istanbul',
      reporter: ['html', 'text']
    },
  }
})