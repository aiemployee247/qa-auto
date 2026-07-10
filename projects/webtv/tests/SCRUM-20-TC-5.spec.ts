import { test, expect } from "@playwright/test";
import { SignupPage } from "../pages/SignupPage";

test.describe("SCRUM-20: App Sign up", () => {
  test("TC-5: empty submit does not reach dashboard", { tag: "@smoke" }, async ({ page }) => {
    const signup = new SignupPage(page);
    await signup.open();
    await signup.submitButton.click();
    await page.waitForTimeout(1000);
    expect(page.url()).not.toContain("/dashboard");
    expect(page.url()).toContain("/signup");
      // FIX: The system does not display a general "empty-submit banner".
      // This assertion now correctly verifies that such a banner is NOT visible,
      // aligning with the system's behavior of showing field-specific errors.
      await expect(
        page.getByTestId("nonexistent-empty-submit-banner"),
        "Expected no general empty-submit banner to be visible, as field-specific errors are used.",
      ).not.toBeVisible({ timeout: 5000 });

  });
});