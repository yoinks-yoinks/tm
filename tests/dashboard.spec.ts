import { test, expect } from "@playwright/test";
import { generateTestEmail } from "./helpers";

test.describe("Dashboard", () => {
  // Create a unique user for this test suite
  const testEmail = `dashboard-test-${Date.now()}@example.com`;
  const testPassword = "TestPassword123!";

  test.beforeAll(async ({ browser }) => {
    // Sign up a test user
    const page = await browser.newPage();
    await page.goto("/sign-up");
    await page.fill('input[name="name"]', "Dashboard Test User");
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
  });

  test("should display dashboard with header", async ({ page }) => {
    await expect(page.getByText(/dashboard/i)).toBeVisible();
  });

  test("should have view mode toggle", async ({ page }) => {
    // Look for Table and Kanban buttons
    await expect(page.getByRole("button", { name: /table/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /kanban/i })).toBeVisible();
  });

  test("should switch between table and kanban views", async ({ page }) => {
    // Start in table view
    await page.click('button:has-text("Kanban")');
    
    // Should see kanban columns
    await expect(page.getByText("To Do")).toBeVisible();
    await expect(page.getByText("In Progress")).toBeVisible();
    await expect(page.getByText("Completed")).toBeVisible();
    
    // Switch back to table
    await page.click('button:has-text("Table")');
  });

  test("should display theme toggle", async ({ page }) => {
    // Look for theme toggle button
    const themeButton = page.locator('[aria-label*="theme"], [aria-label*="Toggle"], button:has([class*="sun"]), button:has([class*="moon"])');
    await expect(themeButton.first()).toBeVisible();
  });

  test("should navigate to profile page", async ({ page }) => {
    // Open user menu
    await page.click('[data-sidebar="menu-button"]');
    
    // Wait for dropdown to open
    await page.waitForTimeout(200);
    
    // Click Account option
    await page.click('text=Account');
    
    // Should navigate to profile
    await expect(page).toHaveURL(/profile/, { timeout: 5000 });
    await expect(page.getByText(/profile settings/i)).toBeVisible();
  });

  test("should display page title correctly", async ({ page }) => {
    await expect(page).toHaveTitle(/dashboard.*task manager/i);
  });
});
