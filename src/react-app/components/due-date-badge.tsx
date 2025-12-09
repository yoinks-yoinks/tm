import { Badge } from "@/components/ui/badge";
import { getDueDateStatus, formatDueDate, type DueDateStatus } from "@/lib/due-date";
import { cn } from "@/lib/utils";
import { CalendarDays, AlertTriangle, Clock } from "lucide-react";

const statusConfig: Record<DueDateStatus, { className: string; icon: React.ComponentType<{ className?: string }> }> = {
  overdue: {
    className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    icon: AlertTriangle,
  },
  "due-soon": {
    className: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    icon: Clock,
  },
  upcoming: {
    className: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
    icon: CalendarDays,
  },
};

interface DueDateBadgeProps {
  dueDate: string | null | undefined;
  className?: string;
  showIcon?: boolean;
}

export function DueDateBadge({ dueDate, className, showIcon = true }: DueDateBadgeProps) {
  const status = getDueDateStatus(dueDate);
  
  if (!status || !dueDate) return null;
  
  const config = statusConfig[status];
  const Icon = config.icon;
  
  return (
    <Badge
      variant="secondary"
      className={cn("gap-1", config.className, className)}
      data-status={status}
    >
      {showIcon && <Icon className="h-3 w-3" />}
      {formatDueDate(dueDate)}
    </Badge>
  );
}
