import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";

/**
 * Jira: SCRUM-21 — TC-5
 * Viktor workspace SSO entry point is visible on login.
 */
test.describe("SCRUM-21: Login page SSO functionality", () => {
  test("TC-5: Viktor workspace SSO button is visible", { tag: "@smoke" }, async ({ page }) => {
    const login = new LoginPage(page);
    await login.open();
    await expect(page.getByRole('button', { name: 'Sign in with Viktor' })).toBeVisible();
  });
});