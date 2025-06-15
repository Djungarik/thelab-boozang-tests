import { test, expect } from "../fixtures";
import { PageManager } from "../page-objects/pageManager";
import * as sortedListTestData from "../test-data/sortedList.json";
import * as formFillTestData from "../test-data/formFill.json";
import * as catShelterTestData from "../test-data/catShelter.json";

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
    const firstName = formFillTestData.apiTestUser.firstName;
    const lastName = `${formFillTestData.apiTestUser.lastName}${todaysDateAndTime}`;
    const baseEmail = formFillTestData.apiTestUser.email;
    const [prefix, domain] = baseEmail.split("@");
    const email = `${prefix}+${todaysDateAndTime}@${domain}`;
    const password = `${formFillTestData.apiTestUser.password}${todaysDateAndTime}!`;

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
    const firstName = formFillTestData.apiDeleteTestUser.firstName;
    const lastName = `${formFillTestData.apiDeleteTestUser.lastName}${todaysDateAndTime}`;
    const baseEmail = formFillTestData.apiDeleteTestUser.email;
    const [prefix, domain] = baseEmail.split("@");
    const email = `${prefix}+${todaysDateAndTime}@${domain}`;
    const password = `${formFillTestData.apiDeleteTestUser.password}${todaysDateAndTime}!`;

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
    const catDescription = catShelterTestData.testAPINewCat.catDescription;
    const isFoundHome = false;
    const inOrOutside = catShelterTestData.testAPINewCat.radioValue.inside;
    const catName = `${catShelterTestData.testAPINewCat.catName} ${todaysDateAndTime}`;

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
    const catDescription = catShelterTestData.testAPIDeleteCat.catDescription;
    const isFoundHome = false;
    const inOrOutside = catShelterTestData.testAPIDeleteCat.radioValue.inside;
    const catName = `${catShelterTestData.testAPIDeleteCat.catName} ${todaysDateAndTime}`;

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
    const catDescription = catShelterTestData.testAPIEditCat.catDescription;
    const isFoundHome = false;
    const inOrOutside = catShelterTestData.testAPIEditCat.radioValue.inside;
    const catName = `${catShelterTestData.testAPIEditCat.catName} ${todaysDateAndTime}`;

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

    const catDescriptionUpdate =
      catShelterTestData.testAPIEditCat.updatedCatDescription;
    const isFoundHomeUpdate = true;
    const inOrOutsideUpdate =
      catShelterTestData.testAPIEditCat.radioValue.outside;
    const catNameUpdate = `${catShelterTestData.testAPIEditCat.updatedCatName} ${todaysDateAndTime}`;

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

test.describe("sorted list  API", () => {
  let pm: PageManager;
  test.beforeEach(async ({ page }) => {
    pm = new PageManager(page);
    await pm.navigateTo().sortedListPage();
  });

  test("sorted list - add an item via API", async ({
    page,
    apiHelper,
    helperBase,
  }) => {
    const todaysDate = helperBase.getTodaysDateWithCurrentTime();
    const itemTitle = `${sortedListTestData.apiItem} ${todaysDate}`;
    const addItemResponse = await apiHelper.createSortedListItem(itemTitle);

    expect(addItemResponse.ok()).toBeTruthy();

    await page.reload();

    await expect(
      page.locator(".collection_item", { hasText: itemTitle })
    ).toHaveCount(1);
  });

  test("sorted list - delete an item via API", async ({
    page,
    apiHelper,
    helperBase,
  }) => {
    const todaysDate = helperBase.getTodaysDateWithCurrentTime();
    const itemTitle = `${sortedListTestData.apiItemDelete} ${todaysDate}`;
    const addItemResponse = await apiHelper.createSortedListItem(itemTitle);

    expect(addItemResponse.ok()).toBeTruthy();

    await page.reload();

    await expect(
      page.locator(".collection_item", { hasText: itemTitle })
    ).toHaveCount(1);

    const addItemData = await addItemResponse.json();
    const itemId = addItemData.id;

    const deleteItemResponse = await apiHelper.deleteSortedListItem(itemId);

    expect(deleteItemResponse.ok()).toBeTruthy();

    await page.reload();

    await expect(
      page.locator(".collection_item", { hasText: itemTitle })
    ).toHaveCount(0);
  });
});
