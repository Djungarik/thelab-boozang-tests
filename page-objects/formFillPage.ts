import { Page } from "@playwright/test";

export class FormFillPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async fillFormWithFirstNameLastNameEmailPassword(
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) {
    await this.page
      .getByRole("textbox", { name: "First name:" })
      .fill(firstName);
    await this.page.getByRole("textbox", { name: "Last name:" }).fill(lastName);
    await this.page.getByRole("textbox", { name: "Email: " }).fill(email);
    await this.page.getByRole("textbox", { name: "Password: " }).fill(password);
  }

  async clickSaveToDBButtonAndWaitForResponse() {
    await Promise.all([
      this.page.waitForResponse(
        (res) =>
          res.url().includes("/users/") &&
          res.request().method() === "POST" &&
          res.status() === 201
      ),
      this.page.getByRole("button", { name: "Save to db" }).click(),
    ]);
  }

  async clickShowUsersInDBButtonAndWaitForResponse() {
    await Promise.all([
      this.page.waitForResponse(
        (res) =>
          res.url().includes("/users/") &&
          res.request().method() === "GET" &&
          res.status() === 200
      ),
      this.page.getByRole("button", { name: "Show users in db" }).click(),
    ]);
  }

  async clickHideUsersInDBButton() {
    await this.page.getByRole("button", { name: "Hide  users in db" }).click();
  }
}
