import { AppSidebar } from "@/components/app-sidebar";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { KanbanBoard } from "@/components/kanban-board";
import { SectionCards } from "@/components/section-cards";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
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

  const { data: tasksData } = useTasksQuery();
  const { selectedTagIds, clearTagFilters } = useTagFilter();

  // Filter tasks by selected tags
  const filteredTasks = useMemo(() => {
    const allTasks = tasksData?.tasks || [];
    if (selectedTagIds.length === 0) return allTasks;
    
    return allTasks.filter((task) => {
      if (!task.tags || task.tags.length === 0) return false;
      // Task must have at least one of the selected tags
      return task.tags.some((tag) => selectedTagIds.includes(tag.id));
    });
  }, [tasksData?.tasks, selectedTagIds]);

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
                className="flex items-center justify-between gap-4 px-4 lg:px-6"
              >
                <div className="flex items-center gap-3">
                  <motion.h2 
                    className="text-lg font-semibold"
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
                        className="flex items-center gap-2"
                      >
                        <Badge variant="secondary" className="gap-1 pl-2 pr-1">
                          <span>
                            Filtered by {selectedTagIds.length} tag{selectedTagIds.length > 1 ? "s" : ""}
                          </span>
                          <button
                            onClick={clearTagFilters}
                            className="ml-1 rounded-sm hover:bg-muted p-0.5"
                          >
                            <IconX className="h-3 w-3" />
                          </button>
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          ({filteredTasks.length} task{filteredTasks.length !== 1 ? "s" : ""})
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-lg">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      variant={viewMode === "table" ? "secondary" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("table")}
                      className={`transition-all duration-200 ${
                        viewMode === "table" 
                          ? "shadow-sm bg-background" 
                          : "hover:bg-muted"
                      }`}
                    >
                      <IconTable className="h-4 w-4 mr-1" />
                      Table
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      variant={viewMode === "kanban" ? "secondary" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("kanban")}
                      className={`transition-all duration-200 ${
                        viewMode === "kanban" 
                          ? "shadow-sm bg-background" 
                          : "hover:bg-muted"
                      }`}
                    >
                      <IconLayoutKanban className="h-4 w-4 mr-1" />
                      Kanban
                    </Button>
                  </motion.div>
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
                    <DataTable />
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
                    <KanbanBoard tasks={filteredTasks} />
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
