import { test, expect } from "@applitools/eyes-playwright/fixture";
import { PageManager } from "../page-objects/pageManager";
import { findBall } from "./findBall";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("speed game", async ({ page }) => {
  const pm = new PageManager(page);

  await pm.navigateTo().speedGamePage();

  await page.getByRole("button", { name: "Start Game" }).click();

  await page.getByRole("button", { name: "End Game" }).click();

  await expect(page.getByText("Success")).toBeVisible();
});

test("wait game", async ({ page }) => {
  const pm = new PageManager(page);

  await pm.navigateTo().waitGamePage();

  await page.getByRole("button", { name: "Start Game" }).click();

  await page.getByRole("button", { name: "End Game" }).click();

  await expect(page.getByText("Try again!")).toBeVisible();

  await page.getByRole("button", { name: "Start Game" }).click();

  await page.waitForTimeout(5001);

  await page.getByRole("button", { name: "End Game" }).click();
  await expect(page.locator(".success_message")).toBeVisible();
});

test("yellow or blue", async ({ page }) => {
  const pm = new PageManager(page);

  await pm.navigateTo().yellowOrBluePage();

  await page.getByRole("button", { name: "Generate Color" }).click();

  const colorSuccess = page.locator(".color");

  if ((await colorSuccess.textContent()) === "yellow") {
    await page.getByRole("button", { name: "yellow" }).click();
  } else {
    await page.getByRole("button", { name: "blue" }).click();
  }
  await expect(page.locator(".success_message")).toBeVisible();

  await page.getByRole("button", { name: "Generate Color" }).click();
  const colorFail = page.locator(".color");

  if ((await colorFail.textContent()) === "yellow") {
    await page.getByRole("button", { name: "blue" }).click();
  } else {
    await page.getByRole("button", { name: "yellow" }).click();
  }

  await expect(page.locator(".success_message.fail")).toBeVisible();
});

