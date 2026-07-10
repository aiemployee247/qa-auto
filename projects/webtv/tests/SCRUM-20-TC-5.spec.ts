import { test, expect } from "@playwright/test";
import { SignupPage } from "../pages/SignupPage";

test.describe("SCRUM-20: App Sign up", () => {
  test("TC-5: empty submit does not reach dashboard", { tag: "@smoke" }, async ({ page }) => {
    const signup = new SignupPage(page);
    await signup.open();
    await signup.submitButton.click();
    // A short wait to allow the page to process the submission and display error messages.
    // The expect().toBeVisible() below will also implicitly wait for the element to appear.
    await page.waitForTimeout(1000); 
    expect(page.url()).not.toContain("/dashboard");
    expect(page.url()).toContain("/signup");
    // Fix: Assert that the "Please fill out this field." error message is visible after an empty submission.
    await expect(page.getByText('Please fill out this field.')).toBeVisible();
  });
});