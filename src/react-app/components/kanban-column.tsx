import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { motion, AnimatePresence, type Easing } from "framer-motion";
import { KanbanCard } from "./kanban-card";
import type { Task } from "@/hooks/use-tasks-query";
import { cn } from "@/lib/utils";
import { IconClipboardList, IconProgress, IconCircleCheck } from "@tabler/icons-react";

interface KanbanColumnProps {
  id: string;
  title: string;
  tasks: Task[];
  className?: string;
  index: number;
}

const columnConfigs = {
  todo: {
    icon: IconClipboardList,
    gradient: "from-orange-500 to-amber-500",
    bgGradient: "from-orange-500/5 to-amber-500/5",
    borderColor: "border-orange-500/20",
    iconBg: "bg-orange-500/10 text-orange-500",
  },
  in_progress: {
    icon: IconProgress,
    gradient: "from-blue-500 to-cyan-500",
    bgGradient: "from-blue-500/5 to-cyan-500/5",
    borderColor: "border-blue-500/20",
    iconBg: "bg-blue-500/10 text-blue-500",
  },
  completed: {
    icon: IconCircleCheck,
    gradient: "from-green-500 to-emerald-500",
    bgGradient: "from-green-500/5 to-emerald-500/5",
    borderColor: "border-green-500/20",
    iconBg: "bg-green-500/10 text-green-500",
  },
};

const columnVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.4,
      ease: "easeOut" as Easing,
    },
  }),
};

export function KanbanColumn({ id, title, tasks, className, index }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id });
  const config = columnConfigs[id as keyof typeof columnConfigs] || columnConfigs.todo;
  const Icon = config.icon;

  return (
    <motion.div
      custom={index}
      variants={columnVariants}
      initial="hidden"
      animate="visible"
      className={cn(
        "flex flex-col rounded-xl min-h-[400px] sm:min-h-[500px] w-[280px] sm:w-80 shrink-0 overflow-hidden border",
        config.borderColor,
        className
      )}
    >
      {/* Column Header */}
      <motion.div 
        className={`bg-linear-to-r ${config.bgGradient} p-4 border-b ${config.borderColor}`}
        whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className={`p-1.5 rounded-lg ${config.iconBg}`}
            >
              <Icon className="size-4" />
            </motion.div>
            <h3 className="font-semibold text-sm">{title}</h3>
          </div>
          <motion.span 
            className={`text-xs font-medium bg-linear-to-r ${config.gradient} bg-clip-text text-transparent px-2 py-1 rounded-full bg-background border ${config.borderColor}`}
            whileHover={{ scale: 1.05 }}
          >
            {tasks.length}
          </motion.span>
        </div>
      </motion.div>

      {/* Column Body */}
      <motion.div
        ref={setNodeRef}
        className={cn(
          "flex-1 p-3 space-y-3 overflow-y-auto transition-all duration-300 bg-muted/30",
          isOver && `bg-linear-to-b ${config.bgGradient} ring-2 ring-inset ring-primary/20`
        )}
        animate={{
          scale: isOver ? 1.01 : 1,
        }}
        transition={{ duration: 0.2 }}
      >
        <SortableContext
          items={tasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          <AnimatePresence mode="popLayout">
            {tasks.length > 0 ? (
              tasks.map((task) => <KanbanCard key={task.id} task={task} />)
            ) : (
              <motion.div
                data-testid="empty-column"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center h-32 text-muted-foreground text-sm gap-2"
              >
                <motion.div
                  animate={{ 
                    y: [0, -5, 0],
                    opacity: [0.5, 0.8, 0.5],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className={`p-3 rounded-xl ${config.iconBg} opacity-50`}
                >
                  <Icon className="size-6" />
                </motion.div>
                <span>Drop tasks here</span>
              </motion.div>
            )}
          </AnimatePresence>
        </SortableContext>
      </motion.div>
    </motion.div>
  );
}
