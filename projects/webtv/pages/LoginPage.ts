import { expect, type Page } from "@playwright/test";
import { BasePage } from "@shared/pages/BasePage";

export class LoginPage extends BasePage {
  readonly emailInput = this.page.locator('input[type="email"]');
  readonly passwordInput = this.page.locator('input[type="password"]');
  readonly submitButton = this.page.locator('button[type="submit"]');
  readonly errorMessage = this.page
    .locator("text=/invalid|error|failed|incorrect|wrong/i")
    .first();

  constructor(page: Page) {
    super(page);
  }

  async open() {
    await this.goto("/login");
    await expect(this.emailInput).toBeVisible();
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }
}
