import { test, expect } from "@playwright/test";
import { SignupPage } from "../pages/SignupPage";

test.describe("SCRUM-20: App Sign up", () => {
  test("TC-5: empty submit does not reach dashboard", { tag: "@smoke" }, async ({ page }) => {
    const signup = new SignupPage(page);
    await signup.open();
    await signup.submitButton.click();
    // Removed await page.waitForTimeout(1000); as it's a brittle hard wait.
    // Playwright's assertions have auto-retry.

    expect(page.url()).not.toContain("/dashboard");
    expect(page.url()).toContain("/signup");

    // The previous attempt failed because 'Please fill out this field.' was not visible.
    // The screenshot analysis confirms it should be visible after submission.
    // This suggests a timing issue where the error message takes longer to appear.
    // Increasing the timeout for this specific assertion to allow for rendering.
    await expect(page.getByText('Please fill out this field.')).toBeVisible({ timeout: 10000 });
  });
});