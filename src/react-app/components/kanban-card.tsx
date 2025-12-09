import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PriorityBadge } from "./priority-badge";
import { DueDateBadge } from "./due-date-badge";
import { TagBadge } from "./tag-badge";
import type { Task } from "@/hooks/use-tasks-query";
import { IconGripVertical } from "@tabler/icons-react";

interface KanbanCardProps {
  task: Task;
}

export function KanbanCard({ task }: KanbanCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`cursor-grab active:cursor-grabbing ${isDragging ? "shadow-lg ring-2 ring-primary" : ""}`}
    >
      <CardHeader className="p-3 pb-0">
        <div className="flex items-start gap-2">
          <button
            {...attributes}
            {...listeners}
            className="mt-0.5 cursor-grab text-muted-foreground hover:text-foreground"
            aria-label="Drag handle"
          >
            <IconGripVertical className="h-4 w-4" />
          </button>
          <CardTitle className="text-sm font-medium flex-1 line-clamp-2">
            {task.title}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-3 pt-2 space-y-2">
        {task.description && (
          <p className="text-xs text-muted-foreground line-clamp-2">
            {task.description}
          </p>
        )}
        <div className="flex flex-wrap items-center gap-1.5">
          <PriorityBadge priority={task.priority} />
          <DueDateBadge dueDate={task.dueDate} compact />
        </div>
        {task.tags && task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {task.tags.slice(0, 3).map((tag) => (
              <TagBadge key={tag.id} name={tag.name} color={tag.color} />
            ))}
            {task.tags.length > 3 && (
              <span className="text-xs text-muted-foreground">
                +{task.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
