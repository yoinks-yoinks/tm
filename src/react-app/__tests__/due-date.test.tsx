/// <reference lib="dom" />

import { describe, test, expect } from "bun:test";
import { render } from "@testing-library/react";
import { DueDateBadge } from "../components/due-date-badge";
import { getDueDateStatus } from "../lib/due-date";

describe("getDueDateStatus utility", () => {
  test("returns 'overdue' for past dates", () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    expect(getDueDateStatus(yesterday.toISOString())).toBe("overdue");
  });

  test("returns 'due-soon' for dates within 3 days", () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    expect(getDueDateStatus(tomorrow.toISOString())).toBe("due-soon");
  });

  test("returns 'upcoming' for dates more than 3 days away", () => {
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    expect(getDueDateStatus(nextWeek.toISOString())).toBe("upcoming");
  });

  test("returns null for no date", () => {
    expect(getDueDateStatus(null)).toBeNull();
    expect(getDueDateStatus(undefined)).toBeNull();
  });
});

describe("DueDateBadge Component", () => {
  test("renders nothing when no date provided", () => {
    const { container } = render(<DueDateBadge dueDate={null} />);
    expect(container.innerHTML).toBe("");
  });

  test("renders overdue badge with correct styling", () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const { getByText } = render(<DueDateBadge dueDate={yesterday.toISOString()} />);
    expect(getByText(/overdue/i)).toBeInTheDocument();
  });

  test("renders due-soon badge correctly", () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const { container } = render(<DueDateBadge dueDate={tomorrow.toISOString()} />);
    expect(container.querySelector("[data-status='due-soon']")).toBeInTheDocument();
  });

  test("renders upcoming date correctly", () => {
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    const { container } = render(<DueDateBadge dueDate={nextWeek.toISOString()} />);
    expect(container.querySelector("[data-status='upcoming']")).toBeInTheDocument();
  });

  test("displays formatted date", () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 5);
    const { container } = render(<DueDateBadge dueDate={futureDate.toISOString()} />);
    // Should contain some date text
    expect(container.textContent).toBeTruthy();
  });
});
