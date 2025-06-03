import { test, expect } from "../fixtures";
import { PageManager } from "../page-objects/pageManager";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("speed game", async ({ page }) => {
  const pm = new PageManager(page);

  await pm.navigateTo().speedGamePage();

  await pm.onSpeedGamePage().startGame();
  await pm.onSpeedGamePage().endGame();

  await expect(page.getByText("Success")).toBeVisible();
});

test("wait game", async ({ page }) => {
  const pm = new PageManager(page);

  await pm.navigateTo().waitGamePage();

  await pm.onWaitGamePage().startGame();
  await pm.onWaitGamePage().endGame();

  await expect(page.getByText("Try again!")).toBeVisible();

  await pm.onWaitGamePage().startGame();

  await page.waitForTimeout(5001);

  await pm.onWaitGamePage().endGame();

  await expect(page.locator(".success_message")).toBeVisible();
});

test("yellow or blue", async ({ page }) => {
  const pm = new PageManager(page);

  await pm.navigateTo().yellowOrBluePage();

  await pm.onYellowOrBluePage().generateColor();

  const colorSuccess = page.locator(".color");

  if ((await colorSuccess.textContent()) === "yellow") {
    await pm.onYellowOrBluePage().clickYellow();
  } else {
    await pm.onYellowOrBluePage().clickBlue();
  }
  await expect(page.locator(".success_message")).toBeVisible();

  await pm.onYellowOrBluePage().generateColor();
  const colorFail = page.locator(".color");

  if ((await colorFail.textContent()) === "yellow") {
    await pm.onYellowOrBluePage().clickBlue();
  } else {
    await pm.onYellowOrBluePage().clickYellow();
  }

  await expect(page.locator(".success_message.fail")).toBeVisible();
});

test("cat or dog", async ({ page }) => {
  const pm = new PageManager(page);

  await pm.navigateTo().catOrDogPage();

  await pm.onCatOrDogPage().generateImage();

  const imageSuccess = page.locator(".image img");

  if ((await imageSuccess.getAttribute("alt")) === "cat") {
    await pm.onCatOrDogPage().clickCat();
  } else {
    await pm.onCatOrDogPage().clickDog();
  }

  await expect(page.locator(".success_message")).toBeVisible();

  await pm.onCatOrDogPage().generateImage();
  const imageFail = page.locator(".image img");

  if ((await imageFail.getAttribute("alt")) === "cat") {
    await pm.onCatOrDogPage().clickDog();
  } else {
    await pm.onCatOrDogPage().clickCat();
  }

  await expect(page.locator(".success_message.fail")).toBeVisible();
});

test("sorted list", async ({ page }) => {
  const pm = new PageManager(page);

  await pm.navigateTo().sortedListPage();

  const itemsList = page.locator(".collection");
  let item = itemsList.locator(".collection_item");
  const dataArray = ["Item 1", "Item 2", "Item 3", "Item 4", "Item 5"];
  const addToDoButton = page.getByRole("button", { name: "Add todo" });

  await page.waitForSelector(".collection", { state: "visible" });

  await pm.onSortedListPage().deleteAllItemsFromTheList(itemsList);

  await expect(itemsList.locator(".collection_item")).toHaveCount(0);

  for (const el of dataArray) {
    await pm.onSortedListPage().addItemToTheList(el);
    await addToDoButton.waitFor({ state: "visible" });
  }

  await itemsList.waitFor({ state: "visible" });

  await expect(item).toHaveCount(dataArray.length);

  await expect(itemsList).toHaveText(dataArray.join(" "));

  await pm.onSortedListPage().addItemToTheList("Test 6");

  await expect(itemsList).not.toHaveText("Test 6");
  await expect(item).toHaveCount(dataArray.length);

  await expect(page.getByText("Your schedule is full!")).toBeVisible();
});

