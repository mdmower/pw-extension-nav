import { test, expect } from "./pw-fixtures.js";

test.describe("Bubble", () => {
  test.beforeEach(async ({ page, extension }) => {
    await page.goto(extension.bubbleUrl);
  });

  test("navigation via playwright page.goto()", async ({ page, context }) => {
    await expect(page.getByRole("button", { name: "Navigate" })).toBeVisible();
    page.goto("https://example.com/");
    await expect(page).toHaveURL("https://example.com/");
    // This suceeds because the response is mocked by Playwright
    await expect(page.getByText("mocked!")).toBeVisible({ timeout: 2000 });
  });

  test("navigation via chrome.tabs.create()", async ({ page, context }) => {
    await expect(page.getByRole("button", { name: "Navigate" })).toBeVisible();
    const newPagePromise = context.waitForEvent("page");
    await page.getByRole("button", { name: "Navigate" }).click();
    const newPage = await newPagePromise;
    expect(page.isClosed()).toBe(true);
    await expect(newPage).toHaveURL("https://example.com/");
    // This fails because the response isn't mocked by Playwright
    await expect(newPage.getByText("mocked!")).toBeVisible({ timeout: 2000 });
  });
});
