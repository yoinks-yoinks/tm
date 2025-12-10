/// <reference lib="dom" />

import { describe, test, expect } from "bun:test";
import { render } from "@testing-library/react";
import { EmptyState } from "../components/empty-state";

describe("EmptyState Component", () => {
  test("renders default title for no-tasks variant", () => {
    const { getByText } = render(<EmptyState variant="no-tasks" />);
    
    expect(getByText("No tasks yet")).toBeInTheDocument();
  });

  test("renders custom title when provided", () => {
    const { getByText } = render(<EmptyState title="Custom Title" />);
    
    expect(getByText("Custom Title")).toBeInTheDocument();
  });

  test("renders custom description when provided", () => {
    const { getByText } = render(
      <EmptyState
        title="No tasks"
        description="Create your first task to get started"
      />
    );
    
    expect(getByText("Create your first task to get started")).toBeInTheDocument();
  });

  test("renders different variants with correct defaults", () => {
    const { getByText: getByTextNoResults } = render(<EmptyState variant="no-results" />);
    expect(getByTextNoResults("No results found")).toBeInTheDocument();

    const { getByText: getByTextFiltered } = render(<EmptyState variant="filtered-empty" />);
    expect(getByTextFiltered("No matching tasks")).toBeInTheDocument();

    const { getByText: getByTextError } = render(<EmptyState variant="error" />);
    expect(getByTextError("Something went wrong")).toBeInTheDocument();
  });

  test("renders action button when onAction is provided", () => {
    const handleClick = () => {};
    const { getByRole } = render(
      <EmptyState
        variant="no-tasks"
        onAction={handleClick}
      />
    );
    
    expect(getByRole("button", { name: /Create Task/i })).toBeInTheDocument();
  });

  test("renders custom action label", () => {
    const handleClick = () => {};
    const { getByRole } = render(
      <EmptyState
        actionLabel="Custom Action"
        onAction={handleClick}
      />
    );
    
    expect(getByRole("button", { name: /Custom Action/i })).toBeInTheDocument();
  });

  test("does not render action button when onAction is not provided", () => {
    const { queryByRole } = render(<EmptyState title="No tasks" />);
    
    expect(queryByRole("button")).toBeNull();
  });
});
