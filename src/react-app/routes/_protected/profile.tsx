import { AppSidebar } from "@/components/app-sidebar";
import { ChangePasswordForm } from "@/components/change-password-form";
import { ProfileForm } from "@/components/profile-form";
import { SiteHeader } from "@/components/site-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { useSession } from "@/lib/auth-client";
import { createFileRoute } from "@tanstack/react-router";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, type Easing } from "framer-motion";
import { User, Lock, Shield } from "lucide-react";

export const Route = createFileRoute("/_protected/profile")({
  component: RouteComponent,
});

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as Easing } },
};

function RouteComponent() {
  useDocumentTitle("Profile");
  const { data: session, isPending } = useSession();

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
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <motion.div 
          className="flex flex-1 flex-col"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          <div className="flex flex-col gap-6 p-4 md:p-6 lg:p-8 max-w-3xl">
            {/* Header Section */}
            <motion.div variants={itemVariants}>
              <div className="flex items-start gap-4">
                {isPending ? (
                  <Skeleton className="h-20 w-20 rounded-full" />
                ) : (
                  <Avatar className="h-20 w-20 border-2 border-primary/10">
                    <AvatarImage 
                      src={session?.user?.image || undefined} 
                      alt={session?.user?.name || "User"} 
                    />
                    <AvatarFallback className="text-xl bg-primary/10 text-primary">
                      {session?.user?.name ? getInitials(session.user.name) : "U"}
                    </AvatarFallback>
                  </Avatar>
                )}
                <div className="flex-1">
                  <h1 className="text-2xl font-bold tracking-tight">Profile Settings</h1>
                  <p className="text-muted-foreground">
                    Manage your account settings and preferences.
                  </p>
                </div>
              </div>
            </motion.div>

            <Separator />

            {isPending ? (
              <ProfileSkeleton />
            ) : session?.user ? (
              <>
                {/* Profile Information Card */}
                <motion.div variants={itemVariants}>
                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
                          <User className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">Profile Information</CardTitle>
                          <CardDescription>
                            Update your account profile information.
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ProfileForm
                        user={{
                          name: session.user.name,
                          email: session.user.email,
                          image: session.user.image || undefined,
                        }}
                      />
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Change Password Card */}
                <motion.div variants={itemVariants}>
                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
                          <Lock className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">Change Password</CardTitle>
                          <CardDescription>
                            Update your password to keep your account secure.
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ChangePasswordForm />
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Account Security Card */}
                <motion.div variants={itemVariants}>
                  <Card className="border-dashed">
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted">
                          <Shield className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div>
                          <CardTitle className="text-lg text-muted-foreground">Account Security</CardTitle>
                          <CardDescription>
                            Additional security options coming soon.
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Two-factor authentication and other security features will be available in a future update.
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              </>
            ) : (
              <motion.div variants={itemVariants}>
                <Card className="border-destructive/50 bg-destructive/10">
                  <CardContent className="pt-6">
                    <p className="text-destructive">Unable to load profile. Please try refreshing the page.</p>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </motion.div>
      </SidebarInset>
    </SidebarProvider>
  );
}

function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded-md" />
            <div className="space-y-1.5">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-60" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-full" />
          </div>
          <Skeleton className="h-10 w-28" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded-md" />
            <div className="space-y-1.5">
              <Skeleton className="h-5 w-36" />
              <Skeleton className="h-4 w-64" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-10 w-full" />
          </div>
          <Skeleton className="h-10 w-36" />
        </CardContent>
      </Card>
    </div>
  );
}
