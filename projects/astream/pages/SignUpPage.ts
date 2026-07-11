import { MobileBasePage } from '@shared/mobile/MobileBasePage';

export type SignUpForm = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword?: string;
  birthMonth?: string;
  birthDay?: string;
  birthYear?: string;
  optInBrand?: boolean;
  optInPartners?: boolean;
};

export class AStreamSignUpPage extends MobileBasePage {
  get screen() {
    return this.byId('signup-screen');
  }
  get firstNameInput() {
    return this.byId('signup-name');
  }
  get lastNameInput() {
    return this.byId('signup-last-name');
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
  get birthMonthInput() {
    return this.byId('signup-birth-mm');
  }
  get birthDayInput() {
    return this.byId('signup-birth-dd');
  }
  get birthYearInput() {
    return this.byId('signup-birth-yyyy');
  }
  get optInBrand() {
    return this.byId('signup-optin-brand');
  }
  get optInPartners() {
    return this.byId('signup-optin-partners');
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

  get nameInput() {
    return this.firstNameInput;
  }

  async waitForReady() {
    await this.waitForId('signup-screen');
    await this.waitForId('signup-name');
    await this.waitForId('signup-last-name');
    await this.waitForId('signup-email');
  }

  async signUp(form: SignUpForm) {
    const confirm = form.confirmPassword ?? form.password;

    await this.setValueById('signup-name', form.firstName);
    await this.setValueById('signup-last-name', form.lastName);
    await this.setValueById('signup-email', form.email);

    try {
      const toggle = await this.elementById('signup-password-toggle');
      await toggle.click();
    } catch {
      // optional
    }

    await this.setValueById('signup-password', form.password);
    await this.setValueById('signup-confirm-password', confirm);
    await this.hideKeyboardSafe();

    // Skip birthdate: not required for auth; Sauce sims flake on those fields.
    await this.revealBySwipe('signup-submit');

    try {
      if (form.optInBrand && (await this.byId('signup-optin-brand').isExisting().catch(() => false))) {
        await this.byId('signup-optin-brand').click();
      }
      if (
        form.optInPartners &&
        (await this.byId('signup-optin-partners').isExisting().catch(() => false))
      ) {
        await this.byId('signup-optin-partners').click();
      }
    } catch {
      // optional
    }

    await this.revealBySwipe('signup-submit');
    await this.tapById('signup-submit');
  }
}
