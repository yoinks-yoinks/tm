import { Link } from "@tanstack/react-router";
import { ListTodo, Sparkles } from "lucide-react";
import { ReactNode } from "react";
import { motion } from "framer-motion";
import { AuthBackground } from "@/components/animated-background";

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      {/* Left side - Form */}
      <AuthBackground className="flex flex-col gap-4 p-4 sm:p-6 md:p-10">
        <motion.div 
          className="flex justify-center gap-2 md:justify-start relative z-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link to="/" className="flex items-center gap-2 font-medium group">
            <motion.div 
              className="bg-linear-to-br from-blue-500 to-purple-600 text-primary-foreground flex size-7 sm:size-8 items-center justify-center rounded-lg shadow-lg transition-transform group-hover:scale-110"
              whileHover={{ rotate: 5, scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <ListTodo className="size-4 sm:size-5" />
            </motion.div>
            <span className="text-lg sm:text-xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              TaskFlow
            </span>
          </Link>
        </motion.div>
        <div className="flex flex-1 items-center justify-center relative z-10 px-2 sm:px-0">
          <motion.div 
            className="w-full max-w-sm"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2, type: "spring", stiffness: 100 }}
          >
            <motion.div
              className="backdrop-blur-xl bg-card/80 border border-border/50 rounded-xl sm:rounded-2xl p-5 sm:p-8 shadow-2xl"
              whileHover={{ boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
              transition={{ duration: 0.3 }}
            >
              {children}
            </motion.div>
          </motion.div>
        </div>
      </AuthBackground>
      
      {/* Right side - Animated showcase */}
      <div className="relative hidden lg:block overflow-hidden bg-linear-to-br from-blue-600 via-purple-600 to-indigo-700">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          {/* Floating orbs */}
          <motion.div
            className="absolute top-20 left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"
            animate={{
              x: [0, 50, 0],
              y: [0, 30, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-32 right-16 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl"
            animate={{
              x: [0, -40, 0],
              y: [0, -50, 0],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          />
          <motion.div
            className="absolute top-1/2 left-1/3 w-48 h-48 bg-blue-300/20 rounded-full blur-3xl"
            animate={{
              x: [0, 60, 0],
              y: [0, -40, 0],
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
          />
        </div>
        
        {/* Grid pattern overlay */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />
        
        {/* Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-center"
          >
            {/* Floating task cards preview */}
            <div className="relative mb-8">
              <motion.div
                className="absolute -left-16 top-0 bg-white/20 backdrop-blur-md rounded-xl p-4 shadow-xl border border-white/20"
                initial={{ opacity: 0, x: -50, rotate: -10 }}
                animate={{ opacity: 1, x: 0, rotate: -6 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                whileHover={{ rotate: 0, scale: 1.05 }}
              >
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                  <span>Complete project</span>
                </div>
              </motion.div>
              
              <motion.div
                className="bg-white/25 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-white/30"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <motion.div
                    className="p-3 bg-white/30 rounded-xl"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                  >
                    <ListTodo className="w-8 h-8" />
                  </motion.div>
                  <div className="text-left">
                    <div className="font-bold text-lg">TaskFlow</div>
                    <div className="text-white/70 text-sm">Manage with ease</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <motion.div 
                    className="h-2 bg-white/40 rounded-full overflow-hidden"
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1, delay: 1 }}
                  >
                    <motion.div
                      className="h-full bg-white rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: "75%" }}
                      transition={{ duration: 1.5, delay: 1.2 }}
                    />
                  </motion.div>
                  <div className="text-xs text-white/70">75% tasks completed</div>
                </div>
              </motion.div>
              
              <motion.div
                className="absolute -right-12 bottom-0 bg-white/20 backdrop-blur-md rounded-xl p-4 shadow-xl border border-white/20"
                initial={{ opacity: 0, x: 50, rotate: 10 }}
                animate={{ opacity: 1, x: 0, rotate: 6 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                whileHover={{ rotate: 0, scale: 1.05 }}
              >
                <div className="flex items-center gap-2 text-sm">
                  <Sparkles className="w-4 h-4 text-yellow-300" />
                  <span>New feature!</span>
                </div>
              </motion.div>
            </div>
            
            <motion.h2
              className="text-4xl font-bold mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              Organize. Prioritize. Achieve.
            </motion.h2>
            <motion.p
              className="text-white/80 text-lg max-w-md mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              Join thousands of productive users managing their tasks with TaskFlow's beautiful interface.
            </motion.p>
            
            {/* Animated stats */}
            <motion.div
              className="flex justify-center gap-8 mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              {[
                { value: "10K+", label: "Active Users" },
                { value: "50K+", label: "Tasks Created" },
                { value: "99%", label: "Satisfaction" },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="text-center"
                  whileHover={{ scale: 1.1 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 + index * 0.1 }}
                >
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-sm text-white/70">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
        
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </div>
  );
}
