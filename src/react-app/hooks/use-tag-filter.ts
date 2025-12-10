import { useCallback, useMemo } from "react";
import { useNavigate, useLocation } from "@tanstack/react-router";

/**
 * Hook to manage tag filter state in URL search params
 */
export function useTagFilter() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get tags from URL search params
  const tagsParam = new URLSearchParams(location.search).get("tags");

  // Parse tag IDs from URL
  const selectedTagIds = useMemo(() => {
    if (!tagsParam) return [];
    return tagsParam.split(",").filter(Boolean);
  }, [tagsParam]);

  // Set tag filter
  const setSelectedTagIds = useCallback(
    (tagIds: string[]) => {
      const searchParams = new URLSearchParams(location.search);
      if (tagIds.length > 0) {
        searchParams.set("tags", tagIds.join(","));
      } else {
        searchParams.delete("tags");
      }
      navigate({
        to: location.pathname,
        search: Object.fromEntries(searchParams),
        replace: true,
      });
    },
    [navigate, location.pathname, location.search]
  );

  // Toggle a single tag
  const toggleTag = useCallback(
    (tagId: string) => {
      const newTagIds = selectedTagIds.includes(tagId)
        ? selectedTagIds.filter((id) => id !== tagId)
        : [...selectedTagIds, tagId];
      setSelectedTagIds(newTagIds);
    },
    [selectedTagIds, setSelectedTagIds]
  );

  // Clear all tag filters
  const clearTagFilters = useCallback(() => {
    setSelectedTagIds([]);
  }, [setSelectedTagIds]);

  return {
    selectedTagIds,
    setSelectedTagIds,
    toggleTag,
    clearTagFilters,
  };
}
