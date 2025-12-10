import type { Task } from "@/hooks/use-tasks-query";

export interface ExportOptions {
  filename?: string;
  includeTags?: boolean;
  includeDescription?: boolean;
  dateFormat?: "iso" | "locale";
}

const defaultOptions: ExportOptions = {
  filename: "tasks",
  includeTags: true,
  includeDescription: true,
  dateFormat: "locale",
};

function formatDateForExport(
  dateString: string | null | undefined,
  format: "iso" | "locale"
): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (format === "iso") {
    return date.toISOString().split("T")[0];
  }
  // Use a format without commas: "15 Jan 2025"
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function escapeCSVField(field: string): string {
  // If field contains comma, newline, or quote, wrap in quotes
  if (field.includes(",") || field.includes("\n") || field.includes('"')) {
    // Escape double quotes by doubling them
    return `"${field.replace(/"/g, '""')}"`;
  }
  return field;
}

function priorityLabel(priority: Task["priority"]): string {
  const labels: Record<Task["priority"], string> = {
    urgent: "Urgent",
    high: "High",
    medium: "Medium",
    low: "Low",
  };
  return labels[priority] || priority;
}

function statusLabel(status: Task["status"]): string {
  const labels: Record<Task["status"], string> = {
    todo: "To Do",
    in_progress: "In Progress",
    completed: "Completed",
  };
  return labels[status] || status;
}

export function tasksToCSV(tasks: Task[], options: ExportOptions = {}): string {
  const opts = { ...defaultOptions, ...options };

  // Build headers
  const headers: string[] = ["Title"];
  if (opts.includeDescription) headers.push("Description");
  headers.push("Status", "Priority", "Due Date");
  if (opts.includeTags) headers.push("Tags");
  headers.push("Created At");

  // Build rows - escape ALL fields to ensure proper CSV format
  const rows: string[][] = tasks.map((task) => {
    const row: string[] = [escapeCSVField(task.title)];

    if (opts.includeDescription) {
      row.push(escapeCSVField(task.description || ""));
    }

    row.push(
      escapeCSVField(statusLabel(task.status)),
      escapeCSVField(priorityLabel(task.priority)),
      escapeCSVField(formatDateForExport(task.dueDate, opts.dateFormat!))
    );

    if (opts.includeTags) {
      const tagNames = (task.tags || []).map((t) => t.name).join("; ");
      row.push(escapeCSVField(tagNames));
    }

    row.push(escapeCSVField(formatDateForExport(task.createdAt, opts.dateFormat!)));

    return row;
  });

  // Combine headers and rows
  const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join(
    "\n"
  );

  return csvContent;
}

export function downloadCSV(content: string, filename: string): void {
  // Add BOM for proper UTF-8 encoding in Excel
  const bom = "\uFEFF";
  const blob = new Blob([bom + content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}.csv`);
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Clean up
  URL.revokeObjectURL(url);
}

export function exportTasksToCSV(
  tasks: Task[],
  options: ExportOptions = {}
): void {
  const csv = tasksToCSV(tasks, options);
  const filename = options.filename || `tasks-${new Date().toISOString().split("T")[0]}`;
  downloadCSV(csv, filename);
}
