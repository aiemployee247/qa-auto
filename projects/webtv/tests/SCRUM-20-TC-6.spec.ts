import { test, expect } from "@playwright/test";
import { SignupPage } from "../pages/SignupPage";

test.describe("SCRUM-20: App Sign up", () => {
  test("TC-6: password minimum length hint is shown", { tag: "@smoke" }, async ({ page }) => {
    const signup = new SignupPage(page);
    await signup.open();
    await expect(signup.passwordHint).toBeVisible();
  });
});

