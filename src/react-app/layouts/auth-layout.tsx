import { Link } from "@tanstack/react-router";
import { ListTodo } from "lucide-react";
import { ReactNode } from "react";
import { motion } from "framer-motion";

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <motion.div 
          className="flex justify-center gap-2 md:justify-start"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link to="/" className="flex items-center gap-2 font-medium group">
            <motion.div 
              className="bg-blue-500 text-primary-foreground flex size-6 items-center justify-center rounded-md transition-transform group-hover:scale-110"
              whileHover={{ rotate: 5 }}
            >
              <ListTodo className="size-4" />
            </motion.div>
            <span className="font-semibold">Task Manager Inc.</span>
          </Link>
        </motion.div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">{children}</div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block overflow-hidden">
        <motion.img
          src="/images/auth.webp"
          alt="people working together"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
        {/* Gradient overlay for better text readability if needed */}
        <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />
      </div>
    </div>
  );
}
