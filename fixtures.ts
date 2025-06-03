import { test as base } from "@applitools/eyes-playwright/fixture";
import { ApiHelper } from "./apiHelper";

type MyFixtures = {
  apiHelper: ApiHelper;
};

export const test = base.extend<MyFixtures>({
  apiHelper: async ({ request }, use) => {
    const helper = new ApiHelper(request);
    await use(helper);
  },
});

export { expect } from "@playwright/test";
