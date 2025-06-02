import { Page } from "@playwright/test";

export class YellowOrBluePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async generateColor() {
    await this.page.getByRole("button", { name: "Generate Color" }).click();
  }

  async clickYellow() {
    await this.page.getByRole("button", { name: "yellow" }).click();
  }

  async clickBlue() {
    await this.page.getByRole("button", { name: "blue" }).click();
  }
}
