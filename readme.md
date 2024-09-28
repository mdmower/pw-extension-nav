## Playwright mocked responses issue with `chrome.tabs.create()`

This is a minimal reproduction of an issue with Playwright failing to mock the network response for a new tab opened via extension method [`chrome.tabs.create()`](https://developer.chrome.com/docs/extensions/reference/api/tabs#method-create).

This repository includes a tiny Manifest v3 extension that works in Edge and Chrome. When installed, the browser action button shows a page that has button "Navigate". When the button is clicked, a new tab is created and activated by invoking [`chrome.tabs.create()`](https://developer.chrome.com/docs/extensions/reference/api/tabs#method-create). The new tab navigates to `https://example.com/`.

Playwright is configured to mock responses for `https://example.com/`. When using Playwright's `page.goto()` method to navigate to `https://example.com/`, the response is mocked. When using the extension button to navigate, the response is not mocked. In fact, the request is not detected at all by `context.on("request", ...)`.

The tests still fail when experimental feature [`PW_EXPERIMENTAL_SERVICE_WORKER_NETWORK_EVENTS`](https://playwright.dev/docs/service-workers-experimental) is enabled.

Testing instructions:

```sh
# Optionally, uncomment (does not affect test results)
# export PW_EXPERIMENTAL_SERVICE_WORKER_NETWORK_EVENTS=1
npm install
npx playwright install
npm run test
```

Test output:

```
Running 2 tests using 1 worker
[chromium] › bubble.spec.js:8:3 › Bubble › navigation via playwright page.goto()
Request detected: chrome-extension://nnbkekbbfepfbgikblfbopdepnlhfjpd/bubble.js
Request detected: https://example.com/
[chromium] › bubble.spec.js:16:3 › Bubble › navigation via chrome.tabs.create()
Request detected: chrome-extension://nnbkekbbfepfbgikblfbopdepnlhfjpd/bubble.js
  1) [chromium] › bubble.spec.js:16:3 › Bubble › navigation via chrome.tabs.create() ───────────────

    Error: Timed out 2000ms waiting for expect(locator).toBeVisible()

    Locator: getByText('mocked!')
    Expected: visible
    Received: <element(s) not found>
    Call log:
      - expect.toBeVisible with timeout 2000ms
      - waiting for getByText('mocked!')


      22 |     await expect(newPage).toHaveURL("https://example.com/");
      23 |     // This fails because the response isn't mocked by Playwright
    > 24 |     await expect(newPage.getByText("mocked!")).toBeVisible({ timeout: 2000 });
         |                                                ^
      25 |   });
      26 | });
      27 |

        at /home/mdmower/source/pw-extension-nav/bubble.spec.js:24:48

  1 failed
    [chromium] › bubble.spec.js:16:3 › Bubble › navigation via chrome.tabs.create() ────────────────
  1 passed (3.5s)
```
