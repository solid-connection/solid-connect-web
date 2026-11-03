import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  // One local fixture owns the chat rooms. Keep resets isolated across projects.
  workers: 1,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  timeout: 45_000,
  expect: { timeout: 10_000 },
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: "http://127.0.0.1:43181",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    { name: "desktop", testIgnore: "**/responsive.spec.ts", use: { ...devices["Desktop Chrome"] } },
    {
      name: "mobile",
      testIgnore: "**/responsive.spec.ts",
      use: { ...devices["Pixel 7"], viewport: { width: 390, height: 844 } },
    },
    { name: "responsive", testMatch: "**/responsive.spec.ts", use: { ...devices["Desktop Chrome"] } },
  ],
  webServer: [
    { command: "node e2e/fixtures/server.mjs", url: "http://127.0.0.1:43180/__health", reuseExistingServer: false },
    {
      command: "pnpm --filter @solid-connect/university-web exec next dev --hostname 127.0.0.1 --port 43182",
      url: "http://127.0.0.1:43182/university/inha",
      reuseExistingServer: false,
      timeout: 120_000,
      env: {
        NEXT_PUBLIC_API_SERVER_URL: "http://127.0.0.1:43180",
        NEXT_TELEMETRY_DISABLED: "1",
        SENTRY_AUTH_TOKEN: "",
      },
    },
    {
      command: "pnpm exec next dev --hostname 127.0.0.1 --port 43181",
      url: "http://127.0.0.1:43181/login",
      reuseExistingServer: false,
      timeout: 120_000,
      env: {
        NEXT_PUBLIC_API_SERVER_URL: "http://127.0.0.1:43180",
        UNIVERSITY_WEB_DOMAIN: "http://127.0.0.1:43182",
        NEXT_TELEMETRY_DISABLED: "1",
        SENTRY_AUTH_TOKEN: "",
      },
    },
  ],
});
