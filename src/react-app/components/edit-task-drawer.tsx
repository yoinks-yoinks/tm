"use client";

import { useState, useEffect, FormEvent } from "react";
import { motion, AnimatePresence, type Easing } from "framer-motion";
import { IconDeviceFloppy, IconX } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TagCombobox, type BaseTag } from "@/components/tag-combobox";
import { DatePicker } from "@/components/date-picker";
import { PrioritySelector } from "@/components/priority-selector";
import { type Priority } from "@/constants/priority";
import { type Task } from "@/hooks/use-tasks-query";
import { useUpdateTaskMutation } from "@/hooks/use-update-task-mutation";
import { useUpdateTaskTagsMutation } from "@/hooks/use-update-task-tags-mutation";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";
import { format, formatDistanceToNow, parseISO, isValid } from "date-fns";

interface EditTaskDrawerProps {
  task: Task;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSuccess?: () => void;
}

const sectionVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.3,
      ease: "easeOut" as Easing,
    },
  }),
};

function formatDate(dateString: string) {
  try {
    const date = parseISO(dateString);
    if (!isValid(date)) return "Unknown";
    return format(date, "PPP 'at' p");
  } catch {
    return "Unknown";
  }
}

function formatRelativeDate(dateString: string) {
  try {
    const date = parseISO(dateString);
    if (!isValid(date)) return "";
    return formatDistanceToNow(date, { addSuffix: true });
  } catch {
    return "";
  }
}

export function EditTaskDrawer({ 
  task, 
  trigger, 
  open: controlledOpen, 
  onOpenChange: controlledOnOpenChange,
  onSuccess 
}: EditTaskDrawerProps) {
  const isMobile = useIsMobile();
  const updateMutation = useUpdateTaskMutation();
  const updateTagsMutation = useUpdateTaskTagsMutation();
  
  // Support both controlled and uncontrolled modes
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = (value: boolean) => {
    if (isControlled) {
      controlledOnOpenChange?.(value);
    } else {
      setInternalOpen(value);
    }
  };
  
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [status, setStatus] = useState(task.status);
  const [priority, setPriority] = useState<Priority>(task.priority);
  const [dueDate, setDueDate] = useState<string | null>(task.dueDate || null);
  const [selectedTags, setSelectedTags] = useState<BaseTag[]>(task.tags || []);

  // Sync state when task changes or drawer opens
  useEffect(() => {
    if (open) {
      setTitle(task.title);
      setDescription(task.description);
      setStatus(task.status);
      setPriority(task.priority);
      setDueDate(task.dueDate || null);
      setSelectedTags(task.tags || []);
    }
  }, [open, task]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const previousStatus = task.status;
      
      await updateMutation.mutateAsync({
        id: task.id,
        title,
        description,
        status,
        priority,
        dueDate: dueDate || null,
      });

      // Update tags if changed
      const currentTagIds = (task.tags || []).map((t) => t.id).sort().join(",");
      const newTagIds = selectedTags.map((t) => t.id).sort().join(",");
      if (currentTagIds !== newTagIds) {
        await updateTagsMutation.mutateAsync({
          taskId: task.id,
          tagIds: selectedTags.map((t) => t.id),
        });
      }

      // Fire confetti if status changed to completed
      if (status === "completed" && previousStatus !== "completed") {
        import("@/lib/confetti").then(({ fireTaskCompletedConfetti }) => {
          fireTaskCompletedConfetti();
        });
      }

      setOpen(false);
      toast.success("Task updated successfully");
      onSuccess?.();
    } catch {
      toast.error("Failed to update task");
    }
  };

  const isPending = updateMutation.isPending || updateTagsMutation.isPending;
  const hasChanges =
    title !== task.title ||
    description !== task.description ||
    status !== task.status ||
    priority !== task.priority ||
    dueDate !== (task.dueDate || null) ||
    JSON.stringify(selectedTags.map((t) => t.id).sort()) !==
      JSON.stringify((task.tags || []).map((t) => t.id).sort());

  return (
    <Drawer open={open} onOpenChange={setOpen} direction={isMobile ? "bottom" : "right"}>
      {trigger && <DrawerTrigger asChild>{trigger}</DrawerTrigger>}
      <DrawerContent className="h-[95vh] max-h-[95vh] flex flex-col">
        <DrawerHeader className="shrink-0">
          <DrawerTitle>Edit Task</DrawerTitle>
          <DrawerDescription>
            Make changes to your task. Click save when you're done.
          </DrawerDescription>
        </DrawerHeader>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-4">
            {/* Title */}
            <motion.div
              custom={0}
              initial="hidden"
              animate="visible"
              variants={sectionVariants}
              className="space-y-1.5"
            >
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Task title"
              />
            </motion.div>

            {/* Description */}
            <motion.div
              custom={1}
              initial="hidden"
              animate="visible"
              variants={sectionVariants}
              className="space-y-1.5"
            >
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add more details..."
                className="min-h-16 resize-none"
              />
            </motion.div>

            {/* Status & Due Date Row */}
            <motion.div
              custom={2}
              initial="hidden"
              animate="visible"
              variants={sectionVariants}
              className="grid grid-cols-2 gap-3"
            >
              {/* Status */}
              <div className="space-y-1.5">
                <Label>Status</Label>
                <Select value={status} onValueChange={(v) => setStatus(v as Task["status"])}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todo">To Do</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Due Date */}
              <div className="space-y-1.5">
                <Label>Due Date</Label>
                <DatePicker value={dueDate} onChange={setDueDate} placeholder="Set due date" />
              </div>
            </motion.div>

            {/* Priority */}
            <motion.div
              custom={3}
              initial="hidden"
              animate="visible"
              variants={sectionVariants}
              className="space-y-1.5"
            >
              <Label>Priority</Label>
              <PrioritySelector value={priority} onChange={setPriority} />
            </motion.div>

            {/* Tags */}
            <motion.div
              custom={4}
              initial="hidden"
              animate="visible"
              variants={sectionVariants}
              className="space-y-1.5"
            >
              <Label>Tags</Label>
              <TagCombobox
                selectedTags={selectedTags}
                onTagsChange={setSelectedTags}
                placeholder="Select or create tags..."
              />
            </motion.div>

            {/* Metadata */}
            <motion.div
              custom={5}
              initial="hidden"
              animate="visible"
              variants={sectionVariants}
              className="space-y-2 rounded-lg bg-muted/50 p-2.5 text-sm"
            >
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Created</span>
                <span className="text-right">
                  <span className="block">{formatDate(task.createdAt)}</span>
                  <span className="text-xs text-muted-foreground">
                    {formatRelativeDate(task.createdAt)}
                  </span>
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Task ID</span>
                <span className="font-mono text-xs text-muted-foreground">
                  {task.id.slice(0, 8)}...
                </span>
              </div>
            </motion.div>
          </div>

          <DrawerFooter className="shrink-0 gap-2 border-t bg-background">
            <AnimatePresence>
              {hasChanges && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-xs text-amber-600 dark:text-amber-400 text-center mb-1"
                >
                  You have unsaved changes
                </motion.div>
              )}
            </AnimatePresence>
            <Button type="submit" disabled={isPending || !hasChanges} className="gap-2">
              {isPending ? (
                "Saving..."
              ) : (
                <>
                  <IconDeviceFloppy className="h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
            <DrawerClose asChild>
              <Button variant="outline" className="gap-2">
                <IconX className="h-4 w-4" />
                Cancel
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  );
}
