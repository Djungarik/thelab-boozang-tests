import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("speed game", async ({ page }) => {
  await page.getByRole("button", { name: "Menu" }).click();
  await page.getByRole("link", { name: "Speed Game" }).click();

  await page.getByRole("button", { name: "Start Game" }).click();

  await page.getByRole("button", { name: "End Game" }).click();

  await expect(page.getByText("Success")).toBeVisible();
});

test("wait game", async ({ page }) => {
  await page.getByRole("button", { name: "Menu" }).click();
  await page.getByRole("link", { name: "Wait Game" }).click();

  await page.getByRole("button", { name: "Start Game" }).click();

  await page.getByRole("button", { name: "End Game" }).click();

  await expect(page.getByText("Try again!")).toBeVisible();

  await page.getByRole("button", { name: "Start Game" }).click();

  await page.waitForTimeout(5001);

  await page.getByRole("button", { name: "End Game" }).click();
  await expect(page.locator(".success_message")).toBeVisible();
});

test("yellow or blue", async ({ page }) => {
  await page.getByRole("button", { name: "Menu" }).click();
  await page.getByRole("link", { name: "Yellow or Blue" }).click();

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
  await page.getByRole("button", { name: "Menu" }).click();
  await page.getByRole("link", { name: "Cat or dog" }).click();

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
  await page.getByRole("button", { name: "Menu" }).click();
  await page.getByRole("link", { name: "Sorted list" }).click();

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
  await page.getByRole("button", { name: "Menu" }).click();
  await page.getByRole("link", { name: "Form Fill" }).click();

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
  await page.getByRole("button", { name: "Menu" }).click();
  await page.getByRole("link", { name: "Form Fill" }).click();

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
