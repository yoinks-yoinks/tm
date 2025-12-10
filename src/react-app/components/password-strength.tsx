"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Check, X } from "lucide-react";

interface PasswordStrengthProps {
  password: string;
  className?: string;
}

type StrengthLevel = "weak" | "fair" | "good" | "strong";

interface PasswordRequirement {
  label: string;
  test: (password: string) => boolean;
}

const requirements: PasswordRequirement[] = [
  { label: "At least 8 characters", test: (p) => p.length >= 8 },
  { label: "Contains uppercase letter", test: (p) => /[A-Z]/.test(p) },
  { label: "Contains lowercase letter", test: (p) => /[a-z]/.test(p) },
  { label: "Contains a number", test: (p) => /[0-9]/.test(p) },
  { label: "Contains special character", test: (p) => /[^A-Za-z0-9]/.test(p) },
];

function calculateStrength(password: string): {
  level: StrengthLevel;
  score: number;
  passedRequirements: boolean[];
} {
  const passedRequirements = requirements.map((req) => req.test(password));
  const score = passedRequirements.filter(Boolean).length;

  let level: StrengthLevel;
  if (score <= 1) level = "weak";
  else if (score <= 2) level = "fair";
  else if (score <= 3) level = "good";
  else level = "strong";

  return { level, score, passedRequirements };
}

const strengthConfig: Record<
  StrengthLevel,
  { color: string; bgColor: string; label: string }
> = {
  weak: { color: "bg-red-500", bgColor: "bg-red-500/20", label: "Weak" },
  fair: { color: "bg-orange-500", bgColor: "bg-orange-500/20", label: "Fair" },
  good: { color: "bg-yellow-500", bgColor: "bg-yellow-500/20", label: "Good" },
  strong: { color: "bg-green-500", bgColor: "bg-green-500/20", label: "Strong" },
};

export function PasswordStrength({ password, className }: PasswordStrengthProps) {
  const { level, score, passedRequirements } = React.useMemo(
    () => calculateStrength(password),
    [password]
  );

  const config = strengthConfig[level];

  if (!password) return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className={cn("space-y-3", className)}
    >
      {/* Strength Bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Password strength</span>
          <motion.span
            key={level}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "font-medium",
              level === "weak" && "text-red-500",
              level === "fair" && "text-orange-500",
              level === "good" && "text-yellow-500",
              level === "strong" && "text-green-500"
            )}
          >
            {config.label}
          </motion.span>
        </div>
        <div className="flex gap-1">
          {[0, 1, 2, 3, 4].map((index) => (
            <motion.div
              key={index}
              className={cn(
                "h-1.5 flex-1 rounded-full transition-colors duration-300",
                index < score ? config.color : "bg-muted"
              )}
              initial={false}
              animate={{
                scale: index < score ? [1, 1.1, 1] : 1,
              }}
              transition={{ duration: 0.2 }}
            />
          ))}
        </div>
      </div>

      {/* Requirements List */}
      <div className="space-y-1.5">
        {requirements.map((req, index) => {
          const passed = passedRequirements[index];
          return (
            <motion.div
              key={req.label}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center gap-2 text-xs"
            >
              <motion.div
                initial={false}
                animate={{
                  scale: passed ? [1, 1.2, 1] : 1,
                  backgroundColor: passed ? "rgb(34 197 94)" : "rgb(107 114 128)",
                }}
                transition={{ duration: 0.2 }}
                className={cn(
                  "flex h-4 w-4 items-center justify-center rounded-full",
                  passed ? "bg-green-500" : "bg-muted-foreground/40"
                )}
              >
                {passed ? (
                  <Check className="h-2.5 w-2.5 text-white" />
                ) : (
                  <X className="h-2.5 w-2.5 text-white" />
                )}
              </motion.div>
              <span
                className={cn(
                  "transition-colors duration-200",
                  passed ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {req.label}
              </span>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
