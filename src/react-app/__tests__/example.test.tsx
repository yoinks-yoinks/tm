/// <reference lib="dom" />

import { describe, test, expect } from "bun:test";
import { render } from "@testing-library/react";

// Simple test component
function TestButton({ children }: { children: React.ReactNode }) {
  return <button type="button">{children}</button>;
}

describe("Example Component Tests", () => {
  test("renders a button with text", () => {
    const { getByRole } = render(<TestButton>Click me</TestButton>);
    
    const button = getByRole("button");
    expect(button).toHaveTextContent("Click me");
  });

  test("button is in the document", () => {
    const { getByRole } = render(<TestButton>Test Button</TestButton>);
    
    const button = getByRole("button", { name: /test button/i });
    expect(button).toBeInTheDocument();
  });
});

describe("DOM Manipulation Tests", () => {
  test("can create and query DOM elements", () => {
    document.body.innerHTML = `
      <div id="app">
        <h1>Hello World</h1>
        <p>This is a test paragraph</p>
      </div>
    `;

    const heading = document.querySelector("h1");
    const paragraph = document.querySelector("p");

    expect(heading?.textContent).toBe("Hello World");
    expect(paragraph?.textContent).toBe("This is a test paragraph");
  });
});
