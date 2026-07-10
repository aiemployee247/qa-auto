import { MobileBasePage } from '@shared/mobile/MobileBasePage';

export class AStreamLoginPage extends MobileBasePage {
  get screen() {
    return this.byId('login-screen');
  }
  get brand() {
    return this.byId('login-brand');
  }
  get emailInput() {
    return this.byId('login-email');
  }
  get passwordInput() {
    return this.byId('login-password');
  }
  get passwordToggle() {
    return this.byId('login-password-toggle');
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

  /** Welcome is the first screen after install / logout. */
  async dismissWelcomeIfPresent(timeoutMs = 20_000) {
    const deadline = Date.now() + timeoutMs;
    while (Date.now() < deadline) {
      if (await this.byId('login-email').isExisting().catch(() => false)) {
        return;
      }
      const getStarted = this.byId('welcome-get-started');
      if (await getStarted.isExisting().catch(() => false)) {
        await getStarted.click();
        await this.driver.pause(600);
        continue;
      }
      const skip = this.byId('welcome-skip');
      if (await skip.isExisting().catch(() => false)) {
        await skip.click();
        await this.driver.pause(600);
        continue;
      }
      await this.driver.pause(400);
    }
  }

  async waitForReady() {
    await this.dismissWelcomeIfPresent();
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
    const submit = await this.elementById('login-submit');
    await submit.click();
  }

  async openSignUp() {
    await this.hideKeyboardSafe();
    await this.tapById('login-goto-signup');
    const signup = this.byId('signup-screen');
    if (!(await signup.isExisting().catch(() => false))) {
      await this.driver.pause(500);
      await this.tapById('login-goto-signup');
    }
    await this.waitForId('signup-screen');
  }
}
