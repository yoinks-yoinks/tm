import { Badge } from "@/components/ui/badge";
import { type TagColor } from "@/constants/tag-colors";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface TagBadgeProps {
  name: string;
  color: TagColor;
  className?: string;
  onRemove?: () => void;
}

// Enhanced color classes with better gradients
const tagColorClasses: Record<TagColor, string> = {
  gray: "bg-linear-to-r from-gray-100 to-slate-100 text-gray-700 dark:from-gray-800 dark:to-slate-800 dark:text-gray-300 border-gray-200 dark:border-gray-700",
  red: "bg-linear-to-r from-red-100 to-rose-100 text-red-700 dark:from-red-900/40 dark:to-rose-900/40 dark:text-red-400 border-red-200 dark:border-red-800",
  orange: "bg-linear-to-r from-orange-100 to-amber-100 text-orange-700 dark:from-orange-900/40 dark:to-amber-900/40 dark:text-orange-400 border-orange-200 dark:border-orange-800",
  yellow: "bg-linear-to-r from-yellow-100 to-amber-100 text-yellow-700 dark:from-yellow-900/40 dark:to-amber-900/40 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800",
  green: "bg-linear-to-r from-green-100 to-emerald-100 text-green-700 dark:from-green-900/40 dark:to-emerald-900/40 dark:text-green-400 border-green-200 dark:border-green-800",
  teal: "bg-linear-to-r from-teal-100 to-cyan-100 text-teal-700 dark:from-teal-900/40 dark:to-cyan-900/40 dark:text-teal-400 border-teal-200 dark:border-teal-800",
  blue: "bg-linear-to-r from-blue-100 to-sky-100 text-blue-700 dark:from-blue-900/40 dark:to-sky-900/40 dark:text-blue-400 border-blue-200 dark:border-blue-800",
  indigo: "bg-linear-to-r from-indigo-100 to-violet-100 text-indigo-700 dark:from-indigo-900/40 dark:to-violet-900/40 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800",
  purple: "bg-linear-to-r from-purple-100 to-fuchsia-100 text-purple-700 dark:from-purple-900/40 dark:to-fuchsia-900/40 dark:text-purple-400 border-purple-200 dark:border-purple-800",
  pink: "bg-linear-to-r from-pink-100 to-rose-100 text-pink-700 dark:from-pink-900/40 dark:to-rose-900/40 dark:text-pink-400 border-pink-200 dark:border-pink-800",
};

function getTagColorClass(color: TagColor): string {
  return tagColorClasses[color] || tagColorClasses.gray;
}

export function TagBadge({ name, color, className, onRemove }: TagBadgeProps) {
  const colorClass = getTagColorClass(color);
  
  return (
    <Badge
      variant="outline"
      className={cn(
        "gap-1 font-medium text-xs px-2 py-0.5 border transition-all duration-200 hover:shadow-sm",
        colorClass,
        className
      )}
      data-tag-color={color}
    >
      <span className="relative">
        {/* Color dot indicator */}
        <span 
          className={cn(
            "inline-block w-1.5 h-1.5 rounded-full mr-1 opacity-80",
            {
              "bg-gray-500": color === "gray",
              "bg-red-500": color === "red",
              "bg-orange-500": color === "orange",
              "bg-yellow-500": color === "yellow",
              "bg-green-500": color === "green",
              "bg-teal-500": color === "teal",
              "bg-blue-500": color === "blue",
              "bg-indigo-500": color === "indigo",
              "bg-purple-500": color === "purple",
              "bg-pink-500": color === "pink",
            }
          )}
        />
        {name}
      </span>
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2 hover:bg-background/50 p-0.5 transition-colors"
          aria-label={`Remove ${name} tag`}
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </Badge>
  );
}
