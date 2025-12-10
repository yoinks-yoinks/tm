import { motion, type Easing } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  className?: string;
}

const shimmerVariants = {
  initial: { opacity: 0.5 },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: "easeInOut" as Easing,
      repeat: Infinity,
      repeatType: "reverse" as const,
    },
  },
};

const rowVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.3,
      ease: "easeOut" as Easing,
    },
  }),
};

export function TableSkeleton({
  rows = 5,
  columns = 5,
  className,
}: TableSkeletonProps) {
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {/* Header skeleton */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center justify-between"
      >
        <Skeleton className="h-9 w-32" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-36" />
          <Skeleton className="h-9 w-28" />
        </div>
      </motion.div>

      {/* Table skeleton */}
      <div className="overflow-hidden rounded-lg border">
        {/* Table header */}
        <motion.div
          variants={shimmerVariants}
          initial="initial"
          animate="animate"
          className="flex items-center gap-4 border-b bg-muted/50 px-4 py-3"
        >
          {Array.from({ length: columns }).map((_, i) => (
            <Skeleton
              key={i}
              className={cn(
                "h-4",
                i === 0 ? "w-32" : i === 1 ? "w-48" : "w-20"
              )}
            />
          ))}
        </motion.div>

        {/* Table rows */}
        <div className="divide-y">
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <motion.div
              key={rowIndex}
              custom={rowIndex}
              variants={rowVariants}
              initial="hidden"
              animate="visible"
              className="flex items-center gap-4 px-4 py-4"
            >
              {Array.from({ length: columns }).map((_, colIndex) => (
                <Skeleton
                  key={colIndex}
                  className={cn(
                    "h-4",
                    colIndex === 0
                      ? "w-40"
                      : colIndex === 1
                      ? "w-56"
                      : colIndex === 2
                      ? "w-24"
                      : colIndex === 3
                      ? "w-20"
                      : "w-8"
                  )}
                />
              ))}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Pagination skeleton */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.3 }}
        className="flex items-center justify-between px-4"
      >
        <Skeleton className="h-4 w-24" />
        <div className="flex items-center gap-4">
          <Skeleton className="h-4 w-20" />
          <div className="flex gap-1">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

interface KanbanSkeletonProps {
  columns?: number;
  cardsPerColumn?: number;
  className?: string;
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.3,
      ease: "easeOut" as Easing,
    },
  }),
};

export function KanbanSkeleton({
  columns = 3,
  cardsPerColumn = 3,
  className,
}: KanbanSkeletonProps) {
  const columnWidths = ["w-80"];

  return (
    <div className={cn("flex gap-4 overflow-x-auto pb-4", className)}>
      {Array.from({ length: columns }).map((_, colIndex) => (
        <motion.div
          key={colIndex}
          custom={colIndex}
          variants={rowVariants}
          initial="hidden"
          animate="visible"
          className={cn(
            "flex flex-col rounded-xl min-h-[500px] overflow-hidden border border-muted",
            columnWidths[0]
          )}
        >
          {/* Column header skeleton */}
          <div className="p-4 border-b bg-muted/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-8 rounded-lg" />
                <Skeleton className="h-4 w-20" />
              </div>
              <Skeleton className="h-6 w-8 rounded-full" />
            </div>
          </div>

          {/* Cards skeleton */}
          <div className="flex-1 p-3 space-y-3 bg-muted/10">
            {Array.from({ length: cardsPerColumn }).map((_, cardIndex) => (
              <motion.div
                key={cardIndex}
                custom={colIndex * cardsPerColumn + cardIndex}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                className="rounded-lg border bg-card p-4 space-y-3 shadow-sm"
              >
                {/* Title */}
                <Skeleton className="h-5 w-3/4" />
                
                {/* Description */}
                <div className="space-y-2">
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-2/3" />
                </div>

                {/* Footer with badges */}
                <div className="flex items-center gap-2 pt-2">
                  <Skeleton className="h-5 w-16 rounded-full" />
                  <Skeleton className="h-5 w-12 rounded-full" />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
