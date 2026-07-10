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
      // DEMO ONLY: intentionally broken assertion so smoke runs show a failure.
      await expect(
        page.getByTestId("nonexistent-empty-submit-banner"),
        "Expected an empty-submit banner that does not exist (intentional demo failure)",
      ).toBeVisible({ timeout: 5000 });

  });
});

