import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { PasswordStrength } from "@/components/password-strength";
import { useChangePasswordMutation } from "@/hooks/use-change-password-mutation";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Lock, KeyRound, ShieldCheck } from "lucide-react";

export function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const changePassword = useChangePasswordMutation();

  const isValid = currentPassword && newPassword && confirmPassword && 
                  newPassword === confirmPassword && newPassword.length >= 8;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("All fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters");
      return;
    }

    toast.promise(
      changePassword.mutateAsync({ currentPassword, newPassword }).then(() => {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }),
      {
        loading: "Changing password...",
        success: "Password changed successfully!",
        error: (err) => err?.message || "Failed to change password",
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Current Password */}
      <div className="space-y-2">
        <Label htmlFor="currentPassword" className="flex items-center gap-2">
          <Lock className="h-4 w-4 text-muted-foreground" />
          Current Password
        </Label>
        <PasswordInput
          id="currentPassword"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder="Enter current password"
          disabled={changePassword.isPending}
        />
      </div>

      {/* New Password */}
      <div className="space-y-2">
        <Label htmlFor="newPassword" className="flex items-center gap-2">
          <KeyRound className="h-4 w-4 text-muted-foreground" />
          New Password
        </Label>
        <PasswordInput
          id="newPassword"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Enter new password"
          disabled={changePassword.isPending}
        />
        <AnimatePresence>
          {newPassword && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3"
            >
              <PasswordStrength password={newPassword} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Confirm New Password */}
      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-muted-foreground" />
          Confirm New Password
        </Label>
        <PasswordInput
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm new password"
          disabled={changePassword.isPending}
        />
        {confirmPassword && newPassword !== confirmPassword && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs text-destructive"
          >
            Passwords do not match
          </motion.p>
        )}
        {confirmPassword && newPassword === confirmPassword && newPassword.length >= 8 && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs text-green-500"
          >
            Passwords match ✓
          </motion.p>
        )}
      </div>

      {/* Submit Button */}
      <motion.div
        initial={false}
        animate={{ 
          opacity: isValid ? 1 : 0.5,
          scale: isValid ? 1 : 0.98,
        }}
        transition={{ duration: 0.2 }}
      >
        <Button 
          type="submit" 
          disabled={changePassword.isPending || !isValid}
          className="w-full sm:w-auto"
        >
          {changePassword.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Changing...
            </>
          ) : (
            "Change Password"
          )}
        </Button>
      </motion.div>
    </form>
  );
}
