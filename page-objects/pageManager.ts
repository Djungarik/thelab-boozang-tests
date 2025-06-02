import { Page } from "@playwright/test";
import { NavigationPage } from "./navigationPage";

export class PageManager {
  readonly page: Page;
  readonly navigationPage: NavigationPage;

  constructor(page: Page) {
    this.page = page;
    this.navigationPage = new NavigationPage(this.page);
  }

  navigateTo() {
    return this.navigationPage;
  }
}
