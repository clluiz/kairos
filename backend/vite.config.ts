// vite.config.ts
import path from "path"
import { defineConfig } from "vitest/config"

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
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
