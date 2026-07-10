import { expect, type Page } from "@playwright/test";
import { BasePage } from "@shared/pages/BasePage";

export class SignupPage extends BasePage {
  readonly nameInput = this.page.locator('input[name="name"]');
  readonly emailInput = this.page.locator('input[type="email"]');
  readonly passwordInput = this.page.locator('input[type="password"]');
  readonly submitButton = this.page.getByRole("button", { name: /create account/i });
  readonly signInLink = this.page.getByRole("link", { name: /sign in/i });
  readonly viktorButton = this.page.getByRole("button", { name: /sign in with viktor/i });
  readonly passwordHint = this.page.getByText(/must be at least 6 characters/i);

  constructor(page: Page) {
    super(page);
  }

  async open() {
    await this.goto("/signup");
    await expect(this.emailInput).toBeVisible();
  }

  async fillForm(name: string, email: string, password: string) {
    await this.nameInput.fill(name);
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
  }
}
