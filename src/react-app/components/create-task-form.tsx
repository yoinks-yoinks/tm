import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { TagCombobox, type BaseTag } from "@/components/tag-combobox";
import { priorities, priorityConfig, type Priority } from "@/constants/priority";
import {
  createTaskSchema,
  useCreateTaskMutation,
  type CreateTaskForm,
} from "@/hooks/use-create-task-mutation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

interface CreateTaskFormProps {
  onSuccess: () => void;
}

export function CreateTaskForm({ onSuccess }: CreateTaskFormProps) {
  const [selectedTags, setSelectedTags] = useState<BaseTag[]>([]);
  
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

  const onSubmit = (data: CreateTaskForm) => {
    const submitData = {
      ...data,
      tagIds: selectedTags.map((t) => t.id),
    };
    
    mutate(submitData, {
      onSuccess: () => {
        toast.success("Task created successfully");
        form.reset();
        setSelectedTags([]);
        onSuccess();
      },
      onError: () => {
        toast.error("Failed to create task");
      },
    });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Controller
          name="title"
          control={form.control}
          render={({ field }) => <Input {...field} placeholder="Title" />}
        />
        {form.formState.errors.title && (
          <p className="text-red-500 text-sm mt-1">
            {form.formState.errors.title.message}
          </p>
        )}
      </div>
      <div>
        <Controller
          name="description"
          control={form.control}
          render={({ field }) => (
            <Textarea {...field} placeholder="Description (optional)" />
          )}
        />
      </div>
      <div>
        <Controller
          name="priority"
          control={form.control}
          render={({ field }) => (
            <Select
              value={field.value}
              onValueChange={(value) => field.onChange(value as Priority)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                {priorities.map((priority) => (
                  <SelectItem key={priority} value={priority}>
                    {priorityConfig[priority].label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>
      <div>
        <Label htmlFor="dueDate" className="text-sm text-muted-foreground mb-1 block">
          Due Date (optional)
        </Label>
        <Controller
          name="dueDate"
          control={form.control}
          render={({ field }) => (
            <Input
              id="dueDate"
              type="datetime-local"
              value={field.value ? field.value.slice(0, 16) : ""}
              onChange={(e) =>
                field.onChange(e.target.value ? new Date(e.target.value).toISOString() : null)
              }
            />
          )}
        />
      </div>
      <div>
        <Label className="text-sm text-muted-foreground mb-1 block">
          Tags (optional)
        </Label>
        <TagCombobox
          selectedTags={selectedTags}
          onTagsChange={setSelectedTags}
          placeholder="Select or create tags..."
        />
      </div>
      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? "Creating..." : "Create Task"}
      </Button>
    </form>
  );
}
