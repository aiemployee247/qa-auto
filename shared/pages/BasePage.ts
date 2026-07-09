import type { Page } from "@playwright/test";

/**
 * Base page object all POMs extend.
 * Keep selectors resilient: prefer getByRole / getByTestId / getByLabel
 * over CSS classes, which churn with UI redesigns.
 */
export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  async goto(path: string) {
    await this.page.goto(path, { waitUntil: "domcontentloaded" });
  }

  url(): string {
    return this.page.url();
  }
}
