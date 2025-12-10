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
  const taskId = crypto.randomUUID();
  const newTask = {
    id: taskId,
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

  // Handle tags if provided
  if (body.tagIds && body.tagIds.length > 0) {
    // Verify all tags belong to user
    const userTags = await db
      .select()
      .from(tag)
      .where(and(eq(tag.userId, user.id), inArray(tag.id, body.tagIds)));

    if (userTags.length > 0) {
      const taskTagValues = userTags.map((t) => ({
        taskId,
        tagId: t.id,
      }));
      await db.insert(taskTag).values(taskTagValues);
    }
  }

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

// Seed demo data endpoint (for demonstration purposes)
app.post("/api/seed-demo", async (c) => {
  const user = await getAuthUser(c);
  if (!user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const db = drizzle(c.env.DB);
  const now = new Date();
  
  // Helper to create dates relative to now
  const daysFromNow = (days: number) => {
    const date = new Date(now);
    date.setDate(date.getDate() + days);
    return date;
  };

  // Create demo tags
  const demoTags = [
    { id: `tag_work_${user.id}`, name: "Work", color: "blue" as const },
    { id: `tag_personal_${user.id}`, name: "Personal", color: "green" as const },
    { id: `tag_urgent_${user.id}`, name: "Urgent", color: "red" as const },
    { id: `tag_meeting_${user.id}`, name: "Meeting", color: "purple" as const },
    { id: `tag_development_${user.id}`, name: "Development", color: "indigo" as const },
    { id: `tag_design_${user.id}`, name: "Design", color: "pink" as const },
    { id: `tag_marketing_${user.id}`, name: "Marketing", color: "orange" as const },
    { id: `tag_finance_${user.id}`, name: "Finance", color: "teal" as const },
    { id: `tag_hr_${user.id}`, name: "HR", color: "yellow" as const },
    { id: `tag_client_${user.id}`, name: "Client", color: "gray" as const },
  ];

  // Create demo tasks for Pakistan audience
  const demoTasks = [
    // Completed Tasks
    { 
      id: `demo_task_01_${user.id}`, 
      title: "Complete NUST Project Proposal", 
      description: "Finalize the project proposal for NUST university collaboration on AI research",
      status: "completed" as const, 
      priority: "high" as const, 
      dueDate: daysFromNow(-2),
      createdAt: daysFromNow(-7),
      tags: ["Work", "Meeting"]
    },
    { 
      id: `demo_task_02_${user.id}`, 
      title: "Submit PSX Financial Report", 
      description: "Submit quarterly financial report to Pakistan Stock Exchange",
      status: "completed" as const, 
      priority: "urgent" as const, 
      dueDate: daysFromNow(-1),
      createdAt: daysFromNow(-14),
      tags: ["Finance", "Urgent"]
    },
    { 
      id: `demo_task_03_${user.id}`, 
      title: "Review Karachi Office Budget", 
      description: "Review and approve budget allocation for Karachi regional office",
      status: "completed" as const, 
      priority: "medium" as const, 
      dueDate: daysFromNow(-3),
      createdAt: daysFromNow(-10),
      tags: ["Finance"]
    },
    { 
      id: `demo_task_04_${user.id}`, 
      title: "Launch JazzCash Integration", 
      description: "Complete mobile payment integration with JazzCash API",
      status: "completed" as const, 
      priority: "high" as const, 
      dueDate: daysFromNow(-5),
      createdAt: daysFromNow(-21),
      tags: ["Development"]
    },
    { 
      id: `demo_task_05_${user.id}`, 
      title: "Finalize Lahore Team Hiring", 
      description: "Complete hiring process for 5 developers in Lahore office",
      status: "completed" as const, 
      priority: "medium" as const, 
      dueDate: daysFromNow(-4),
      createdAt: daysFromNow(-30),
      tags: ["HR"]
    },

    // In Progress Tasks
    { 
      id: `demo_task_06_${user.id}`, 
      title: "Develop Easypaisa Payment Module", 
      description: "Build and test Easypaisa payment gateway integration for e-commerce platform",
      status: "in_progress" as const, 
      priority: "high" as const, 
      dueDate: daysFromNow(3),
      createdAt: daysFromNow(-5),
      tags: ["Development", "Client"]
    },
    { 
      id: `demo_task_07_${user.id}`, 
      title: "Design Islamabad Conference Banner", 
      description: "Create promotional materials for Pakistan Tech Summit in Islamabad",
      status: "in_progress" as const, 
      priority: "medium" as const, 
      dueDate: daysFromNow(5),
      createdAt: daysFromNow(-3),
      tags: ["Design", "Marketing"]
    },
    { 
      id: `demo_task_08_${user.id}`, 
      title: "Update SECP Compliance Documents", 
      description: "Review and update all Securities and Exchange Commission compliance paperwork",
      status: "in_progress" as const, 
      priority: "urgent" as const, 
      dueDate: daysFromNow(1),
      createdAt: daysFromNow(-2),
      tags: ["Finance", "Urgent"]
    },
    { 
      id: `demo_task_09_${user.id}`, 
      title: "Prepare Peshawar Branch Expansion Plan", 
      description: "Draft business case for new branch in Peshawar region",
      status: "in_progress" as const, 
      priority: "medium" as const, 
      dueDate: daysFromNow(7),
      createdAt: daysFromNow(-4),
      tags: ["Work"]
    },
    { 
      id: `demo_task_10_${user.id}`, 
      title: "Coordinate with PTA for License Renewal", 
      description: "Work with Pakistan Telecommunication Authority for service license renewal",
      status: "in_progress" as const, 
      priority: "high" as const, 
      dueDate: daysFromNow(2),
      createdAt: daysFromNow(-1),
      tags: ["Work", "Client"]
    },

    // Todo Tasks
    { 
      id: `demo_task_11_${user.id}`, 
      title: "Schedule Meeting with PITB Team", 
      description: "Arrange meeting with Punjab Information Technology Board for smart city project",
      status: "todo" as const, 
      priority: "high" as const, 
      dueDate: daysFromNow(4),
      createdAt: daysFromNow(-1),
      tags: ["Meeting", "Client"]
    },
    { 
      id: `demo_task_12_${user.id}`, 
      title: "Review Faisalabad Factory Automation", 
      description: "Evaluate automation proposals for textile manufacturing unit",
      status: "todo" as const, 
      priority: "medium" as const, 
      dueDate: daysFromNow(10),
      createdAt: daysFromNow(0),
      tags: ["Work"]
    },
    { 
      id: `demo_task_13_${user.id}`, 
      title: "Update Pakistan Market Analysis Report", 
      description: "Refresh quarterly market analysis for investors",
      status: "todo" as const, 
      priority: "medium" as const, 
      dueDate: daysFromNow(14),
      createdAt: daysFromNow(0),
      tags: ["Marketing"]
    },
    { 
      id: `demo_task_14_${user.id}`, 
      title: "Plan Multan Office Team Building", 
      description: "Organize team building event for Multan regional team",
      status: "todo" as const, 
      priority: "low" as const, 
      dueDate: daysFromNow(21),
      createdAt: daysFromNow(0),
      tags: ["Personal", "HR"]
    },
    { 
      id: `demo_task_15_${user.id}`, 
      title: "Implement FBR Tax Calculation Module", 
      description: "Build Federal Board of Revenue tax calculation feature",
      status: "todo" as const, 
      priority: "urgent" as const, 
      dueDate: daysFromNow(2),
      createdAt: daysFromNow(0),
      tags: ["Development", "Finance", "Urgent"]
    },
    { 
      id: `demo_task_16_${user.id}`, 
      title: "Prepare Rawalpindi Office Lease Agreement", 
      description: "Review and finalize office space lease for Rawalpindi expansion",
      status: "todo" as const, 
      priority: "medium" as const, 
      dueDate: daysFromNow(8),
      createdAt: daysFromNow(0),
      tags: ["Work"]
    },
    { 
      id: `demo_task_17_${user.id}`, 
      title: "Design Urdu Language Support UI", 
      description: "Create RTL (Right-to-Left) interface for Urdu language support",
      status: "todo" as const, 
      priority: "high" as const, 
      dueDate: daysFromNow(6),
      createdAt: daysFromNow(0),
      tags: ["Design", "Development"]
    },
    { 
      id: `demo_task_18_${user.id}`, 
      title: "Submit NADRA Integration Request", 
      description: "Apply for NADRA database integration for identity verification",
      status: "todo" as const, 
      priority: "high" as const, 
      dueDate: daysFromNow(3),
      createdAt: daysFromNow(0),
      tags: ["Development", "Client"]
    },
  ];

  try {
    // Insert tags (ignore if already exists)
    for (const tagData of demoTags) {
      await db.insert(tag).values({
        id: tagData.id,
        name: tagData.name,
        color: tagData.color,
        userId: user.id,
        createdAt: now,
      }).onConflictDoNothing();
    }

    // Create a map of tag names to IDs
    const tagNameToId: Record<string, string> = {};
    for (const t of demoTags) {
      tagNameToId[t.name] = t.id;
    }

    // Insert tasks
    for (const taskData of demoTasks) {
      await db.insert(task).values({
        id: taskData.id,
        title: taskData.title,
        description: taskData.description,
        status: taskData.status,
        priority: taskData.priority,
        dueDate: taskData.dueDate,
        userId: user.id,
        createdAt: taskData.createdAt,
        updatedAt: now,
      }).onConflictDoNothing();

      // Insert task-tag relationships
      for (const tagName of taskData.tags) {
        const tagId = tagNameToId[tagName];
        if (tagId) {
          await db.insert(taskTag).values({
            taskId: taskData.id,
            tagId: tagId,
          }).onConflictDoNothing();
        }
      }
    }

    return c.json({ 
      message: "Demo data seeded successfully", 
      tasksCreated: demoTasks.length,
      tagsCreated: demoTags.length 
    });
  } catch (error) {
    console.error("Seed error:", error);
    return c.json({ error: "Failed to seed demo data" }, 500);
  }
});

// ==================== AI TRANSCRIPTION ROUTES ====================

// Free tier limits - programmatic controls to never exceed
const AI_FREE_TIER = {
  NEURONS_PER_DAY: 10000,
  NEURONS_PER_MINUTE: 47, // whisper-large-v3-turbo
  MAX_AUDIO_MINUTES: Math.floor(10000 / 47), // ~212 minutes
  SAFETY_BUFFER: 0.95, // Use only 95% of limit for safety
};

const KV_FREE_TIER = {
  WRITES_PER_DAY: 1000,
  READS_PER_DAY: 100000,
  MAX_TRANSCRIPTIONS: 500, // Half of write limit for safety
};

interface AIUsage {
  neurons: number;
  minutes: number;
  requests: number;
  lastUpdated: string;
}

// Get today's date key for KV
const getUsageKey = () => {
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD in UTC
  return `ai_usage:${today}`;
};

// Get current AI usage from KV
const getAIUsage = async (kv: KVNamespace): Promise<AIUsage> => {
  const key = getUsageKey();
  const stored = await kv.get(key);
  if (stored) {
    return JSON.parse(stored);
  }
  return { neurons: 0, minutes: 0, requests: 0, lastUpdated: new Date().toISOString() };
};

// Update AI usage in KV
const updateAIUsage = async (kv: KVNamespace, usage: AIUsage): Promise<void> => {
  const key = getUsageKey();
  // Set TTL to 48 hours to auto-cleanup old entries
  await kv.put(key, JSON.stringify(usage), { expirationTtl: 60 * 60 * 48 });
};

// Check if we're within free tier limits
const checkFreeTierLimits = (usage: AIUsage): { allowed: boolean; reason?: string; remaining: number } => {
  const safeMaxNeurons = AI_FREE_TIER.NEURONS_PER_DAY * AI_FREE_TIER.SAFETY_BUFFER;
  const safeMaxRequests = KV_FREE_TIER.MAX_TRANSCRIPTIONS;
  
  const remainingNeurons = Math.max(0, safeMaxNeurons - usage.neurons);
  const remainingMinutes = Math.floor(remainingNeurons / AI_FREE_TIER.NEURONS_PER_MINUTE);
  
  if (usage.neurons >= safeMaxNeurons) {
    return { 
      allowed: false, 
      reason: "Daily AI neuron limit reached. Resets at midnight UTC.", 
      remaining: 0 
    };
  }
  
  if (usage.requests >= safeMaxRequests) {
    return { 
      allowed: false, 
      reason: "Daily request limit reached. Resets at midnight UTC.", 
      remaining: 0 
    };
  }
  
  return { allowed: true, remaining: remainingMinutes };
};

// Get AI usage stats
app.get("/api/ai-usage", async (c) => {
  const user = await getAuthUser(c);
  if (!user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  try {
    const usage = await getAIUsage(c.env.USAGE_KV);
    const limits = checkFreeTierLimits(usage);
    
    const safeMaxMinutes = Math.floor((AI_FREE_TIER.NEURONS_PER_DAY * AI_FREE_TIER.SAFETY_BUFFER) / AI_FREE_TIER.NEURONS_PER_MINUTE);
    
    return c.json({
      usage: {
        minutes: Math.round(usage.minutes * 10) / 10,
        requests: usage.requests,
        percentUsed: Math.round((usage.minutes / safeMaxMinutes) * 100),
      },
      limits: {
        maxMinutes: safeMaxMinutes,
        remainingMinutes: limits.remaining,
        allowed: limits.allowed,
        reason: limits.reason,
      },
      resetsAt: new Date(new Date().toISOString().split("T")[0] + "T00:00:00Z").getTime() + 86400000, // Midnight UTC tomorrow
    });
  } catch (error) {
    console.error("AI usage error:", error);
    return c.json({ error: "Failed to get AI usage" }, 500);
  }
});

// Transcribe audio to text
app.post("/api/transcribe", async (c) => {
  const user = await getAuthUser(c);
  if (!user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  try {
    // Check free tier limits BEFORE processing
    const currentUsage = await getAIUsage(c.env.USAGE_KV);
    const limitCheck = checkFreeTierLimits(currentUsage);
    
    if (!limitCheck.allowed) {
      return c.json({ 
        error: limitCheck.reason,
        remaining: limitCheck.remaining,
        allowed: false,
      }, 429); // Too Many Requests
    }

    // Get audio data from form
    const formData = await c.req.formData();
    const audioFile = formData.get("audio");
    const languageParam = formData.get("language") as string | null;
    
    if (!audioFile || !(audioFile instanceof File)) {
      return c.json({ error: "No audio file provided" }, 400);
    }

    // Convert to base64
    const audioBuffer = await audioFile.arrayBuffer();
    const audioBase64 = btoa(
      new Uint8Array(audioBuffer).reduce((data, byte) => data + String.fromCharCode(byte), "")
    );

    // Estimate audio duration for limiting (rough estimate: 16kHz, 16-bit mono = 32000 bytes/sec)
    const estimatedSeconds = audioBuffer.byteLength / 32000;
    const estimatedMinutes = estimatedSeconds / 60;
    
    // Safety: Reject very long audio to protect free tier
    if (estimatedMinutes > 2) {
      return c.json({ error: "Audio too long. Maximum 2 minutes per recording." }, 400);
    }

    // Map regional language codes to Whisper-supported codes
    const WHISPER_LANGUAGE_MAP: Record<string, string> = {
      "en": "en",
      "ur": "ur",
      "ps": "ps",  // Pashto is directly supported
      "hi": "hi",  // Hindi/Hindko
      "sd": "sd",  // Sindhi/Saraiki
      "bal": "fa", // Map Balochi to Persian (closest)
      "brh": "fa", // Map Brahui to Persian (closest)
      "bft": "bo", // Map Balti to Tibetan (closest)
      "scl": "ur", // Map Shina to Urdu (closest)
      "bsk": "ur", // Map Burushaski to Urdu (closest)
      "khw": "ur", // Map Khowar to Urdu (closest)
      "wbl": "fa", // Map Wakhi to Persian (closest)
      "pa": "pa",  // Punjabi is directly supported
    };

    // Get the whisper-compatible language code
    const whisperLanguage = languageParam 
      ? WHISPER_LANGUAGE_MAP[languageParam] || languageParam 
      : undefined;

    // Call Whisper AI with language hint if provided
    const response = await c.env.AI.run("@cf/openai/whisper-large-v3-turbo", {
      audio: audioBase64,
      task: "transcribe",
      vad_filter: true, // Filter out silence
      ...(whisperLanguage && { language: whisperLanguage }),
    });

    // Get actual duration from response if available
    const actualMinutes = response.transcription_info?.duration 
      ? response.transcription_info.duration / 60 
      : estimatedMinutes;

    // Calculate neurons used
    const neuronsUsed = Math.ceil(actualMinutes * AI_FREE_TIER.NEURONS_PER_MINUTE);

    // Update usage in KV (single write)
    const updatedUsage: AIUsage = {
      neurons: currentUsage.neurons + neuronsUsed,
      minutes: currentUsage.minutes + actualMinutes,
      requests: currentUsage.requests + 1,
      lastUpdated: new Date().toISOString(),
    };
    await updateAIUsage(c.env.USAGE_KV, updatedUsage);

    // Return transcription
    return c.json({
      text: response.text || "",
      language: response.transcription_info?.language,
      duration: actualMinutes,
      remaining: checkFreeTierLimits(updatedUsage).remaining,
    });

  } catch (error) {
    console.error("Transcription error:", error);
    return c.json({ error: "Failed to transcribe audio" }, 500);
  }
});

export default app;
