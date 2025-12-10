import { useRouterState } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";

export function NavigationProgress() {
  const isLoading = useRouterState({
    select: (state) => state.isLoading,
  });

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          exit={{ scaleX: 0, opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed top-0 left-0 right-0 z-[100] h-1 bg-linear-to-r from-blue-500 via-purple-500 to-blue-500 origin-left"
          style={{
            backgroundSize: "200% 100%",
            animation: "shimmer 1.5s infinite linear",
          }}
        />
      )}
    </AnimatePresence>
  );
}
