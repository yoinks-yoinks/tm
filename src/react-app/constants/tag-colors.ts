// Tag color values array for Zod schema validation
export const tagColorValues = [
  "gray", "red", "orange", "yellow", "green", 
  "teal", "blue", "indigo", "purple", "pink"
] as const;

export type TagColor = (typeof tagColorValues)[number];

export const tagColors = [
  { name: "Gray", value: "gray" as const, className: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300" },
  { name: "Red", value: "red" as const, className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
  { name: "Orange", value: "orange" as const, className: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" },
  { name: "Yellow", value: "yellow" as const, className: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" },
  { name: "Green", value: "green" as const, className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  { name: "Teal", value: "teal" as const, className: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400" },
  { name: "Blue", value: "blue" as const, className: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  { name: "Indigo", value: "indigo" as const, className: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400" },
  { name: "Purple", value: "purple" as const, className: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" },
  { name: "Pink", value: "pink" as const, className: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400" },
] as const;

export const tagColorMap = tagColors.reduce(
  (acc, color) => {
    acc[color.value] = color;
    return acc;
  },
  {} as Record<TagColor, (typeof tagColors)[number]>
);

export function getTagColorClass(color: string): string {
  const tagColor = tagColorMap[color as TagColor];
  return tagColor?.className || tagColors[0].className;
}
