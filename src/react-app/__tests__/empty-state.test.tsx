/// <reference lib="dom" />

import { describe, test, expect } from "bun:test";
import { render } from "@testing-library/react";
import { EmptyState } from "../components/empty-state";
import { ClipboardList } from "lucide-react";

describe("EmptyState Component", () => {
  test("renders title", () => {
    const { getByText } = render(<EmptyState title="No tasks yet" />);
    
    expect(getByText("No tasks yet")).toBeInTheDocument();
  });

  test("renders description when provided", () => {
    const { getByText } = render(
      <EmptyState
        title="No tasks"
        description="Create your first task to get started"
      />
    );
    
    expect(getByText("Create your first task to get started")).toBeInTheDocument();
  });

  test("renders icon when provided", () => {
    const { container } = render(
      <EmptyState
        icon={ClipboardList}
        title="No tasks"
      />
    );
    
    // Icon should be rendered inside a rounded div
    const iconWrapper = container.querySelector(".rounded-full");
    expect(iconWrapper).toBeTruthy();
  });

  test("renders action button when provided", () => {
    const handleClick = () => {};
    const { getByRole } = render(
      <EmptyState
        title="No tasks"
        action={{
          label: "Create Task",
          onClick: handleClick,
        }}
      />
    );
    
    expect(getByRole("button", { name: "Create Task" })).toBeInTheDocument();
  });

  test("does not render action button when not provided", () => {
    const { queryByRole } = render(<EmptyState title="No tasks" />);
    
    expect(queryByRole("button")).toBeNull();
  });
});
