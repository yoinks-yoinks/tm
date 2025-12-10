import { APIEndpoints } from "@/constants/api-endpoints";
import { QueryKeys } from "@/constants/query-keys";
import { api } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import z from "zod";

export const updateTaskTagsSchema = z.object({
  taskId: z.string(),
  tagIds: z.array(z.string()),
});

export type UpdateTaskTagsForm = z.infer<typeof updateTaskTagsSchema>;

export const useUpdateTaskTagsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ taskId, tagIds }: UpdateTaskTagsForm) => {
      await api.post(`${APIEndpoints.Tasks}/${taskId}/tags`, { tagIds });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.Tasks] });
    },
  });
};
