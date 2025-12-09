import { test, expect } from "@playwright/test";

test.describe("Dark Mode", () => {
  test("should toggle between light and dark mode on login page", async ({ page }) => {
    await page.goto("/login");
    
    // Find the theme toggle button
    const themeToggle = page.locator('button[aria-label*="theme"], button:has([class*="sun"]), button:has([class*="moon"])').first();
    
    // Get initial state
    const html = page.locator("html");
    
    // Click theme toggle
    await themeToggle.click();
    
    // Wait for dropdown menu
    await page.waitForTimeout(200);
    
    // Select dark mode
    await page.click('text=Dark');
    
    // Wait for theme change
    await page.waitForTimeout(300);
    
    // Verify dark class is added
    await expect(html).toHaveClass(/dark/);
  });

  test("should persist theme preference", async ({ page }) => {
    await page.goto("/login");
    
    // Set theme to dark via UI
    const themeToggle = page.locator('button[aria-label*="theme"], button:has([class*="sun"]), button:has([class*="moon"])').first();
    await themeToggle.click();
    await page.waitForTimeout(200);
    await page.click('text=Dark');
    await page.waitForTimeout(300);
    
    // Reload page
    await page.reload();
    await page.waitForLoadState("networkidle");
    
    // Theme should persist
    const html = page.locator("html");
    await expect(html).toHaveClass(/dark/);
  });

  test("should have system theme option", async ({ page }) => {
    await page.goto("/login");
    
    // Find and click theme toggle
    const themeToggle = page.locator('button[aria-label*="theme"], button:has([class*="sun"]), button:has([class*="moon"])').first();
    await themeToggle.click();
    
    // Wait for dropdown
    await page.waitForTimeout(200);
    
    // Should see all three options
    await expect(page.getByText("Light")).toBeVisible();
    await expect(page.getByText("Dark")).toBeVisible();
    await expect(page.getByText("System")).toBeVisible();
  });
});
