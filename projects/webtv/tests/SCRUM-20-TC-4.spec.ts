import { test, expect } from "@playwright/test";
import { SignupPage } from "../pages/SignupPage";

test.describe("SCRUM-20: App Sign up", () => {
  test("TC-4: sign in link returns to login", { tag: "@smoke" }, async ({ page }) => {
    const signup = new SignupPage(page);
    await signup.open();
    await signup.signInLink.click();
    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByText(/welcome back/i)).toBeVisible();
  });
});

