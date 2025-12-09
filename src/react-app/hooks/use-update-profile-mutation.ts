import { api } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import z from "zod";

export const updateProfileSchema = z.object({
  name: z.string().min(1, "Name is required"),
});

export type UpdateProfileForm = z.infer<typeof updateProfileSchema>;

export const useUpdateProfileMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: UpdateProfileForm) => {
      const { data } = await api.patch("/api/user", formData);
      return data;
    },
    onSuccess: () => {
      // Invalidate session to refresh user data
      queryClient.invalidateQueries({ queryKey: ["session"] });
    },
  });
};
