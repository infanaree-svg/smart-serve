import { fileURLToPath, URL } from "url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

/**
 * Vitest configuration for the Smart Serve+ frontend suite.
 *
 * The `test` script passes `--environment jsdom`; this file supplies the `@`
 * path alias the app's source uses and the shared setup module.
 */
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: "declarations",
        replacement: fileURLToPath(new URL("../declarations", import.meta.url)),
      },
      {
        find: "@",
        replacement: fileURLToPath(new URL("./src", import.meta.url)),
      },
    ],
    dedupe: ["@icp-sdk/core"],
  },
  test: {
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    css: false,
    // A single forked worker avoids the tinypool min/max thread conflict seen
    // in this sandbox and keeps the DOM environment deterministic.
    pool: "forks",
    poolOptions: {
      forks: { singleFork: true, minForks: 1, maxForks: 1 },
    },
  },
});
