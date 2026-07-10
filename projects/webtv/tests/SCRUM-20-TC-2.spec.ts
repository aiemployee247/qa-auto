import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";

test.describe("SCRUM-20: App Sign up", () => {
  test("TC-2: login Sign up link opens sign up page", { tag: "@smoke" }, async ({ page }) => {
    const login = new LoginPage(page);
    await login.open();
    await page.getByRole("link", { name: /sign up/i }).click();
    await expect(page).toHaveURL(/\/signup/);
    await expect(page.getByText(/create an account/i)).toBeVisible();
  });
});

