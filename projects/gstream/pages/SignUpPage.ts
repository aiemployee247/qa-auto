import { MobileBasePage } from '@shared/mobile/MobileBasePage';

export class GStreamSignUpPage extends MobileBasePage {
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
  get goToLogin() {
    return this.byId('signup-goto-login');
  }

  async waitForReady() {
    await this.waitForId('signup-screen');
    await this.waitForId('signup-name');
  }

  async signUp(
    name: string,
    email: string,
    password: string,
    confirmPassword = password,
  ) {
    await this.setValueById('signup-name', name);
    await this.setValueById('signup-email', email);
    await this.setValueById('signup-password', password);
    await this.setValueById('signup-confirm-password', confirmPassword);
    await this.tapById('signup-submit');
  }
}
