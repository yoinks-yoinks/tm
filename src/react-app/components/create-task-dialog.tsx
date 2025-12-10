"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, type Easing } from "framer-motion";
import {
  IconPlus,
  IconSparkles,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TagCombobox, type BaseTag } from "@/components/tag-combobox";
import { DatePicker } from "@/components/date-picker";
import { PrioritySelector } from "@/components/priority-selector";
import { VoiceRecorder } from "@/components/voice-recorder";
import { LanguageSelector } from "@/components/language-selector";
import { type Priority } from "@/constants/priority";
import {
  createTaskSchema,
  useCreateTaskMutation,
  type CreateTaskForm,
} from "@/hooks/use-create-task-mutation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface CreateTaskDialogProps {
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

const formVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" as Easing },
  },
};

export function CreateTaskDialog({ trigger, onSuccess }: CreateTaskDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState<BaseTag[]>([]);
  const [voiceLanguage, setVoiceLanguage] = useState("en");

  const form = useForm<CreateTaskForm>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "medium",
      dueDate: null,
      tagIds: [],
    },
  });

  const { mutate, isPending } = useCreateTaskMutation();

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      form.reset();
      setSelectedTags([]);
    }
  }, [open, form]);

  const onSubmit = (data: CreateTaskForm) => {
    const submitData = {
      ...data,
      tagIds: selectedTags.map((t) => t.id),
    };

    mutate(submitData, {
      onSuccess: () => {
        toast.success("Task created successfully! 🎉");
        setOpen(false);
        onSuccess?.();
      },
      onError: () => {
        toast.error("Failed to create task");
      },
    });
  };

  const titleValue = form.watch("title");
  const isValid = titleValue?.trim().length > 0;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button size="sm" className="gap-2">
            <IconPlus className="h-4 w-4" />
            New Task
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <IconSparkles className="h-5 w-5 text-primary" />
            </motion.div>
            Create New Task
          </DialogTitle>
          <DialogDescription>
            Add a new task to your list. Fill in the details below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)}>
          <motion.div
            variants={formVariants}
            initial="hidden"
            animate="visible"
            className="space-y-5 py-4"
          >
            {/* Voice Language Selector */}
            <motion.div variants={itemVariants} className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Voice input language:</span>
              <LanguageSelector value={voiceLanguage} onChange={setVoiceLanguage} compact />
            </motion.div>

            {/* Title */}
            <motion.div variants={itemVariants} className="space-y-2">
              <Label htmlFor="title">
                Title <span className="text-red-500">*</span>
              </Label>
              <div className="flex gap-2">
                <Controller
                  name="title"
                  control={form.control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="title"
                      placeholder="What needs to be done?"
                      className={cn(
                        "flex-1",
                        form.formState.errors.title && "border-red-500 focus-visible:ring-red-500"
                      )}
                      autoFocus
                    />
                  )}
                />
                <VoiceRecorder
                  label="Speak title"
                  onTranscription={(text) => form.setValue("title", text)}
                  disabled={isPending}
                  language={voiceLanguage}
                />
              </div>
              {form.formState.errors.title && (
                <p className="text-red-500 text-sm">
                  {form.formState.errors.title.message}
                </p>
              )}
            </motion.div>

            {/* Description */}
            <motion.div variants={itemVariants} className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <div className="flex gap-2">
                <Controller
                  name="description"
                  control={form.control}
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      id="description"
                      placeholder="Add more details about this task..."
                      className="min-h-20 resize-none flex-1"
                    />
                  )}
                />
                <VoiceRecorder
                  label="Speak description"
                  onTranscription={(text) => {
                    const current = form.getValues("description") || "";
                    form.setValue("description", current ? `${current} ${text}` : text);
                  }}
                  disabled={isPending}
                  language={voiceLanguage}
                  className="self-start mt-1"
                />
              </div>
            </motion.div>

            {/* Priority */}
            <motion.div variants={itemVariants} className="space-y-2">
              <Label>Priority</Label>
              <Controller
                name="priority"
                control={form.control}
                render={({ field }) => (
                  <PrioritySelector
                    value={field.value || "medium"}
                    onChange={(value) => field.onChange(value as Priority)}
                  />
                )}
              />
            </motion.div>

            {/* Due Date */}
            <motion.div variants={itemVariants} className="space-y-2">
              <Label>Due Date</Label>
              <Controller
                name="dueDate"
                control={form.control}
                render={({ field }) => (
                  <DatePicker
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Pick a due date"
                    minDate={new Date()}
                  />
                )}
              />
            </motion.div>

            {/* Tags */}
            <motion.div variants={itemVariants} className="space-y-2">
              <Label>Tags</Label>
              <TagCombobox
                selectedTags={selectedTags}
                onTagsChange={setSelectedTags}
                placeholder="Select or create tags..."
              />
            </motion.div>
          </motion.div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!isValid || isPending}>
              <AnimatePresence mode="wait">
                {isPending ? (
                  <motion.span
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    Creating...
                  </motion.span>
                ) : (
                  <motion.span
                    key="create"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    <IconPlus className="h-4 w-4" />
                    Create Task
                  </motion.span>
                )}
              </AnimatePresence>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
