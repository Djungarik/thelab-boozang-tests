import { Page } from "@playwright/test";
import { NavigationPage } from "./navigationPage";
import { SpeedGamePage } from "./speedGamePage";

export class PageManager {
  readonly page: Page;
  readonly navigationPage: NavigationPage;
  readonly speedGamePage: SpeedGamePage;

  constructor(page: Page) {
    this.page = page;
    this.navigationPage = new NavigationPage(this.page);
    this.speedGamePage = new SpeedGamePage(this.page);
  }

  navigateTo() {
    return this.navigationPage;
  }

  onSpeedGamePage() {
    return this.speedGamePage;
  }
}
