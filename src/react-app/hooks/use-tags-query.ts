import { APIEndpoints } from "@/constants/api-endpoints";
import { tagColorValues } from "@/constants/tag-colors";
import { QueryKeys } from "@/constants/query-keys";
import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import z from "zod";

const tagSchema = z.object({
  id: z.string(),
  name: z.string(),
  color: z.enum(tagColorValues),
  createdAt: z.string(),
});

const schema = z.object({
  tags: z.array(tagSchema),
});

export type Tag = z.infer<typeof tagSchema>;

export const useTagsQuery = () => {
  return useQuery({
    queryKey: [QueryKeys.Tags],
    queryFn: async () => {
      const { data } = await api.get(APIEndpoints.Tags);
      return schema.parse(data);
    },
  });
};
