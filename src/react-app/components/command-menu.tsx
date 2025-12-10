"use client";

import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useTheme } from "next-themes";
import {
  IconLayoutDashboard,
  IconUser,
  IconLogout,
  IconSun,
  IconMoon,
  IconCheck,
  IconClock,
  IconList,
  IconKeyboard,
} from "@tabler/icons-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useTasksQuery, type Task } from "@/hooks/use-tasks-query";
import { Badge } from "@/components/ui/badge";

interface CommandMenuProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function CommandMenu({ open, onOpenChange }: CommandMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { setTheme, theme } = useTheme();
  const { data: tasksData } = useTasksQuery();

  const tasks = tasksData?.tasks || [];

  // Use controlled or uncontrolled state
  const commandOpen = open !== undefined ? open : isOpen;
  const setCommandOpen = onOpenChange || setIsOpen;

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandOpen(!commandOpen);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [commandOpen, setCommandOpen]);

  const runCommand = useCallback(
    (command: () => void) => {
      setCommandOpen(false);
      command();
    },
    [setCommandOpen]
  );

  const handleNavigate = useCallback(
    (path: string) => {
      runCommand(() => navigate({ to: path }));
    },
    [navigate, runCommand]
  );

  const handleThemeToggle = useCallback(() => {
    runCommand(() => setTheme(theme === "dark" ? "light" : "dark"));
  }, [runCommand, setTheme, theme]);

  const handleLogout = useCallback(() => {
    runCommand(() => navigate({ to: "/logout" }));
  }, [navigate, runCommand]);

  // Group tasks by status
  const todoTasks = tasks.filter((t) => t.status === "todo").slice(0, 3);
  const inProgressTasks = tasks.filter((t) => t.status === "in_progress").slice(0, 3);

  const getStatusIcon = (status: Task["status"]) => {
    switch (status) {
      case "completed":
        return <IconCheck className="h-4 w-4 text-green-500" />;
      case "in_progress":
        return <IconClock className="h-4 w-4 text-orange-500 animate-pulse" />;
      default:
        return <IconList className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getPriorityBadge = (priority: Task["priority"]) => {
    const colors = {
      urgent: "bg-red-500/10 text-red-500 border-red-500/20",
      high: "bg-orange-500/10 text-orange-500 border-orange-500/20",
      medium: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
      low: "bg-green-500/10 text-green-500 border-green-500/20",
    };
    return (
      <Badge variant="outline" className={`text-xs ${colors[priority]}`}>
        {priority}
      </Badge>
    );
  };

  return (
    <CommandDialog open={commandOpen} onOpenChange={setCommandOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        {/* Quick Actions */}
        <CommandGroup heading="Quick Actions">
          <CommandItem onSelect={() => handleNavigate("/dashboard")}>
            <IconLayoutDashboard className="mr-2 h-4 w-4" />
            <span>Go to Dashboard</span>
            <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              <span className="text-xs">⌘</span>D
            </kbd>
          </CommandItem>
          <CommandItem onSelect={() => handleNavigate("/profile")}>
            <IconUser className="mr-2 h-4 w-4" />
            <span>Profile Settings</span>
          </CommandItem>
          <CommandItem onSelect={handleThemeToggle}>
            {theme === "dark" ? (
              <IconSun className="mr-2 h-4 w-4" />
            ) : (
              <IconMoon className="mr-2 h-4 w-4" />
            )}
            <span>Toggle {theme === "dark" ? "Light" : "Dark"} Mode</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        {/* Todo Tasks */}
        {todoTasks.length > 0 && (
          <>
            <CommandGroup heading="To Do">
              {todoTasks.map((task) => (
                <CommandItem
                  key={task.id}
                  onSelect={() => handleNavigate("/dashboard")}
                  className="flex items-center gap-2"
                >
                  {getStatusIcon(task.status)}
                  <span className="flex-1 truncate">{task.title}</span>
                  {getPriorityBadge(task.priority)}
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
          </>
        )}

        {/* In Progress Tasks */}
        {inProgressTasks.length > 0 && (
          <>
            <CommandGroup heading="In Progress">
              {inProgressTasks.map((task) => (
                <CommandItem
                  key={task.id}
                  onSelect={() => handleNavigate("/dashboard")}
                  className="flex items-center gap-2"
                >
                  {getStatusIcon(task.status)}
                  <span className="flex-1 truncate">{task.title}</span>
                  {getPriorityBadge(task.priority)}
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
          </>
        )}

        {/* Other */}
        <CommandGroup heading="Other">
          <CommandItem onSelect={handleLogout}>
            <IconLogout className="mr-2 h-4 w-4" />
            <span>Logout</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>

      {/* Footer with keyboard hint */}
      <div className="border-t p-2 text-xs text-muted-foreground flex items-center justify-between">
        <div className="flex items-center gap-2">
          <IconKeyboard className="h-3 w-3" />
          <span>Press</span>
          <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium">
            ↑↓
          </kbd>
          <span>to navigate</span>
        </div>
        <div className="flex items-center gap-2">
          <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium">
            Enter
          </kbd>
          <span>to select</span>
          <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium">
            Esc
          </kbd>
          <span>to close</span>
        </div>
      </div>
    </CommandDialog>
  );
}
