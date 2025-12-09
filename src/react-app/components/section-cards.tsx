import { IconTrendingDown, IconTrendingUp, IconList, IconClock, IconPlayerPlay, IconCircleCheck } from "@tabler/icons-react";
import { motion, type Easing } from "framer-motion";
import { useEffect, useState, useRef } from "react";

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useTasksQuery } from "@/hooks/use-tasks-query";

// Animated counter hook
function useAnimatedCounter(end: number, duration: number = 1500) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let startTime: number;
          const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            setCount(Math.floor(progress * end));
            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [end, duration, hasAnimated]);

  return { count, ref };
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: "easeOut" as Easing,
    },
  }),
};

const iconVariants = {
  initial: { scale: 1 },
  hover: { 
    scale: 1.1, 
    rotate: 5,
    transition: { type: "spring" as const, stiffness: 400, damping: 10 }
  },
};

const statsCards = [
  {
    key: "total",
    title: "Total Tasks",
    icon: IconList,
    gradient: "from-blue-500 to-cyan-500",
    bgGradient: "from-blue-500/10 to-cyan-500/10",
    iconBg: "bg-blue-500/10 text-blue-500",
    trendIcon: IconTrendingUp,
    description: "All tasks in the system",
    trendText: "Total number of tasks",
  },
  {
    key: "pending",
    title: "Pending Tasks",
    icon: IconClock,
    gradient: "from-orange-500 to-amber-500",
    bgGradient: "from-orange-500/10 to-amber-500/10",
    iconBg: "bg-orange-500/10 text-orange-500",
    trendIcon: IconTrendingDown,
    description: "Requires attention",
    trendText: "Tasks awaiting action",
  },
  {
    key: "active",
    title: "Active Tasks",
    icon: IconPlayerPlay,
    gradient: "from-green-500 to-emerald-500",
    bgGradient: "from-green-500/10 to-emerald-500/10",
    iconBg: "bg-green-500/10 text-green-500",
    trendIcon: IconTrendingUp,
    description: "Active work items",
    trendText: "Currently in progress",
  },
  {
    key: "completion",
    title: "Completion Rate",
    icon: IconCircleCheck,
    gradient: "from-purple-500 to-pink-500",
    bgGradient: "from-purple-500/10 to-pink-500/10",
    iconBg: "bg-purple-500/10 text-purple-500",
    trendIcon: IconTrendingUp,
    description: "Overall progress",
    trendText: "Percentage completed",
    isPercentage: true,
  },
];

export function SectionCards() {
  const { data, isPending, isError } = useTasksQuery();

  if (isPending) {
    return (
      <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="@container/card overflow-hidden">
            <CardHeader className="relative">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-20" />
              <div className="absolute right-4 top-4">
                <Skeleton className="h-10 w-10 rounded-xl" />
              </div>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-24" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (isError) {
    return <div className="px-4 lg:px-6">Error loading tasks data.</div>;
  }

  const total = data.tasks.length;
  const pending = data.tasks.filter((t) => t.status === "todo").length;
  const active = data.tasks.filter((t) => t.status === "in_progress").length;
  const completed = data.tasks.filter((t) => t.status === "completed").length;
  const completionRate = total > 0 ? ((completed / total) * 100) : 0;

  const values = {
    total,
    pending,
    active,
    completion: Math.round(completionRate),
  };

  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {statsCards.map((card, index) => (
        <AnimatedCard
          key={card.key}
          card={card}
          value={values[card.key as keyof typeof values]}
          index={index}
        />
      ))}
    </div>
  );
}

function AnimatedCard({
  card,
  value,
  index,
}: {
  card: (typeof statsCards)[number];
  value: number;
  index: number;
}) {
  const { count, ref } = useAnimatedCounter(value);
  const Icon = card.icon;
  const TrendIcon = card.trendIcon;

  return (
    <motion.div
      ref={ref}
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      <Card className="@container/card overflow-hidden relative group">
        {/* Gradient overlay on hover */}
        <div className={`absolute inset-0 bg-linear-to-br ${card.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
        
        {/* Animated background decoration */}
        <motion.div
          className={`absolute -right-8 -top-8 h-24 w-24 rounded-full bg-linear-to-br ${card.gradient} opacity-10 blur-2xl`}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <CardHeader className="relative z-10">
          <div className="flex items-start justify-between">
            <div>
              <CardDescription className="text-xs font-medium uppercase tracking-wider">
                {card.title}
              </CardDescription>
              <CardTitle className="text-3xl font-bold tabular-nums mt-1 @[250px]/card:text-4xl">
                <span className={`bg-linear-to-r ${card.gradient} bg-clip-text text-transparent`}>
                  {count}
                  {card.isPercentage && "%"}
                </span>
              </CardTitle>
            </div>
            <motion.div
              variants={iconVariants}
              initial="initial"
              whileHover="hover"
              className={`p-2.5 rounded-xl ${card.iconBg}`}
            >
              <Icon className="size-5" />
            </motion.div>
          </div>
        </CardHeader>
        
        <CardFooter className="flex-col items-start gap-1.5 text-sm relative z-10">
          <div className="line-clamp-1 flex gap-2 font-medium items-center">
            {card.trendText}
            <TrendIcon className={`size-4 ${card.trendIcon === IconTrendingUp ? 'text-green-500' : 'text-orange-500'}`} />
          </div>
          <div className="text-muted-foreground text-xs">{card.description}</div>
        </CardFooter>

        {/* Progress bar for completion rate */}
        {card.isPercentage && (
          <div className="px-6 pb-4 relative z-10">
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                className={`h-full bg-linear-to-r ${card.gradient} rounded-full`}
                initial={{ width: 0 }}
                animate={{ width: `${value}%` }}
                transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
              />
            </div>
          </div>
        )}
      </Card>
    </motion.div>
  );
}
