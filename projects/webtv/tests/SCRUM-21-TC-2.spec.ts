import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { SignupPage } from "../pages/SignupPage";

/**
 * Jira: SCRUM-21 — TC-2
 * Sign up link on login navigates to create-account page
 */
test.describe("SCRUM-21: Login page sign up link", () => {
  test("TC-2: Sign up link navigates to /signup", { tag: "@smoke" }, async ({ page }) => {
    const login = new LoginPage(page);
    await login.open();
    await login.signUpLink.click();

    await expect(page).toHaveURL(/\/signup/);
    const signup = new SignupPage(page);
    await expect(signup.nameInput).toBeVisible();
    await expect(signup.submitButton).toBeVisible();
  });
});