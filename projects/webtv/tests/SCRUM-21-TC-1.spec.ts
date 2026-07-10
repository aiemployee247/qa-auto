import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";

/**
 * Jira: SCRUM-21 — TC-1
 * Login page loads with email, password, and sign-in control
 */
test.describe("SCRUM-21: Login page loads with controls", () => {
  test("TC-1: Login page loads with email, password, and sign-in control", { tag: "@smoke" }, async ({ page }) => {
    const login = new LoginPage(page);

    // 1. Open https://preview-qa-review-ae007b75.viktor.space/login at 1920×1080 WebTV viewport
    await login.open();
    await expect(page).toHaveURL(/\/login/);

    // 2. Verify welcome/sign-in heading is visible
    await expect(page.getByText(/sign in|welcome/i)).toBeVisible();

    // 3. Verify email and password inputs are visible
    await expect(login.emailInput).toBeVisible();
    await expect(login.passwordInput).toBeVisible();

    // 4. Verify the primary sign-in submit control is visible
    await expect(login.submitButton).toBeVisible();
  });
});