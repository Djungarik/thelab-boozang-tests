import { Page } from "@playwright/test";
import { NavigationPage } from "./navigationPage";
import { SpeedGamePage } from "./speedGamePage";
import { WaitGamePage } from "./waitGamePage";
import { YellowOrBluePage } from "./yellowOrBluePage";
import { CatOrDogPage } from "./catOrDogPage";
import { SortedListPage } from "./sortedListPage";

export class PageManager {
  readonly page: Page;
  readonly navigationPage: NavigationPage;
  readonly speedGamePage: SpeedGamePage;
  readonly waitGamePage: WaitGamePage;
  readonly yellowOrBluePage: YellowOrBluePage;
  readonly catOrDogPage: CatOrDogPage;
  readonly sortedListPage: SortedListPage;

  constructor(page: Page) {
    this.page = page;
    this.navigationPage = new NavigationPage(this.page);
    this.speedGamePage = new SpeedGamePage(this.page);
    this.waitGamePage = new WaitGamePage(this.page);
    this.yellowOrBluePage = new YellowOrBluePage(this.page);
    this.catOrDogPage = new CatOrDogPage(this.page);
    this.sortedListPage = new SortedListPage(this.page);
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

  onYellowOrBluePage() {
    return this.yellowOrBluePage;
  }

  onCatOrDogPage() {
    return this.catOrDogPage;
  }

  onSortedListPage() {
    return this.sortedListPage;
  }
}
