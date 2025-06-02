import { Page } from "@playwright/test";

export class WaitGamePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async startGame() {
    await this.page.getByRole("button", { name: "Start Game" }).click();
  }

  async endGame() {
    await this.page.getByRole("button", { name: "End Game" }).click();
  }
}
