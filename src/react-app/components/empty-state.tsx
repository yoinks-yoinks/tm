import { motion, type Easing } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  IconClipboardList,
  IconSearch,
  IconFilter,
  IconPlus,
  IconRefresh,
} from "@tabler/icons-react";

export type EmptyStateVariant = "no-tasks" | "no-results" | "filtered-empty" | "error";

interface EmptyStateProps {
  variant?: EmptyStateVariant;
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

const variantConfig: Record<
  EmptyStateVariant,
  {
    icon: typeof IconClipboardList;
    defaultTitle: string;
    defaultDescription: string;
    defaultActionLabel?: string;
    gradient: string;
    iconBg: string;
  }
> = {
  "no-tasks": {
    icon: IconClipboardList,
    defaultTitle: "No tasks yet",
    defaultDescription: "Get started by creating your first task to stay organized and productive.",
    defaultActionLabel: "Create Task",
    gradient: "from-blue-500 to-cyan-500",
    iconBg: "bg-blue-500/10 text-blue-500",
  },
  "no-results": {
    icon: IconSearch,
    defaultTitle: "No results found",
    defaultDescription: "Try adjusting your search terms or filters to find what you're looking for.",
    gradient: "from-orange-500 to-amber-500",
    iconBg: "bg-orange-500/10 text-orange-500",
  },
  "filtered-empty": {
    icon: IconFilter,
    defaultTitle: "No matching tasks",
    defaultDescription: "No tasks match the selected filters. Try clearing some filters or create a new task.",
    defaultActionLabel: "Clear Filters",
    gradient: "from-purple-500 to-pink-500",
    iconBg: "bg-purple-500/10 text-purple-500",
  },
  error: {
    icon: IconRefresh,
    defaultTitle: "Something went wrong",
    defaultDescription: "We couldn't load your tasks. Please try again.",
    defaultActionLabel: "Try Again",
    gradient: "from-red-500 to-rose-500",
    iconBg: "bg-red-500/10 text-red-500",
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" as Easing },
  },
};

const floatingVariants = {
  animate: {
    y: [0, -8, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut" as Easing,
    },
  },
};

const pulseRingVariants = {
  animate: {
    scale: [1, 1.5, 2],
    opacity: [0.4, 0.2, 0],
    transition: {
      duration: 2.5,
      repeat: Infinity,
      ease: "easeOut" as Easing,
    },
  },
};

export function EmptyState({
  variant = "no-tasks",
  title,
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  const config = variantConfig[variant];
  const Icon = config.icon;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={cn(
        "relative flex flex-col items-center justify-center py-16 px-4",
        className
      )}
    >
      {/* Animated Icon with Pulse Ring */}
      <motion.div variants={itemVariants} className="relative mb-6">
        {/* Pulse Ring */}
        <motion.div
          variants={pulseRingVariants}
          animate="animate"
          className={cn(
            "absolute inset-0 rounded-full bg-linear-to-r",
            config.gradient
          )}
          style={{ opacity: 0.2 }}
        />
        
        {/* Floating Icon Container */}
        <motion.div
          variants={floatingVariants}
          animate="animate"
          className={cn(
            "relative p-6 rounded-2xl shadow-lg",
            config.iconBg,
            "border border-current/10"
          )}
        >
          <Icon className="size-12" strokeWidth={1.5} />
          
          {/* Decorative dots */}
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            className={cn(
              "absolute -top-1 -right-1 size-3 rounded-full bg-linear-to-r",
              config.gradient
            )}
          />
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, delay: 1 }}
            className={cn(
              "absolute -bottom-1 -left-1 size-2 rounded-full bg-linear-to-r",
              config.gradient
            )}
          />
        </motion.div>
      </motion.div>

      {/* Title */}
      <motion.h3
        variants={itemVariants}
        className="text-xl font-semibold text-foreground mb-2 text-center"
      >
        {title || config.defaultTitle}
      </motion.h3>

      {/* Description */}
      <motion.p
        variants={itemVariants}
        className="text-muted-foreground text-center max-w-sm mb-6"
      >
        {description || config.defaultDescription}
      </motion.p>

      {/* Action Button */}
      {(actionLabel || config.defaultActionLabel) && onAction && (
        <motion.div variants={itemVariants}>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button onClick={onAction} className="gap-2">
              {variant === "no-tasks" && <IconPlus className="size-4" />}
              {variant === "filtered-empty" && <IconFilter className="size-4" />}
              {variant === "error" && <IconRefresh className="size-4" />}
              {actionLabel || config.defaultActionLabel}
            </Button>
          </motion.div>
        </motion.div>
      )}

      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        <motion.div
          animate={{
            x: [0, 20, 0],
            y: [0, -10, 0],
            rotate: [0, 5, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className={cn(
            "absolute top-1/4 left-1/4 size-32 rounded-full blur-3xl opacity-20 bg-linear-to-r",
            config.gradient
          )}
        />
        <motion.div
          animate={{
            x: [0, -15, 0],
            y: [0, 15, 0],
            rotate: [0, -5, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className={cn(
            "absolute bottom-1/4 right-1/4 size-24 rounded-full blur-3xl opacity-15 bg-linear-to-r",
            config.gradient
          )}
        />
      </div>
    </motion.div>
  );
}
