import { MobileBasePage } from '@shared/mobile/MobileBasePage';

export class AStreamHomePage extends MobileBasePage {
  get screen() {
    return this.byId('home-screen');
  }
  get userEmail() {
    return this.byId('home-user-email');
  }
  get logoutButton() {
    return this.byId('home-logout');
  }

  async waitForReady() {
    await this.waitForDisplayed(this.screen);
  }

  async logout() {
    await this.tap(this.logoutButton);
  }
}
