import { useEffect } from "react";

export function useDocumentTitle(title: string) {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = title ? `${title} | Task Manager` : "Task Manager";

    return () => {
      document.title = previousTitle;
    };
  }, [title]);
}
