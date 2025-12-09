# E2E Tests Directory

This folder contains Playwright E2E tests for the Task Manager application.

## Test Files

- `auth.spec.ts` - Authentication flows (login, signup, password reset)
- `dashboard.spec.ts` - Dashboard functionality (views, navigation)
- `profile.spec.ts` - Profile page (update name, change password)
- `dark-mode.spec.ts` - Theme switching functionality

## Running Tests

```bash
# Run all E2E tests
bun run test:e2e

# Run tests in headed mode (see browser)
npx playwright test --headed

# Run a specific test file
npx playwright test tests/auth.spec.ts

# Run tests with debug
npx playwright test --debug
```

## Test Setup

Tests use a local development server that starts automatically before tests run.

Each test suite creates its own test user to ensure isolation.

## Helpers

See `helpers.ts` for utility functions:

- `generateTestEmail()` - Generate unique test emails
- `login()` - Login helper
- `signUp()` - Sign up helper
