import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";

/**
 * Jira: SCRUM-21 — TC-3
 * Empty submit does not authenticate to dashboard
 */
test.describe("SCRUM-21: App Login", () => {
  test("TC-3: Empty submit does not authenticate to dashboard", { tag: "@smoke" }, async ({ page }) => {
    const login = new LoginPage(page);
    await login.open();
    await login.submitButton.click();
    await expect(page.url()).not.toContain("/dashboard");
    await expect(page).toHaveURL(/\/login/);
  });
});