import { Page } from "@playwright/test";
import { NavigationPage } from "./navigationPage";
import { SpeedGamePage } from "./speedGamePage";
import { WaitGamePage } from "./waitGamePage";

export class PageManager {
  readonly page: Page;
  readonly navigationPage: NavigationPage;
  readonly speedGamePage: SpeedGamePage;
  readonly waitGamePage: WaitGamePage;

  constructor(page: Page) {
    this.page = page;
    this.navigationPage = new NavigationPage(this.page);
    this.speedGamePage = new SpeedGamePage(this.page);
    this.waitGamePage = new WaitGamePage(this.page);
  }

  navigateTo() {
    return this.navigationPage;
  }

  onSpeedGamePage() {
    return this.speedGamePage;
  }

  onWaitGamePage() {
    return this.waitGamePage;
  }
}
