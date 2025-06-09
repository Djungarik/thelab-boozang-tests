import { Page } from "@playwright/test";

export class CatShelterPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async addCatWithNameDescriptionRadioValue(
    catName: string,
    catDescription: string,
    radioValue: string
  ) {
    await this.page.getByRole("textbox", { name: "Name:" }).fill(catName);
    await this.page
      .getByRole("textbox", { name: "Description:" })
      .fill(catDescription);
    await this.page.getByRole("radio", { name: radioValue }).click();
    await this.page.getByRole("button", { name: "Add Cat" }).click();
  }

  async editCatWithNameDescriptionRadioValue(
    updatedCatName: string,
    updatedCatDescription: string
  ) {
    await this.page.getByPlaceholder("Enter name...").clear();
    await this.page.getByPlaceholder("Enter name...").fill(updatedCatName);

    await this.page.getByPlaceholder("Enter description...").clear();
    await this.page
      .getByPlaceholder("Enter description...")
      .fill(updatedCatDescription);

    const radios = [
      this.page.getByRole("radio", { name: "Wants to go outside" }),
      this.page.getByRole("radio", { name: "Stay inside" }),
    ];

    for (const radio of radios) {
      if (!(await radio.isChecked())) {
        await radio.click();
        break;
      }
    }
  }

  async clickAddCatButtonOnTheShelterPage() {
    await this.page.locator('[class="link_btn add"]').click();
  }

  async clickAddCatButtonOnTheAddCatPage() {
    await this.page.getByRole("button", { name: "Add Cat" }).click();
  }

  async clickSaveButton() {
    await this.page.getByRole("button", { name: "Save" }).click();
  }

  async clickDeleteButton() {
    await this.page.getByRole("button", { name: "Delete" }).click();
  }
}
