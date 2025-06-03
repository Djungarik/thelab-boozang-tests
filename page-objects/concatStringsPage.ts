import { Page } from "@playwright/test";

export class ConcatStringsPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async fillFormWithTwoStrings(expectedString: string) {
    await this.page.locator(".list_form input").fill(expectedString);
  }

  async clickSubmitStringButton() {
    await this.page.getByRole("button", { name: "Submit string" }).click();
  }
}
