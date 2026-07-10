import { test, expect } from "@playwright/test";
import { SignupPage } from "../pages/SignupPage";

test.describe("SCRUM-20: App Sign up", () => {
  test("TC-3: sign up form shows name email password", { tag: "@smoke" }, async ({ page }) => {
    const signup = new SignupPage(page);
    await signup.open();
    await expect(signup.nameInput).toBeVisible();
    await expect(signup.emailInput).toBeVisible();
    await expect(signup.passwordInput).toBeVisible();
  });
});

