import { test, expect } from "@playwright/test";
import { SignupPage } from "../pages/SignupPage";

test.describe("SCRUM-20: App Sign up", () => {
  test("TC-7: Viktor SSO button is visible", { tag: "@smoke" }, async ({ page }) => {
    const signup = new SignupPage(page);
    await signup.open();
    await expect(signup.viktorButton).toBeVisible();
  });
});

