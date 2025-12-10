import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { QueryKeys } from "@/constants/query-keys";

export interface AIUsageData {
  usage: {
    minutes: number;
    requests: number;
    percentUsed: number;
  };
  limits: {
    maxMinutes: number;
    remainingMinutes: number;
    allowed: boolean;
    reason?: string;
  };
  resetsAt: number;
}

export function useAIUsageQuery() {
  return useQuery({
    queryKey: [QueryKeys.AIUsage],
    queryFn: async () => {
      const response = await api.get<AIUsageData>("/api/ai-usage");
      return response.data;
    },
    staleTime: 60 * 1000, // 1 minute
    refetchOnWindowFocus: false,
  });
}
