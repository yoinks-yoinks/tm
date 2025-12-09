import { AppSidebar } from "@/components/app-sidebar";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { KanbanBoard } from "@/components/kanban-board";
import { SectionCards } from "@/components/section-cards";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { useTasksQuery } from "@/hooks/use-tasks-query";
import { createFileRoute } from "@tanstack/react-router";
import { IconLayoutKanban, IconTable } from "@tabler/icons-react";
import { useState, useEffect } from "react";
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
                <motion.h2 
                  className="text-lg font-semibold"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  Tasks Overview
                </motion.h2>
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
                    <KanbanBoard tasks={tasksData?.tasks || []} />
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
