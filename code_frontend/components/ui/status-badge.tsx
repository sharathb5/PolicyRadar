import { cn } from "@/lib/utils"

interface StatusBadgeProps {
  status: string
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const colors: Record<string, string> = {
    Proposed: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
    Adopted: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    Effective: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  }

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium",
        colors[status] || "bg-muted text-muted-foreground",
      )}
    >
      {status}
    </span>
  )
}
