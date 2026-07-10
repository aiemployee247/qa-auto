import { MobileBasePage } from '@shared/mobile/MobileBasePage';

export class GStreamHomePage extends MobileBasePage {
  get screen() {
    return this.byId('home-screen');
  }
  get heading() {
    return this.byId('home-heading');
  }
  get userName() {
    return this.byId('home-user-name');
  }
  get userEmail() {
    return this.byId('home-user-email');
  }
  get logoutButton() {
    return this.byId('home-logout');
  }

  async waitForReady() {
    await this.waitForId('home-screen');
    await this.waitForId('home-heading');
  }

  async logout() {
    await this.tapById('home-logout');
  }
}
