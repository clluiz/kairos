// vite.config.ts
import path from "path"
import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    globals: true,
    testTimeout: 100000,
    include: ["src/test/**/*.test.{js,ts}"],
    deps: {
      inline: true,
    },
    coverage: {
      provider: "istanbul",
      reporter: ["html", "text"],
    },
  },
})
