import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";

/**
 * Jira: DEMO-2 (WEBTV) — Xray case TC-1
 * Login with invalid credentials shows an error and does not sign in.
 */
test.describe("DEMO-2: Login validation", () => {
  test(
    "TC-1: invalid credentials show an error and do not sign in",
    { tag: "@smoke" },
    async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.open();

      await loginPage.login("wrong-user@test.local", "definitely-wrong-password");

      await expect(loginPage.errorMessage).toBeVisible({ timeout: 10_000 });
      expect(page.url()).not.toContain("/dashboard");
    },
  );
});
