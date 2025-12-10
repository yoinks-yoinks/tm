# UI/UX Improvement Plan

## Overview
This document outlines the comprehensive UI/UX improvements for the Task Manager application.

---

## Phase 1: Smart Tag Input Component ⭐ PRIORITY
**Goal:** Create a reusable tag combobox with autocomplete and inline creation

### Components to Create:
- [ ] `TagCombobox` - Main smart tag input component
- [ ] `TagColorPicker` - Color selection for new tags

### Features:
- Type-ahead autocomplete with fuzzy search
- "Create new tag" option when no match exists
- Multi-select with removable chips
- Color picker for new tags
- Keyboard navigation (↑↓ Enter Esc)
- Task count per tag in suggestions

### shadcn Components Needed:
- `command` (combobox functionality)
- `popover` (dropdown positioning)
- `badge` (already exists - for chips)

### API Requirements:
- `GET /api/tags` - Fetch all tags
- `POST /api/tags` - Create new tag
- `DELETE /api/tags/:id` - Delete tag

### Files to Create/Modify:
- `src/react-app/components/tag-combobox.tsx` (NEW)
- `src/react-app/components/tag-color-picker.tsx` (NEW)
- `src/react-app/hooks/use-tags-query.ts` (NEW)
- `src/react-app/hooks/use-create-tag-mutation.ts` (NEW)
- `src/react-app/constants/tag-colors.ts` (UPDATE if needed)
- `src/worker/index.ts` (ADD tag endpoints)
- `src/worker/db/schema.ts` (CHECK tag schema)

---

## Phase 2: Sidebar Tag Filter
**Goal:** Add tag-based filtering to sidebar navigation

### Features:
- Collapsible "Tags" section in sidebar
- Tag list with color indicators
- Click to filter dashboard tasks
- Multi-select support
- Task count badges
- "+ Add Tag" quick action

### Files to Create/Modify:
- `src/react-app/components/app-sidebar.tsx` (UPDATE)
- `src/react-app/components/nav-tags.tsx` (NEW)
- `src/react-app/hooks/use-tag-filter.ts` (NEW - Zustand/URL state)

---

## Phase 3: Auth Forms Enhancement
**Goal:** Improve login, signup, forget password, and reset password forms

### Features:
- Framer Motion entrance animations
- Password visibility toggle (eye icon)
- Password strength indicator (signup)
- Loading spinner during submission
- Form field focus animations
- Input icons (email, lock, user)

### Components to Create/Modify:
- `src/react-app/components/password-input.tsx` (NEW)
- `src/react-app/components/password-strength.tsx` (NEW)
- `src/react-app/components/login-form.tsx` (UPDATE)
- `src/react-app/components/sign-up-form.tsx` (UPDATE)
- `src/react-app/components/forget-password-form.tsx` (UPDATE)
- `src/react-app/components/reset-password-form.tsx` (UPDATE)
- `src/react-app/layouts/auth-layout.tsx` (UPDATE - animations)

### shadcn Components Needed:
- `progress` (password strength)

---

## Phase 4: Profile Page Revamp
**Goal:** Enhance profile page with better UX and avatar support

### Features:
- Avatar upload with preview
- Animated card transitions
- Success animations on save
- Profile completion progress bar
- Account activity section

### Files to Create/Modify:
- `src/react-app/routes/_protected/profile.tsx` (UPDATE)
- `src/react-app/components/profile-form.tsx` (UPDATE)
- `src/react-app/components/avatar-upload.tsx` (NEW)
- `src/react-app/hooks/use-upload-avatar-mutation.ts` (NEW)

### shadcn Components Needed:
- `progress` (profile completion)
- `hover-card` (avatar preview)

---

## Phase 5: Task Dialog Enhancement
**Goal:** Improve task creation/editing with better UI

### Features:
- Proper Dialog/Sheet for task creation
- TagCombobox integration
- Calendar popup for due date (react-day-picker)
- Priority visual selector with icons
- Rich description with Markdown preview

### Files to Create/Modify:
- `src/react-app/components/create-task-dialog.tsx` (NEW - replaces form)
- `src/react-app/components/edit-task-drawer.tsx` (UPDATE)
- `src/react-app/components/priority-selector.tsx` (NEW)
- `src/react-app/components/date-picker.tsx` (NEW)

### Packages Needed:
- `react-day-picker` (calendar)
- `date-fns` (date formatting)

### shadcn Components Needed:
- `calendar` (date picker)
- `popover` (date picker dropdown)

---

## Phase 6: Data Table Improvements
**Goal:** Enhance the task table with better UX

### Features:
- Row hover animations
- Search/filter bar with clear button
- Column visibility toggle dropdown
- Bulk selection with animated checkboxes
- Sort indicator animations
- Export to CSV button

### Files to Create/Modify:
- `src/react-app/components/data-table.tsx` (UPDATE)
- `src/react-app/components/data-table-toolbar.tsx` (NEW)
- `src/react-app/components/data-table-column-toggle.tsx` (NEW)

### shadcn Components Needed:
- `scroll-area` (better scrolling)

---

## Phase 7: Site Header & Search
**Goal:** Add command palette and improve header

### Features:
- Global search command palette (⌘K)
- Breadcrumb navigation
- Notification bell with badge
- Quick actions menu

### Files to Create/Modify:
- `src/react-app/components/site-header.tsx` (UPDATE)
- `src/react-app/components/command-menu.tsx` (NEW)
- `src/react-app/components/breadcrumbs.tsx` (NEW)

### shadcn Components Needed:
- `command` (search palette)

---

## Phase 8: Empty States & Polish
**Goal:** Final polish and empty states

### Features:
- Illustrated empty states (SVG)
- Animated icons
- Page transition animations
- Confetti on task completion
- Keyboard shortcuts help modal
- Reduced motion preference support

### Files to Create/Modify:
- `src/react-app/components/empty-state.tsx` (UPDATE)
- `src/react-app/components/keyboard-shortcuts.tsx` (NEW)
- `src/react-app/components/confetti.tsx` (NEW)

### Packages Needed:
- `canvas-confetti` (celebrations)

---

## Technical Requirements

### New Packages to Install:
```bash
bun add react-day-picker date-fns canvas-confetti
```

### New shadcn Components to Add:
```bash
npx shadcn@latest add command popover progress calendar scroll-area alert-dialog alert switch hover-card
```

---

## Implementation Timeline

| Phase | Description | Estimated Time | Commit Point |
|-------|-------------|----------------|--------------|
| 1 | Smart Tag Input | 2-3 hours | ✓ Deploy |
| 2 | Sidebar Tag Filter | 1-2 hours | ✓ Deploy |
| 3 | Auth Forms | 2 hours | ✓ Deploy |
| 4 | Profile Page | 1-2 hours | ✓ Deploy |
| 5 | Task Dialog | 2-3 hours | ✓ Deploy |
| 6 | Data Table | 2 hours | ✓ Deploy |
| 7 | Header & Search | 2 hours | ✓ Deploy |
| 8 | Polish & Empty States | 1-2 hours | ✓ Deploy |

---

## Notes
- Each phase will have its own commit and deployment
- User will be asked for feedback after each major portion
- All animations respect `prefers-reduced-motion`
- Components follow SOLID principles and are reusable
