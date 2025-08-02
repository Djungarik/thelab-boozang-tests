# thelab-boozang-tests

Automated Playwright tests for [thelab.boozang.com](https://thelab.boozang.com/), including UI and API coverage.

## Project Structure

- `tests/` - Test specs for UI and API scenarios
- `page-objects/` - Page Object Model classes for test abstraction
- `test-data/` - JSON files with test data
- `apiHelper.ts` - Helper for API requests
- `fixtures.ts` - Custom Playwright fixtures
- `playwright.config.ts` - Playwright configuration
- `.github/workflows/` - GitHub Actions CI setup

## Setup

1. Install dependencies:

   ```sh
   npm install
   ```

2. Create a `.env` file in the root directory and set your Applitools API key:

   ```
   APPLITOOLS_API_KEY=your_applitools_api_key
   ```

## Running Tests

- Run all UI tests (Chromium):

  ```sh
  npm run chromium-all-ui-tests
  ```

- Run all API tests (Chromium):

  ```sh
  npm run chromium-all-api-tests
  ```

## Reporting

- Allure Report can be viewed on the [GitHub page](https://djungarik.github.io/thelab-boozang-tests/)

## Continuous Integration

GitHub Actions workflow is configured in [`.github/workflows/github-actions.yml`](.github/workflows/github-actions.yml) to run tests and publish reports.

## Dependencies

- [@playwright/test](https://playwright.dev/)
- [@applitools/eyes-playwright](https://applitools.com/)
- [jimp](https://github.com/jimp-dev/jimp) (for image processing)
- [allure-playwright](https://github.com/allure-framework/allure-playwright)
