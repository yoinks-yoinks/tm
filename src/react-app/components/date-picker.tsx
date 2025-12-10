"use client";

import * as React from "react";
import { format, isValid, parseISO } from "date-fns";
import { motion, AnimatePresence, type Easing } from "framer-motion";
import { IconCalendar, IconX } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
  value?: string | null;
  onChange: (date: string | null) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  minDate?: Date;
}

const popoverVariants = {
  hidden: { opacity: 0, scale: 0.95, y: -5 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { duration: 0.15, ease: "easeOut" as Easing }
  },
};

export function DatePicker({
  value,
  onChange,
  placeholder = "Pick a date",
  disabled = false,
  className,
  minDate,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  
  // Parse the ISO string to Date object
  const selectedDate = React.useMemo(() => {
    if (!value) return undefined;
    const parsed = parseISO(value);
    return isValid(parsed) ? parsed : undefined;
  }, [value]);

  const handleSelect = (date: Date | undefined) => {
    if (date) {
      // Convert to ISO string
      onChange(date.toISOString());
    }
    setOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
  };

  const displayValue = selectedDate
    ? format(selectedDate, "PPP")
    : placeholder;

  const isOverdue = selectedDate && selectedDate < new Date();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            "w-full justify-start text-left font-normal",
            !selectedDate && "text-muted-foreground",
            isOverdue && "text-red-500 border-red-200 dark:border-red-800",
            className
          )}
        >
          <IconCalendar className={cn(
            "mr-2 h-4 w-4",
            isOverdue && "text-red-500"
          )} />
          <span className="flex-1">{displayValue}</span>
          <AnimatePresence>
            {selectedDate && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={handleClear}
                className="ml-2 rounded-full p-0.5 hover:bg-muted"
              >
                <IconX className="h-3 w-3" />
              </motion.button>
            )}
          </AnimatePresence>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={popoverVariants}
        >
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleSelect}
            disabled={(date) => {
              if (minDate && date < minDate) {
                return true;
              }
              return false;
            }}
            initialFocus
          />
          {selectedDate && (
            <div className="border-t p-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Selected:</span>
                <span className="font-medium">
                  {format(selectedDate, "EEEE, MMMM d, yyyy")}
                </span>
              </div>
            </div>
          )}
        </motion.div>
      </PopoverContent>
    </Popover>
  );
}
