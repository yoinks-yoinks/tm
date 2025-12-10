"use client";

import * as React from "react";
import { Check, Plus, X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useTagsQuery } from "@/hooks/use-tags-query";
import { useCreateTagMutation } from "@/hooks/use-create-tag-mutation";
import { tagColors, type TagColor, getTagColorClass } from "@/constants/tag-colors";
import { toast } from "sonner";

// Base tag type that works for both tasks and standalone tags
export interface BaseTag {
  id: string;
  name: string;
  color: string;
}

interface TagComboboxProps {
  selectedTags: BaseTag[];
  onTagsChange: (tags: BaseTag[]) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

// Simple fuzzy search function
function fuzzyMatch(text: string, search: string): boolean {
  const searchLower = search.toLowerCase();
  const textLower = text.toLowerCase();
  
  // Direct includes match
  if (textLower.includes(searchLower)) return true;
  
  // Fuzzy character match
  let searchIndex = 0;
  for (let i = 0; i < textLower.length && searchIndex < searchLower.length; i++) {
    if (textLower[i] === searchLower[searchIndex]) {
      searchIndex++;
    }
  }
  return searchIndex === searchLower.length;
}

// Color dot component
function ColorDot({ color }: { color: TagColor }) {
  const colorClasses: Record<TagColor, string> = {
    gray: "bg-gray-500",
    red: "bg-red-500",
    orange: "bg-orange-500",
    yellow: "bg-yellow-500",
    green: "bg-green-500",
    teal: "bg-teal-500",
    blue: "bg-blue-500",
    indigo: "bg-indigo-500",
    purple: "bg-purple-500",
    pink: "bg-pink-500",
  };

  return (
    <span className={cn("w-2 h-2 rounded-full shrink-0", colorClasses[color])} />
  );
}

export function TagCombobox({
  selectedTags,
  onTagsChange,
  placeholder = "Select or create tags...",
  className,
  disabled = false,
}: TagComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState("");
  const [showColorPicker, setShowColorPicker] = React.useState(false);
  const [newTagColor, setNewTagColor] = React.useState<TagColor>("blue");

  const { data: tagsData, isPending: isLoadingTags } = useTagsQuery();
  const createTagMutation = useCreateTagMutation();

  const tags = React.useMemo(() => tagsData?.tags || [], [tagsData?.tags]);

  // Filter tags based on search
  const filteredTags = React.useMemo(() => {
    if (!searchValue.trim()) return tags;
    return tags.filter((tag) => fuzzyMatch(tag.name, searchValue));
  }, [tags, searchValue]);

  // Check if exact match exists
  const exactMatchExists = React.useMemo(() => {
    return tags.some(
      (tag) => tag.name.toLowerCase() === searchValue.toLowerCase().trim()
    );
  }, [tags, searchValue]);

  const canCreateNew = searchValue.trim().length > 0 && !exactMatchExists;

  const handleSelect = (tag: BaseTag) => {
    const isSelected = selectedTags.some((t) => t.id === tag.id);
    if (isSelected) {
      onTagsChange(selectedTags.filter((t) => t.id !== tag.id));
    } else {
      onTagsChange([...selectedTags, tag]);
    }
  };

  const handleRemove = (tagId: string) => {
    onTagsChange(selectedTags.filter((t) => t.id !== tagId));
  };

  const handleCreateTag = async () => {
    if (!canCreateNew) return;

    const tagName = searchValue.trim();
    setShowColorPicker(false);

    try {
      const result = await createTagMutation.mutateAsync({
        name: tagName,
        color: newTagColor,
      });

      // Add the new tag to selection
      onTagsChange([...selectedTags, result.tag]);
      setSearchValue("");
      setNewTagColor("blue");
      toast.success(`Tag "${tagName}" created`);
    } catch {
      toast.error("Failed to create tag");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && canCreateNew && !showColorPicker) {
      e.preventDefault();
      setShowColorPicker(true);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-start text-left font-normal min-h-10 h-auto",
            !selectedTags.length && "text-muted-foreground",
            className
          )}
          disabled={disabled}
        >
          <div className="flex flex-wrap gap-1 flex-1">
            <AnimatePresence mode="popLayout">
              {selectedTags.length > 0 ? (
                selectedTags.map((tag) => (
                  <motion.div
                    key={tag.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Badge
                      variant="secondary"
                      className={cn(
                        "mr-1 gap-1",
                        getTagColorClass(tag.color)
                      )}
                    >
                      <ColorDot color={tag.color as TagColor} />
                      {tag.name}
                      <button
                        className="ml-1 hover:bg-black/10 dark:hover:bg-white/10 rounded-full p-0.5"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemove(tag.id);
                        }}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  </motion.div>
                ))
              ) : (
                <span>{placeholder}</span>
              )}
            </AnimatePresence>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search or create tag..."
            value={searchValue}
            onValueChange={setSearchValue}
            onKeyDown={handleKeyDown}
          />
          <CommandList>
            {isLoadingTags ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <>
                <CommandEmpty>
                  {searchValue.trim() ? (
                    <div className="py-2 text-center text-sm text-muted-foreground">
                      No tags found
                    </div>
                  ) : (
                    <div className="py-2 text-center text-sm text-muted-foreground">
                      Start typing to search or create
                    </div>
                  )}
                </CommandEmpty>

                {filteredTags.length > 0 && (
                  <CommandGroup heading="Tags">
                    {filteredTags.map((tag) => {
                      const isSelected = selectedTags.some((t) => t.id === tag.id);
                      return (
                        <CommandItem
                          key={tag.id}
                          value={tag.id}
                          onSelect={() => handleSelect(tag)}
                          className="cursor-pointer"
                        >
                          <div
                            className={cn(
                              "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                              isSelected
                                ? "bg-primary text-primary-foreground"
                                : "opacity-50 [&_svg]:invisible"
                            )}
                          >
                            <Check className="h-3 w-3" />
                          </div>
                          <ColorDot color={tag.color as TagColor} />
                          <span className="ml-2 flex-1">{tag.name}</span>
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                )}

                {canCreateNew && (
                  <>
                    <CommandSeparator />
                    <CommandGroup>
                      {showColorPicker ? (
                        <div className="p-2 space-y-2">
                          <p className="text-xs font-medium text-muted-foreground">
                            Choose a color for "{searchValue.trim()}"
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {tagColors.map((color) => (
                              <motion.button
                                key={color.value}
                                type="button"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setNewTagColor(color.value)}
                                className={cn(
                                  "w-6 h-6 rounded-full flex items-center justify-center transition-all",
                                  color.className,
                                  newTagColor === color.value &&
                                    "ring-2 ring-offset-2 ring-primary"
                                )}
                              >
                                {newTagColor === color.value && (
                                  <Check className="h-3 w-3" />
                                )}
                              </motion.button>
                            ))}
                          </div>
                          <div className="flex gap-2 pt-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setShowColorPicker(false)}
                              className="flex-1"
                            >
                              Cancel
                            </Button>
                            <Button
                              size="sm"
                              onClick={handleCreateTag}
                              disabled={createTagMutation.isPending}
                              className="flex-1"
                            >
                              {createTagMutation.isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                "Create"
                              )}
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <CommandItem
                          onSelect={() => setShowColorPicker(true)}
                          className="cursor-pointer"
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          <span>Create "{searchValue.trim()}"</span>
                        </CommandItem>
                      )}
                    </CommandGroup>
                  </>
                )}
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
