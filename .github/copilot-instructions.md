# Copilot / AI Agent Instructions — my-playwright-project

Purpose
- Short reference for AI coding agents to be immediately productive in this repo: a Playwright E2E test suite for https://e-zoo.by and example tests.

What this repo is (big picture)
- Playwright Test Suite: tests live under `tests/` (site-specific e-zoo tests) and `tests-examples/` (Playwright demo tests).
- Config: `playwright.config.ts` centrally defines testDir, baseURL, reporter, trace, and default browser options.
- Artifacts: `playwright-report/` (HTML test reports) and `test-results/` store test outputs and traces.

Key files to read first
- `playwright.config.ts` — primary configuration (baseURL, headless, trace, reporters, projects).
- `tests/` — real e-zoo tests (look at `myTests.spec.ts`).
- `tests-examples/demo-todo-app.spec.ts` — canonical examples, fixture usage, and helper functions.
- `package.json` — dependencies (Playwright v1.55). Notably, there are no npm scripts; use npx/npm exec.

Design & Conventions
- Tests use Playwright Test (`@playwright/test`) with fixtures (`page`, `test`) and `expect` assertions.
- `baseURL` is set in `playwright.config.ts` to `https://e-zoo.by`. Prefer `page.goto('/path')` rather than absolute URLs to keep tests portable.
- Use `getByRole`, `getByText`, and `getByPlaceholder` where possible (preferred ARIA-based selectors). Use `.locator()` for complex CSS/XPath queries.
- Tests use `expect.soft(...)` for non-blocking assertions.
- Global setup (e.g., cookie accept) is implemented via `test.beforeEach` in `tests/myTests.spec.ts`. Copy that pattern to new tests to ensure consistent state.
- Use `trace: on-first-retry` from config — traces are captured only when a test is retried.
- `type: "module"` is set in package.json — tests and imports use ES module syntax.

Project-specific patterns / examples
- Use baseURL in calls:
  - `await page.goto('/');` instead of `page.goto('https://e-zoo.by/');`
- Example of locating a product card and clicking a related button:
  - `await page.locator('.product__details:has-text("Royal Canin Sterilised 37")').locator('..').locator('button:has-text("В корзину")').click();`
- Waiting for elements to be visible for stability:
  - `await page.locator('.product__info p.h4').first().waitFor({ state: 'visible' });`
- Helper functions in `tests-examples/demo-todo-app.spec.ts` demonstrate how to test localStorage and page state. Consider reusing such helpers in `tests/`.

Commands & workflows (developer guidance)
- Setup:
  - Install dependencies: `npm ci` or `npm install`.
- Run tests:
  - Run all tests: `npx playwright test`
  - Run tests under `tests/`: `npx playwright test tests/`
  - Run a specific file: `npx playwright test tests/myTests.spec.ts`
  - Run a specific test by name:
    - `npx playwright test -g "Check that start page is loaded on URL opening"`
  - Run a single project (chromium):
    - `npx playwright test --project=chromium`
  - Run headed (show browser UI):
    - `npx playwright test --project=chromium --headed` (config currently sets headless=false by default)
  - Debug & Inspector:
    - `PWDEBUG=1 npx playwright test -g "test name"` to open Playwright Inspector for the failing test interactively.
  - Run with trace open & explore trace:
    - After a failing test with trace, open the trace with `npx playwright show-trace <trace.zip>` or open the HTML report.
  - Open HTML report:
    - `npx playwright show-report` or `open playwright-report/index.html`.

CI / Common gotchas & safety nets
- `forbidOnly` is enabled in `playwright.config.ts` to block builds with `test.only` present if `CI` is set — good guard.
- Local development: the tests are primarily targeted at Chromium (project 'chromium') — config includes commented projects for firefox/webkit if you need cross-browser validation.
- Avoid leaving `test.only` in files (found in `tests/myTests.spec.ts`). Search repo before PR: `grep -R "test.only(" -n`.
- Use `await page.goto('/')` and rely on `baseURL` to support local dev and environments.
- Prefer `getBy*` roles over fragile CSS selectors where possible.

Maintenance & recommendations for contributors
- Add scripts to `package.json` for convenience (optional):
  - `"test": "npx playwright test",
    "test:headed": "npx playwright test --project=chromium --headed",
    "test:debug": "PWDEBUG=1 npx playwright test",
    "show-report": "npx playwright show-report"`
- Standardize element wait patterns: prefer `await expect(locator).toBeVisible()` or `await locator.waitFor(...)` before interactions.
- Reuse helper functions for repeated patterns (e.g., open product card, add to cart) in a `tests/helpers` or `tests/fixtures` folder; the `tests-examples` file is a good pattern to follow.
- Keep test descriptions human-readable (Russian is used; keep it consistent).

What to avoid / signals for AI agents
- Do not change `baseURL` unless updating `playwright.config.ts` — use relative paths in `page.goto()`.
- Do not merge PRs with `test.only` still present (CI will fail if `CI=true`).
- Avoid over-optimizing selectors; keep tests readable and resilient by using role-based or text-based selectors when possible.

Where to look for more context during PRs or debugging
- `playwright.config.ts` — behavior for retries, trace, baseURL, and reporter.
- `tests/myTests.spec.ts` — examples of production tests for e-zoo, common setup, and testing patterns.
- `tests-examples/demo-todo-app.spec.ts` — canonical usage of Playwright features and auxiliary helpers to copy.
- `playwright-report/` & `test-results/` — use them for debugging failing runs and downloading traces.

If anything looks ambiguous, ask:
- Should locally run tests rely on alternate baseURLs or environment-specific URLs?
- Do we want to add `npm scripts` to standardize developer workflows?

Thanks — if you want, I can also open a PR to add `package.json` scripts, or add a `tests/helpers` folder and rewrite repeated patterns into shared helpers.