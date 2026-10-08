import { fileURLToPath } from "node:url";

import { defineConfig } from "vitest/config";

// Unit tests cover pure business logic (pricing, cart, search, URL state).
// UI behaviour is covered by the end-to-end journey described in the README.
export default defineConfig({
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  test: {
    include: ["src/**/*.test.ts"],
    environment: "node",
  },
});
