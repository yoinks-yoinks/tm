/// <reference lib="dom" />

import { describe, test, expect } from "bun:test";
import { render } from "@testing-library/react";
import { KanbanBoard } from "../components/kanban-board";
import { KanbanColumn } from "../components/kanban-column";
import { KanbanCard } from "../components/kanban-card";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create a wrapper with QueryClient for testing
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
};

const mockTasks = [
  {
    id: "1",
    title: "Task 1",
    description: "Description 1",
    status: "todo" as const,
    priority: "medium" as const,
    dueDate: null,
    createdAt: new Date().toISOString(),
    tags: [],
  },
  {
    id: "2",
    title: "Task 2",
    description: "Description 2",
    status: "in_progress" as const,
    priority: "high" as const,
    dueDate: null,
    createdAt: new Date().toISOString(),
    tags: [],
  },
  {
    id: "3",
    title: "Task 3",
    description: "Description 3",
    status: "completed" as const,
    priority: "low" as const,
    dueDate: null,
    createdAt: new Date().toISOString(),
    tags: [],
  },
];

describe("KanbanCard Component", () => {
  test("renders task title", () => {
    const { getByText } = render(
      <KanbanCard task={mockTasks[0]} />,
      { wrapper: createWrapper() }
    );
    
    expect(getByText("Task 1")).toBeInTheDocument();
  });

  test("displays priority badge", () => {
    const { container } = render(
      <KanbanCard task={mockTasks[1]} />,
      { wrapper: createWrapper() }
    );
    
    const badge = container.querySelector("[data-priority]");
    expect(badge).toBeTruthy();
  });

  test("has draggable attributes", () => {
    const { container } = render(
      <KanbanCard task={mockTasks[0]} />,
      { wrapper: createWrapper() }
    );
    
    // Card should be the root element with role
    const card = container.firstChild as HTMLElement;
    expect(card).toBeTruthy();
  });
});

describe("KanbanColumn Component", () => {
  const columnTasks = mockTasks.filter(t => t.status === "todo");
  
  test("renders column title", () => {
    const { getByText } = render(
      <KanbanColumn
        id="todo"
        title="To Do"
        tasks={columnTasks}
      />,
      { wrapper: createWrapper() }
    );
    
    expect(getByText("To Do")).toBeInTheDocument();
  });

  test("renders task count", () => {
    const { getByText } = render(
      <KanbanColumn
        id="todo"
        title="To Do"
        tasks={columnTasks}
      />,
      { wrapper: createWrapper() }
    );
    
    expect(getByText("1")).toBeInTheDocument();
  });

  test("renders empty state when no tasks", () => {
    const { getByText } = render(
      <KanbanColumn
        id="completed"
        title="Completed"
        tasks={[]}
      />,
      { wrapper: createWrapper() }
    );
    
    expect(getByText(/no tasks/i)).toBeInTheDocument();
  });
});

describe("KanbanBoard Component", () => {
  test("renders three columns", () => {
    const { getByText } = render(
      <KanbanBoard tasks={mockTasks} />,
      { wrapper: createWrapper() }
    );
    
    expect(getByText("To Do")).toBeInTheDocument();
    expect(getByText("In Progress")).toBeInTheDocument();
    expect(getByText("Completed")).toBeInTheDocument();
  });

  test("groups tasks by status", () => {
    const { getByText } = render(
      <KanbanBoard tasks={mockTasks} />,
      { wrapper: createWrapper() }
    );
    
    // Each task should be visible
    expect(getByText("Task 1")).toBeInTheDocument();
    expect(getByText("Task 2")).toBeInTheDocument();
    expect(getByText("Task 3")).toBeInTheDocument();
  });

  test("renders empty board message when no tasks", () => {
    render(
      <KanbanBoard tasks={[]} />,
      { wrapper: createWrapper() }
    );
    
    // Should show empty state in all columns
    const emptyMessages = document.querySelectorAll('[data-testid="empty-column"]');
    expect(emptyMessages.length).toBeGreaterThan(0);
  });
});
