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

export class GStreamSignUpPage extends MobileBasePage {
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

  /** @deprecated use firstNameInput — kept for older callers */
  get nameInput() {
    return this.firstNameInput;
  }

  async waitForReady() {
    await this.waitForId('signup-screen');
    await this.waitForId('signup-name');
    await this.waitForId('signup-last-name');
    await this.waitForId('signup-email');
  }

  private async scrollFormDown() {
    if (this.isAndroid) {
      try {
        await this.driver.execute('mobile: scrollGesture', {
          left: 80,
          top: 500,
          width: 900,
          height: 1200,
          direction: 'down',
          percent: 0.8,
        });
      } catch {
        const { width, height } = await this.driver.getWindowSize();
        await this.driver.performActions([
          {
            type: 'pointer',
            id: 'finger1',
            parameters: { pointerType: 'touch' },
            actions: [
              {
                type: 'pointerMove',
                duration: 0,
                x: Math.floor(width / 2),
                y: Math.floor(height * 0.7),
              },
              { type: 'pointerDown', button: 0 },
              {
                type: 'pointerMove',
                duration: 400,
                x: Math.floor(width / 2),
                y: Math.floor(height * 0.25),
              },
              { type: 'pointerUp', button: 0 },
            ],
          },
        ]);
        await this.driver.releaseActions();
      }
      await this.driver.pause(400);
      return;
    }
    const { width, height } = await this.driver.getWindowSize();
    await this.driver.performActions([
      {
        type: 'pointer',
        id: 'finger1',
        parameters: { pointerType: 'touch' },
        actions: [
          {
            type: 'pointerMove',
            duration: 0,
            x: Math.floor(width / 2),
            y: Math.floor(height * 0.75),
          },
          { type: 'pointerDown', button: 0 },
          {
            type: 'pointerMove',
            duration: 400,
            x: Math.floor(width / 2),
            y: Math.floor(height * 0.25),
          },
          { type: 'pointerUp', button: 0 },
        ],
      },
    ]);
    await this.driver.releaseActions();
    await this.driver.pause(400);
  }

  async signUp(form: SignUpForm) {
    const confirm = form.confirmPassword ?? form.password;

    await this.setValueById('signup-name', form.firstName);
    await this.setValueById('signup-last-name', form.lastName);
    await this.setValueById('signup-email', form.email);

    // Reveal passwords — secure Android fields are unreliable when masked.
    try {
      const show = this.driver.$('android=new UiSelector().text("Show")');
      if (await show.isExisting()) {
        await show.click();
        await this.driver.pause(300);
      }
    } catch {
      try {
        const toggle = await this.elementById('signup-password-toggle');
        await toggle.click();
      } catch {
        // optional
      }
    }

    await this.setValueById('signup-password', form.password);
    await this.setValueById('signup-confirm-password', confirm);

    // Assert visible values match before continuing (avoids false mismatch).
    if (this.isAndroid) {
      const pwdText = (await this.byId('signup-password').getText().catch(() => '')).trim();
      const confText = (
        await this.byId('signup-confirm-password').getText().catch(() => '')
      ).trim();
      if (pwdText !== form.password || confText !== form.password) {
        await this.setValueById('signup-password', form.password);
        await this.setValueById('signup-confirm-password', form.password);
      }
    }

    await this.hideKeyboardSafe();
    await this.scrollFormDown();

    // Birth fields start empty — type only, do not DEL-wipe (avoids clearing name).
    if (form.birthMonth) {
      await this.typeIntoEmpty('signup-birth-mm', form.birthMonth);
    }
    if (form.birthDay) {
      await this.typeIntoEmpty('signup-birth-dd', form.birthDay);
    }
    if (form.birthYear) {
      await this.typeIntoEmpty('signup-birth-yyyy', form.birthYear);
    }

    await this.hideKeyboardSafe();
    await this.scrollFormDown();

    if (form.optInBrand) {
      const el = await this.elementById('signup-optin-brand');
      await el.click();
    }
    if (form.optInPartners) {
      const el = await this.elementById('signup-optin-partners');
      await el.click();
    }

    const submit = await this.elementById('signup-submit');
    await submit.click();
  }

  /** Type into an empty field without backspacing other focused inputs. */
  private async typeIntoEmpty(id: string, value: string) {
    const el = await this.elementById(id);
    await el.click();
    await this.driver.pause(250);
    await el.addValue(value);
  }
}
