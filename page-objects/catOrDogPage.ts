import { Page } from "@playwright/test";

export class CatOrDogPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async generateImage() {
    await this.page.getByRole("button", { name: "Generate Image" }).click();
  }

  async clickCat() {
    await this.page.getByRole("button", { name: "cat" }).click();
  }

  async clickDog() {
    await this.page.getByRole("button", { name: "dog" }).click();
  }
}
