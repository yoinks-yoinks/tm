import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUpdateProfileMutation } from "@/hooks/use-update-profile-mutation";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Loader2, User, Mail, Check, Camera } from "lucide-react";

interface ProfileFormProps {
  user: {
    name: string;
    email: string;
    image?: string;
  };
}

export function ProfileForm({ user }: ProfileFormProps) {
  const [name, setName] = useState(user.name);
  const [hasChanges, setHasChanges] = useState(false);
  const updateProfile = useUpdateProfileMutation();

  const handleNameChange = (value: string) => {
    setName(value);
    setHasChanges(value !== user.name);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }

    toast.promise(
      updateProfile.mutateAsync({ name: name.trim() }).then(() => {
        setHasChanges(false);
      }),
      {
        loading: "Updating profile...",
        success: "Profile updated successfully!",
        error: "Failed to update profile",
      }
    );
  };

  // Get initials from name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Avatar Section */}
      <div className="flex items-center gap-4">
        <div className="relative group">
          <Avatar className="h-16 w-16 border-2 border-primary/10">
            <AvatarImage src={user.image} alt={user.name} />
            <AvatarFallback className="text-lg bg-primary/10 text-primary">
              {getInitials(name || "U")}
            </AvatarFallback>
          </Avatar>
          <motion.div
            className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-not-allowed"
            whileHover={{ scale: 1.02 }}
          >
            <Camera className="h-5 w-5 text-white" />
          </motion.div>
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium">Profile Picture</p>
          <p className="text-xs text-muted-foreground">
            Avatar customization coming soon
          </p>
        </div>
      </div>

      {/* Email Field (Read-only) */}
      <div className="space-y-2">
        <Label htmlFor="email" className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-muted-foreground" />
          Email
        </Label>
        <div className="relative">
          <Input
            id="email"
            value={user.email}
            disabled
            className="bg-muted/50 text-muted-foreground cursor-not-allowed"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Check className="h-4 w-4 text-green-500" />
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          Your email cannot be changed.
        </p>
      </div>

      {/* Name Field */}
      <div className="space-y-2">
        <Label htmlFor="name" className="flex items-center gap-2">
          <User className="h-4 w-4 text-muted-foreground" />
          Display Name
        </Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => handleNameChange(e.target.value)}
          placeholder="Enter your name"
          disabled={updateProfile.isPending}
        />
      </div>

      {/* Submit Button */}
      <motion.div
        initial={false}
        animate={{ 
          opacity: hasChanges ? 1 : 0.5,
          scale: hasChanges ? 1 : 0.98,
        }}
        transition={{ duration: 0.2 }}
      >
        <Button 
          type="submit" 
          disabled={updateProfile.isPending || !hasChanges}
          className="w-full sm:w-auto"
        >
          {updateProfile.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </motion.div>
    </form>
  );
}
