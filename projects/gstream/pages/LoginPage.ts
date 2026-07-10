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
    try {
      const toggle = await this.elementById('login-password-toggle');
      await toggle.click();
    } catch {
      // optional
    }
    await this.setValueById('login-password', password);
    // Tap submit directly — hideKeyboard can drop it from the iOS a11y tree.
    const submit = await this.elementById('login-submit');
    await submit.click();
  }

  async openSignUp() {
    await this.hideKeyboardSafe();
    await this.tapById('login-goto-signup');
    // Navigation can lag after keyboard dismissal; retry once.
    const signup = this.byId('signup-screen');
    if (!(await signup.isExisting().catch(() => false))) {
      await this.driver.pause(500);
      await this.tapById('login-goto-signup');
    }
    await this.waitForId('signup-screen');
  }
}
