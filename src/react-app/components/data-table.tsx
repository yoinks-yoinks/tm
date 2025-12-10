import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconCircleCheckFilled,
  IconDotsVertical,
  IconLoader,
  IconArrowUp,
  IconArrowDown,
  IconArrowsSort,
  IconEdit,
  IconTrash,
} from "@tabler/icons-react";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
  Column,
} from "@tanstack/react-table";
import { motion, AnimatePresence, type Easing } from "framer-motion";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EmptyState } from "@/components/empty-state";
import { TableSkeleton } from "@/components/loading-skeletons";
import { EditTaskDrawer } from "@/components/edit-task-drawer";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDeleteTaskMutation } from "@/hooks/use-delete-task-mutation";
import { useTasksQuery, type Task } from "@/hooks/use-tasks-query";
import { useUpdateTaskMutation } from "@/hooks/use-update-task-mutation";
import { useTagFilter } from "@/hooks/use-tag-filter";
import { useState, useMemo } from "react";
import { PriorityBadge } from "./priority-badge";
import { DueDateBadge } from "./due-date-badge";
import { TagBadge } from "./tag-badge";

function getStatusDisplay(status: Task["status"]) {
  switch (status) {
    case "completed":
      return {
        label: "Completed",
        icon: (
          <IconCircleCheckFilled className="fill-green-500 dark:fill-green-400" />
        ),
      };
    case "in_progress":
      return {
        label: "In Progress",
        icon: <IconLoader className="animate-spin" />,
      };
    case "todo":
      return { label: "To Do", icon: <IconLoader /> };
    default:
      return { label: status, icon: null };
  }
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// Row animation variants
const rowVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.03,
      duration: 0.2,
      ease: "easeOut" as Easing,
    },
  }),
  exit: { opacity: 0, x: -10, transition: { duration: 0.15 } },
};

// Sortable column header component
interface SortableHeaderProps<TData> {
  column: Column<TData, unknown>;
  title: string;
}

function SortableHeader<TData>({ column, title }: SortableHeaderProps<TData>) {
  const isSorted = column.getIsSorted();
  
  return (
    <Button
      variant="ghost"
      size="sm"
      className="-ml-3 h-8 hover:bg-muted/50 font-medium group"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      {title}
      <motion.span
        className="ml-2"
        initial={false}
        animate={{
          rotate: isSorted === "desc" ? 180 : 0,
          opacity: isSorted ? 1 : 0.5,
        }}
        transition={{ duration: 0.2 }}
      >
        {isSorted === "asc" ? (
          <IconArrowUp className="h-4 w-4" />
        ) : isSorted === "desc" ? (
          <IconArrowDown className="h-4 w-4" />
        ) : (
          <IconArrowsSort className="h-4 w-4 opacity-0 group-hover:opacity-50 transition-opacity" />
        )}
      </motion.span>
    </Button>
  );
}

function TaskCellViewer({ task }: { task: Task }) {
  return (
    <EditTaskDrawer
      task={task}
      trigger={
        <Button variant="link" className="text-foreground w-fit px-0 text-left">
          {task.title}
        </Button>
      }
    />
  );
}

