# Campaign Demo Playwright Automation

This repository contains a Playwright + TypeScript UI automation suite for validating the QA campaign dashboard workflow.

## Project overview

The project is designed to automate the following user journeys:

- Login with valid and invalid credentials
- Campaign creation and draft validation
- Scheduling campaigns for future and past dates
- Sending campaigns immediately
- Viewing campaign reports and counts

### Tech stack

- Node.js
- TypeScript
- Playwright Test
- dotenv for environment variable loading

### Main project structure

- `tests/` — test specifications
- `pages/` — page object model classes
- `testdata/` — reusable test data objects
- `playwright.config.ts` — Playwright runner configuration
- `qa.env` — environment values used by the test suite

## Setup instructions

### 1. Install dependencies

From the project root:

```bash
npm install
```

### 2. Install Playwright browsers

```bash
npx playwright install
```

### 3. Confirm environment variables

The project reads environment values from `qa.env` and also supports a local `.env` file if needed.

Current QA values in `qa.env`:

```env
BaseURL=https://aws-pluto.vuture.dev/qa.html
UserName=qa@example.com
Password=Password@123
```

## What has been completed

The current project contains the following built test and page-object coverage:

- `pages/LoginPage.ts` handles login navigation, credential entry, and dashboard/error verification.
- `pages/DashBoard.ts` encapsulates dashboard tab navigation for New Campaign, Drafts, Schedule, and Reports.
- `pages/campagin.ts` covers campaign form actions, save/preview flow, and validation messaging.
- `pages/SchedulePage.ts` supports selecting drafts, scheduling them, and sending them immediately.
- `pages/REportsPage.ts` reads report statistics from the reports page.
- `tests/login.spec.ts` validates login success, invalid login, and empty-field handling.
- `tests/Campagin.spec.ts` covers campaign creation and mandatory/invalid sender validation scenarios.
- `tests/Schedule.spec.ts` exercises draft retention, future scheduling, past-date rejection, send-now flow, reports view, repeatability, and artifact checks.

## What is still pending

The following areas are still incomplete or need refinement:

- `pages/DraftPaged.ts` is still a placeholder and does not yet provide final draft-page behavior.
- Some page objects and specs could be further normalized to use a single consistent selector and assertion style across all flows.
- The project would benefit from a more explicit test naming/organization strategy if the suite expands further.

## How to run the tests

From the project root:

```bash
npm test
```

### Useful commands

```bash
npm run test:headed
npm run test:ui
npx playwright test --workers=1 --reporter=list
npx playwright show-report
```

## Verification status

The suite was verified with:

```bash
npx playwright test --workers=1 --reporter=list
```

Verified result:

- 13 tests passed
- 0 failed
- Total runtime: about 48.3 seconds

## Notes

- The suite is intentionally run with `--workers=1` because the app is shared and more stable in serial mode.
- HTML test results are generated through Playwright’s built-in reporter.
- Playwright artifacts such as failure screenshots, traces, and videos are retained automatically.
