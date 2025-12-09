import { describe, test, expect } from "bun:test";
import app from "../index";

/**
 * Backend Unit Tests
 * 
 * Note: These tests focus on routes that don't require database access.
 * Routes that require authentication and database access (like /api/tasks, /api/auth/*)
 * will throw errors in unit tests because the D1 database binding
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

  // Note: Auth routes require D1 database binding which is not available in unit tests.
  // Auth route testing should be done in E2E tests with Playwright (Sprint 8).
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
    
    // Expect 400 (bad request due to invalid JSON)
    expect(res.status).toBe(400);
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
    
    // zValidator returns 400 for validation errors before hitting auth
    expect(res.status).toBe(400);
  });
});
