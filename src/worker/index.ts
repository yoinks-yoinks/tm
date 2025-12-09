import { zValidator } from "@hono/zod-validator";
import { and, eq, inArray } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { Hono } from "hono";
import { z } from "zod";
import { task, taskStatusEnum, taskPriorityEnum, tag, taskTag, tagColorEnum, user } from "./db/schema";
import { getAuth } from "./lib/auth";
import { getAuthUser } from "./lib/get-auth-user";

const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  status: z.enum(taskStatusEnum).optional().default("todo"),
  priority: z.enum(taskPriorityEnum).optional().default("medium"),
  dueDate: z.string().datetime().optional().nullable(),
  tagIds: z.array(z.string()).optional(),
});

const updateTaskSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  status: z.enum(taskStatusEnum).optional(),
  priority: z.enum(taskPriorityEnum).optional(),
  dueDate: z.string().datetime().optional().nullable(),
  tagIds: z.array(z.string()).optional(),
});

const createTagSchema = z.object({
  name: z.string().min(1, "Tag name is required"),
  color: z.enum(tagColorEnum).optional().default("blue"),
});

const updateTagSchema = z.object({
  name: z.string().min(1).optional(),
  color: z.enum(tagColorEnum).optional(),
});

const updateProfileSchema = z.object({
  name: z.string().min(1, "Name is required"),
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
});

const app = new Hono<{ Bindings: Env }>();

app.get("/api/", (c) => c.json({ name: "Cloudflare" }));

app.on(["POST", "GET"], "/api/auth/*", (c) => {
  const auth = getAuth(c.env);
  return auth.handler(c.req.raw);
});

app.get("/api/me", async (c) => {
  const auth = getAuth(c.env);
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  });

  if (!session) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  return c.json({ user: session.user });
});

// Update user profile
app.patch("/api/user", zValidator("json", updateProfileSchema), async (c) => {
  const authUser = await getAuthUser(c);
  if (!authUser) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const body = c.req.valid("json");
  const db = drizzle(c.env.DB);

  await db
    .update(user)
    .set({
      name: body.name,
      updatedAt: new Date(),
    })
    .where(eq(user.id, authUser.id));

  return c.json({ message: "Profile updated successfully" });
});

// Change password
app.post("/api/user/change-password", zValidator("json", changePasswordSchema), async (c) => {
  const authUser = await getAuthUser(c);
  if (!authUser) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const body = c.req.valid("json");
  const auth = getAuth(c.env);

  // Use Better Auth's built-in password change
  try {
    const result = await auth.api.changePassword({
      body: {
        currentPassword: body.currentPassword,
        newPassword: body.newPassword,
      },
      headers: c.req.raw.headers,
    });

    if (!result) {
      return c.json({ error: "Failed to change password" }, 400);
    }

    return c.json({ message: "Password changed successfully" });
  } catch (error) {
    return c.json({ error: "Current password is incorrect" }, 400);
  }
});

