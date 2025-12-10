"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  IconAlertTriangle,
  IconArrowUp,
  IconMinus,
  IconArrowDown,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { priorities, type Priority, priorityConfig } from "@/constants/priority";

interface PrioritySelectorProps {
  value: Priority;
  onChange: (priority: Priority) => void;
  disabled?: boolean;
  className?: string;
}

const priorityIcons: Record<Priority, React.ElementType> = {
  urgent: IconAlertTriangle,
  high: IconArrowUp,
  medium: IconMinus,
  low: IconArrowDown,
};

const priorityColors: Record<Priority, { bg: string; border: string; text: string; activeBg: string }> = {
  urgent: {
    bg: "bg-red-50 dark:bg-red-950/30",
    border: "border-red-200 dark:border-red-800",
    text: "text-red-600 dark:text-red-400",
    activeBg: "bg-red-100 dark:bg-red-900/50 ring-2 ring-red-500",
  },
  high: {
    bg: "bg-orange-50 dark:bg-orange-950/30",
    border: "border-orange-200 dark:border-orange-800",
    text: "text-orange-600 dark:text-orange-400",
    activeBg: "bg-orange-100 dark:bg-orange-900/50 ring-2 ring-orange-500",
  },
  medium: {
    bg: "bg-blue-50 dark:bg-blue-950/30",
    border: "border-blue-200 dark:border-blue-800",
    text: "text-blue-600 dark:text-blue-400",
    activeBg: "bg-blue-100 dark:bg-blue-900/50 ring-2 ring-blue-500",
  },
  low: {
    bg: "bg-slate-50 dark:bg-slate-950/30",
    border: "border-slate-200 dark:border-slate-800",
    text: "text-slate-600 dark:text-slate-400",
    activeBg: "bg-slate-100 dark:bg-slate-900/50 ring-2 ring-slate-500",
  },
};

export function PrioritySelector({
  value,
  onChange,
  disabled = false,
  className,
}: PrioritySelectorProps) {
  return (
    <div className={cn("grid grid-cols-4 gap-2", className)}>
      {priorities.map((priority) => {
        const Icon = priorityIcons[priority];
        const colors = priorityColors[priority];
        const config = priorityConfig[priority];
        const isActive = value === priority;

        return (
          <motion.button
            key={priority}
            type="button"
            disabled={disabled}
            onClick={() => onChange(priority)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              "relative flex flex-col items-center justify-center gap-1.5 rounded-lg border p-3 transition-all duration-200",
              colors.bg,
              colors.border,
              isActive ? colors.activeBg : "hover:border-muted-foreground/30",
              disabled && "opacity-50 cursor-not-allowed"
            )}
          >
            <motion.div
              initial={false}
              animate={{
                scale: isActive ? 1.1 : 1,
                y: isActive ? -2 : 0,
              }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              <Icon className={cn("h-5 w-5", colors.text)} />
            </motion.div>
            <span className={cn(
              "text-xs font-medium",
              isActive ? colors.text : "text-muted-foreground"
            )}>
              {config.label}
            </span>
            {isActive && (
              <motion.div
                layoutId="priority-indicator"
                className="absolute -bottom-1 left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-current"
                style={{ color: colors.text }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
          </motion.button>
        );
      })}
    </div>
  );
}

// Compact version for inline use
export function PrioritySelectorCompact({
  value,
  onChange,
  disabled = false,
  className,
}: PrioritySelectorProps) {
  return (
    <div className={cn("flex gap-1", className)}>
      {priorities.map((priority) => {
        const Icon = priorityIcons[priority];
        const colors = priorityColors[priority];
        const config = priorityConfig[priority];
        const isActive = value === priority;

        return (
          <motion.button
            key={priority}
            type="button"
            disabled={disabled}
            onClick={() => onChange(priority)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title={config.label}
            className={cn(
              "flex items-center justify-center rounded-md p-2 transition-all duration-200",
              isActive 
                ? cn(colors.bg, "border", colors.border, colors.text)
                : "text-muted-foreground hover:bg-muted",
              disabled && "opacity-50 cursor-not-allowed"
            )}
          >
            <Icon className="h-4 w-4" />
          </motion.button>
        );
      })}
    </div>
  );
}
