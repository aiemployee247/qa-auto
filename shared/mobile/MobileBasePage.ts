import type { ChainablePromiseElement } from 'webdriverio';

/**
 * Shared helpers for Appium mobile page objects.
 */
export abstract class MobileBasePage {
  constructor(protected readonly driver: WebdriverIO.Browser) {}

  protected byId(id: string): ChainablePromiseElement {
    // React Native testID → accessibility id on both platforms
    return this.driver.$(`~${id}`);
  }

  protected async waitForDisplayed(
    el: ChainablePromiseElement,
    timeout = 15_000,
  ): Promise<void> {
    await el.waitForDisplayed({ timeout });
  }

  protected async setValue(
    el: ChainablePromiseElement,
    value: string,
  ): Promise<void> {
    await this.waitForDisplayed(el);
    await el.click();
    await el.clearValue();
    await el.setValue(value);
  }

  protected async tap(el: ChainablePromiseElement): Promise<void> {
    await this.waitForDisplayed(el);
    await el.click();
  }
}
