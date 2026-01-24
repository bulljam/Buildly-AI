import path from "node:path"
import { fileURLToPath } from "node:url"

import { defineConfig } from "vitest/config"

const rootDir = fileURLToPath(new URL(".", import.meta.url))

export default defineConfig({
  test: {
    environment: "node",
    globals: true,
    clearMocks: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(rootDir),
    },
  },
})
