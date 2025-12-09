/// <reference lib="dom" />

import { describe, test, expect } from "bun:test";
import { render } from "@testing-library/react";
import { TagBadge } from "../components/tag-badge";
import { tagColors, type TagColor } from "../constants/tag-colors";

describe("Tag Colors Configuration", () => {
  test("has predefined color options", () => {
    expect(tagColors.length).toBeGreaterThan(0);
  });

  test("each color has required properties", () => {
    for (const color of tagColors) {
      expect(color.name).toBeDefined();
      expect(color.value).toBeDefined();
      expect(color.className).toBeDefined();
      expect(typeof color.name).toBe("string");
      expect(typeof color.value).toBe("string");
      expect(typeof color.className).toBe("string");
    }
  });

  test("has common colors available", () => {
    const colorNames = tagColors.map(c => c.value);
    expect(colorNames).toContain("blue");
    expect(colorNames).toContain("green");
    expect(colorNames).toContain("red");
  });
});

describe("TagBadge Component", () => {
  test("renders tag with name", () => {
    const { getByText } = render(
      <TagBadge name="Feature" color="blue" />
    );
    expect(getByText("Feature")).toBeInTheDocument();
  });

  test("renders with default color when invalid color provided", () => {
    const { getByText } = render(
      <TagBadge name="Test" color={"invalid" as TagColor} />
    );
    expect(getByText("Test")).toBeInTheDocument();
  });

  test("renders multiple tags correctly", () => {
    const { getByText } = render(
      <div>
        <TagBadge name="Bug" color="red" />
        <TagBadge name="Enhancement" color="green" />
      </div>
    );
    expect(getByText("Bug")).toBeInTheDocument();
    expect(getByText("Enhancement")).toBeInTheDocument();
  });

  test("has correct data attribute for styling", () => {
    const { container } = render(
      <TagBadge name="Test" color="purple" />
    );
    const badge = container.querySelector("[data-tag-color]");
    expect(badge?.getAttribute("data-tag-color")).toBe("purple");
  });
});
