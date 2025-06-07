import { Locator, Page } from "@playwright/test";

export class SortedListPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async deleteAllItemsFromTheList(list: Locator) {
    while ((await list.locator(".collection_item").count()) > 0) {
      const item = list.locator(".collection_item").first();
      await item.locator('button[title="delete"]').click();
      await this.page.waitForTimeout(1000);
    }
  }

  async addItemToTheList(item: string) {
    await this.page.locator(".list_form input").fill(item);
    await this.page.getByRole("button", { name: "Add todo" }).click();
  }
}
