import { useState } from "react";
import { motion, AnimatePresence, type Easing } from "framer-motion";
import {
  IconDownload,
  IconFileSpreadsheet,
  IconCheck,
  IconFilter,
  IconList,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { exportTasksToCSV } from "@/lib/export-csv";
import type { Task } from "@/hooks/use-tasks-query";
import { cn } from "@/lib/utils";

interface ExportButtonProps {
  allTasks: Task[];
  filteredTasks: Task[];
  className?: string;
}

const checkVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { type: "spring" as const, stiffness: 400, damping: 15 },
  },
  exit: {
    scale: 0,
    opacity: 0,
    transition: { duration: 0.15, ease: "easeOut" as Easing },
  },
};

export function ExportButton({
  allTasks,
  filteredTasks,
  className,
}: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleExport = async (type: "all" | "filtered") => {
    const tasks = type === "all" ? allTasks : filteredTasks;
    const label = type === "all" ? "all tasks" : "filtered tasks";

    if (tasks.length === 0) {
      toast.error("No tasks to export", {
        description:
          type === "filtered"
            ? "Try clearing your filters or create some tasks first."
            : "Create some tasks first to export them.",
      });
      return;
    }

    setIsExporting(type);

    // Simulate a brief delay for UX
    await new Promise((resolve) => setTimeout(resolve, 500));

    try {
      const filename =
        type === "all"
          ? `all-tasks-${new Date().toISOString().split("T")[0]}`
          : `filtered-tasks-${new Date().toISOString().split("T")[0]}`;

      exportTasksToCSV(tasks, { filename });

      setShowSuccess(true);
      toast.success(`Exported ${tasks.length} ${label}`, {
        description: `Downloaded as ${filename}.csv`,
        icon: <IconFileSpreadsheet className="size-4" />,
      });

      setTimeout(() => setShowSuccess(false), 2000);
    } catch {
      toast.error("Export failed", {
        description: "Something went wrong while exporting. Please try again.",
      });
    } finally {
      setIsExporting(null);
    }
  };

  const isAnyExporting = isExporting !== null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "gap-2 transition-all duration-200",
              showSuccess && "border-green-500/50 text-green-600 dark:text-green-400",
              className
            )}
            disabled={isAnyExporting}
          >
            <AnimatePresence mode="wait">
              {showSuccess ? (
                <motion.div
                  key="success"
                  variants={checkVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <IconCheck className="size-4" />
                </motion.div>
              ) : isAnyExporting ? (
                <motion.div
                  key="loading"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <IconDownload className="size-4" />
                </motion.div>
              ) : (
                <motion.div
                  key="default"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <IconDownload className="size-4" />
                </motion.div>
              )}
            </AnimatePresence>
            {showSuccess ? "Exported!" : isAnyExporting ? "Exporting..." : "Export"}
          </Button>
        </motion.div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex items-center gap-2">
          <IconFileSpreadsheet className="size-4 text-muted-foreground" />
          Export to CSV
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => handleExport("all")}
          disabled={isAnyExporting || allTasks.length === 0}
          className="gap-2 cursor-pointer"
        >
          <IconList className="size-4" />
          <div className="flex flex-col gap-0.5">
            <span>All Tasks</span>
            <span className="text-xs text-muted-foreground">
              {allTasks.length} task{allTasks.length !== 1 ? "s" : ""}
            </span>
          </div>
          {isExporting === "all" && (
            <motion.div
              className="ml-auto"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <IconDownload className="size-4 text-muted-foreground" />
            </motion.div>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleExport("filtered")}
          disabled={isAnyExporting || filteredTasks.length === 0}
          className="gap-2 cursor-pointer"
        >
          <IconFilter className="size-4" />
          <div className="flex flex-col gap-0.5">
            <span>Current View</span>
            <span className="text-xs text-muted-foreground">
              {filteredTasks.length} task{filteredTasks.length !== 1 ? "s" : ""}
              {filteredTasks.length !== allTasks.length && " (filtered)"}
            </span>
          </div>
          {isExporting === "filtered" && (
            <motion.div
              className="ml-auto"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <IconDownload className="size-4 text-muted-foreground" />
            </motion.div>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
