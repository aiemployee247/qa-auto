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
   * On iOS, off-screen ScrollView children are also often missing — swipe/scroll first.
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

    const direct = this.byId(id);
    if (await direct.isExisting().catch(() => false)) {
      return direct as unknown as WebdriverIO.Element;
    }

    for (let i = 0; i < 5; i++) {
      try {
        await this.driver.execute('mobile: scroll', {
          direction: 'down',
          predicateString: `name == "${id}" OR label == "${id}"`,
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
                duration: 350,
                x: Math.floor(width / 2),
                y: Math.floor(height * 0.35),
              },
              { type: 'pointerUp', button: 0 },
            ],
          },
        ]);
        await this.driver.releaseActions();
      }
      await this.driver.pause(250);
      if (await this.byId(id).isExisting().catch(() => false)) {
        return this.byId(id) as unknown as WebdriverIO.Element;
      }
    }

    const el = this.byId(id);
    await el.waitForExist({ timeout: 15_000 });
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
    await el.waitForExist({ timeout });
    // iOS RN container testIDs (e.g. login-screen) often report visible=false
    // even when on-screen; only enforce displayed on Android.
    if (this.isAndroid) {
      await el.waitForDisplayed({ timeout });
    }
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
        // Prefer the keyboard accessory "Done" button when present.
        const done = this.driver.$('~Done');
        if (await done.isExisting().catch(() => false)) {
          await done.click();
          return;
        }
        try {
          await this.driver.execute('mobile: hideKeyboard', {});
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
                  y: Math.floor(height * 0.12),
                },
                { type: 'pointerDown', button: 0 },
                { type: 'pointerUp', button: 0 },
              ],
            },
          ]);
          await this.driver.releaseActions();
        }
      }
    } catch {
      // Keyboard may already be dismissed.
    }
  }

  protected async setValueById(id: string, value: string): Promise<void> {
    if (this.isAndroid) {
      let input = this.byId(id);
      if (!(await input.isExisting().catch(() => false))) {
        try {
          await this.driver.execute('mobile: scrollGesture', {
            left: 80,
            top: 400,
            width: 900,
            height: 1300,
            direction: 'down',
            percent: 0.7,
          });
        } catch {
          // ignore
        }
        input = this.byId(id);
        if (!(await input.isExisting().catch(() => false))) {
          input = await this.driver.$(
            `android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().resourceId("${id}"))`,
          );
        }
      }

      await input.click();
      await this.driver.pause(400);

      // Only wipe THIS focused field: MOVE_END + DEL, then type once.
      // (Global DEL without a focus pause was clearing the previous field —
      // e.g. wiping Password while filling Confirm, causing mismatch errors.)
      try {
        await this.driver.pressKeyCode(123); // MOVE_END
        for (let i = 0; i < Math.max(value.length + 5, 20); i++) {
          await this.driver.pressKeyCode(67); // DEL
        }
      } catch {
        try {
          await input.clearValue();
        } catch {
          // ignore
        }
      }
      await this.driver.pause(100);
      await input.addValue(value);
      return;
    }

    // iOS: element setValue/clearValue often skips React Native onChangeText.
    // W3C key actions (char-by-char) update controlled inputs reliably.
    const el = await this.elementById(id);
    await el.waitForExist({ timeout: 30_000 });
    await el.click();
    try {
      await el.clearValue();
    } catch {
      // ignore
    }
    const keyActions = value.split('').flatMap((ch) => [
      { type: 'keyDown' as const, value: ch },
      { type: 'keyUp' as const, value: ch },
    ]);
    await this.driver.performActions([
      { type: 'key', id: 'keyboard', actions: keyActions },
    ]);
    await this.driver.releaseActions();
  }

  protected async tapById(id: string): Promise<void> {
    await this.hideKeyboardSafe();
    if (this.isAndroid) {
      let el = this.byId(id);
      if (!(await el.isExisting().catch(() => false))) {
        el = await this.driver.$(
          `android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().resourceId("${id}"))`,
        );
      }
      await el.click();
      return;
    }
    const el = await this.elementById(id);
    await el.waitForExist({ timeout: 30_000 });
    // If keyboard covers the control, tap "Done" / dismiss first then retry.
    try {
      await el.click();
    } catch {
      await this.hideKeyboardSafe();
      const again = await this.elementById(id);
      await again.click();
    }
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
