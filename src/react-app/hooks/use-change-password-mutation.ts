import { api } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import z from "zod";

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
});

export type ChangePasswordForm = z.infer<typeof changePasswordSchema>;

export const useChangePasswordMutation = () => {
  return useMutation({
    mutationFn: async (formData: ChangePasswordForm) => {
      const { data } = await api.post("/api/user/change-password", formData);
      return data;
    },
  });
};
