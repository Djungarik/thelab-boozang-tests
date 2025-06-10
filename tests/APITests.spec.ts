import { test, expect } from "../fixtures";
import { PageManager } from "../page-objects/pageManager";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test.describe("form fill API", () => {
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

test.describe("cat shelter API", () => {
  let pm: PageManager;
  test.beforeEach(async ({ page }) => {
    pm = new PageManager(page);
    await pm.navigateTo().catShelterPage();
  });

  test("cat shelter - add a cat via API", async ({
    page,
    apiHelper,
    helperBase,
  }) => {
    const todaysDateAndTime = helperBase.getTodaysDateWithCurrentTime();
    const catDescription = `Test Description 123!`;
    const isFoundHome = false;
    const inOrOutside = "outside";
    const catName = `Automation Cat Added ${todaysDateAndTime}`;

    const createCatResponse = await apiHelper.createCat(
      catDescription,
      isFoundHome,
      inOrOutside,
      catName
    );

    expect(createCatResponse.ok()).toBeTruthy();

    await page.reload();

    await expect(
      page.locator(".collection li", { hasText: catName })
    ).toHaveCount(1);
  });
  test("cat shelter - delete a cat via API", async ({
    page,
    apiHelper,
    helperBase,
  }) => {
    const todaysDateAndTime = helperBase.getTodaysDateWithCurrentTime();
    const catDescription = `Test Description 123!`;
    const isFoundHome = false;
    const inOrOutside = "outside";
    const catName = `Automation Cat DELETE ME ${todaysDateAndTime}`;

    const createCatResponse = await apiHelper.createCat(
      catDescription,
      isFoundHome,
      inOrOutside,
      catName
    );

    expect(createCatResponse.ok()).toBeTruthy();

    await page.reload();

    await expect(
      page.locator(".collection li", { hasText: catName })
    ).toHaveCount(1);

    const createData = await createCatResponse.json();
    const catId = createData.id;

    const deleteCatResponse = await apiHelper.deleteCat(catId);

    expect(deleteCatResponse.ok()).toBeTruthy();

    await page.reload();

    await expect(
      page.locator(".collection li", { hasText: catName })
    ).toHaveCount(0);
  });
  test("cat shelter - update a cat via API", async ({
    page,
    apiHelper,
    helperBase,
  }) => {
    const todaysDateAndTime = helperBase.getTodaysDateWithCurrentTime();
    const catDescription = `Test Description 123!`;
    const isFoundHome = false;
    const inOrOutside = "outside";
    const catName = `Automation Cat ${todaysDateAndTime}`;

    const createCatResponse = await apiHelper.createCat(
      catDescription,
      isFoundHome,
      inOrOutside,
      catName
    );

    expect(createCatResponse.ok()).toBeTruthy();

    await page.reload();

    await expect(
      page.locator(".collection li", { hasText: catName })
    ).toHaveCount(1);

    const createData = await createCatResponse.json();
    const catId = createData.id;

    const catDescriptionUpdate = `Test Updated Description 123!`;
    const isFoundHomeUpdate = true;
    const inOrOutsideUpdate = "inside";
    const catNameUpdate = `Automation Cat Updated ${todaysDateAndTime}`;

    const updateCatResponse = await apiHelper.updateCat(
      catDescriptionUpdate,
      isFoundHomeUpdate,
      catId,
      inOrOutsideUpdate,
      catNameUpdate
    );

    expect(updateCatResponse.ok()).toBeTruthy();
    await page.reload();

    await expect(
      page.locator(".collection li", { hasText: catName })
    ).toHaveCount(0);

    await expect(
      page.locator(".collection li", { hasText: catNameUpdate })
    ).toHaveCount(1);
  });
});
