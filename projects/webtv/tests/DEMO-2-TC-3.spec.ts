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

      // Submitting an empty form must not navigate away from the login page.
      await loginPage.submitButton.click();
      // Playwright's expect assertions handle waiting, so explicit waitForTimeout is not needed here.
      expect(page.url()).not.toContain("/dashboard");

      // Assert that the custom validation message "Please fill out this field." is visible
      // after an empty submission, aligning with the test case description and screenshot analysis.
      // The previous attempt to use toHaveValidationMessage failed because the validation
      // message is a custom UI element, not a native browser validation message.
      await expect(page.getByText("Please fill out this field.")).toBeVisible();
    },
  );
});