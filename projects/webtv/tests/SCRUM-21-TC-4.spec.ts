import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";

/**
 * Jira: SCRUM-21 — TC-4
 * Invalid credentials show error and stay on login.
 */
test.describe("SCRUM-21: App Login", () => {
  test("TC-4: Invalid credentials show error and stay on login", { tag: "@smoke" }, async ({ page }) => {
    const login = new LoginPage(page);

    // 1. Open https://preview-qa-review-ae007b75.viktor.space/login
    await login.open();

    // 2. Enter invalid@test.local in email field
    await login.emailInput.fill("invalid@test.local");

    // 3. Enter wrongpassword in password field
    await login.passwordInput.fill("wrongpassword");

    // 4. Submit sign in
    await login.submitButton.click();

    // Expected result: An error message is visible; user remains on /login; URL does not contain /dashboard.
    await expect(page.getByText(/invalid credentials/i)).toBeVisible();
    await expect(page).toHaveURL(/\/login/);
    await expect(page.url()).not.toContain("/dashboard");
  });
});