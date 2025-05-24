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

  await page.waitForSelector(".collection", { state: "visible" });

  while ((await item.count()) > 0) {
    const el = item.first();
    const deleteButton = el.locator('button[title="delete"]');
    await deleteButton.click();
  }

  await expect(itemsList.locator(".collection_item")).toHaveCount(0);
});
