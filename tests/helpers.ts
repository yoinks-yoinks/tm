import { Page, expect } from "@playwright/test";

/**
 * Test user credentials
 * Note: These need to be created in the test database
 */
export const TEST_USER = {
  email: "test@example.com",
  password: "password123",
  name: "Test User",
};

/**
 * Login as test user
 */
export async function login(page: Page) {
  await page.goto("/login");
  await page.waitForLoadState("networkidle");

  await page.fill('input[type="email"]', TEST_USER.email);
  await page.fill('input[type="password"]', TEST_USER.password);
  await page.click('button[type="submit"]');

  // Wait for redirect to dashboard
  await expect(page).toHaveURL(/dashboard/, { timeout: 10000 });
}

/**
 * Create a task via the UI
 */
export async function createTask(
  page: Page,
  task: { title: string; description?: string; priority?: string }
) {
  // Click the "Create Task" button to open the dialog
  await page.click('button:has-text("Create Task")');

  // Fill in the form
  await page.fill('input[name="title"]', task.title);
  if (task.description) {
    await page.fill('textarea[name="description"]', task.description);
  }
  if (task.priority) {
    await page.click('[data-testid="priority-select"]');
    await page.click(`[data-value="${task.priority}"]`);
  }

  // Submit
  await page.click('button[type="submit"]:has-text("Create")');

  // Wait for toast or task to appear
  await page.waitForTimeout(500);
}

/**
 * Sign up a new user
 */
export async function signUp(
  page: Page,
  user: { name: string; email: string; password: string }
) {
  await page.goto("/sign-up");
  await page.waitForLoadState("networkidle");

  await page.fill('input[name="name"]', user.name);
  await page.fill('input[type="email"]', user.email);
  await page.fill('input[type="password"]', user.password);
  await page.click('button[type="submit"]');
}

/**
 * Generate a unique email for testing
 */
export function generateTestEmail() {
  const timestamp = Date.now();
  return `test-${timestamp}@example.com`;
}

/**
 * Wait for API to be ready
 */
export async function waitForApi(page: Page) {
  await page.goto("/");
  await page.waitForLoadState("networkidle");
}
