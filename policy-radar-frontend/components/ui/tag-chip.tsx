import type React from "react"
import { cn } from "@/lib/utils"

interface TagChipProps {
  children: React.ReactNode
  variant?: "default" | "scope"
}

export function TagChip({ children, variant = "default" }: TagChipProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium",
        variant === "default" && "bg-secondary text-secondary-foreground",
        variant === "scope" && "bg-muted text-muted-foreground",
      )}
    >
      {children}
    </span>
  )
}
