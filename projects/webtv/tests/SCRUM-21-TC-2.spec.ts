import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { SignupPage } from "../pages/SignupPage";

/**
 * Jira: SCRUM-21 — TC-2
 * Sign up link on login navigates to create-account page
 */
test.describe("SCRUM-21: Login page navigation", () => {
  test("TC-2: Sign up link on login navigates to create-account page", { tag: "@smoke" }, async ({ page }) => {
    const login = new LoginPage(page);
    await login.open();

    // Activate the "Sign up" link
    await login.signUpLink.click();

    // Browser navigates to /signup
    await expect(page).toHaveURL(/\/signup/);

    // Create-account content is shown (e.g., the "Create Account" button)
    const signup = new SignupPage(page);
    await expect(signup.submitButton).toBeVisible();
  });
});