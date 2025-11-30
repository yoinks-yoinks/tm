import { useMutation } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { api } from "@/lib/api";

const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
});

type CreateTaskForm = z.infer<typeof createTaskSchema>;

interface CreateTaskFormProps {
  onSuccess: () => void;
}

export function CreateTaskForm({ onSuccess }: CreateTaskFormProps) {
  const form = useForm<CreateTaskForm>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const createTaskMutation = useMutation({
    mutationFn: (data: CreateTaskForm) => api.post("/api/tasks", data),
    onSuccess: () => {
      toast.success("Task created successfully");
      form.reset();
      onSuccess();
    },
    onError: () => {
      toast.error("Failed to create task");
    },
  });

  const onSubmit = (data: CreateTaskForm) => {
    createTaskMutation.mutate(data);
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
      <Button
        type="submit"
        disabled={createTaskMutation.isPending}
        className="w-full"
      >
        {createTaskMutation.isPending ? "Creating..." : "Create Task"}
      </Button>
    </form>
  );
}
