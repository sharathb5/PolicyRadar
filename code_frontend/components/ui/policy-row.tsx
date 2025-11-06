"use client"

import { cn } from "@/lib/utils"
import { JurisdictionBadge } from "./jurisdiction-badge"
import { TagChip } from "./tag-chip"
import { StatusBadge } from "./status-badge"
import { ImpactScore } from "./impact-score"
import { ConfidencePill } from "./confidence-pill"
import { ExternalLink, BookMarked as BookmarkFilled, Share2 } from "lucide-react"
import { Button } from "./button"
import type { Policy } from "@/lib/policy-data"

interface PolicyRowProps {
  policy: Policy
  focused?: boolean
  onClick: () => void
  onSave?: (policyId: string) => void
  isSaved?: boolean
}

export function PolicyRow({ policy, focused, onClick, onSave, isSaved = false }: PolicyRowProps) {
  return (
    <div
      className={cn(
        "group relative px-6 py-4 cursor-pointer transition-colors hover:bg-accent/50",
        focused && "bg-accent ring-2 ring-ring",
      )}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          onClick()
        }
      }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-foreground text-balance">{policy.title}</h3>
            <JurisdictionBadge jurisdiction={policy.jurisdiction} />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <TagChip>{policy.policy_type}</TagChip>
            <StatusBadge status={policy.status} />
            {policy.scopes.map((scope) => (
              <TagChip key={scope} variant="scope">
                Scope {scope}
              </TagChip>
            ))}
          </div>

          <p className="text-xs text-muted-foreground line-clamp-1">{policy.what_might_change}</p>

          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>Effective: {policy.effective_date}</span>
            <span>•</span>
            <span>Updated: {policy.last_updated_at}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <ExternalLink className="h-3 w-3" />
              {policy.source_name_official}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end gap-1">
            <ImpactScore score={policy.impact_score} />
            <ConfidencePill confidence={policy.confidence} />
          </div>

          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={(e) => {
                e.stopPropagation()
                onSave?.(policy.id)
              }}
            >
              <BookmarkFilled
                className={`h-4 w-4 ${isSaved ? "fill-primary text-primary" : "text-muted-foreground"}`}
              />
              <span className="sr-only">Save</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={(e) => {
                e.stopPropagation()
                console.log("Share", policy.title)
              }}
            >
              <Share2 className="h-4 w-4" />
              <span className="sr-only">Share</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
