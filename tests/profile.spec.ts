import { test, expect } from "@playwright/test";

test.describe("Profile Page", () => {
  // Create a unique user for this test suite
  const testEmail = `profile-test-${Date.now()}@example.com`;
  const testPassword = "TestPassword123!";
  const testName = "Profile Test User";

  test.beforeAll(async ({ browser }) => {
    // Sign up a test user
    const page = await browser.newPage();
    await page.goto("/sign-up");
    await page.fill('input[name="name"]', testName);
    await page.fill('input[type="email"]', testEmail);
    await page.fill('input[type="password"]', testPassword);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/dashboard/, { timeout: 10000 });
    await page.close();
  });

  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto("/login");
    await page.fill('input[type="email"]', testEmail);
    await page.fill('input[type="password"]', testPassword);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/dashboard/, { timeout: 10000 });
    
    // Navigate to profile
    await page.goto("/profile");
    await page.waitForLoadState("networkidle");
  });

  test("should display profile page", async ({ page }) => {
    await expect(page.getByText(/profile settings/i)).toBeVisible();
  });

  test("should display user email", async ({ page }) => {
    await expect(page.getByText(testEmail)).toBeVisible();
  });

  test("should display name input with current value", async ({ page }) => {
    const nameInput = page.getByLabel(/name/i);
    await expect(nameInput).toBeVisible();
    await expect(nameInput).toHaveValue(testName);
  });

  test("should display profile information card", async ({ page }) => {
    await expect(page.getByText(/profile information/i)).toBeVisible();
  });

  test("should display change password card", async ({ page }) => {
    await expect(page.getByText(/change password/i)).toBeVisible();
  });

  test("should have password fields", async ({ page }) => {
    await expect(page.getByLabel(/current password/i)).toBeVisible();
    await expect(page.getByLabel(/^new password$/i)).toBeVisible();
    await expect(page.getByLabel(/confirm.*password/i)).toBeVisible();
  });

  test("should display page title correctly", async ({ page }) => {
    await expect(page).toHaveTitle(/profile.*task manager/i);
  });
});
