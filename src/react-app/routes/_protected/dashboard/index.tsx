import { AppSidebar } from "@/components/app-sidebar";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { KanbanBoard } from "@/components/kanban-board";
import { SectionCards } from "@/components/section-cards";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useTasksQuery } from "@/hooks/use-tasks-query";
import { createFileRoute } from "@tanstack/react-router";
import { IconLayoutKanban, IconTable } from "@tabler/icons-react";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/_protected/dashboard/")({
  component: RouteComponent,
});

type ViewMode = "table" | "kanban";

function RouteComponent() {
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
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards />
              <div className="px-4 lg:px-6">
                <ChartAreaInteractive />
              </div>
              
              {/* View Mode Toggle */}
              <div className="flex items-center justify-end gap-2 px-4 lg:px-6">
                <Button
                  variant={viewMode === "table" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("table")}
                >
                  <IconTable className="h-4 w-4 mr-1" />
                  Table
                </Button>
                <Button
                  variant={viewMode === "kanban" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("kanban")}
                >
                  <IconLayoutKanban className="h-4 w-4 mr-1" />
                  Kanban
                </Button>
              </div>

              {/* Tasks View */}
              {viewMode === "table" ? (
                <DataTable />
              ) : (
                <div className="px-4 lg:px-6">
                  <KanbanBoard tasks={tasksData?.tasks || []} />
                </div>
              )}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
