import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PriorityBadge } from "./priority-badge";
import { DueDateBadge } from "./due-date-badge";
import { TagBadge } from "./tag-badge";
import type { Task } from "@/hooks/use-tasks-query";
import { IconGripVertical } from "@tabler/icons-react";

interface KanbanCardProps {
  task: Task;
}

const statusColors = {
  todo: "border-l-orange-500",
  in_progress: "border-l-blue-500",
  completed: "border-l-green-500",
};

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
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isDragging ? 0.5 : 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: isDragging ? 1 : 1.02, y: isDragging ? 0 : -2 }}
      transition={{ duration: 0.2 }}
      layout
    >
      <Card
        className={`cursor-grab active:cursor-grabbing border-l-4 ${statusColors[task.status]} ${
          isDragging 
            ? "shadow-xl ring-2 ring-primary/50 bg-card/90" 
            : "hover:shadow-lg hover:border-l-4"
        } transition-all duration-200 overflow-hidden group`}
      >
        {/* Hover gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        
        <CardHeader className="p-3 pb-0 relative z-10">
          <div className="flex items-start gap-2">
            <motion.button
              {...attributes}
              {...listeners}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="mt-0.5 cursor-grab text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Drag handle"
            >
              <IconGripVertical className="h-4 w-4" />
            </motion.button>
            <CardTitle className="text-sm font-medium flex-1 line-clamp-2">
              {task.title}
            </CardTitle>
          </div>
        </CardHeader>
        
        <CardContent className="p-3 pt-2 space-y-2 relative z-10">
          {task.description && (
            <motion.p 
              className="text-xs text-muted-foreground line-clamp-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              {task.description}
            </motion.p>
          )}
          
          <div className="flex flex-wrap items-center gap-1.5">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <PriorityBadge priority={task.priority} />
            </motion.div>
            {task.dueDate && (
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <DueDateBadge dueDate={task.dueDate} compact />
              </motion.div>
            )}
          </div>
          
          {task.tags && task.tags.length > 0 && (
            <motion.div 
              className="flex flex-wrap gap-1"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              {task.tags.slice(0, 3).map((tag, index) => (
                <motion.div
                  key={tag.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ scale: 1.1 }}
                >
                  <TagBadge name={tag.name} color={tag.color} />
                </motion.div>
              ))}
              {task.tags.length > 3 && (
                <motion.span 
                  className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full"
                  whileHover={{ scale: 1.05 }}
                >
                  +{task.tags.length - 3}
                </motion.span>
              )}
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
