import { Page } from "@playwright/test";

export class CollectingKittensPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async getPoints() {
    const points = await this.page
      .locator(".game_header_counter.points strong")
      .textContent();
    return points;
  }

  async clickOnAllKittens() {
    const kittens = this.page.locator(".kitten");
    let timeLeft = await this.page
      .locator(".game_header_counter.time strong")
      .textContent();

    while (timeLeft !== "30") {
      timeLeft = await this.page
        .locator(".game_header_counter.time strong")
        .textContent();

      for (const kitten of await kittens.all()) {
        await kitten.click();
      }
    }
  }
}
