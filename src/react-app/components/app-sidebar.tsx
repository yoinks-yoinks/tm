import { IconDashboard, IconKeyboard, IconDatabase } from "@tabler/icons-react";
import { ListTodo } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";

import { NavMain } from "@/components/nav-main";
import { NavSecondary, type NavSecondaryItem } from "@/components/nav-secondary";
import { NavTags } from "@/components/nav-tags";
import { NavUser } from "@/components/nav-user";
import { KeyboardShortcuts } from "@/components/keyboard-shortcuts";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useSession } from "@/lib/auth-client";
import { api } from "@/lib/api";
import { QueryKeys } from "@/constants/query-keys";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data } = useSession();
  const queryClient = useQueryClient();
  const [shortcutsOpen, setShortcutsOpen] = React.useState(false);

  const handleLoadDemoData = async () => {
    try {
      toast.loading("Loading demo data...", { id: "seed-demo" });
      await api.post("/api/seed-demo");
      await queryClient.invalidateQueries({ queryKey: [QueryKeys.Tasks] });
      await queryClient.invalidateQueries({ queryKey: [QueryKeys.Tags] });
      toast.success("Demo data loaded successfully! 🎉", { id: "seed-demo" });
    } catch (error) {
      toast.error("Failed to load demo data", { id: "seed-demo" });
    }
  };

  const user = {
    name: data?.user.name || "User",
    email: data?.user.email || "",
    avatar: data?.user.image || "/avatars/default.jpg",
  };

  const navMain = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
  ];

  const navSecondary: NavSecondaryItem[] = [
    {
      title: "Load Demo Data",
      icon: IconDatabase,
      onClick: handleLoadDemoData,
    },
    {
      title: "Keyboard Shortcuts",
      icon: IconKeyboard,
      onClick: () => setShortcutsOpen(true),
    },
  ];

  return (
    <>
      <Sidebar collapsible="offcanvas" {...props}>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                className="data-[slot=sidebar-menu-button]:p-1.5!"
              >
                <Link to="/dashboard">
                  <div className="flex items-center gap-2">
                    <div className="bg-blue-500 text-primary-foreground flex size-6 items-center justify-center rounded-md">
                      <ListTodo className="size-4" />
                    </div>
                    <span className="text-base font-semibold">
                      Task Manager Inc.
                    </span>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <NavMain items={navMain} />
          <NavTags />
          <NavSecondary items={navSecondary} className="mt-auto" />
        </SidebarContent>
        <SidebarFooter>
          <NavUser user={user} />
        </SidebarFooter>
      </Sidebar>
      <KeyboardShortcuts open={shortcutsOpen} onOpenChange={setShortcutsOpen} />
    </>
  );
}
