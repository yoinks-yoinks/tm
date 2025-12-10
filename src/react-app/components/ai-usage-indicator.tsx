import { useAIUsageQuery } from "@/hooks/use-ai-usage-query";
import { cn } from "@/lib/utils";
import { Mic, MicOff } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface AIUsageIndicatorProps {
  className?: string;
  showDetails?: boolean;
}

export function AIUsageIndicator({ className, showDetails = true }: AIUsageIndicatorProps) {
  const { data, isLoading, isError } = useAIUsageQuery();

  if (isLoading || isError || !data) {
    return null;
  }

  const { usage, limits } = data;
  const percentRemaining = 100 - usage.percentUsed;
  
  // Color based on usage
  const getColor = () => {
    if (!limits.allowed) return "text-red-500";
    if (percentRemaining <= 10) return "text-red-500";
    if (percentRemaining <= 30) return "text-amber-500";
    return "text-emerald-500";
  };

  const getTimeUntilReset = () => {
    const now = Date.now();
    const diff = data.resetsAt - now;
    if (diff <= 0) return "Resetting...";
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className={cn("flex items-center gap-1.5 text-sm", getColor(), className)}>
          {limits.allowed ? (
            <Mic className="h-3.5 w-3.5" />
          ) : (
            <MicOff className="h-3.5 w-3.5" />
          )}
          {showDetails && (
            <span className="tabular-nums">
              {limits.remainingMinutes}m
            </span>
          )}
        </div>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs">
        <div className="space-y-1">
          <p className="font-medium">Voice Input Usage</p>
          <div className="text-xs text-muted-foreground space-y-0.5">
            <p>Used: {usage.minutes.toFixed(1)} / {limits.maxMinutes} minutes</p>
            <p>Remaining: {limits.remainingMinutes} minutes</p>
            <p>Resets in: {getTimeUntilReset()}</p>
          </div>
          {!limits.allowed && (
            <p className="text-xs text-red-500 mt-1">
              {limits.reason}
            </p>
          )}
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
