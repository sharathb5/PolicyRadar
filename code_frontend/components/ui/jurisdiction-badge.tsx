import { cn } from "@/lib/utils"

interface JurisdictionBadgeProps {
  jurisdiction: string
}

export function JurisdictionBadge({ jurisdiction }: JurisdictionBadgeProps) {
  const colors: Record<string, string> = {
    EU: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    "US-Federal": "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    "US-CA": "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
    UK: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  }

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold",
        colors[jurisdiction] || "bg-muted text-muted-foreground",
      )}
    >
      {jurisdiction}
    </span>
  )
}
