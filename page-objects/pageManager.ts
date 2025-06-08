import { Page } from "@playwright/test";
import { Eyes } from "@applitools/eyes-playwright";
import { NavigationPage } from "./navigationPage";
import { SpeedGamePage } from "./speedGamePage";
import { WaitGamePage } from "./waitGamePage";
import { YellowOrBluePage } from "./yellowOrBluePage";
import { CatOrDogPage } from "./catOrDogPage";
import { SortedListPage } from "./sortedListPage";
import { FormFillPage } from "./formFillPage";
import { CatShelterPage } from "./catShelterPage";
import { TablesPage } from "./tablesPage";
import { ConcatStringsPage } from "./concatStringsPage";
import { CollectingKittensPage } from "./collectingKittensPage";
import { CanvasGamePage } from "./canvasGamePage";

export class PageManager {
  readonly page: Page;
  private eyes?: Eyes;
  readonly navigationPage: NavigationPage;
  readonly speedGamePage: SpeedGamePage;
  readonly waitGamePage: WaitGamePage;
  readonly yellowOrBluePage: YellowOrBluePage;
  readonly catOrDogPage: CatOrDogPage;
  readonly sortedListPage: SortedListPage;
  readonly formFillPage: FormFillPage;
  readonly catShelterPage: CatShelterPage;
  readonly tablesPage: TablesPage;
  readonly concatStringsPage: ConcatStringsPage;
  readonly collectingKittensPage: CollectingKittensPage;
  private _canvasGamePage?: CanvasGamePage;

  constructor(page: Page, eyes?: any) {
    this.page = page;
    this.eyes = eyes;
    this.navigationPage = new NavigationPage(this.page);
    this.speedGamePage = new SpeedGamePage(this.page);
    this.waitGamePage = new WaitGamePage(this.page);
    this.yellowOrBluePage = new YellowOrBluePage(this.page);
    this.catOrDogPage = new CatOrDogPage(this.page);
    this.sortedListPage = new SortedListPage(this.page);
    this.formFillPage = new FormFillPage(this.page);
    this.catShelterPage = new CatShelterPage(this.page);
    this.tablesPage = new TablesPage(this.page);
    this.concatStringsPage = new ConcatStringsPage(this.page);
    this.collectingKittensPage = new CollectingKittensPage(this.page);
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

  onFormFillPage() {
    return this.formFillPage;
  }

  onCatShelterPage() {
    return this.catShelterPage;
  }

  onTablesPage() {
    return this.tablesPage;
  }

  onConcatStringsPage() {
    return this.concatStringsPage;
  }

  onCollectingKittensPage() {
    return this.collectingKittensPage;
  }

  onCanvasGamePage(): CanvasGamePage {
    if (!this.eyes) {
      throw new Error("Eyes instance is required for CanvasGamePage");
    }

    if (!this._canvasGamePage) {
      this._canvasGamePage = new CanvasGamePage(this.page, this.eyes);
    }

    return this._canvasGamePage;
  }
}
