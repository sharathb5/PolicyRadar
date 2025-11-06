"use client"

import { X, ExternalLink, Copy, Share2, BookMarked as BookmarkFilled } from "lucide-react"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/ui/status-badge"
import { JurisdictionBadge } from "@/components/ui/jurisdiction-badge"
import { TagChip } from "@/components/ui/tag-chip"
import { ImpactScore } from "@/components/ui/impact-score"
import { ConfidencePill } from "@/components/ui/confidence-pill"
import { useState, useEffect } from "react"
import type { Policy } from "@/lib/policy-data"

interface PolicyDrawerProps {
  policy: Policy | null
  onClose: () => void
  onSave?: (policyId: string) => void
  isSaved?: boolean
}

export function PolicyDrawer({ policy, onClose, onSave, isSaved = false }: PolicyDrawerProps) {
  const [isAdded, setIsAdded] = useState(false)
  const [localIsSaved, setLocalIsSaved] = useState(isSaved)

  useEffect(() => {
    setLocalIsSaved(isSaved)
  }, [isSaved])

  if (!policy) return null

  const impactFactors = [
    { label: "Mandatory", value: 85 },
    { label: "Time proximity", value: 72 },
    { label: "Scope coverage", value: 90 },
    { label: "Sector breadth", value: 68 },
    { label: "Disclosure complexity", value: 78 },
  ]

  const handleAddToDigest = () => {
    setIsAdded(true)
    console.log("[v0] Added to digest:", policy.title)
    // Reset after 2 seconds
    setTimeout(() => setIsAdded(false), 2000)
  }

  const handleShare = () => {
    const shareUrl = `${window.location.origin}?policy=${policy.id}`
    navigator.clipboard.writeText(shareUrl)
    console.log("[v0] Shared policy link:", shareUrl)
  }

  const handleCopyLink = () => {
    const shareUrl = `${window.location.origin}?policy=${policy.id}`
    navigator.clipboard.writeText(shareUrl)
    console.log("[v0] Copied link:", shareUrl)
  }

  const handleSave = () => {
    setLocalIsSaved(!localIsSaved)
    onSave?.(policy.id)
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/20 z-40" onClick={onClose} aria-hidden="true" />

      <aside
        className="fixed right-0 top-0 bottom-0 w-[40%] bg-card border-l border-border z-50 overflow-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
      >
        <div className="sticky top-0 bg-card border-b border-border p-4 flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h2 id="drawer-title" className="text-lg font-semibold text-foreground text-balance">
              {policy.title}
            </h2>
            <div className="flex items-center gap-2 mt-2">
              <JurisdictionBadge jurisdiction={policy.jurisdiction} />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSave}
              title={localIsSaved ? "Remove from saved" : "Save policy"}
            >
              <BookmarkFilled
                className={`h-4 w-4 ${localIsSaved ? "fill-primary text-primary" : "text-muted-foreground"}`}
              />
              <span className="sr-only">{localIsSaved ? "Remove from saved" : "Save policy"}</span>
            </Button>
            <Button variant="ghost" size="icon" onClick={handleShare} title="Share policy">
              <Share2 className="h-4 w-4" />
              <span className="sr-only">Share policy</span>
            </Button>
            <Button variant="ghost" size="icon" onClick={handleCopyLink} title="Copy link">
              <Copy className="h-4 w-4" />
              <span className="sr-only">Copy link</span>
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
              <span className="sr-only">Close drawer</span>
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <section>
            <h3 className="text-sm font-semibold text-foreground mb-2">Summary</h3>
            <p className="text-sm text-foreground leading-relaxed">{policy.summary}</p>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-foreground mb-3">Impact</h3>
            <div className="space-y-2 mb-3">
              {impactFactors.map((factor) => (
                <div key={factor.label} className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground w-36">{factor.label}</span>
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${factor.value}%` }} />
                  </div>
                  <span className="text-xs font-medium text-foreground w-8 text-right">{factor.value}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-foreground">Total Score:</span>
              <ImpactScore score={policy.impact_score} />
              <ConfidencePill confidence={policy.confidence} />
            </div>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-foreground mb-3">Applicability</h3>
            <div className="space-y-3">
              <div>
                <span className="text-xs text-muted-foreground block mb-2">Scopes</span>
                <div className="flex gap-2">
                  {policy.scopes.map((scope) => (
                    <TagChip key={scope}>Scope {scope}</TagChip>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-xs text-muted-foreground block mb-2">Status</span>
                <StatusBadge status={policy.status} />
              </div>

              <div>
                <span className="text-xs text-muted-foreground block mb-2">Timeline</span>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-muted-foreground">Effective:</span>
                  <span className="font-medium text-foreground">{policy.effective_date}</span>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-foreground mb-2">What might change</h3>
            <p className="text-sm text-foreground leading-relaxed">{policy.what_might_change}</p>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-foreground mb-2">Citations</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <ExternalLink className="h-3 w-3 text-muted-foreground" />
                <span className="text-sm text-foreground">{policy.source_name_official}</span>
              </div>
              <div className="flex items-center gap-2">
                <ExternalLink className="h-3 w-3 text-muted-foreground" />
                <span className="text-sm text-foreground">{policy.source_name_secondary}</span>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-foreground mb-2">History</h3>
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground">
                <span className="font-medium text-foreground">{policy.last_updated_at}</span> — Status updated to{" "}
                {policy.status}
              </div>
            </div>
          </section>
        </div>

        <div className="sticky bottom-0 bg-card border-t border-border p-4">
          <Button
            variant={isAdded ? "default" : "secondary"}
            className="w-full"
            onClick={handleAddToDigest}
            disabled={isAdded}
          >
            {isAdded ? "✓ Added to Digest" : "Add to Digest"}
          </Button>
        </div>
      </aside>
    </>
  )
}
