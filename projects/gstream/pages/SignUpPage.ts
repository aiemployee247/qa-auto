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
    try {
      const toggle = await this.elementById('signup-password-toggle');
      await toggle.click();
    } catch {
      // optional
    }
    await this.setValueById('signup-password', password);
    await this.setValueById('signup-confirm-password', confirmPassword);
    // On iOS, dismiss/scroll can drop signup-submit from the a11y tree.
    // Tap it directly (works even when visible=false under the keyboard).
    const submit = await this.elementById('signup-submit');
    await submit.click();
  }
}
