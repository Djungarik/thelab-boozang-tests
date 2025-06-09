import { test as base } from "@applitools/eyes-playwright/fixture";
import { ApiHelper } from "./apiHelper";
import { HelperBase } from "./page-objects/helperBase";

type MyFixtures = {
  apiHelper: ApiHelper;
  helperBase: HelperBase;
};

export const test = base.extend<MyFixtures>({
  apiHelper: async ({ request }, use) => {
    const apiHelper = new ApiHelper(request);
    await use(apiHelper);
  },
  helperBase: async ({ page }, use) => {
    const helperBase = new HelperBase(page);
    await use(helperBase);
  },
});

export { expect } from "@playwright/test";
