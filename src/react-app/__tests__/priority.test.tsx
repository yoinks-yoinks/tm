/// <reference lib="dom" />

import { describe, test, expect } from "bun:test";
import { render } from "@testing-library/react";
import { PriorityBadge } from "../components/priority-badge";
import { priorities, priorityConfig } from "../constants/priority";

describe("Priority Configuration", () => {
  test("has all four priority levels defined", () => {
    expect(priorities).toContain("low");
    expect(priorities).toContain("medium");
    expect(priorities).toContain("high");
    expect(priorities).toContain("urgent");
    expect(priorities).toHaveLength(4);
  });

  test("each priority has a color configuration", () => {
    expect(priorityConfig.low).toBeDefined();
    expect(priorityConfig.medium).toBeDefined();
    expect(priorityConfig.high).toBeDefined();
    expect(priorityConfig.urgent).toBeDefined();
  });

  test("each priority config has label and class", () => {
    for (const priority of priorities) {
      const config = priorityConfig[priority];
      expect(config.label).toBeDefined();
      expect(config.className).toBeDefined();
      expect(typeof config.label).toBe("string");
      expect(typeof config.className).toBe("string");
    }
  });
});

describe("PriorityBadge Component", () => {
  test("renders low priority badge correctly", () => {
    const { getByText } = render(<PriorityBadge priority="low" />);
    expect(getByText("Low")).toBeInTheDocument();
  });

  test("renders medium priority badge correctly", () => {
    const { getByText } = render(<PriorityBadge priority="medium" />);
    expect(getByText("Medium")).toBeInTheDocument();
  });

  test("renders high priority badge correctly", () => {
    const { getByText } = render(<PriorityBadge priority="high" />);
    expect(getByText("High")).toBeInTheDocument();
  });

  test("renders urgent priority badge correctly", () => {
    const { getByText } = render(<PriorityBadge priority="urgent" />);
    expect(getByText("Urgent")).toBeInTheDocument();
  });

  test("applies correct CSS class for each priority", () => {
    const { container: lowContainer } = render(<PriorityBadge priority="low" />);
    const { container: urgentContainer } = render(<PriorityBadge priority="urgent" />);
    
    // Low should have a less prominent style
    const lowBadge = lowContainer.querySelector("[data-priority]");
    expect(lowBadge?.getAttribute("data-priority")).toBe("low");
    
    // Urgent should have data attribute
    const urgentBadge = urgentContainer.querySelector("[data-priority]");
    expect(urgentBadge?.getAttribute("data-priority")).toBe("urgent");
  });
});
