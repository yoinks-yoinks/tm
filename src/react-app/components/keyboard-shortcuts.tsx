"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, type Easing } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { IconKeyboard, IconCommand } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

interface ShortcutGroup {
  title: string;
  shortcuts: {
    keys: string[];
    description: string;
  }[];
}

const shortcutGroups: ShortcutGroup[] = [
  {
    title: "Navigation",
    shortcuts: [
      { keys: ["⌘", "K"], description: "Open command palette" },
      { keys: ["⌘", "D"], description: "Go to Dashboard" },
      { keys: ["Esc"], description: "Close dialogs" },
    ],
  },
  {
    title: "Tasks",
    shortcuts: [
      { keys: ["N"], description: "New task (from sidebar)" },
      { keys: ["E"], description: "Edit selected task" },
      { keys: ["Delete"], description: "Delete selected task" },
    ],
  },
  {
    title: "View",
    shortcuts: [
      { keys: ["T"], description: "Toggle table/kanban view" },
      { keys: ["⌘", "/"], description: "Show keyboard shortcuts" },
    ],
  },
];

// Detect Mac vs Windows
const isMac = typeof navigator !== "undefined" && /Mac|iPod|iPhone|iPad/.test(navigator.platform);

// Replace ⌘ with Ctrl for Windows
function formatKey(key: string): string {
  if (!isMac && key === "⌘") {
    return "Ctrl";
  }
  return key;
}

interface KeyboardShortcutsProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.2,
      ease: "easeOut" as Easing,
    },
  }),
};

export function KeyboardShortcuts({ open, onOpenChange }: KeyboardShortcutsProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Use controlled or uncontrolled state
  const dialogOpen = open !== undefined ? open : isOpen;
  const setDialogOpen = onOpenChange || setIsOpen;

  // Listen for ⌘/ or Ctrl+/
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "/" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setDialogOpen(!dialogOpen);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [dialogOpen, setDialogOpen]);

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <IconKeyboard className="h-5 w-5" />
            Keyboard Shortcuts
          </DialogTitle>
          <DialogDescription>
            Navigate faster with these keyboard shortcuts
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <AnimatePresence>
            {shortcutGroups.map((group, groupIndex) => (
              <motion.div
                key={group.title}
                initial="hidden"
                animate="visible"
                className="space-y-3"
              >
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  {group.title}
                </h3>
                <div className="space-y-2">
                  {group.shortcuts.map((shortcut, shortcutIndex) => (
                    <motion.div
                      key={shortcut.description}
                      custom={groupIndex * 3 + shortcutIndex}
                      variants={itemVariants}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm">{shortcut.description}</span>
                      <div className="flex items-center gap-1">
                        {shortcut.keys.map((key, keyIndex) => (
                          <span key={keyIndex}>
                            <kbd
                              className={cn(
                                "pointer-events-none inline-flex h-6 min-w-6 select-none items-center justify-center gap-1 rounded border bg-muted px-2 font-mono text-xs font-medium",
                                key === "⌘" && "px-1.5"
                              )}
                            >
                              {key === "⌘" && !isMac ? (
                                "Ctrl"
                              ) : key === "⌘" ? (
                                <IconCommand className="h-3 w-3" />
                              ) : (
                                formatKey(key)
                              )}
                            </kbd>
                            {keyIndex < shortcut.keys.length - 1 && (
                              <span className="text-muted-foreground mx-0.5">+</span>
                            )}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-center pt-4 border-t">
          <p className="text-xs text-muted-foreground flex items-center gap-2">
            Press{" "}
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium">
              {isMac ? <IconCommand className="h-3 w-3" /> : "Ctrl"}
            </kbd>
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium">
              /
            </kbd>{" "}
            to toggle this dialog
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
