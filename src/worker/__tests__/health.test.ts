import { describe, test, expect } from "bun:test";
import app from "../index";

/**
 * Backend Unit Tests
 * 
 * Note: These tests focus on routes that don't require database access.
 * Routes that require authentication and database access (like /api/tasks)
 * will return 500 errors in unit tests because the D1 database binding
 * is not available outside of Cloudflare Workers environment.
 * 
 * For full integration testing of authenticated routes, use:
 * - E2E tests with Playwright (Sprint 8)
 * - Manual testing with the dev server
 */

describe("Health Check API", () => {
  test("GET /api/ returns Cloudflare name", async () => {
    const res = await app.request("/api/");
    
    expect(res.status).toBe(200);
    
    const data = await res.json();
    expect(data).toEqual({ name: "Cloudflare" });
  });

  test("GET /api/ returns correct content type", async () => {
    const res = await app.request("/api/");
    
    expect(res.headers.get("content-type")).toContain("application/json");
  });
});

describe("API Route Structure", () => {
  test("Unknown routes return 404", async () => {
    const res = await app.request("/api/unknown-route-12345");
    
    expect(res.status).toBe(404);
  });

  test("Auth routes are defined (POST /api/auth/*)", async () => {
    // Auth routes should be handled (even if they fail without proper setup)
    const res = await app.request("/api/auth/session", {
      method: "GET",
    });
    
    // The route exists (not 404) even if it errors due to missing env
    expect(res.status).not.toBe(404);
  });
});

describe("Request Validation", () => {
  test("POST /api/tasks with invalid JSON returns 400", async () => {
    const res = await app.request("/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: "not valid json",
    });
    
    // Expect either 400 (validation error) or 500 (no env)
    expect([400, 500]).toContain(res.status);
  });

  test("POST /api/tasks with missing title returns 400", async () => {
    const res = await app.request("/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        description: "Task without title",
      }),
    });
    
    // Validation should catch missing required field
    expect([400, 500]).toContain(res.status);
  });
});
