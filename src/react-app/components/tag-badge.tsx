import { Badge } from "@/components/ui/badge";
import { getTagColorClass, type TagColor } from "@/constants/tag-colors";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface TagBadgeProps {
  name: string;
  color: TagColor;
  className?: string;
  onRemove?: () => void;
}

export function TagBadge({ name, color, className, onRemove }: TagBadgeProps) {
  const colorClass = getTagColorClass(color);
  
  return (
    <Badge
      variant="secondary"
      className={cn("gap-1", colorClass, className)}
      data-tag-color={color}
    >
      {name}
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
          aria-label={`Remove ${name} tag`}
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </Badge>
  );
}
