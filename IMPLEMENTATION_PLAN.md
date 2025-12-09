# 📋 Task Manager Capstone - Implementation Plan

> **Project:** Task Manager (tm)  
> **Approach:** Test-Driven Development (TDD)  
> **Date:** December 9, 2025

---

## 📚 Table of Contents

1. [Tech Stack Overview](#tech-stack-overview)
2. [Execution Flow](#execution-flow)
3. [Testing Strategy](#testing-strategy)
4. [Sprint 0: Testing Infrastructure](#sprint-0-testing-infrastructure-setup)
5. [Sprint 1: Dark Mode Toggle](#sprint-1-dark-mode-toggle)
6. [Sprint 2: Task Priorities](#sprint-2-task-priorities)
7. [Sprint 3: Due Dates](#sprint-3-due-dates)
8. [Sprint 4: Tags System](#sprint-4-tags-system)
9. [Sprint 5: User Profile Page](#sprint-5-user-profile-page)
10. [Sprint 6: Drag & Drop Kanban](#sprint-6-drag--drop-kanban)
11. [Sprint 7: Polish & Branding](#sprint-7-polish--branding)
12. [Sprint 8: E2E Tests](#sprint-8-e2e-tests)

---

## Tech Stack Overview

| Layer           | Technology                               | Purpose                                 |
| --------------- | ---------------------------------------- | --------------------------------------- |
| **Runtime**     | Bun                                      | Ultra-fast JS runtime & package manager |
| **Frontend**    | React + TanStack Router + TanStack Query | UI, routing, server state               |
| **Backend**     | Hono.js on Cloudflare Workers            | Edge API                                |
| **Database**    | Cloudflare D1 + Drizzle ORM              | Serverless SQLite                       |
| **Auth**        | Better Auth                              | Email/password authentication           |
| **UI**          | Tailwind CSS + Radix UI + Lucide Icons   | Styling & components                    |
| **Forms**       | React Hook Form + Zod                    | Form handling & validation              |
| **Drag & Drop** | @dnd-kit/core + @dnd-kit/sortable        | Kanban board                            |
| **Deployment**  | Wrangler CLI                             | Cloudflare deployment                   |

---

## Execution Flow

```
Phase 1 (Sequential - Foundation)
└── Sprint 0: Testing Infrastructure ────────────────────────┐
                                                             │
Phase 2 (Parallel - Features) ◄──────────────────────────────┘
├── Sprint 1: Dark Mode        ─┬─ Can run in parallel
├── Sprint 2: Task Priorities   │
├── Sprint 3: Due Dates         │
├── Sprint 4: Tags System       │
├── Sprint 5: User Profile      │
└── Sprint 6: Drag & Drop      ─┘

Phase 3 (Sequential - After all features)
├── Sprint 7: Polish & Branding
└── Sprint 8: E2E Tests
```

### Summary

| Phase | Sprints     | Parallelization            | Estimated Commits |
| ----- | ----------- | -------------------------- | ----------------- |
| 1     | Sprint 0    | Sequential (first)         | 1                 |
| 2     | Sprints 1-6 | **Parallel**               | 6                 |
| 3     | Sprints 7-8 | Sequential (after Phase 2) | 2                 |

**Total Commits: 9**

---

## Testing Strategy

| Test Type                    | Tool                                         | Purpose                           |
| ---------------------------- | -------------------------------------------- | --------------------------------- |
| **Backend Unit Tests**       | Bun Test                                     | Test Hono API handlers/middleware |
| **Frontend Component Tests** | Bun Test + React Testing Library + happy-dom | Test React components             |
| **E2E Tests**                | Playwright                                   | Test full user flows              |

### TDD Workflow per Sprint

1. **Red Phase:** Write failing tests first
2. **Green Phase:** Implement minimum code to pass tests
3. **Refactor Phase:** Clean up code while keeping tests green
4. **Commit:** Single atomic commit per sprint

---

## Sprint 0: Testing Infrastructure Setup

### Metadata

- **Independent:** ✅ Yes (must be first)
- **Commit:** `chore: setup testing infrastructure with Bun Test and Playwright`

### Subagent Prompt

```
You are implementing Sprint 0: Testing Infrastructure Setup for a Task Manager application.

PROJECT CONTEXT:
- Runtime: Bun
- Frontend: React + TanStack Router/Query
- Backend: Hono.js on Cloudflare Workers
- Database: Cloudflare D1 + Drizzle ORM
- Project path: c:\My Stuff\British Council\ToT Full Stack\tm\tm

TASK: Set up complete testing infrastructure with TDD support.

STEPS:
1. Install testing dependencies:
   - bun add -d @testing-library/react @testing-library/dom happy-dom playwright @playwright/test

2. Create test configuration:
   - Create bunfig.toml with happy-dom preload
   - Create playwright.config.ts

3. Create folder structure:
   - src/worker/__tests__/ (backend tests)
   - src/react-app/__tests__/ (frontend tests)
   - tests/ (E2E Playwright tests)
   - src/react-app/__tests__/setup.ts (test setup file)

4. Update package.json scripts:
   - "test": "bun test"
   - "test:watch": "bun test --watch"
   - "test:e2e": "playwright test"

5. Create example tests to verify setup works:
   - src/worker/__tests__/health.test.ts (test GET /health endpoint)
   - src/react-app/__tests__/example.test.tsx (simple component test)

VERIFICATION:
- Run "bun test" and ensure tests pass
- Ensure no TypeScript errors

COMMIT: "chore: setup testing infrastructure with Bun Test and Playwright"

Return list of files created/modified.
```

### Expected Files

- `bunfig.toml`
- `playwright.config.ts`
- `src/worker/__tests__/health.test.ts`
- `src/react-app/__tests__/setup.ts`
- `src/react-app/__tests__/example.test.tsx`
- `tests/.gitkeep`
- `package.json` (updated scripts)

---

## Sprint 1: Dark Mode Toggle

### Metadata

- **Independent:** ✅ Yes (after Sprint 0)
- **Commit:** `feat: implement dark mode toggle with localStorage persistence`

### Subagent Prompt

```
You are implementing Sprint 1: Dark Mode Toggle for a Task Manager application.

PROJECT CONTEXT:
- Frontend: React + TanStack Router + Tailwind CSS v4
- UI: Radix UI components + shadcn/ui patterns
- Project path: c:\My Stuff\British Council\ToT Full Stack\tm\tm

TASK: Implement dark mode with theme toggle (TDD approach).

STEP 1 - Write Tests First:
Create src/react-app/__tests__/theme.test.tsx:
- Test: ThemeProvider renders children
- Test: useTheme returns current theme
- Test: toggleTheme switches between light/dark
- Test: theme persists to localStorage
- Test: respects system preference initially

STEP 2 - Implement Theme System:
Create src/react-app/components/theme-provider.tsx:
- ThemeProvider context with light/dark/system options
- useTheme hook
- Read/write to localStorage key "tm-theme"
- Apply class to document.documentElement

STEP 3 - Create Toggle Component:
Create src/react-app/components/theme-toggle.tsx:
- Button with sun/moon icon (use lucide-react icons)
- Cycles through light → dark → system
- Shows current theme visually

STEP 4 - Integrate:
- Wrap app in ThemeProvider in main.tsx
- Add ThemeToggle to site-header.tsx

STEP 5 - Tailwind Configuration:
- Ensure Tailwind darkMode is set to "class"
- Add dark: variants to existing components if needed

VERIFICATION:
- Run "bun test" - theme tests should pass
- Toggle works in browser
- Theme persists on refresh

COMMIT: "feat: implement dark mode toggle with localStorage persistence"

Return list of files created/modified.
```

### Expected Files

- `src/react-app/__tests__/theme.test.tsx`
- `src/react-app/components/theme-provider.tsx`
- `src/react-app/components/theme-toggle.tsx`
- `src/react-app/main.tsx` (updated)
- `src/react-app/components/site-header.tsx` (updated)

---

## Sprint 2: Task Priorities

### Metadata

- **Independent:** ✅ Yes (after Sprint 0)
- **Commit:** `feat: add task priorities (high/medium/low) with color-coded badges`

### Subagent Prompt

```
You are implementing Sprint 2: Task Priorities for a Task Manager application.

PROJECT CONTEXT:
- Backend: Hono.js + Drizzle ORM + Cloudflare D1
- Frontend: React + TanStack Query + React Hook Form + Zod
- Project path: c:\My Stuff\British Council\ToT Full Stack\tm\tm

TASK: Add task priority field (high/medium/low) with TDD approach.

STEP 1 - Write Backend Tests:
Create src/worker/__tests__/tasks-priority.test.ts:
- Test: POST /tasks accepts priority field
- Test: GET /tasks returns priority field
- Test: PATCH /tasks/:id updates priority
- Test: Default priority is "medium" if not provided
- Test: Invalid priority value returns 400

STEP 2 - Update Schema:
In src/worker/db/schema.ts:
- Add priority enum: ["high", "medium", "low"]
- Add priority column to tasks table (default: "medium")

STEP 3 - Run Migration:
- Run: bun drizzle-kit generate
- Run: bun wrangler d1 migrations apply tm-d1 --local

STEP 4 - Update Backend API:
In src/worker/index.ts:
- Update createTaskSchema to include priority (optional, default "medium")
- Update updateTaskSchema to include priority (optional)
- Ensure routes return priority field

STEP 5 - Write Frontend Tests:
Create src/react-app/__tests__/priority.test.tsx:
- Test: Priority select renders with 3 options
- Test: Priority badge renders correct color
- Test: Create form submits priority

STEP 6 - Update Frontend:
Create src/react-app/components/priority-badge.tsx:
- High: red/destructive badge
- Medium: yellow/warning badge
- Low: green/success badge

Update src/react-app/components/create-task-form.tsx:
- Add priority select field

Update src/react-app/components/data-table.tsx:
- Add priority column with badge
- Add priority filter dropdown

STEP 7 - Update Types:
Update any Task type definitions to include priority

VERIFICATION:
- Run "bun test" - all priority tests pass
- Create task with different priorities
- See priority badges in table
- Filter by priority works

COMMIT: "feat: add task priorities (high/medium/low) with color-coded badges"

Return list of files created/modified.
```

### Expected Files

- `src/worker/__tests__/tasks-priority.test.ts`
- `src/worker/db/schema.ts` (updated)
- `src/worker/index.ts` (updated)
- `drizzle/XXXX_*.sql` (new migration)
- `src/react-app/__tests__/priority.test.tsx`
- `src/react-app/components/priority-badge.tsx`
- `src/react-app/components/create-task-form.tsx` (updated)
- `src/react-app/components/data-table.tsx` (updated)

---

## Sprint 3: Due Dates

### Metadata

- **Independent:** ✅ Yes (after Sprint 0)
- **Commit:** `feat: add due dates with visual indicators (overdue, today, upcoming)`

### Subagent Prompt

```
You are implementing Sprint 3: Due Dates for a Task Manager application.

PROJECT CONTEXT:
- Backend: Hono.js + Drizzle ORM + Cloudflare D1
- Frontend: React + TanStack Query + React Hook Form
- Project path: c:\My Stuff\British Council\ToT Full Stack\tm\tm

TASK: Add due date field with visual indicators (TDD approach).

STEP 1 - Write Backend Tests:
Create src/worker/__tests__/tasks-duedate.test.ts:
- Test: POST /tasks accepts dueDate (ISO string or timestamp)
- Test: GET /tasks returns dueDate
- Test: PATCH /tasks/:id updates dueDate
- Test: dueDate can be null (optional field)

STEP 2 - Update Schema:
In src/worker/db/schema.ts:
- Add dueDate column (integer timestamp, nullable)

STEP 3 - Run Migration:
- Run: bun drizzle-kit generate
- Run: bun wrangler d1 migrations apply tm-d1 --local

STEP 4 - Update Backend API:
In src/worker/index.ts:
- Update createTaskSchema: dueDate as optional number
- Update updateTaskSchema: dueDate as optional number
- Handle date serialization

STEP 5 - Write Frontend Tests:
Create src/react-app/__tests__/duedate.test.tsx:
- Test: Date input renders
- Test: Due date displays formatted
- Test: Overdue shows red indicator
- Test: Due today shows yellow indicator
- Test: Due this week shows normal

STEP 6 - Create Date Picker:
Create src/react-app/components/ui/date-picker.tsx:
- Use native date input or install a date picker library
- Format dates nicely (e.g., "Dec 15, 2025")

STEP 7 - Create Due Date Display:
Create src/react-app/components/due-date-badge.tsx:
- Overdue: red with "Overdue" text
- Due today: yellow with "Today"
- Due this week: blue with "This week"
- Future: gray with formatted date
- No due date: "-" or empty

STEP 8 - Update Frontend Forms & Table:
Update src/react-app/components/create-task-form.tsx:
- Add date picker for due date

Update src/react-app/components/data-table.tsx:
- Add due date column with badge
- Add sort by due date option
- Consider filter: overdue, due today, due this week

VERIFICATION:
- Run "bun test" - all due date tests pass
- Create task with due date
- See appropriate indicators based on date
- Sort by due date works

COMMIT: "feat: add due dates with visual indicators (overdue, today, upcoming)"

Return list of files created/modified.
```

### Expected Files

- `src/worker/__tests__/tasks-duedate.test.ts`
- `src/worker/db/schema.ts` (updated)
- `src/worker/index.ts` (updated)
- `drizzle/XXXX_*.sql` (new migration)
- `src/react-app/__tests__/duedate.test.tsx`
- `src/react-app/components/ui/date-picker.tsx`
- `src/react-app/components/due-date-badge.tsx`
- `src/react-app/components/create-task-form.tsx` (updated)
- `src/react-app/components/data-table.tsx` (updated)

---

## Sprint 4: Tags System

### Metadata

- **Independent:** ✅ Yes (after Sprint 0)
- **Commit:** `feat: add tags system with filtering and color-coded badges`

### Subagent Prompt

```
You are implementing Sprint 4: Tags/Categories System for a Task Manager application.

PROJECT CONTEXT:
- Backend: Hono.js + Drizzle ORM + Cloudflare D1
- Frontend: React + TanStack Query
- Project path: c:\My Stuff\British Council\ToT Full Stack\tm\tm

TASK: Add tags system with many-to-many task-tag relationship (TDD approach).

STEP 1 - Write Backend Tests:
Create src/worker/__tests__/tags.test.ts:
- Test: GET /tags returns user's tags
- Test: POST /tags creates new tag
- Test: DELETE /tags/:id deletes tag
- Test: POST /tasks with tagIds creates associations
- Test: GET /tasks includes tags array
- Test: GET /tasks?tagId=X filters by tag

STEP 2 - Create Schema:
In src/worker/db/schema.ts:
Add tags table:
- id: text primary key
- name: text not null
- color: text (optional, for badge color)
- userId: text FK to user

Add taskTags junction table:
- taskId: text FK to tasks (cascade delete)
- tagId: text FK to tags (cascade delete)
- Primary key: (taskId, tagId)

STEP 3 - Run Migration:
- Run: bun drizzle-kit generate
- Run: bun wrangler d1 migrations apply tm-d1 --local

STEP 4 - Implement Tags API:
In src/worker/index.ts add routes:
- GET /tags - list user's tags
- POST /tags - create tag {name, color?}
- DELETE /tags/:id - delete tag

Update task routes:
- POST /tasks accepts tagIds array
- GET /tasks returns tags array per task
- GET /tasks?tagId=X filters by tag

STEP 5 - Write Frontend Tests:
Create src/react-app/__tests__/tags.test.tsx:
- Test: Tag badge renders with color
- Test: Tag selector shows available tags
- Test: Tag filter works
- Test: Create tag form works

STEP 6 - Create Tag Components:
Create src/react-app/components/tag-badge.tsx:
- Colored badge based on tag.color
- Small "x" button for removal in edit mode

Create src/react-app/components/tag-selector.tsx:
- Multi-select for tags
- Option to create new tag inline

Create src/react-app/components/tag-manager.tsx:
- List all tags
- Create new tag
- Delete tag (with confirmation)

STEP 7 - Create Hooks:
Create src/react-app/hooks/use-tags-query.ts
Create src/react-app/hooks/use-create-tag-mutation.ts
Create src/react-app/hooks/use-delete-tag-mutation.ts

STEP 8 - Update Task Forms & Table:
Update create-task-form.tsx:
- Add tag selector

Update data-table.tsx:
- Show tag badges in row
- Add tag filter dropdown

STEP 9 - Update API Constants:
Update src/react-app/constants/api-endpoints.ts
Update src/react-app/constants/query-keys.ts

VERIFICATION:
- Run "bun test" - all tag tests pass
- Create tags, assign to tasks
- Filter tasks by tag
- Delete tag cascades properly

COMMIT: "feat: add tags system with filtering and color-coded badges"

Return list of files created/modified.
```

### Expected Files

- `src/worker/__tests__/tags.test.ts`
- `src/worker/db/schema.ts` (updated)
- `src/worker/index.ts` (updated)
- `drizzle/XXXX_*.sql` (new migration)
- `src/react-app/__tests__/tags.test.tsx`
- `src/react-app/components/tag-badge.tsx`
- `src/react-app/components/tag-selector.tsx`
- `src/react-app/components/tag-manager.tsx`
- `src/react-app/hooks/use-tags-query.ts`
- `src/react-app/hooks/use-create-tag-mutation.ts`
- `src/react-app/hooks/use-delete-tag-mutation.ts`
- `src/react-app/components/create-task-form.tsx` (updated)
- `src/react-app/components/data-table.tsx` (updated)
- `src/react-app/constants/api-endpoints.ts` (updated)
- `src/react-app/constants/query-keys.ts` (updated)

---

## Sprint 5: User Profile Page

### Metadata

- **Independent:** ✅ Yes (after Sprint 0)
- **Commit:** `feat: add user profile page with name update and password change`

### Subagent Prompt

```
You are implementing Sprint 5: User Profile Page for a Task Manager application.

PROJECT CONTEXT:
- Auth: Better Auth with email/password
- Backend: Hono.js
- Frontend: React + TanStack Router
- Project path: c:\My Stuff\British Council\ToT Full Stack\tm\tm

TASK: Add user profile page with name update and password change (TDD approach).

STEP 1 - Write Backend Tests:
Create src/worker/__tests__/profile.test.ts:
- Test: GET /user returns current user profile
- Test: PATCH /user updates name
- Test: POST /user/change-password changes password
- Test: Password change validates current password
- Test: Unauthorized returns 401

STEP 2 - Implement Profile API:
In src/worker/index.ts add routes:
- PATCH /user - update user profile {name?, image?}
- POST /user/change-password - {currentPassword, newPassword}

STEP 3 - Write Frontend Tests:
Create src/react-app/__tests__/profile.test.tsx:
- Test: Profile form renders with current user data
- Test: Update name shows success toast
- Test: Change password form validates matching passwords
- Test: Invalid current password shows error

STEP 4 - Create Profile Route:
Create src/react-app/routes/_protected/profile.tsx:
- Protected route (requires auth)
- Page layout with settings sections

STEP 5 - Create Profile Components:
Create src/react-app/components/profile-form.tsx:
- Display current name/email
- Edit name field
- Upload avatar (optional, can be future)
- Save button

Create src/react-app/components/change-password-form.tsx:
- Current password field
- New password field
- Confirm new password field
- Validation: passwords must match
- Submit button

STEP 6 - Create Hooks:
Create src/react-app/hooks/use-update-profile-mutation.ts
Create src/react-app/hooks/use-change-password-mutation.ts

STEP 7 - Update Navigation:
Update app-sidebar.tsx or nav-user.tsx:
- Add "Profile" or "Settings" link

STEP 8 - Update API Constants:
Update src/react-app/constants/api-endpoints.ts
Update src/react-app/constants/query-keys.ts

VERIFICATION:
- Run "bun test" - all profile tests pass
- Navigate to profile page
- Update name successfully
- Change password works
- Invalid password shows error

COMMIT: "feat: add user profile page with name update and password change"

Return list of files created/modified.
```

### Expected Files

- `src/worker/__tests__/profile.test.ts`
- `src/worker/index.ts` (updated)
- `src/react-app/__tests__/profile.test.tsx`
- `src/react-app/routes/_protected/profile.tsx`
- `src/react-app/components/profile-form.tsx`
- `src/react-app/components/change-password-form.tsx`
- `src/react-app/hooks/use-update-profile-mutation.ts`
- `src/react-app/hooks/use-change-password-mutation.ts`
- `src/react-app/components/app-sidebar.tsx` or `nav-user.tsx` (updated)
- `src/react-app/constants/api-endpoints.ts` (updated)
- `src/react-app/constants/query-keys.ts` (updated)

---

## Sprint 6: Drag & Drop Kanban

### Metadata

- **Independent:** ✅ Yes (after Sprint 0)
- **Commit:** `feat: add drag & drop Kanban board view with dnd-kit`

### Subagent Prompt

```
You are implementing Sprint 6: Drag & Drop Kanban Board for a Task Manager application.

PROJECT CONTEXT:
- Frontend: React + @dnd-kit/core + @dnd-kit/sortable (already installed!)
- Backend: Hono.js + Drizzle ORM
- Task statuses: todo, in-progress, done
- Project path: c:\My Stuff\British Council\ToT Full Stack\tm\tm

TASK: Add Kanban board view with drag & drop (TDD approach).

STEP 1 - Write Backend Tests:
Create src/worker/__tests__/tasks-reorder.test.ts:
- Test: PATCH /tasks/:id updates status on drag between columns
- Test: PATCH /tasks/reorder updates positions (optional)

STEP 2 - Update Schema (Optional for position):
In src/worker/db/schema.ts:
- Add position column (integer, default 0) for ordering within columns

STEP 3 - Run Migration if needed:
- Run: bun drizzle-kit generate
- Run: bun wrangler d1 migrations apply tm-d1 --local

STEP 4 - Update Backend API:
In src/worker/index.ts:
- Ensure PATCH /tasks/:id handles status updates
- Optional: Add PATCH /tasks/reorder for batch position updates

STEP 5 - Write Frontend Tests:
Create src/react-app/__tests__/kanban.test.tsx:
- Test: Kanban board renders 3 columns (Todo, In Progress, Done)
- Test: Tasks appear in correct column based on status
- Test: Drag task to different column updates status
- Test: Empty column shows empty state

STEP 6 - Create Kanban Components:
Create src/react-app/components/kanban-board.tsx:
- Uses @dnd-kit/core DndContext
- Three columns: todo, in-progress, done
- Handles onDragEnd to update task status

Create src/react-app/components/kanban-column.tsx:
- Uses @dnd-kit/sortable SortableContext
- Column header with count
- Droppable area
- List of KanbanCard components

Create src/react-app/components/kanban-card.tsx:
- Uses useSortable hook
- Displays task title, priority badge, due date
- Draggable handle

STEP 7 - Add View Toggle:
Update src/react-app/routes/_protected/dashboard/index.tsx:
- Add toggle button: Table View / Kanban View
- Render DataTable or KanbanBoard based on selection
- Persist preference in localStorage

STEP 8 - Handle Drag Events:
In KanbanBoard:
- onDragEnd: If dropped in different column, call updateTaskMutation with new status
- Optional: Update position for reordering

VERIFICATION:
- Run "bun test" - all kanban tests pass
- Toggle to Kanban view
- Drag task between columns
- Task status updates in database
- Refresh shows updated positions

COMMIT: "feat: add drag & drop Kanban board view with dnd-kit"

Return list of files created/modified.
```

### Expected Files

- `src/worker/__tests__/tasks-reorder.test.ts`
- `src/worker/db/schema.ts` (updated - position column)
- `src/worker/index.ts` (updated)
- `drizzle/XXXX_*.sql` (new migration)
- `src/react-app/__tests__/kanban.test.tsx`
- `src/react-app/components/kanban-board.tsx`
- `src/react-app/components/kanban-column.tsx`
- `src/react-app/components/kanban-card.tsx`
- `src/react-app/routes/_protected/dashboard/index.tsx` (updated)

---

## Sprint 7: Polish & Branding

### Metadata

- **Independent:** ✅ Yes
- **Commit:** `feat: add polish (empty states, favicon, dynamic titles, loading improvements)`

### Subagent Prompt

```
You are implementing Sprint 7: Polish & Branding for a Task Manager application.

PROJECT CONTEXT:
- Frontend: React + TanStack Router
- Project path: c:\My Stuff\British Council\ToT Full Stack\tm\tm

TASK: Add polish items (empty states, favicon, titles, loading improvements).

STEP 1 - Empty States:
Create src/react-app/components/empty-state.tsx:
- Reusable component with:
  - Icon (optional)
  - Title
  - Description
  - Action button (optional)

Add empty states to:
- Dashboard: "No tasks yet. Create your first task!"
- Kanban columns: "No tasks in this column"
- Tags: "No tags created yet"

STEP 2 - Favicon & Branding:
Update public/ folder:
- Add favicon.ico or favicon.svg (use a task/check icon)
- Add apple-touch-icon.png (180x180)
- Add favicon-32x32.png, favicon-16x16.png

Update index.html:
- Add favicon link tags
- Update <title> to "Task Manager"
- Add meta description

STEP 3 - Dynamic Page Titles:
Use TanStack Router's meta or document title:
- Dashboard: "Dashboard | Task Manager"
- Profile: "Profile | Task Manager"
- Login: "Login | Task Manager"
- etc.

STEP 4 - Loading States Review:
Review and improve loading states:
- Add Skeleton components where missing
- Ensure spinners are consistent
- Add loading state to buttons during mutations

STEP 5 - Error States Review:
Review error handling:
- API errors show user-friendly toasts
- Form validation errors are clear
- Network errors have retry option

STEP 6 - Accessibility Quick Wins:
- Ensure all buttons have aria-labels
- Check color contrast
- Ensure focus states are visible

VERIFICATION:
- Favicon appears in browser tab
- Page titles update on navigation
- Empty states show appropriate messages
- Loading/error states are consistent

COMMIT: "feat: add polish (empty states, favicon, dynamic titles, loading improvements)"

Return list of files created/modified.
```

### Expected Files

- `src/react-app/components/empty-state.tsx`
- `public/favicon.ico` or `public/favicon.svg`
- `public/apple-touch-icon.png`
- `index.html` (updated)
- Various route files (updated with page titles)
- Various components (updated with empty states)

---

## Sprint 8: E2E Tests

### Metadata

- **Depends on:** All features (Sprints 1-7) implemented
- **Commit:** `test: add comprehensive E2E tests with Playwright`

### Subagent Prompt

```
You are implementing Sprint 8: E2E Tests for a Task Manager application.

PROJECT CONTEXT:
- E2E Tool: Playwright
- App URL: http://localhost:5173
- Project path: c:\My Stuff\British Council\ToT Full Stack\tm\tm

TASK: Add comprehensive E2E tests for critical user flows.

PRE-REQUISITE:
- All features (Sprint 1-7) must be implemented first
- Playwright must be installed (Sprint 0)

STEP 1 - Test Setup:
Update playwright.config.ts:
- Base URL: http://localhost:5173
- Start dev server before tests
- Configure browsers (chromium, firefox, webkit)

Create tests/helpers.ts:
- Helper to login test user
- Helper to create test task
- Helper to reset test data (if possible)

STEP 2 - Auth Flow Tests:
Create tests/auth.spec.ts:
- Test: Signup with new email
- Test: Login with valid credentials
- Test: Login with invalid credentials shows error
- Test: Logout redirects to login
- Test: Protected routes redirect when not logged in
- Test: Forgot password flow

STEP 3 - Task CRUD Tests:
Create tests/tasks.spec.ts:
- Test: Create task with title only
- Test: Create task with all fields (priority, due date, tags)
- Test: Edit task title
- Test: Change task status
- Test: Delete task with confirmation
- Test: Task appears in correct Kanban column

STEP 4 - Dashboard Tests:
Create tests/dashboard.spec.ts:
- Test: Dashboard loads with statistics
- Test: Toggle between Table and Kanban view
- Test: Filter tasks by status
- Test: Filter tasks by priority
- Test: Filter tasks by tag
- Test: Sort tasks by due date
- Test: Empty state shows when no tasks

STEP 5 - Dark Mode Test:
Create tests/theme.spec.ts:
- Test: Toggle dark mode
- Test: Theme persists on refresh

STEP 6 - Profile Tests:
Create tests/profile.spec.ts:
- Test: Update name
- Test: Change password with valid current password
- Test: Change password fails with wrong current password

STEP 7 - Full User Journey:
Create tests/user-journey.spec.ts:
- Complete flow: Signup → Create Task → Add Priority → Set Due Date → Add Tag → Mark Complete → View in Kanban → Delete → Logout

VERIFICATION:
- Run "bun run test:e2e"
- All tests pass in chromium
- Tests run in under 2 minutes

COMMIT: "test: add comprehensive E2E tests with Playwright"

Return list of files created/modified.
```

### Expected Files

- `playwright.config.ts` (updated)
- `tests/helpers.ts`
- `tests/auth.spec.ts`
- `tests/tasks.spec.ts`
- `tests/dashboard.spec.ts`
- `tests/theme.spec.ts`
- `tests/profile.spec.ts`
- `tests/user-journey.spec.ts`

---

## 📊 Progress Tracking

Use this checklist to track completion:

- [ ] Sprint 0: Testing Infrastructure Setup
- [ ] Sprint 1: Dark Mode Toggle
- [ ] Sprint 2: Task Priorities
- [ ] Sprint 3: Due Dates
- [ ] Sprint 4: Tags System
- [ ] Sprint 5: User Profile Page
- [ ] Sprint 6: Drag & Drop Kanban
- [ ] Sprint 7: Polish & Branding
- [ ] Sprint 8: E2E Tests

---

## 📝 Notes

- **Migrations:** If running sprints in parallel, coordinate migration file naming to avoid conflicts
- **Git:** Each sprint should be a single atomic commit
- **Testing:** Run `bun test` after each sprint to ensure no regressions
- **Dependencies:** @dnd-kit packages are already installed, no need to reinstall

---

_Generated on December 9, 2025_
