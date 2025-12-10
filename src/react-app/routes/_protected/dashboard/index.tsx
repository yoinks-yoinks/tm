import { AppSidebar } from "@/components/app-sidebar";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { KanbanBoard } from "@/components/kanban-board";
import { SectionCards } from "@/components/section-cards";
import { SiteHeader } from "@/components/site-header";
import { ExportButton } from "@/components/export-button";
import { SearchInput } from "@/components/search-input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { EmptyState } from "@/components/empty-state";
import { KanbanSkeleton } from "@/components/loading-skeletons";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { useTasksQuery } from "@/hooks/use-tasks-query";
import { useTagFilter } from "@/hooks/use-tag-filter";
import { createFileRoute } from "@tanstack/react-router";
import { IconLayoutKanban, IconTable, IconX } from "@tabler/icons-react";
import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence, type Easing } from "framer-motion";

export const Route = createFileRoute("/_protected/dashboard/")({
  component: RouteComponent,
});

type ViewMode = "table" | "kanban";

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as Easing } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
};

const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as Easing } },
};

function RouteComponent() {
  useDocumentTitle("Dashboard");

  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("dashboard-view") as ViewMode) || "table";
    }
    return "table";
  });

  const [searchQuery, setSearchQuery] = useState("");

  const { data: tasksData, isPending, isError } = useTasksQuery();
  const { selectedTagIds, clearTagFilters } = useTagFilter();

  // Filter tasks by selected tags and search query
  const filteredTasks = useMemo(() => {
    let tasks = tasksData?.tasks || [];
    
    // Filter by tags
    if (selectedTagIds.length > 0) {
      tasks = tasks.filter((task) => {
        if (!task.tags || task.tags.length === 0) return false;
        return task.tags.some((tag) => selectedTagIds.includes(tag.id));
      });
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      tasks = tasks.filter((task) => {
        return (
          task.title.toLowerCase().includes(query) ||
          (task.description && task.description.toLowerCase().includes(query)) ||
          (task.tags && task.tags.some((tag) => tag.name.toLowerCase().includes(query)))
        );
      });
    }
    
    return tasks;
  }, [tasksData?.tasks, selectedTagIds, searchQuery]);

  useEffect(() => {
    localStorage.setItem("dashboard-view", viewMode);
  }, [viewMode]);

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <motion.div 
          className="flex flex-1 flex-col"
          initial="initial"
          animate="animate"
          variants={staggerContainer}
        >
          <div className="@container/main flex flex-1 flex-col gap-2">
            <motion.div 
              className="flex flex-col gap-4 py-4 md:gap-6 md:py-6"
              variants={staggerContainer}
            >
              {/* Stats Cards */}
              <motion.div variants={fadeInUp}>
                <SectionCards />
              </motion.div>

              {/* Chart */}
              <motion.div variants={fadeInUp} className="px-4 lg:px-6">
                <ChartAreaInteractive />
              </motion.div>
              
              {/* View Mode Toggle */}
              <motion.div 
                variants={fadeInUp}
                className="flex flex-col gap-3 px-4 lg:px-6 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <motion.h2 
                    className="text-base sm:text-lg font-semibold whitespace-nowrap"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    Tasks Overview
                  </motion.h2>
                  {/* Active Tag Filter Indicator */}
                  <AnimatePresence>
                    {selectedTagIds.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="flex items-center gap-1 sm:gap-2"
                      >
                        <Badge variant="secondary" className="gap-1 pl-2 pr-1 text-xs sm:text-sm">
                          <span className="hidden xs:inline">Filtered by </span>
                          <span>{selectedTagIds.length} tag{selectedTagIds.length > 1 ? "s" : ""}</span>
                          <button
                            onClick={clearTagFilters}
                            className="ml-1 rounded-sm hover:bg-muted p-0.5"
                          >
                            <IconX className="h-3 w-3" />
                          </button>
                        </Badge>
                        <span className="text-xs sm:text-sm text-muted-foreground">
                          ({filteredTasks.length})
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  {/* Search indicator */}
                  <AnimatePresence>
                    {searchQuery && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                      >
                        <Badge variant="outline" className="gap-1 text-xs sm:text-sm max-w-[150px] truncate">
                          "{searchQuery}"
                        </Badge>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0 sm:overflow-visible">
                  {/* Search Input */}
                  <SearchInput
                    value={searchQuery}
                    onChange={setSearchQuery}
                    placeholder="Search tasks..."
                  />
                  
                  {/* Export Button */}
                  <ExportButton
                    allTasks={tasksData?.tasks || []}
                    filteredTasks={filteredTasks}
                  />
                  
                  {/* View Mode Toggle */}
                  <div className="flex items-center gap-0.5 sm:gap-1 bg-muted/50 p-0.5 sm:p-1 rounded-lg shrink-0">
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        variant={viewMode === "table" ? "secondary" : "ghost"}
                        size="sm"
                        onClick={() => setViewMode("table")}
                        className={`transition-all duration-200 h-8 px-2 sm:px-3 ${
                          viewMode === "table" 
                            ? "shadow-sm bg-background" 
                            : "hover:bg-muted"
                        }`}
                      >
                        <IconTable className="h-4 w-4 sm:mr-1" />
                        <span className="hidden sm:inline">Table</span>
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        variant={viewMode === "kanban" ? "secondary" : "ghost"}
                        size="sm"
                        onClick={() => setViewMode("kanban")}
                        className={`transition-all duration-200 h-8 px-2 sm:px-3 ${
                          viewMode === "kanban" 
                            ? "shadow-sm bg-background" 
                            : "hover:bg-muted"
                        }`}
                      >
                        <IconLayoutKanban className="h-4 w-4 sm:mr-1" />
                        <span className="hidden sm:inline">Kanban</span>
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </motion.div>

              {/* Tasks View with Animation */}
              <AnimatePresence mode="wait">
                {viewMode === "table" ? (
                  <motion.div
                    key="table"
                    variants={pageVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  >
                    <DataTable searchQuery={searchQuery} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="kanban"
                    variants={pageVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="px-4 lg:px-6"
                  >
                    {isPending ? (
                      <KanbanSkeleton columns={3} cardsPerColumn={3} />
                    ) : isError ? (
                      <div className="overflow-hidden rounded-lg border">
                        <EmptyState
                          variant="error"
                          title="Couldn't load tasks"
                          description="We encountered an error loading your tasks. Please try refreshing the page."
                          actionLabel="Refresh"
                          onAction={() => window.location.reload()}
                        />
                      </div>
                    ) : filteredTasks.length === 0 && (tasksData?.tasks?.length ?? 0) > 0 ? (
                      <div className="overflow-hidden rounded-lg border">
                        <EmptyState
                          variant="filtered-empty"
                          title="No tasks match this filter"
                          description="Try selecting different tags in the sidebar or clear your filters."
                          actionLabel="Clear Filters"
                          onAction={clearTagFilters}
                        />
                      </div>
                    ) : filteredTasks.length === 0 ? (
                      <div className="overflow-hidden rounded-lg border">
                        <EmptyState
                          variant="no-tasks"
                          title="No tasks yet"
                          description="Get started by clicking 'New Task' in the sidebar to create your first task."
                        />
                      </div>
                    ) : (
                      <KanbanBoard tasks={filteredTasks} />
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </motion.div>
      </SidebarInset>
    </SidebarProvider>
  );
}