function ActionsCell({ task }: { task: Task }) {
  const deleteMutation = useDeleteTaskMutation();
  const [editOpen, setEditOpen] = useState(false);

  const handleDelete = () => {
    toast.promise(deleteMutation.mutateAsync(task.id), {
      loading: "Deleting task...",
      success: "Task deleted successfully",
      error: "Failed to delete task",
    });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="data-[state=open]:bg-muted text-muted-foreground flex size-8 hover:bg-muted/80 transition-colors"
            size="icon"
          >
            <IconDotsVertical className="size-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-36">
          <DropdownMenuItem onSelect={() => setEditOpen(true)} className="gap-2">
            <IconEdit className="size-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="gap-2"
          >
            <IconTrash className="size-4" />
            {deleteMutation.isPending ? "Deleting..." : "Delete"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <EditTaskDrawer
        task={task}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
    </>
  );
}

function StatusCell({ task }: { task: Task }) {
  const updateMutation = useUpdateTaskMutation();
  const statusDisplay = getStatusDisplay(task.status);

  const handleStatusChange = async (newStatus: Task["status"]) => {
    const previousStatus = task.status;
    
    toast.promise(
      updateMutation.mutateAsync({
        id: task.id,
        status: newStatus,
      }),
      {
        loading: "Updating status...",
        success: () => {
          // Fire confetti when task is completed (and wasn't already completed)
          if (newStatus === "completed" && previousStatus !== "completed") {
            // Dynamic import to avoid loading confetti until needed
            import("@/lib/confetti").then(({ fireTaskCompletedConfetti }) => {
              fireTaskCompletedConfetti();
            });
          }
          return "Status updated";
        },
        error: "Failed to update status",
      }
    );
  };

  return (
    <Select value={task.status} onValueChange={handleStatusChange}>
      <SelectTrigger className="w-[140px] h-8 border-transparent bg-transparent hover:bg-input/30">
        <Badge variant="outline" className="text-muted-foreground px-1.5">
          {statusDisplay.icon}
          {statusDisplay.label}
        </Badge>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="todo">To Do</SelectItem>
        <SelectItem value="in_progress">In Progress</SelectItem>
        <SelectItem value="completed">Completed</SelectItem>
      </SelectContent>
    </Select>
  );
}

const columns: ColumnDef<Task>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => <SortableHeader column={column} title="Title" />,
    cell: ({ row }) => <TaskCellViewer task={row.original} />,
    enableHiding: false,
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <div className="max-w-[300px] truncate text-muted-foreground">
        {row.original.description || "No description"}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => <SortableHeader column={column} title="Status" />,
    cell: ({ row }) => <StatusCell task={row.original} />,
  },
  {
    accessorKey: "priority",
    header: ({ column }) => <SortableHeader column={column} title="Priority" />,
    cell: ({ row }) => <PriorityBadge priority={row.original.priority} />,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    sortingFn: (rowA, rowB) => {
      const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
      return priorityOrder[rowA.original.priority] - priorityOrder[rowB.original.priority];
    },
  },
  {
    accessorKey: "dueDate",
    header: ({ column }) => <SortableHeader column={column} title="Due Date" />,
    cell: ({ row }) => <DueDateBadge dueDate={row.original.dueDate} />,
    sortingFn: (rowA, rowB) => {
      const a = rowA.original.dueDate;
      const b = rowB.original.dueDate;
      if (!a && !b) return 0;
      if (!a) return 1;
      if (!b) return -1;
      return new Date(a).getTime() - new Date(b).getTime();
    },
  },
  {
    accessorKey: "tags",
    header: "Tags",
    cell: ({ row }) => {
      const tags = row.original.tags || [];
      if (tags.length === 0) {
        return <span className="text-muted-foreground text-sm">No tags</span>;
      }
      return (
        <div className="flex flex-wrap gap-1 max-w-[200px]">
          {tags.slice(0, 3).map((tag) => (
            <TagBadge key={tag.id} name={tag.name} color={tag.color} />
          ))}
          {tags.length > 3 && (
            <span className="text-muted-foreground text-xs">+{tags.length - 3}</span>
          )}
        </div>
      );
    },
    filterFn: (row, _id, value: string[]) => {
      const tags = row.original.tags || [];
      if (!value || value.length === 0) return true;
      return tags.some((tag) => value.includes(tag.id));
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => <SortableHeader column={column} title="Created" />,
    cell: ({ row }) => (
      <div className="text-muted-foreground text-sm">
        {formatDate(row.original.createdAt)}
      </div>
    ),
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => <ActionsCell task={row.original} />,
  },
];

interface DataTableProps {
  searchQuery?: string;
}

