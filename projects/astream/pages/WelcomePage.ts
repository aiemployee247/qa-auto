import { MobileBasePage } from '@shared/mobile/MobileBasePage';

/** First screen after install / logout (MLB-style Welcome). */
export class AStreamWelcomePage extends MobileBasePage {
  get screen() {
    return this.byId('welcome-screen');
  }
  get brand() {
    return this.byId('welcome-brand');
  }
  get skipButton() {
    return this.byId('welcome-skip');
  }
  get getStartedButton() {
    return this.byId('welcome-get-started');
  }

  async waitForReady(timeout = 20_000) {
    await this.waitForId('welcome-screen', timeout);
    await this.waitForId('welcome-get-started', timeout);
  }

  async isShowing(): Promise<boolean> {
    return this.byId('welcome-screen').isExisting().catch(() => false);
  }

  async getStarted() {
    await this.tapById('welcome-get-started');
  }

  async skip() {
    await this.tapById('welcome-skip');
  }
}
