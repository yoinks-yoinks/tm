import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUpdateProfileMutation } from "@/hooks/use-update-profile-mutation";
import { FormEvent, useState } from "react";
import { toast } from "sonner";

interface ProfileFormProps {
  user: {
    name: string;
    email: string;
  };
}

export function ProfileForm({ user }: ProfileFormProps) {
  const [name, setName] = useState(user.name);
  const updateProfile = useUpdateProfileMutation();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }

    toast.promise(updateProfile.mutateAsync({ name: name.trim() }), {
      loading: "Updating profile...",
      success: "Profile updated successfully",
      error: "Failed to update profile",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <p id="email-display" className="text-sm text-muted-foreground py-2">
          {user.email}
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
        />
      </div>

      <Button type="submit" disabled={updateProfile.isPending}>
        {updateProfile.isPending ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
}
