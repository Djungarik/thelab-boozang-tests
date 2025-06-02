import { Page } from "@playwright/test";

export class NavigationPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async speedGamePage() {
    await this.page.getByRole("button", { name: "Menu" }).click();
    await this.page.getByRole("link", { name: "Speed Game" }).click();
  }

  async waitGamePage() {
    await this.page.getByRole("button", { name: "Menu" }).click();
    await this.page.getByRole("link", { name: "Wait Game" }).click();
  }

  async yellowOrBluePage() {
    await this.page.getByRole("button", { name: "Menu" }).click();
    await this.page.getByRole("link", { name: "Yellow or Blue" }).click();
  }

  async catOrDogPage() {
    await this.page.getByRole("button", { name: "Menu" }).click();
    await this.page.getByRole("link", { name: "Cat or dog" }).click();
  }

  async sortedListPage() {
    await this.page.getByRole("button", { name: "Menu" }).click();
    await this.page.getByRole("link", { name: "Sorted list" }).click();
  }

  async formFillPage() {
    await this.page.getByRole("button", { name: "Menu" }).click();
    await this.page.getByRole("link", { name: "Form Fill" }).click();
  }

  async catShelterPage() {
    await this.page.getByRole("button", { name: "Menu" }).click();
    await this.page.getByRole("link", { name: "Cat Shelter" }).click();
  }

  async tablesPage() {
    await this.page.getByRole("button", { name: "Menu" }).click();
    await this.page.getByRole("link", { name: "Tables" }).click();
  }

  async concatStringsPage() {
    await this.page.getByRole("button", { name: "Menu" }).click();
    await this.page.getByRole("link", { name: "Concat strings" }).click();
  }

  async collectingKittensPage() {
    await this.page.getByRole("button", { name: "Menu" }).click();
    await this.page.getByRole("link", { name: "Collecting kittens" }).click();
  }

  async canvasGamePage() {
    await this.page.getByRole("button", { name: "Menu" }).click();
    await this.page.getByRole("link", { name: "Canvas Game" }).click();
  }
}
