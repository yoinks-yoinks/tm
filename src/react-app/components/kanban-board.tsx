import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core";
import { useState } from "react";
import { KanbanColumn } from "./kanban-column";
import { KanbanCard } from "./kanban-card";
import type { Task } from "@/hooks/use-tasks-query";
import { useUpdateTaskMutation } from "@/hooks/use-update-task-mutation";
import { toast } from "sonner";

interface KanbanBoardProps {
  tasks: Task[];
}

type TaskStatus = "todo" | "in_progress" | "completed";

const columns: { id: TaskStatus; title: string }[] = [
  { id: "todo", title: "To Do" },
  { id: "in_progress", title: "In Progress" },
  { id: "completed", title: "Completed" },
];

export function KanbanBoard({ tasks }: KanbanBoardProps) {
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const updateMutation = useUpdateTaskMutation();

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 5,
      },
    })
  );

  const getTasksByStatus = (status: TaskStatus) =>
    tasks.filter((task) => task.status === status);

  const findColumn = (id: string): TaskStatus | null => {
    // Check if the id is a column id
    const column = columns.find((col) => col.id === id);
    if (column) return column.id;

    // Find the task and return its status
    const task = tasks.find((t) => t.id === id);
    return task?.status as TaskStatus || null;
  };

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find((t) => t.id === event.active.id);
    if (task) {
      setActiveTask(task);
    }
  };

  const handleDragOver = (_event: DragOverEvent) => {
    // Can be used for visual feedback during drag
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Find the target column
    const overColumn = findColumn(overId);
    if (!overColumn) return;

    const activeTask = tasks.find((t) => t.id === activeId);
    if (!activeTask) return;

    // If dropped in a different status column, update the task
    if (activeTask.status !== overColumn) {
      const previousStatus = activeTask.status;
      toast.promise(
        updateMutation.mutateAsync({
          id: activeId,
          status: overColumn,
        }),
        {
          loading: "Moving task...",
          success: () => {
            // Fire confetti when task is moved to completed
            if (overColumn === "completed" && previousStatus !== "completed") {
              import("@/lib/confetti").then(({ fireTaskCompletedConfetti }) => {
                fireTaskCompletedConfetti();
              });
            }
            return "Task moved successfully";
          },
          error: "Failed to move task",
        }
      );
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 snap-x snap-mandatory">
        {columns.map((column, index) => (
          <div key={column.id} className="snap-start">
            <KanbanColumn
              id={column.id}
              title={column.title}
              tasks={getTasksByStatus(column.id)}
              index={index}
            />
          </div>
        ))}
      </div>
      <DragOverlay>
        {activeTask ? (
          <div className="rotate-3 scale-105">
            <KanbanCard task={activeTask} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
