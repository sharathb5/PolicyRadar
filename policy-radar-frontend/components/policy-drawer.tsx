"use client"

import { X, ExternalLink, Copy, Bookmark, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { StatusBadge } from "@/components/ui/status-badge"
import { JurisdictionBadge } from "@/components/ui/jurisdiction-badge"
import { TagChip } from "@/components/ui/tag-chip"
import { ImpactScore } from "@/components/ui/impact-score"
import { ConfidencePill } from "@/components/ui/confidence-pill"
import { Skeleton } from "@/components/ui/skeleton"
import { usePolicyDetail } from "@/lib/queries/policies"
import { useToggleSaved } from "@/lib/queries/saved"

interface PolicyDrawerProps {
  policyId: number | null
  onClose: () => void
}

export function PolicyDrawer({ policyId, onClose }: PolicyDrawerProps) {
  const { data: policy, isLoading, error, refetch } = usePolicyDetail(policyId)
  const toggleSaved = useToggleSaved()

  if (!policyId) return null

  if (isLoading) {
    return (
      <>
        <div className="fixed inset-0 bg-black/20 z-40" onClick={onClose} aria-hidden="true" />
        <aside
          className="fixed right-0 top-0 bottom-0 w-[40%] bg-card border-l border-border z-50 overflow-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="drawer-title"
        >
          <div className="p-6 space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-32 w-full" />
          </div>
        </aside>
      </>
    )
  }

  if (error || !policy) {
    return (
      <>
        <div className="fixed inset-0 bg-black/20 z-40" onClick={onClose} aria-hidden="true" />
        <aside
          className="fixed right-0 top-0 bottom-0 w-[40%] bg-card border-l border-border z-50 overflow-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="drawer-title"
        >
          <div className="flex items-center justify-center h-full p-8">
            <div className="text-center max-w-md">
              <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
              <p className="text-lg font-medium text-foreground mb-2">Error loading policy</p>
              <p className="text-sm text-muted-foreground mb-4">
                {error instanceof Error ? error.message : 'An unknown error occurred'}
              </p>
              <Button onClick={() => refetch()} variant="default" className="mr-2">
                Retry
              </Button>
              <Button onClick={onClose} variant="outline">
                Close
              </Button>
            </div>
          </div>
        </aside>
      </>
    )
  }

  const impactFactors = [
    { label: "Mandatory", value: policy.impact_factors.mandatory },
    { label: "Time proximity", value: policy.impact_factors.time_proximity },
    { label: "Scope coverage", value: policy.impact_factors.scope_coverage },
    { label: "Sector breadth", value: policy.impact_factors.sector_breadth },
    { label: "Disclosure complexity", value: policy.impact_factors.disclosure_complexity },
  ]

  const handleSave = () => {
    console.log('🔵 Save button clicked', { policyId: policy.id })
    
    if (!policy?.id) {
      console.error('❌ No policy ID found')
      return
    }
    
    try {
      console.log('🟢 Calling toggleSaved.mutate', { policyId: policy.id })
      toggleSaved.mutate(policy.id, {
        onSuccess: (data) => {
          console.log('✅ Save successful', { data, policyId: policy.id })
        },
        onError: (error) => {
          console.error('❌ Save failed', { error, policyId: policy.id })
        },
      })
    } catch (error) {
      console.error('❌ Save handler error', { error, policyId: policy.id })
    }
  }

  const handleCopyLink = async () => {
    try {
      const href = typeof window !== 'undefined' ? window.location.href : ''
      await navigator.clipboard.writeText(href)
      toast({ title: 'Link copied', description: 'A shareable link has been copied to your clipboard.' })
    } catch (err) {
      toast({ title: 'Copy failed', description: 'Unable to copy link. Please try again.' })
    }
  }

  return (
    <>
      <div data-testid="drawer-backdrop" className="fixed inset-0 bg-black/20 z-40" onClick={onClose} aria-hidden="true" />

      <aside
        data-testid="policy-drawer"
        className="fixed right-0 top-0 bottom-0 w-[40%] bg-card border-l border-border z-50 overflow-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
      >
        <div className="sticky top-0 bg-card border-b border-border p-4 flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h2 id="drawer-title" data-testid="policy-title" data-policy-id={policy.id} className="text-lg font-semibold text-foreground text-balance">
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
              title="Save policy"
              onClick={handleSave}
              disabled={toggleSaved.isPending}
            >
              <Bookmark className="h-4 w-4" />
              <span className="sr-only">Save policy</span>
            </Button>
            <Button variant="ghost" size="icon" title="Copy link" onClick={handleCopyLink}>
              <Copy className="h-4 w-4" />
              <span className="sr-only">Copy link</span>
            </Button>
            <Button data-testid="drawer-close" variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
              <span className="sr-only">Close drawer</span>
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <section>
            <h3 className="text-sm font-semibold text-foreground mb-2">Summary</h3>
            <p data-testid="policy-summary" className="text-sm text-foreground leading-relaxed">{policy.summary}</p>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-foreground mb-3">Impact</h3>
            <div data-testid="policy-impact-factors" className="space-y-2 mb-3">
              {impactFactors.map((factor) => (
                <div key={factor.label} data-testid={`impact-factor-${factor.label.toLowerCase().replace(/\s+/g, '-')}`} className="flex items-center gap-3">
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
                  <span className="text-muted-foreground">•</span>
                  <span className="text-muted-foreground" data-testid="effective-in-days">
                    {(() => {
                      const today = new Date()
                      const eff = new Date(policy.effective_date)
                      const diffMs = eff.getTime() - today.setHours(0,0,0,0)
                      const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
                      return `Effective in ${days} days`
                    })()}
                  </span>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-foreground mb-2">What might change</h3>
            <p className="text-sm text-foreground leading-relaxed">{policy.what_might_change}</p>
          </section>

          {Array.isArray(policy.likely_affects) && policy.likely_affects.length > 0 && (
            <section>
              <h3 className="text-sm font-semibold text-foreground mb-2">Implications</h3>
              <div data-testid="likely-affects" className="flex gap-2 flex-wrap">
                {policy.likely_affects.map((item, idx) => (
                  <TagChip key={`${item}-${idx}`}>{item}</TagChip>
                ))}
              </div>
            </section>
          )}

          {policy.sectors && policy.sectors.length > 0 && (
            <section>
              <h3 className="text-sm font-semibold text-foreground mb-2">Sectors</h3>
              <div className="flex gap-2 flex-wrap">
                {policy.sectors.map((sector) => (
                  <TagChip key={sector}>{sector}</TagChip>
                ))}
              </div>
            </section>
          )}

          <section>
            <h3 className="text-sm font-semibold text-foreground mb-2">Citations</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <ExternalLink className="h-3 w-3 text-muted-foreground" />
                <span className="text-sm text-foreground">{policy.source_name_official}</span>
              </div>
              {policy.source_name_secondary && (
                <div className="flex items-center gap-2">
                  <ExternalLink className="h-3 w-3 text-muted-foreground" />
                  <span className="text-sm text-foreground">{policy.source_name_secondary}</span>
                </div>
              )}
            </div>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-foreground mb-2">Version</h3>
            <div data-testid="policy-version" className="text-sm text-foreground">
              Version {policy.version}
            </div>
          </section>

          {policy.history && policy.history.length > 0 && (
            <section>
              <h3 className="text-sm font-semibold text-foreground mb-2">History</h3>
              <div data-testid="policy-history" className="space-y-2">
                {policy.history.map((entry, index) => (
                  <div key={index} className="text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">
                      {new Date(entry.changed_at).toLocaleDateString()}
                    </span> — Version {entry.version_from} to {entry.version_to}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <div className="sticky bottom-0 bg-card border-t border-border p-4 flex gap-2">
          <Button data-testid="save-policy-button" variant="default" className="flex-1" onClick={handleSave} disabled={toggleSaved.isPending}>
            <Bookmark className="h-4 w-4 mr-2" />
            {toggleSaved.isPending ? 'Saving...' : 'Save'}
          </Button>
          <Button variant="secondary" className="flex-1">
            Add to Digest
          </Button>
          <Button variant="ghost">Report issue</Button>
        </div>
      </aside>
    </>
  )
}