test("form fill", async ({ page }) => {
  const pm = new PageManager(page);

  await pm.navigateTo().formFillPage();

  const todaysDateAndTime = pm.onFormFillPage().getTodaysDateAndTime();

  const firstName = `Test First Name`;
  const lastName = `Test Last Name${todaysDateAndTime}`;
  const email = `test${todaysDateAndTime}@test.com`;
  const password = `Test${todaysDateAndTime}!`;

  await pm
    .onFormFillPage()
    .fillFormWithFirstNameLastNameEmailPassword(
      firstName,
      lastName,
      email,
      password
    );

  await pm.onFormFillPage().clickSaveToDBButtonAndWaitForResponse();
  await pm.onFormFillPage().clickShowUsersInDBButtonAndWaitForResponse();

  await page.waitForSelector(".print_form.show", { state: "visible" });

  await expect(page.locator("table tbody tr").first()).toContainText(
    `${firstName} ${lastName}${email}`
  );
});
test("form fill - add a user via API", async ({ page, apiHelper }) => {
  const pm = new PageManager(page);

  await pm.navigateTo().formFillPage();

  const todaysDateAndTime = pm.onFormFillPage().getTodaysDateAndTime();

  const firstName = `Test First Name`;
  const lastName = `Test Last Name${todaysDateAndTime}`;
  const email = `test${todaysDateAndTime}@test.com`;
  const password = `Test${todaysDateAndTime}!`;

  const articleResponse = await apiHelper.createFormFillITem(
    firstName,
    lastName,
    email,
    password
  );

  expect(articleResponse.ok()).toBeTruthy();

  await page.getByRole("button", { name: "Show users in db" }).click();
  await page.waitForSelector(".print_form.show", { state: "visible" });

  await expect(page.locator("table tbody tr").first()).toContainText(
    `${firstName} ${lastName}${email}`
  );
});

test.describe("cat shelter", () => {
  let pm: PageManager;
  test.beforeEach(async ({ page }) => {
    pm = new PageManager(page);
    await pm.navigateTo().catShelterPage();
  });
  test("add a cat to the shelter", async ({ page }) => {
    const todaysDateAndTime = pm.onCatShelterPage().getTodaysDateAndTime();

    const catName = `Automation Cat ${todaysDateAndTime}`;
    const catDescription = `Test Description 123!`;

    await pm.onCatShelterPage().clickAddCatButtonOnTheShelterPage();

    await pm
      .onCatShelterPage()
      .addCatWithNameDescriptionRadioValue(
        catName,
        catDescription,
        "Wants to go outside"
      );

    await expect(page.locator(".collection li").last()).toHaveText(catName);
  });
  test("edit a cat", async ({ page }) => {
    const todaysDateAndTime = pm.onCatShelterPage().getTodaysDateAndTime();

    const catName = `Automation Cat ${todaysDateAndTime}`;
    const catDescription = `Test Description 123!`;

    await pm.onCatShelterPage().clickAddCatButtonOnTheShelterPage();

    await pm
      .onCatShelterPage()
      .addCatWithNameDescriptionRadioValue(
        catName,
        catDescription,
        "Wants to go outside"
      );

    await expect(page.locator(".collection li").last()).toHaveText(catName);

    await page.locator(".collection li").last().click();

    const updatedCatName = `Edited ${catName}`;
    const updatedCatDescription = `Edited ${catDescription}`;

    await pm
      .onCatShelterPage()
      .editCatWithNameDescriptionRadioValue(
        updatedCatName,
        updatedCatDescription
      );

    const checkedRadio = page.getByRole("radio", { checked: true });
    const checkedLabel = page.locator('label:has(input[type="radio"]:checked)');
    const checkedRadioText = await checkedLabel.locator("span").textContent();

    await pm.onCatShelterPage().clickSaveButton();

    await expect(page.locator(".collection li").last()).toHaveText(
      updatedCatName
    );

    await page.locator(".collection li").last().click();

    await expect(page.getByPlaceholder("Enter name...")).toHaveValue(
      updatedCatName
    );
    await expect(page.getByPlaceholder("Enter description...")).toHaveValue(
      updatedCatDescription
    );

    await expect(checkedRadio).toBeChecked();
    await expect(checkedLabel.locator("span")).toHaveText(
      checkedRadioText ?? ""
    );
  });
  test("delete a cat", async ({ page }) => {
    const todaysDateAndTime = pm.onCatShelterPage().getTodaysDateAndTime();

    const catName = `DELETE Automation Cat ${todaysDateAndTime}`;
    const catDescription = `Test Description 123!`;

    await pm.onCatShelterPage().clickAddCatButtonOnTheShelterPage();

    await pm
      .onCatShelterPage()
      .addCatWithNameDescriptionRadioValue(
        catName,
        catDescription,
        "Wants to go outside"
      );

    await expect(page.locator(".collection li").last()).toHaveText(catName);

    await page.locator(".collection li").last().click();

    await pm.onCatShelterPage().clickDeleteButton();
    await expect(page.locator(".collection li").last()).not.toHaveText(catName);
  });
});

