import { cn } from "@/lib/utils"

interface RegionChipProps {
  region: string
  active?: boolean
}

export function RegionChip({ region, active }: RegionChipProps) {
  return (
    <button
      className={cn(
        "px-3 py-1 rounded-full text-xs font-medium transition-colors",
        active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80",
      )}
    >
      {region}
    </button>
  )
}
