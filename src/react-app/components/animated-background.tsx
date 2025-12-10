"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface GradientOrbProps {
  className?: string;
  delay?: number;
  duration?: number;
  size?: "sm" | "md" | "lg" | "xl";
}

function GradientOrb({ className = "", delay = 0, duration = 20, size = "lg" }: GradientOrbProps) {
  const sizeClasses = {
    sm: "h-32 w-32",
    md: "h-48 w-48",
    lg: "h-64 w-64",
    xl: "h-96 w-96",
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{
        opacity: [0.3, 0.5, 0.3],
        scale: [1, 1.2, 1],
        x: [0, 30, -20, 0],
        y: [0, -20, 30, 0],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className={`absolute rounded-full blur-3xl ${sizeClasses[size]} ${className}`}
    />
  );
}

interface FloatingParticleProps {
  delay?: number;
}

function FloatingParticle({ delay = 0 }: FloatingParticleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{
        opacity: [0, 1, 0],
        y: [-20, -120],
        x: [0, Math.random() * 40 - 20],
      }}
      transition={{
        duration: 4 + Math.random() * 2,
        delay,
        repeat: Infinity,
        ease: "easeOut",
      }}
      className="absolute h-1 w-1 bg-primary/30 rounded-full"
      style={{
        left: `${Math.random() * 100}%`,
        bottom: "0",
      }}
    />
  );
}

function GridPattern() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div 
        className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]"
        style={{
          backgroundImage: `
            linear-gradient(to right, currentColor 1px, transparent 1px),
            linear-gradient(to bottom, currentColor 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />
      {/* Animated grid lines */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.1, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(90deg, transparent 0%, hsl(var(--primary)/0.1) 50%, transparent 100%)`,
          backgroundSize: "200% 100%",
        }}
      />
    </div>
  );
}

function MovingGradient() {
  return (
    <motion.div
      className="absolute inset-0 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <motion.div
        className="absolute -inset-full opacity-30"
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%"],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "linear",
        }}
        style={{
          background: `
            radial-gradient(circle at 20% 80%, hsl(var(--primary)/0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, hsl(var(--secondary)/0.3) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, hsl(217 91% 60% / 0.2) 0%, transparent 40%)
          `,
        }}
      />
    </motion.div>
  );
}

interface AnimatedBackgroundProps {
  variant?: "default" | "minimal" | "intense";
  children?: React.ReactNode;
  className?: string;
}

export function AnimatedBackground({ variant = "default", children, className = "" }: AnimatedBackgroundProps) {
  const [particles] = useState(() => 
    Array.from({ length: variant === "intense" ? 30 : 15 }, (_, i) => i)
  );

  return (
    <div className={`relative min-h-screen overflow-hidden ${className}`}>
      {/* Base gradient */}
      <div className="absolute inset-0 bg-linear-to-br from-background via-background to-muted/20" />

      {/* Grid pattern */}
      {variant !== "minimal" && <GridPattern />}

      {/* Moving gradient overlay */}
      <MovingGradient />

      {/* Gradient orbs */}
      <GradientOrb
        className="bg-linear-to-br from-blue-500/30 to-cyan-500/20 -top-32 -left-32"
        delay={0}
        duration={25}
        size="xl"
      />
      <GradientOrb
        className="bg-linear-to-br from-purple-500/30 to-pink-500/20 -bottom-32 -right-32"
        delay={5}
        duration={30}
        size="xl"
      />
      {variant === "intense" && (
        <>
          <GradientOrb
            className="bg-linear-to-br from-green-500/20 to-emerald-500/10 top-1/3 left-1/4"
            delay={10}
            duration={20}
            size="lg"
          />
          <GradientOrb
            className="bg-linear-to-br from-orange-500/20 to-amber-500/10 bottom-1/3 right-1/4"
            delay={15}
            duration={22}
            size="md"
          />
          <GradientOrb
            className="bg-linear-to-br from-rose-500/20 to-red-500/10 top-1/2 right-1/3"
            delay={8}
            duration={28}
            size="lg"
          />
        </>
      )}

      {/* Floating particles */}
      {variant !== "minimal" && (
        <div className="absolute inset-0 pointer-events-none">
          {particles.map((i) => (
            <FloatingParticle key={i} delay={i * 0.5} />
          ))}
        </div>
      )}

      {/* Noise texture overlay */}
      <div 
        className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

// Simplified version for auth pages
export function AuthBackground({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative overflow-hidden bg-background ${className}`}>
      {/* Animated gradient mesh */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              "radial-gradient(circle at 0% 0%, hsl(217 91% 60% / 0.15) 0%, transparent 50%)",
              "radial-gradient(circle at 100% 0%, hsl(217 91% 60% / 0.15) 0%, transparent 50%)",
              "radial-gradient(circle at 100% 100%, hsl(217 91% 60% / 0.15) 0%, transparent 50%)",
              "radial-gradient(circle at 0% 100%, hsl(217 91% 60% / 0.15) 0%, transparent 50%)",
              "radial-gradient(circle at 0% 0%, hsl(217 91% 60% / 0.15) 0%, transparent 50%)",
            ],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      {/* Floating orbs */}
      <GradientOrb
        className="bg-linear-to-br from-blue-600/20 to-violet-600/10 -top-20 -right-20"
        delay={0}
        duration={15}
        size="lg"
      />
      <GradientOrb
        className="bg-linear-to-br from-cyan-500/20 to-blue-500/10 -bottom-20 -left-20"
        delay={5}
        duration={18}
        size="lg"
      />

      {/* Grid overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(to right, currentColor 1px, transparent 1px),
            linear-gradient(to bottom, currentColor 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Beam effect */}
      <motion.div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
      >
        <div className="absolute inset-0 bg-linear-to-b from-primary/10 via-primary/5 to-transparent blur-3xl" />
      </motion.div>

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

// Spotlight effect component
export function Spotlight({ className = "" }: { className?: string }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <motion.div
      className={`pointer-events-none fixed inset-0 z-30 transition-opacity duration-300 ${className}`}
      animate={{
        opacity: isHovered ? 1 : 0.5,
        background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, hsl(var(--primary)/0.06), transparent 40%)`,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    />
  );
}
