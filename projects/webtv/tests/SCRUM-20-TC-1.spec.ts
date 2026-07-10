import { test, expect } from "@playwright/test";
import { SignupPage } from "../pages/SignupPage";

/**
 * Jira: SCRUM-20 — TC-1
 * Sign up page loads with the account creation form.
 */
test.describe("SCRUM-20: App Sign up", () => {
  test("TC-1: sign up page loads with account form", { tag: "@smoke" }, async ({ page }) => {
    const signup = new SignupPage(page);
    await signup.open();
    await expect(page.getByText(/create an account/i)).toBeVisible();
    await expect(signup.nameInput).toBeVisible();
    await expect(signup.emailInput).toBeVisible();
    await expect(signup.passwordInput).toBeVisible();
  });
});

