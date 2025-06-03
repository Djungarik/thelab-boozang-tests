import { Page } from "@playwright/test";

export class TablesPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async uncheckAllFilters() {
    const filters = this.page.locator(".option");

    for (const filter of await filters.all()) {
      if (
        (await filter.locator("span").getAttribute("aria-checked")) === "true"
      ) {
        await filter.click();
      }
    }
  }

  async checkAllFilters() {
    const filters = this.page.locator(".option");

    for (const filter of await filters.all()) {
      if (
        (await filter.locator("span").getAttribute("aria-checked")) !== "true"
      ) {
        await filter.click();
      }
    }
  }
}
