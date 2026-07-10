import { defineConfig, devices } from "@playwright/test";

/**
 * Central Playwright config for all automatable platforms.
 * Each Jira project / platform gets its own Playwright "project"
 * pointing at its folder under projects/.
 *
 * Base URLs come from env vars so the same specs run against
 * staging, preview, or production without code changes.
 */
export default defineConfig({
  testDir: "./projects",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [
    ["html", { open: "never" }],
    // Machine-readable per-test results, shipped inside the report artifact
    // so the QA Review dashboard can record pass/fail per test case.
    ["json", { outputFile: "playwright-report/results.json" }],
    ["list"],
  ],
  timeout: 60_000,
  expect: { timeout: 10_000 },
  use: {
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    // PW_VIDEO=on forces video recording for every test in the run
    // (used by the "Run Spec (on demand)" workflow when video proof is requested).
    video: process.env.PW_VIDEO === "on" ? "on" : "retain-on-failure",
  },
  projects: [
    {
      name: "webtv",
      testDir: "./projects/webtv/tests",
      use: {
        ...devices["Desktop Chrome"],
        baseURL:
          process.env.WEBTV_BASE_URL ||
          "https://preview-qa-review-ae007b75.viktor.space",
      },
    },
    {
      name: "uctv",
      testDir: "./projects/uctv/tests",
      use: {
        ...devices["Desktop Chrome"],
        baseURL: process.env.UCTV_BASE_URL || "",
      },
    },
    // Native apps (gstream / astream) use Appium + WebdriverIO —
    // see projects/gstream and projects/astream (npm run test:gstream:android).
  ],
});
