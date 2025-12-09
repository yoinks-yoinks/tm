/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

import { afterEach } from "bun:test";
import { cleanup } from "@testing-library/react";
import { GlobalRegistrator } from "@happy-dom/global-registrator";
import "@testing-library/jest-dom";

// Register happy-dom globally BEFORE tests load
// This must happen at module load time, not in beforeAll
GlobalRegistrator.register();

// Clean up after each test
afterEach(() => {
  cleanup();
  document.body.innerHTML = "";
});

// Extend matchers for jest-dom
declare module "bun:test" {
  interface Matchers<T> {
    toBeInTheDocument(): T;
    toHaveTextContent(text: string | RegExp): T;
    toBeVisible(): T;
    toBeDisabled(): T;
    toBeEnabled(): T;
    toHaveAttribute(attr: string, value?: string): T;
    toHaveClass(...classNames: string[]): T;
    toHaveValue(value: string | number | string[]): T;
    toBeChecked(): T;
    toHaveFocus(): T;
    toBeRequired(): T;
    toBeValid(): T;
    toBeInvalid(): T;
    toContainElement(element: HTMLElement | null): T;
    toContainHTML(htmlText: string): T;
    toHaveAccessibleDescription(description?: string | RegExp): T;
    toHaveAccessibleName(name?: string | RegExp): T;
    toHaveStyle(css: string | Record<string, unknown>): T;
  }
}
