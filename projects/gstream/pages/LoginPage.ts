import { MobileBasePage } from '@shared/mobile/MobileBasePage';

export class GStreamLoginPage extends MobileBasePage {
  get screen() {
    return this.byId('login-screen');
  }
  get emailInput() {
    return this.byId('login-email');
  }
  get passwordInput() {
    return this.byId('login-password');
  }
  get submitButton() {
    return this.byId('login-submit');
  }
  get errorMessage() {
    return this.byId('login-error');
  }
  get goToSignUp() {
    return this.byId('login-goto-signup');
  }

  async waitForReady() {
    await this.waitForDisplayed(this.screen);
    await this.waitForDisplayed(this.emailInput);
  }

  async login(email: string, password: string) {
    await this.setValue(this.emailInput, email);
    await this.setValue(this.passwordInput, password);
    await this.tap(this.submitButton);
  }

  async openSignUp() {
    await this.tap(this.goToSignUp);
  }
}
