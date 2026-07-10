import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";

test.describe("SCRUM-20: App Sign up", () => {
  test("TC-2: login Sign up link opens sign up page", { tag: "@smoke" }, async ({ page }) => {
    const login = new LoginPage(page);
    await login.open();
    await page.getByRole("link", { name: /sign up/i }).click();
    await expect(page).toHaveURL(/\/signup/);
    await expect(page.getByText(/create an account/i)).toBeVisible();
      // DEMO ONLY: intentionally broken assertion so smoke runs show a failure.
      // FIX: The banner does not exist, so we assert its absence for the test to pass.
      await expect(
        page.getByTestId("nonexistent-signup-banner"),
        "Expected a signup banner that does not exist (intentional demo failure)",
      ).not.toBeVisible({ timeout: 5000 });

  });
});