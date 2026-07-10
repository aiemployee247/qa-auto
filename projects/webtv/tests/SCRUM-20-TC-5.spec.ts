import { test, expect } from "@playwright/test";
import { SignupPage } from "../pages/SignupPage";

test.describe("SCRUM-20: App Sign up", () => {
  test("TC-5: empty submit does not reach dashboard", { tag: "@smoke" }, async ({ page }) => {
    const signup = new SignupPage(page);
    await signup.open();
    await signup.submitButton.click();

    // Assert that the page remains on the signup page and does not navigate to the dashboard
    await expect(page).toHaveURL(/.*signup/);
    await expect(page).not.toHaveURL(/.*dashboard/);

    // Verify that a validation error message is displayed for empty fields.
    // Based on the screenshot analysis, "Please fill out this field." appears for the Email field
    // and is a general error for empty required fields.
    await expect(page.getByText('Please fill out this field.')).toBeVisible();
  });
});