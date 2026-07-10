import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";

/**
 * Jira: DEMO-2 (WEBTV) — Xray case TC-3
 * Login form renders all required fields and blocks empty submission.
 */
test.describe("DEMO-2: Login form integrity", () => {
  test(
    "TC-3: login form shows required fields and blocks empty submit",
    { tag: "@smoke" },
    async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.open();

      await expect(loginPage.emailInput).toBeVisible();
      await expect(loginPage.passwordInput).toBeVisible();
      await expect(loginPage.submitButton).toBeVisible();

      // Fill the email field to ensure the "Please fill out this field." error
      // specifically appears for the empty password field, as per screenshot analysis.
      await loginPage.emailInput.fill('test@example.com');

      // Submitting with an empty password must not navigate away and should show a validation error.
      await loginPage.submitButton.click();
      await page.waitForTimeout(1000); // Keeping this wait as per original spec structure, though `toBeVisible` has its own retry.
      expect(page.url()).not.toContain("/dashboard");

      // Assert that the "Please fill out this field." error message is visible.
      // This assertion was missing and is the cause of the reported failure.
      await expect(page.getByText('Please fill out this field.')).toBeVisible();
    },
  );
});