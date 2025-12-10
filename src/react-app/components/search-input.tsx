import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, type Easing } from "framer-motion";
import { IconSearch, IconX, IconLoader2 } from "@tabler/icons-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  isSearching?: boolean;
}

const inputVariants = {
  collapsed: { 
    width: "40px",
    transition: { duration: 0.3, ease: "easeInOut" as Easing }
  },
  expanded: { 
    width: "240px",
    transition: { duration: 0.3, ease: "easeInOut" as Easing }
  },
};

export function SearchInput({
  value,
  onChange,
  placeholder = "Search tasks...",
  className,
  isSearching = false,
}: SearchInputProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  // Keep expanded if there's a value
  useEffect(() => {
    if (value) {
      setIsExpanded(true);
    }
  }, [value]);

  const handleClear = () => {
    onChange("");
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleBlur = () => {
    if (!value) {
      setIsExpanded(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onChange("");
      setIsExpanded(false);
    }
  };

  return (
    <motion.div
      className={cn(
        "relative flex items-center",
        className
      )}
      variants={inputVariants}
      initial="collapsed"
      animate={isExpanded ? "expanded" : "collapsed"}
    >
      {!isExpanded ? (
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9"
            onClick={() => setIsExpanded(true)}
          >
            <IconSearch className="h-4 w-4" />
            <span className="sr-only">Search</span>
          </Button>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative w-full"
        >
          <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className="pl-9 pr-9 h-9"
          />
          <AnimatePresence>
            {(value || isSearching) && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute right-2 top-1/2 -translate-y-1/2"
              >
                {isSearching ? (
                  <IconLoader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                ) : (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={handleClear}
                  >
                    <IconX className="h-3 w-3" />
                    <span className="sr-only">Clear search</span>
                  </Button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </motion.div>
  );
}
