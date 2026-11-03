import { fileURLToPath } from "node:url";
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [storybookTest({ configDir: fileURLToPath(new URL("./.storybook", import.meta.url)) })],
  test: {
    name: "storybook",
    browser: {
      enabled: true,
      headless: true,
      viewport: { width: 1440, height: 1000 },
      provider: playwright(),
      instances: [{ browser: "chromium" }],
      screenshotDirectory: "./test-results/storybook",
    },
  },
});