test("cat or dog", async ({ page }) => {
  const pm = new PageManager(page);

  await pm.navigateTo().catOrDogPage();

  await page.getByRole("button", { name: "Generate Image" }).click();

  const imageSuccess = page.locator(".image img");

  if ((await imageSuccess.getAttribute("alt")) === "cat") {
    await page.getByRole("button", { name: "cat" }).click();
  } else {
    await page.getByRole("button", { name: "dog" }).click();
  }

  await expect(page.locator(".success_message")).toBeVisible();

  await page.getByRole("button", { name: "Generate Image" }).click();
  const imageFail = page.locator(".image img");
  if ((await imageFail.getAttribute("alt")) === "cat") {
    await page.getByRole("button", { name: "dog" }).click();
  } else {
    await page.getByRole("button", { name: "cat" }).click();
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

  if ((await itemsList.locator(".collection_item").count()) > 0) {
    await itemsList
      .locator(".collection_item")
      .first()
      .locator('button[title="delete"]')
      .click();
  }

  await expect(itemsList.locator(".collection_item")).toHaveCount(0);

  for (const el of dataArray) {
    await page.locator(".list_form input").fill(el);
    await addToDoButton.click();
    await addToDoButton.waitFor({ state: "visible" });
  }

  await itemsList.waitFor({ state: "visible" });

  await expect(item).toHaveCount(dataArray.length);

  await expect(itemsList).toHaveText(dataArray.join(" "));

  await page.locator(".list_form input").fill("Test 6");
  await addToDoButton.click();
  await expect(itemsList).not.toHaveText("Test 6");
  await expect(item).toHaveCount(dataArray.length);

  await expect(page.getByText("Your schedule is full!")).toBeVisible();
});

test("form fill", async ({ page }) => {
  const pm = new PageManager(page);

  await pm.navigateTo().formFillPage();

  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");

  const currentTime = `${hours}${minutes}${seconds}`;

  const todaysDateAndTime = `${year}${month}${day}${currentTime}`;

  const firstName = `Test First Name`;
  const lastName = `Test Last Name${todaysDateAndTime}`;
  const email = `test${todaysDateAndTime}@test.com`;
  const password = `Test${todaysDateAndTime}!`;

  await page.getByRole("textbox", { name: "First name:" }).fill(firstName);
  await page.getByRole("textbox", { name: "Last name:" }).fill(lastName);
  await page.getByRole("textbox", { name: "Email: " }).fill(email);
  await page.getByRole("textbox", { name: "Password: " }).fill(password);

  await Promise.all([
    page.waitForResponse(
      (res) =>
        res.url().includes("/users/") &&
        res.request().method() === "POST" &&
        res.status() === 201
    ),
    page.getByRole("button", { name: "Save to db" }).click(),
  ]);

  await Promise.all([
    page.waitForResponse(
      (res) =>
        res.url().includes("/users/") &&
        res.request().method() === "GET" &&
        res.status() === 200
    ),
    page.getByRole("button", { name: "Show users in db" }).click(),
  ]);

  await page.waitForSelector(".print_form.show", { state: "visible" });

  await expect(page.locator("table tbody tr").first()).toContainText(
    `${firstName} ${lastName}${email}`
  );
});
test("form fill - add a user via API", async ({ page }) => {
  const pm = new PageManager(page);

  await pm.navigateTo().formFillPage();

  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");

  const currentTime = `${hours}${minutes}${seconds}`;

  const todaysDateAndTime = `${year}${month}${day}${currentTime}`;

  const firstName = `Test First Name`;
  const lastName = `Test Last Name${todaysDateAndTime}`;
  const email = `test${todaysDateAndTime}@test.com`;
  const password = `Test${todaysDateAndTime}!`;

  const articleResponse = await page.request.post(
    "https://api.boozang.com/users/",
    {
      data: {
        firstname: firstName,
        lastname: lastName,
        email: email,
        password: password,
      },
    }
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
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");

    const currentTime = `${hours}${minutes}${seconds}`;

    const todaysDateAndTime = `${year}${month}${day}${currentTime}`;

    const catName = `Automation Cat ${todaysDateAndTime}`;
    const catDescription = `Test Description 123!`;

    await page.locator('[class="link_btn add"]').click();

    await page.getByRole("textbox", { name: "Name:" }).fill(catName);
    await page
      .getByRole("textbox", { name: "Description:" })
      .fill(catDescription);

    await page.getByRole("radio", { name: "Wants to go outside" }).click();

    await page.getByRole("button", { name: "Add Cat" }).click();

    await expect(page.locator(".collection li").last()).toHaveText(catName);
  });
  test("edit a cat", async ({ page }) => {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");

    const currentTime = `${hours}${minutes}${seconds}`;

    const todaysDateAndTime = `${year}${month}${day}${currentTime}`;

    const catName = `Automation Cat ${todaysDateAndTime}`;
    const catDescription = `Test Description 123!`;

    await page.locator('[class="link_btn add"]').click();

    await page.getByRole("textbox", { name: "Name:" }).fill(catName);
    await page
      .getByRole("textbox", { name: "Description:" })
      .fill(catDescription);

    await page.getByRole("radio", { name: "Wants to go outside" }).click();

    await page.getByRole("button", { name: "Add Cat" }).click();

    await expect(page.locator(".collection li").last()).toHaveText(catName);

    await page.locator(".collection li").last().click();

    const editedCatName = `Edited ${catName}`;
    const editedCatDescription = `Edited ${catDescription}`;

    await page.getByPlaceholder("Enter name...").clear();
    await page.getByPlaceholder("Enter name...").fill(editedCatName);
    await page.getByPlaceholder("Enter description...").clear();
    await page
      .getByPlaceholder("Enter description...")
      .fill(editedCatDescription);

    const radios = [
      page.getByRole("radio", { name: "Wants to go outside" }),
      page.getByRole("radio", { name: "Stay inside" }),
    ];

    for (const radio of radios) {
      if (!(await radio.isChecked())) {
        await radio.click();
        break;
      }
    }
    const checkedRadio = page.getByRole("radio", { checked: true });
    const checkedLabel = page.locator('label:has(input[type="radio"]:checked)');
    const checkedRadioText = await checkedLabel.locator("span").textContent();

    await page.getByRole("button", { name: "Save" }).click();

    await expect(page.locator(".collection li").last()).toHaveText(
      editedCatName
    );

    await page.locator(".collection li").last().click();

    await expect(page.getByPlaceholder("Enter name...")).toHaveValue(
      editedCatName
    );
    await expect(page.getByPlaceholder("Enter description...")).toHaveValue(
      editedCatDescription
    );

    await expect(checkedRadio).toBeChecked();
    await expect(checkedLabel.locator("span")).toHaveText(
      checkedRadioText ?? ""
    );
  });
  test("delete a cat", async ({ page }) => {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");

    const currentTime = `${hours}${minutes}${seconds}`;

    const todaysDateAndTime = `${year}${month}${day}${currentTime}`;

    const catName = `Automation Cat ${todaysDateAndTime}`;
    const catDescription = `Test Description 123!`;

    await page.locator('[class="link_btn add"]').click();

    await page.getByRole("textbox", { name: "Name:" }).fill(catName);
    await page
      .getByRole("textbox", { name: "Description:" })
      .fill(catDescription);

    await page.getByRole("radio", { name: "Wants to go outside" }).click();

    await page.getByRole("button", { name: "Add Cat" }).click();

    await expect(page.locator(".collection li").last()).toHaveText(catName);

    await page.locator(".collection li").last().click();

    await page.getByRole("button", { name: "Delete" }).click();

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
    const filters = page.locator(".option");

    for (const filter of await filters.all()) {
      if (
        (await filter.locator("span").getAttribute("aria-checked")) === "true"
      ) {
        await filter.click();
      }
    }

    await expect(page.locator("tbody")).toBeEmpty();
  });

  test("apply species filters", async ({ page }) => {
    const filters = page.locator(".option");
    const speciesCells = page.locator("tbody tr td:nth-child(3)");

    for (const filter of await filters.all()) {
      if (
        (await filter.locator("span").getAttribute("aria-checked")) !== "true"
      ) {
        await filter.click();
      }

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
    const expectedResult = `${string1}${string2}`;

    await page.locator(".list_form input").fill(expectedResult);

    await page.getByRole("button", { name: "Submit string" }).click();

    await expect(page.locator(".success_message")).toBeVisible();
  });
  test("wrong string", async ({ page }) => {
    await page.locator(".list_form input").fill("Wrong string");

    await page.getByRole("button", { name: "Submit string" }).click();

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
    const kittens = page.locator(".kitten");
    let timeLeft = await page
      .locator(".game_header_counter.time strong")
      .textContent();

    while (timeLeft !== "30") {
      timeLeft = await page
        .locator(".game_header_counter.time strong")
        .textContent();

      for (const kitten of await kittens.all()) {
        await kitten.click();
      }
    }

    const points = await page
      .locator(".game_header_counter.points strong")
      .textContent();

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

test("canvas game", async ({ page, eyes }) => {
  const pm = new PageManager(page);

  await pm.navigateTo().canvasGamePage();

  const canvas = page.locator("canvas");
  const canvasBox = await canvas.boundingBox();

  if (!canvasBox) {
    throw new Error("Canvas bounding box not found");
  }

  await canvas.screenshot({ path: "canvas.png" });

  const ballPos = await findBall("canvas.png", { r: 242, g: 77, b: 127 });

  if (!ballPos) throw new Error("Ball not found");

  const targetX = 444;
  const targetY = 618;

  const startX = canvasBox.x + ballPos.x;
  const startY = canvasBox.y + ballPos.y;

  // Drag the ball
  await page.mouse.move(startX, startY);
  await page.mouse.down();
  await page.mouse.move(targetX, targetY, {
    steps: 20,
  });
  await page.mouse.up();

  await canvas.screenshot({ path: "canvas_after.png" });
  await eyes.check("The ball is in the box", {
    fully: true,
    matchLevel: "Dynamic",
  });
});
