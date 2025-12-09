import { APIEndpoints } from "@/constants/api-endpoints";
import { tagColorValues } from "@/constants/tag-colors";
import { QueryKeys } from "@/constants/query-keys";
import { api } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import z from "zod";

export const createTagSchema = z.object({
  name: z.string().min(1, "Tag name is required"),
  color: z.enum(tagColorValues).default("gray"),
});

export type CreateTagForm = z.infer<typeof createTagSchema>;

const tagSchema = z.object({
  id: z.string(),
  name: z.string(),
  color: z.enum(tagColorValues),
  createdAt: z.string(),
});

const schema = z.object({
  tag: tagSchema,
});

export const useCreateTagMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: CreateTagForm) => {
      const { data } = await api.post(APIEndpoints.Tags, formData);
      return schema.parse(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.Tags] });
    },
  });
};
