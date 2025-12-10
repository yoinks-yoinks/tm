"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Tag, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTagsQuery } from "@/hooks/use-tags-query";
import { useCreateTagMutation } from "@/hooks/use-create-tag-mutation";
import { useTasksQuery } from "@/hooks/use-tasks-query";
import { useTagFilter } from "@/hooks/use-tag-filter";
import { tagColors, type TagColor } from "@/constants/tag-colors";
import { toast } from "sonner";

// Color dot component for tags
function ColorDot({ color }: { color: string }) {
  const colorClasses: Record<string, string> = {
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
    <span className={cn("w-2.5 h-2.5 rounded-full shrink-0", colorClasses[color] || "bg-gray-500")} />
  );
}

export function NavTags() {
  const [isOpen, setIsOpen] = React.useState(true);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [newTagName, setNewTagName] = React.useState("");
  const [newTagColor, setNewTagColor] = React.useState<TagColor>("blue");

  const { selectedTagIds, toggleTag, clearTagFilters } = useTagFilter();
  const { data: tagsData, isPending: isLoadingTags } = useTagsQuery();
  const { data: tasksData } = useTasksQuery();
  const createTagMutation = useCreateTagMutation();

  const tags = tagsData?.tags || [];
  const tasks = React.useMemo(() => tasksData?.tasks || [], [tasksData?.tasks]);

  // Calculate task count per tag
  const tagTaskCounts = React.useMemo(() => {
    const counts: Record<string, number> = {};
    tasks.forEach((task) => {
      task.tags?.forEach((tag) => {
        counts[tag.id] = (counts[tag.id] || 0) + 1;
      });
    });
    return counts;
  }, [tasks]);

  const handleTagClick = (tagId: string) => {
    toggleTag(tagId);
  };

  const handleClearFilters = () => {
    clearTagFilters();
  };

  const handleCreateTag = async () => {
    if (!newTagName.trim()) {
      toast.error("Tag name is required");
      return;
    }

    try {
      await createTagMutation.mutateAsync({
        name: newTagName.trim(),
        color: newTagColor,
      });
      toast.success(`Tag "${newTagName}" created`);
      setNewTagName("");
      setNewTagColor("blue");
      setIsDialogOpen(false);
    } catch {
      toast.error("Failed to create tag");
    }
  };

  return (
    <SidebarGroup>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex items-center justify-between">
          <CollapsibleTrigger asChild>
            <SidebarGroupLabel className="cursor-pointer hover:bg-muted/50 rounded-md transition-colors flex items-center gap-1">
              <motion.div
                animate={{ rotate: isOpen ? 90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronRight className="h-4 w-4" />
              </motion.div>
              <Tag className="h-4 w-4 mr-1" />
              Tags
              {selectedTagIds.length > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 px-1.5 text-xs">
                  {selectedTagIds.length}
                </Badge>
              )}
            </SidebarGroupLabel>
          </CollapsibleTrigger>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 mr-2"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Tag</DialogTitle>
                <DialogDescription>
                  Add a new tag to organize your tasks.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="tag-name">Name</Label>
                  <Input
                    id="tag-name"
                    value={newTagName}
                    onChange={(e) => setNewTagName(e.target.value)}
                    placeholder="Enter tag name"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleCreateTag();
                      }
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Color</Label>
                  <div className="flex flex-wrap gap-2">
                    {tagColors.map((color) => (
                      <motion.button
                        key={color.value}
                        type="button"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setNewTagColor(color.value)}
                        className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center transition-all border-2",
                          newTagColor === color.value
                            ? "border-primary ring-2 ring-primary/20"
                            : "border-transparent"
                        )}
                        title={color.name}
                      >
                        <ColorDot color={color.value} />
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateTag}
                  disabled={createTagMutation.isPending}
                >
                  {createTagMutation.isPending ? "Creating..." : "Create Tag"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <CollapsibleContent>
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <SidebarMenu className="mt-1">
                  {/* Clear Filters Button */}
                  {selectedTagIds.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                    >
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          onClick={handleClearFilters}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <X className="h-4 w-4" />
                          <span>Clear filters</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </motion.div>
                  )}

                  {/* Loading State */}
                  {isLoadingTags ? (
                    <div className="px-2 py-4 text-sm text-muted-foreground">
                      Loading tags...
                    </div>
                  ) : tags.length === 0 ? (
                    <div className="px-2 py-4 text-sm text-muted-foreground">
                      No tags yet. Create one!
                    </div>
                  ) : (
                    /* Tag List */
                    tags.map((tag, index) => {
                      const isSelected = selectedTagIds.includes(tag.id);
                      const taskCount = tagTaskCounts[tag.id] || 0;

                      return (
                        <motion.div
                          key={tag.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <SidebarMenuItem>
                            <SidebarMenuButton
                              onClick={() => handleTagClick(tag.id)}
                              className={cn(
                                "group transition-all duration-200",
                                isSelected && "bg-primary/10 text-primary font-medium"
                              )}
                            >
                              <ColorDot color={tag.color} />
                              <span className="flex-1 truncate">{tag.name}</span>
                              <Badge
                                variant="secondary"
                                className={cn(
                                  "h-5 px-1.5 text-xs transition-colors",
                                  isSelected && "bg-primary/20"
                                )}
                              >
                                {taskCount}
                              </Badge>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        </motion.div>
                      );
                    })
                  )}
                </SidebarMenu>
              </motion.div>
            )}
          </AnimatePresence>
        </CollapsibleContent>
      </Collapsible>
    </SidebarGroup>
  );
}
