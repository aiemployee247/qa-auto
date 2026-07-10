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
    await this.waitForId('login-screen');
    await this.waitForId('login-email');
  }

  async login(email: string, password: string) {
    await this.setValueById('login-email', email);
    await this.setValueById('login-password', password);
    await this.tapById('login-submit');
  }

  async openSignUp() {
    await this.tapById('login-goto-signup');
  }
}
