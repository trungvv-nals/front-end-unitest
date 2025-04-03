import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    watch: true,
    globals: true,
    environment: "jsdom",
    coverage: {
      provider: "istanbul",
      reporter: ["text", "json", "html"],
    },
  },
});
