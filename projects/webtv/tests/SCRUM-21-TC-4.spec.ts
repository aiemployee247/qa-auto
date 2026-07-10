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

    // 2. Enter wrong@example.com in email field (as per knowledge/platforms/webtv-login.md for "Error shown")
    await login.emailInput.fill("wrong@example.com");

    // 3. Enter wrongpass in password field (as per knowledge/platforms/webtv-login.md for "Error shown")
    await login.passwordInput.fill("wrongpass");

    // 4. Submit sign in
    await login.submitButton.click();

    // Expected result: An error message is visible; user remains on /login; URL does not contain /dashboard.
    // Based on knowledge/platforms/webtv-login.md for specific credentials to trigger an error,
    // and knowledge/login-testing.md which states "Invalid credentials error" for wrong passwords.
    // It's common for systems to return a generic "Invalid credentials error" for any failed login attempt
    // (unknown user or wrong password) for security reasons.
    await expect(page.getByText(/invalid credentials error/i)).toBeVisible();
    await expect(page).toHaveURL(/\/login/);
    await expect(page.url()).not.toContain("/dashboard");
  });
});