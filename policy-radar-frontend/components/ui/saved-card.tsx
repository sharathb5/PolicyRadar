import { JurisdictionBadge } from "./jurisdiction-badge"
import { TagChip } from "./tag-chip"
import { ImpactScore } from "./impact-score"
import type { PolicyListItem } from "@/lib/types"

interface SavedCardProps {
  policy: PolicyListItem
}

export function SavedCard({ policy }: SavedCardProps) {
  return (
    <div className="border border-border rounded-lg p-4 bg-card hover:bg-accent/30 transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-foreground">{policy.title}</h3>
            <JurisdictionBadge jurisdiction={policy.jurisdiction} />
          </div>

          <div className="flex items-center gap-2">
            <TagChip>{policy.policy_type}</TagChip>
            <span className="text-xs text-muted-foreground">Effective: {policy.effective_date}</span>
          </div>

          <p className="text-xs text-muted-foreground">{policy.what_might_change}</p>
        </div>

        <ImpactScore score={policy.impact_score} />
      </div>
    </div>
  )
}