export function DataTable({ searchQuery = "" }: DataTableProps) {
  const { data, isPending, isError } = useTasksQuery();
  const { selectedTagIds } = useTagFilter();
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  // Filter tasks by selected tags and search query
  const tasks = useMemo(() => {
    let filteredTasks = data?.tasks || [];
    
    // Filter by tags
    if (selectedTagIds.length > 0) {
      filteredTasks = filteredTasks.filter((task) => {
        if (!task.tags || task.tags.length === 0) return false;
        return task.tags.some((tag) => selectedTagIds.includes(tag.id));
      });
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filteredTasks = filteredTasks.filter((task) => {
        return (
          task.title.toLowerCase().includes(query) ||
          (task.description && task.description.toLowerCase().includes(query)) ||
          (task.tags && task.tags.some((tag) => tag.name.toLowerCase().includes(query)))
        );
      });
    }
    
    return filteredTasks;
  }, [data?.tasks, selectedTagIds, searchQuery]);

  const table = useReactTable({
    data: tasks,
    columns,
    state: {
      sorting,
      columnVisibility,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row.id,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  if (isPending) {
    return (
      <div className="px-4 lg:px-6">
        <TableSkeleton rows={5} columns={5} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="px-4 lg:px-6">
        <div className="overflow-hidden rounded-lg border">
          <EmptyState
            variant="error"
            title="Couldn't load tasks"
            description="We encountered an error loading your tasks. Please try refreshing the page."
            actionLabel="Refresh"
            onAction={() => window.location.reload()}
          />
        </div>
      </div>
    );
  }

  return (
    <Tabs
      defaultValue="outline"
      className="w-full flex-col justify-start gap-6"
    >
      <div className="flex items-center justify-between px-4 lg:px-6">
        <Label htmlFor="view-selector" className="sr-only">
          View
        </Label>
        <Select defaultValue="outline">
          <SelectTrigger
            className="flex w-fit @4xl/main:hidden"
            size="sm"
            id="view-selector"
          >
            <SelectValue placeholder="Select a view" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="outline">All Tasks</SelectItem>
            <SelectItem value="todo">To Do</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
        <TabsList className="**:data-[slot=badge]:bg-muted-foreground/30 hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:px-1 @4xl/main:flex">
          <TabsTrigger value="outline">All Tasks</TabsTrigger>
          <TabsTrigger value="todo">
            To Do{" "}
            <Badge variant="secondary">
              {tasks.filter((t) => t.status === "todo").length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="in-progress">
            In Progress{" "}
            <Badge variant="secondary">
              {tasks.filter((t) => t.status === "in_progress").length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed{" "}
            <Badge variant="secondary">
              {tasks.filter((t) => t.status === "completed").length}
            </Badge>
          </TabsTrigger>
        </TabsList>
      </div>
      <TabsContent
        value="outline"
        className="relative flex flex-col gap-4 px-4 lg:px-6"
      >
        <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="overflow-hidden rounded-lg border min-w-[600px] sm:min-w-0">
          <Table>
            <TableHeader className="bg-muted sticky top-0 z-10">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} colSpan={header.colSpan}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              <AnimatePresence mode="popLayout">
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row, index) => (
                    <motion.tr
                      key={row.id}
                      custom={index}
                      variants={rowVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      layout
                      className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted group"
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="group-hover:bg-transparent">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </motion.tr>
                  ))
                ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-72"
                  >
                    {/* Check if we have tasks but they're filtered out vs no tasks at all */}
                    {tasks.length === 0 && (data?.tasks?.length ?? 0) > 0 ? (
                      <EmptyState
                        variant="filtered-empty"
                        title="No tasks match this filter"
                        description="Try selecting different tags in the sidebar or clear your filters."
                      />
                    ) : tasks.length === 0 ? (
                      <EmptyState
                        variant="no-tasks"
                        title="No tasks yet"
                        description="Get started by clicking 'New Task' in the sidebar to create your first task."
                      />
                    ) : (
                      <EmptyState
                        variant="no-results"
                        title="No results found"
                        description="No tasks match your current view filter."
                      />
                    )}
                  </TableCell>
                </TableRow>
              )}
              </AnimatePresence>
            </TableBody>
          </Table>
          </div>
        </div>
        <div className="flex items-center justify-between px-0 sm:px-4">
          <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
            {table.getFilteredRowModel().rows.length} task(s) total.
          </div>
          <div className="flex w-full items-center gap-8 lg:w-fit">
            <div className="hidden items-center gap-2 lg:flex">
              <Label htmlFor="rows-per-page" className="text-sm font-medium">
                Rows per page
              </Label>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => {
                  table.setPageSize(Number(value));
                }}
              >
                <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                  <SelectValue
                    placeholder={table.getState().pagination.pageSize}
                  />
                </SelectTrigger>
                <SelectContent side="top">
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-fit items-center justify-center text-sm font-medium">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </div>
            <div className="ml-auto flex items-center gap-2 lg:ml-0">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to first page</span>
                <IconChevronsLeft />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to previous page</span>
                <IconChevronLeft />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to next page</span>
                <IconChevronRight />
              </Button>
              <Button
                variant="outline"
                className="hidden size-8 lg:flex"
                size="icon"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to last page</span>
                <IconChevronsRight />
              </Button>
            </div>
          </div>
        </div>
      </TabsContent>
      <TabsContent
        value="todo"
        className="relative flex flex-col gap-4 px-4 lg:px-6"
      >
        <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="overflow-hidden rounded-lg border min-w-[500px] sm:min-w-0">
          <Table>
            <TableHeader className="bg-muted">
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Created</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.filter((t) => t.status === "todo").length > 0 ? (
                tasks
                  .filter((t) => t.status === "todo")
                  .map((task) => (
                    <TableRow key={task.id}>
                      <TableCell>
                        <TaskCellViewer task={task} />
                      </TableCell>
                      <TableCell className="max-w-[300px] truncate text-muted-foreground">
                        {task.description || "No description"}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(task.createdAt)}
                      </TableCell>
                      <TableCell>
                        <ActionsCell task={task} />
                      </TableCell>
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    No pending tasks.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          </div>
        </div>
      </TabsContent>
      <TabsContent
        value="in-progress"
        className="relative flex flex-col gap-4 px-4 lg:px-6"
      >
        <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="overflow-hidden rounded-lg border min-w-[500px] sm:min-w-0">
          <Table>
            <TableHeader className="bg-muted">
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Created</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.filter((t) => t.status === "in_progress").length > 0 ? (
                tasks
                  .filter((t) => t.status === "in_progress")
                  .map((task) => (
                    <TableRow key={task.id}>
                      <TableCell>
                        <TaskCellViewer task={task} />
                      </TableCell>
                      <TableCell className="max-w-[300px] truncate text-muted-foreground">
                        {task.description || "No description"}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(task.createdAt)}
                      </TableCell>
                      <TableCell>
                        <ActionsCell task={task} />
                      </TableCell>
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    No tasks in progress.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          </div>
        </div>
      </TabsContent>
      <TabsContent
        value="completed"
        className="relative flex flex-col gap-4 px-4 lg:px-6"
      >
        <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="overflow-hidden rounded-lg border min-w-[500px] sm:min-w-0">
          <Table>
            <TableHeader className="bg-muted">
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Created</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.filter((t) => t.status === "completed").length > 0 ? (
                tasks
                  .filter((t) => t.status === "completed")
                  .map((task) => (
                    <TableRow key={task.id}>
                      <TableCell>
                        <TaskCellViewer task={task} />
                      </TableCell>
                      <TableCell className="max-w-[300px] truncate text-muted-foreground">
                        {task.description || "No description"}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(task.createdAt)}
                      </TableCell>
                      <TableCell>
                        <ActionsCell task={task} />
                      </TableCell>
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    No completed tasks.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}