test.describe("tables", () => {
  let pm: PageManager;
  test.beforeEach(async ({ page }) => {
    pm = new PageManager(page);
    await pm.navigateTo().tablesPage();
  });

  test("empty filters", async ({ page }) => {
    await pm.onTablesPage().uncheckAllFilters();
    await expect(page.locator("tbody")).toBeEmpty();
  });

  test("apply species filters", async ({ page }) => {
    const filters = page.locator(".option");
    const speciesCells = page.locator("tbody tr td:nth-child(3)");

    await pm.onTablesPage().checkAllFilters();

    for (const filter of await filters.all()) {
      const filterText = (await filter.textContent())?.slice(0, -1) ?? "";
      const filteredSpecies = speciesCells.filter({ hasText: filterText });
      const cellsCount = await filteredSpecies.count();

      expect(cellsCount).toBeGreaterThan(0);
    }
  });
});

test.describe("concat strings", () => {
  let pm: PageManager;
  test.beforeEach(async ({ page }) => {
    pm = new PageManager(page);
    await pm.navigateTo().concatStringsPage();
    await page.getByRole("button", { name: "Generate strings" }).click();
  });
  test("correct string", async ({ page }) => {
    const string1 = await page.locator(".string1").textContent();
    const string2 = await page.locator(".string2").textContent();
    const expectedString = `${string1}${string2}`;

    await pm.onConcatStringsPage().fillFormWithTwoStrings(expectedString);
    await pm.onConcatStringsPage().clickSubmitStringButton();

    await expect(page.locator(".success_message")).toBeVisible();
  });
  test("wrong string", async ({ page }) => {
    await pm.onConcatStringsPage().fillFormWithTwoStrings("Wrong String");
    await pm.onConcatStringsPage().clickSubmitStringButton();

    await expect(page.locator(".success_message.fail")).toBeVisible();
  });
});

test.describe("collecting kittens", () => {
  test.setTimeout(40_000);
  let pm: PageManager;
  test.beforeEach(async ({ page }) => {
    pm = new PageManager(page);
    await pm.navigateTo().collectingKittensPage();
    await page.getByRole("button", { name: "Start Game" }).click();
  });
  test("win the game - click only on kittens", async ({ page }) => {
    await pm.onCollectingKittensPage().clickOnAllKittens();

    const points = await pm.onCollectingKittensPage().getPoints();

    await expect(page.locator(".message")).toHaveText(
      `Game Over!You got ${points} Points!`
    );
  });
  test("loose the game - click on the hedgehog", async ({ page }) => {
    await page.locator(".kitten").first().click();
    await page.locator(".hedgehog").first().click();

    await expect(page.locator(".message")).toHaveText(`Game Over!`);
  });
});

test.only("canvas game", async ({ page, eyes }) => {
  const pm = new PageManager(page);

  await pm.navigateTo().canvasGamePage();

  const canvas = page.locator("canvas");
  const canvasBox = await canvas.boundingBox();

  if (!canvasBox) {
    throw new Error("Canvas bounding box not found");
  }

  await canvas.screenshot({ path: "canvas.png" });

  const ballPos = await pm
    .onCanvasGamePage()
    .getBallCoordinates("canvas.png", { r: 242, g: 77, b: 127 });

  if (!ballPos) throw new Error("Ball not found");

  const targetX = 444;
  const targetY = 618;

  const startX = canvasBox.x + ballPos.x;
  const startY = canvasBox.y + ballPos.y;

  await pm
    .onCanvasGamePage()
    .moveBallToSpecificCoordinates(startX, startY, targetX, targetY);

  await canvas.screenshot({ path: "canvas_after.png" });
  await eyes.check("The ball is in the box", {
    fully: true,
    matchLevel: "Dynamic",
  });
});
