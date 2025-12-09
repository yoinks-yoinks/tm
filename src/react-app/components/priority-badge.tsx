import { Badge } from "@/components/ui/badge";
import { priorityConfig, type Priority } from "@/constants/priority";
import { cn } from "@/lib/utils";

interface PriorityBadgeProps {
  priority: Priority;
  className?: string;
}

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  const config = priorityConfig[priority];
  
  return (
    <Badge
      variant="secondary"
      className={cn(config.className, className)}
      data-priority={priority}
    >
      {config.label}
    </Badge>
  );
}
