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
  });
});

