import { test, expect } from "../fixtures";
import { PageManager } from "../page-objects/pageManager";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test.describe("form fill", () => {
  let pm: PageManager;
  test.beforeEach(async ({ page }) => {
    pm = new PageManager(page);
    await pm.navigateTo().formFillPage();
  });
  test("form fill - add a user via API", async ({
    page,
    apiHelper,
    helperBase,
  }) => {
    const todaysDateAndTime = helperBase.getTodaysDateWithCurrentTime();
    const firstName = `Test First Name`;
    const lastName = `Test Last Name${todaysDateAndTime}`;
    const email = `test${todaysDateAndTime}@test.com`;
    const password = `Test${todaysDateAndTime}!`;

    const articleResponse = await apiHelper.createFormFillItem(
      firstName,
      lastName,
      email,
      password
    );

    expect(articleResponse.ok()).toBeTruthy();

    await pm.onFormFillPage().clickShowUsersInDBButtonAndWaitForResponse();

    await page.waitForSelector(".print_form.show", { state: "visible" });

    await expect(
      page.locator("table tbody tr", {
        hasText: `${firstName} ${lastName}${email}`,
      })
    ).toHaveCount(1);
  });
  test("form fill - delete a user via API", async ({
    page,
    apiHelper,
    helperBase,
  }) => {
    const todaysDateAndTime = helperBase.getTodaysDateWithCurrentTime();
    const firstName = `Test DELETE ME`;
    const lastName = `Test DELETE ME${todaysDateAndTime}`;
    const email = `test${todaysDateAndTime}@test.com`;
    const password = `Test${todaysDateAndTime}!`;

    const createItemResponse = await apiHelper.createFormFillItem(
      firstName,
      lastName,
      email,
      password
    );

    expect(createItemResponse.ok()).toBeTruthy();

    const createData = await createItemResponse.json();
    const userId = createData.id;

    await pm.onFormFillPage().clickShowUsersInDBButtonAndWaitForResponse();
    await page.waitForSelector(".print_form.show", { state: "visible" });

    await expect(
      page.locator("table tbody tr", {
        hasText: `${firstName} ${lastName}${email}`,
      })
    ).toHaveCount(1);

    const deleteItemResponse = await apiHelper.deleteFormFillItem(userId);

    expect(deleteItemResponse.ok()).toBeTruthy();

    await pm.onFormFillPage().clickHideUsersInDBButton();
    await pm.onFormFillPage().clickShowUsersInDBButtonAndWaitForResponse();
    await page.waitForSelector(".print_form.show", { state: "visible" });

    await expect(
      page.locator("table tbody tr", {
        hasText: `${firstName} ${lastName}${email}`,
      })
    ).toHaveCount(0);
  });
});
