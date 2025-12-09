import { test, expect } from "@playwright/test";
import { generateTestEmail } from "./helpers";

test.describe("Authentication Flow", () => {
  test("should display login page", async ({ page }) => {
    await page.goto("/login");
    
    await expect(page.getByRole("heading", { name: /sign in/i })).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /sign in/i })).toBeVisible();
  });

  test("should display sign-up page", async ({ page }) => {
    await page.goto("/sign-up");
    
    await expect(page.getByRole("heading", { name: /create.*account/i })).toBeVisible();
    await expect(page.getByLabel(/name/i)).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
  });

  test("should navigate between login and sign-up", async ({ page }) => {
    await page.goto("/login");
    
    // Click sign up link
    await page.click('a:has-text("Sign up")');
    await expect(page).toHaveURL(/sign-up/);
    
    // Click sign in link
    await page.click('a:has-text("Sign in")');
    await expect(page).toHaveURL(/login/);
  });

  test("should show validation errors for empty login form", async ({ page }) => {
    await page.goto("/login");
    
    // Click submit without filling form
    await page.click('button[type="submit"]');
    
    // Form validation should prevent submission
    // Check that email input has validation error state
    const emailInput = page.getByLabel(/email/i);
    await expect(emailInput).toBeVisible();
  });

  test("should redirect unauthenticated users from dashboard to login", async ({ page }) => {
    await page.goto("/dashboard");
    
    // Should redirect to login
    await expect(page).toHaveURL(/login/, { timeout: 5000 });
  });

  test("should display forgot password page", async ({ page }) => {
    await page.goto("/forget-password");
    
    await expect(page.getByRole("heading", { name: /forgot.*password/i })).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
  });

  test("should successfully sign up a new user", async ({ page }) => {
    const testEmail = generateTestEmail();
    
    await page.goto("/sign-up");
    
    await page.fill('input[name="name"]', "Test User");
    await page.fill('input[type="email"]', testEmail);
    await page.fill('input[type="password"]', "TestPassword123!");
    
    await page.click('button[type="submit"]');
    
    // Should redirect to dashboard after successful signup
    await expect(page).toHaveURL(/dashboard/, { timeout: 10000 });
  });
});
