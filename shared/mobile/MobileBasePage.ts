import type { ChainablePromiseElement } from 'webdriverio';

/**
 * Shared helpers for Appium mobile page objects.
 *
 * React Native maps `testID` → Android `resource-id` and iOS accessibility id.
 */
export abstract class MobileBasePage {
  constructor(protected readonly driver: WebdriverIO.Browser) {}

  protected get isAndroid(): boolean {
    const platform = String(
      this.driver.capabilities.platformName || '',
    ).toLowerCase();
    return platform === 'android';
  }

  protected byId(id: string): ChainablePromiseElement {
    if (this.isAndroid) {
      return this.driver.$(`android=new UiSelector().resourceId("${id}")`);
    }
    return this.driver.$(`~${id}`);
  }

  /**
   * On Android, RN ScrollView drops off-screen nodes from the a11y tree.
   * UiScrollable.scrollIntoView brings them back and returns the element.
   */
  protected async elementById(id: string): Promise<WebdriverIO.Element> {
    if (this.isAndroid) {
      try {
        const direct = this.byId(id);
        if (await direct.isExisting()) {
          return direct as unknown as WebdriverIO.Element;
        }
      } catch {
        // fall through to scroll
      }
      return (await this.driver.$(
        `android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().resourceId("${id}"))`,
      )) as unknown as WebdriverIO.Element;
    }
    const el = this.byId(id);
    await el.waitForExist({ timeout: 30_000 });
    return el as unknown as WebdriverIO.Element;
  }

  protected async waitForDisplayed(
    el: ChainablePromiseElement,
    timeout = 30_000,
  ): Promise<void> {
    await el.waitForDisplayed({ timeout });
  }

  protected async waitForId(id: string, timeout = 30_000): Promise<void> {
    const el = await this.elementById(id);
    await el.waitForDisplayed({ timeout });
  }

  protected async hideKeyboardSafe(): Promise<void> {
    try {
      if (this.isAndroid) {
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
                y: Math.floor(height * 0.12),
              },
              { type: 'pointerDown', button: 0 },
              { type: 'pointerUp', button: 0 },
            ],
          },
        ]);
        await this.driver.releaseActions();
      } else {
        await this.driver.execute('mobile: hideKeyboard', {});
      }
    } catch {
      // Keyboard may already be dismissed.
    }
  }

  protected async setValueById(id: string, value: string): Promise<void> {
    if (this.isAndroid) {
      // Always scrollIntoView so the node stays in the a11y tree through type.
      const focus = await this.driver.$(
        `android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().resourceId("${id}"))`,
      );
      await focus.click();
      const input = await this.driver.$(
        `android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().resourceId("${id}"))`,
      );
      try {
        await input.clearValue();
      } catch {
        // ignore
      }
      await input.addValue(value);
      return;
    }

    const el = await this.elementById(id);
    await el.waitForDisplayed({ timeout: 30_000 });
    await el.click();
    await el.clearValue();
    await el.setValue(value);
  }

  protected async tapById(id: string): Promise<void> {
    await this.hideKeyboardSafe();
    if (this.isAndroid) {
      const el = await this.driver.$(
        `android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().resourceId("${id}"))`,
      );
      await el.click();
      return;
    }
    const el = await this.elementById(id);
    await el.waitForDisplayed({ timeout: 30_000 });
    await el.click();
  }

  // Back-compat wrappers used by existing page objects.
  protected async setValue(
    el: ChainablePromiseElement,
    value: string,
  ): Promise<void> {
    await this.waitForDisplayed(el);
    await el.click();
    if (this.isAndroid) {
      try {
        await el.clearValue();
      } catch {
        // ignore
      }
      await el.addValue(value);
    } else {
      await el.clearValue();
      await el.setValue(value);
    }
  }

  protected async tap(el: ChainablePromiseElement): Promise<void> {
    await this.hideKeyboardSafe();
    await this.waitForDisplayed(el);
    await el.click();
  }
}
