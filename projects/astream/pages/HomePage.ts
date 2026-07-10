import { MobileBasePage } from '@shared/mobile/MobileBasePage';

/** Post-auth Dashboard tab + Profile tab navigation. */
export class AStreamHomePage extends MobileBasePage {
  // Dashboard (default tab)
  get screen() {
    return this.byId('home-screen');
  }
  get brand() {
    return this.byId('home-brand');
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
  get userCard() {
    return this.byId('home-user-card');
  }
  get logoutButton() {
    return this.byId('home-logout');
  }
  get stats() {
    return this.byId('dashboard-stats');
  }
  get liveCard() {
    return this.byId('dashboard-card-live');
  }

  // Tabs
  get dashboardTab() {
    return this.byId('tab-dashboard');
  }
  get profileTab() {
    return this.byId('tab-profile');
  }

  // Profile tab
  get profileScreen() {
    return this.byId('profile-screen');
  }
  get profileHeading() {
    return this.byId('profile-heading');
  }
  get profileDisplayName() {
    return this.byId('profile-display-name');
  }
  get profileEmail() {
    return this.byId('profile-email');
  }
  get profileNameInput() {
    return this.byId('profile-name');
  }
  get profileSave() {
    return this.byId('profile-save');
  }
  get profileLogout() {
    return this.byId('profile-logout');
  }

  async waitForReady() {
    // Prefer child nodes — home-screen container can be visible=false on iOS.
    await this.waitForId('home-heading');
    await this.waitForId('home-user-email');
    await this.waitForId('home-user-name');
  }

  async openDashboard() {
    try {
      const tab = await this.elementById('tab-dashboard');
      await tab.click();
    } catch {
      // already on dashboard
    }
    await this.waitForId('home-heading');
  }

  async openProfile() {
    const tab = await this.elementById('tab-profile');
    await tab.click();
    await this.waitForId('profile-screen');
    await this.waitForId('profile-heading');
  }

  async logout() {
    await this.openDashboard();
    await this.tapById('home-logout');
  }

  async logoutFromProfile() {
    await this.openProfile();
    await this.tapById('profile-logout');
  }
}
