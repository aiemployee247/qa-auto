import { MobileBasePage } from '@shared/mobile/MobileBasePage';

/** Placeholder page object — wire selectors when AStream app ships. */
export class AStreamSignUpPage extends MobileBasePage {
  get screen() {
    return this.byId('signup-screen');
  }
  get nameInput() {
    return this.byId('signup-name');
  }
  get emailInput() {
    return this.byId('signup-email');
  }
  get passwordInput() {
    return this.byId('signup-password');
  }
  get confirmPasswordInput() {
    return this.byId('signup-confirm-password');
  }
  get submitButton() {
    return this.byId('signup-submit');
  }
  get errorMessage() {
    return this.byId('signup-error');
  }

  async waitForReady() {
    await this.waitForDisplayed(this.screen);
  }

  async signUp(
    name: string,
    email: string,
    password: string,
    confirmPassword = password,
  ) {
    await this.setValue(this.nameInput, name);
    await this.setValue(this.emailInput, email);
    await this.setValue(this.passwordInput, password);
    await this.setValue(this.confirmPasswordInput, confirmPassword);
    await this.tap(this.submitButton);
  }
}