app.get("/api/tasks", async (c) => {
  const user = await getAuthUser(c);
  if (!user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const db = drizzle(c.env.DB);
  const tasks = await db.select().from(task).where(eq(task.userId, user.id));

  // Fetch tags for all tasks
  const taskIds = tasks.map((t) => t.id);
  let taskTagsMap: Record<string, Array<{ id: string; name: string; color: string }>> = {};

  if (taskIds.length > 0) {
    const allTaskTags = await db
      .select({
        taskId: taskTag.taskId,
        tag: tag,
      })
      .from(taskTag)
      .innerJoin(tag, eq(taskTag.tagId, tag.id))
      .where(inArray(taskTag.taskId, taskIds));

    taskTagsMap = allTaskTags.reduce(
      (acc, tt) => {
        if (!acc[tt.taskId]) {
          acc[tt.taskId] = [];
        }
        acc[tt.taskId].push({
          id: tt.tag.id,
          name: tt.tag.name,
          color: tt.tag.color,
        });
        return acc;
      },
      {} as Record<string, Array<{ id: string; name: string; color: string }>>
    );
  }

  const tasksWithTags = tasks.map((t) => ({
    ...t,
    tags: taskTagsMap[t.id] || [],
  }));

  return c.json({ tasks: tasksWithTags });
});

app.get("/api/tasks/:id", async (c) => {
  const user = await getAuthUser(c);
  if (!user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const taskId = c.req.param("id");
  const db = drizzle(c.env.DB);

  const [foundTask] = await db
    .select()
    .from(task)
    .where(and(eq(task.id, taskId), eq(task.userId, user.id)));

  if (!foundTask) {
    return c.json({ error: "Task not found" }, 404);
  }

  return c.json({ task: foundTask });
});

app.post("/api/tasks", zValidator("json", createTaskSchema), async (c) => {
  const user = await getAuthUser(c);
  if (!user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const body = c.req.valid("json");

  const db = drizzle(c.env.DB);
  const now = new Date();
  const newTask = {
    id: crypto.randomUUID(),
    title: body.title,
    description: body.description ?? null,
    status: body.status,
    priority: body.priority,
    dueDate: body.dueDate ? new Date(body.dueDate) : null,
    userId: user.id,
    createdAt: now,
    updatedAt: now,
  };

  await db.insert(task).values(newTask);

  return c.json({ task: newTask }, 201);
});

app.patch("/api/tasks/:id", zValidator("json", updateTaskSchema), async (c) => {
  const user = await getAuthUser(c);
  if (!user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const taskId = c.req.param("id");
  const db = drizzle(c.env.DB);

  const [existingTask] = await db
    .select()
    .from(task)
    .where(and(eq(task.id, taskId), eq(task.userId, user.id)));

  if (!existingTask) {
    return c.json({ error: "Task not found" }, 404);
  }

  const body = c.req.valid("json");

  const updateData: Partial<typeof existingTask> = {
    updatedAt: new Date(),
  };

  if (body.title !== undefined) updateData.title = body.title;
  if (body.description !== undefined) updateData.description = body.description;
  if (body.status !== undefined) updateData.status = body.status;
  if (body.priority !== undefined) updateData.priority = body.priority;
  if (body.dueDate !== undefined) updateData.dueDate = body.dueDate ? new Date(body.dueDate) : null;

  await db.update(task).set(updateData).where(eq(task.id, taskId));

  const [updatedTask] = await db.select().from(task).where(eq(task.id, taskId));

  return c.json({ task: updatedTask });
});

app.delete("/api/tasks/:id", async (c) => {
  const user = await getAuthUser(c);
  if (!user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const taskId = c.req.param("id");
  const db = drizzle(c.env.DB);

  const [existingTask] = await db
    .select()
    .from(task)
    .where(and(eq(task.id, taskId), eq(task.userId, user.id)));

  if (!existingTask) {
    return c.json({ error: "Task not found" }, 404);
  }

  await db.delete(task).where(eq(task.id, taskId));

  return c.json({ message: "Task deleted successfully" });
});

// ==================== TAG ROUTES ====================

// Get all tags for the current user
app.get("/api/tags", async (c) => {
  const user = await getAuthUser(c);
  if (!user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const db = drizzle(c.env.DB);
  const tags = await db.select().from(tag).where(eq(tag.userId, user.id));

  return c.json({ tags });
});

// Create a new tag
app.post("/api/tags", zValidator("json", createTagSchema), async (c) => {
  const user = await getAuthUser(c);
  if (!user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const body = c.req.valid("json");
  const db = drizzle(c.env.DB);

  const newTag = {
    id: crypto.randomUUID(),
    name: body.name,
    color: body.color,
    userId: user.id,
    createdAt: new Date(),
  };

  await db.insert(tag).values(newTag);

  return c.json({ tag: newTag }, 201);
});

// Update a tag
app.patch("/api/tags/:id", zValidator("json", updateTagSchema), async (c) => {
  const user = await getAuthUser(c);
  if (!user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const tagId = c.req.param("id");
  const db = drizzle(c.env.DB);

  const [existingTag] = await db
    .select()
    .from(tag)
    .where(and(eq(tag.id, tagId), eq(tag.userId, user.id)));

  if (!existingTag) {
    return c.json({ error: "Tag not found" }, 404);
  }

  const body = c.req.valid("json");
  const updateData: Partial<typeof existingTag> = {};

  if (body.name !== undefined) updateData.name = body.name;
  if (body.color !== undefined) updateData.color = body.color;

  await db.update(tag).set(updateData).where(eq(tag.id, tagId));

  const [updatedTag] = await db.select().from(tag).where(eq(tag.id, tagId));

  return c.json({ tag: updatedTag });
});

// Delete a tag
app.delete("/api/tags/:id", async (c) => {
  const user = await getAuthUser(c);
  if (!user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const tagId = c.req.param("id");
  const db = drizzle(c.env.DB);

  const [existingTag] = await db
    .select()
    .from(tag)
    .where(and(eq(tag.id, tagId), eq(tag.userId, user.id)));

  if (!existingTag) {
    return c.json({ error: "Tag not found" }, 404);
  }

  await db.delete(tag).where(eq(tag.id, tagId));

  return c.json({ message: "Tag deleted successfully" });
});

// Add tags to a task
app.post("/api/tasks/:id/tags", async (c) => {
  const user = await getAuthUser(c);
  if (!user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const taskId = c.req.param("id");
  const body = await c.req.json<{ tagIds: string[] }>();
  const db = drizzle(c.env.DB);

  // Verify task belongs to user
  const [existingTask] = await db
    .select()
    .from(task)
    .where(and(eq(task.id, taskId), eq(task.userId, user.id)));

  if (!existingTask) {
    return c.json({ error: "Task not found" }, 404);
  }

  // Verify all tags belong to user
  const userTags = await db
    .select()
    .from(tag)
    .where(and(eq(tag.userId, user.id), inArray(tag.id, body.tagIds)));

  if (userTags.length !== body.tagIds.length) {
    return c.json({ error: "One or more tags not found" }, 404);
  }

  // Remove existing tags and add new ones
  await db.delete(taskTag).where(eq(taskTag.taskId, taskId));

  if (body.tagIds.length > 0) {
    const taskTagValues = body.tagIds.map((tagId) => ({
      taskId,
      tagId,
    }));
    await db.insert(taskTag).values(taskTagValues);
  }

  return c.json({ message: "Tags updated successfully" });
});

// Get tags for a specific task
app.get("/api/tasks/:id/tags", async (c) => {
  const user = await getAuthUser(c);
  if (!user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const taskId = c.req.param("id");
  const db = drizzle(c.env.DB);

  // Verify task belongs to user
  const [existingTask] = await db
    .select()
    .from(task)
    .where(and(eq(task.id, taskId), eq(task.userId, user.id)));

  if (!existingTask) {
    return c.json({ error: "Task not found" }, 404);
  }

  const taskTags = await db
    .select({ tag })
    .from(taskTag)
    .innerJoin(tag, eq(taskTag.tagId, tag.id))
    .where(eq(taskTag.taskId, taskId));

  return c.json({ tags: taskTags.map((tt) => tt.tag) });
});

export default app;
