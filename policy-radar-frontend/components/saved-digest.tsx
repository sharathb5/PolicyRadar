"use client"

import { useState } from "react"
import { PolicyHeader } from "./policy-header"
import { SavedCard } from "./ui/saved-card"
import { Button } from "./ui/button"
import { Skeleton } from "./ui/skeleton"
import { AlertCircle, Copy, Rss } from "lucide-react"
import { useSavedPolicies } from "@/lib/queries/saved"
import { useDigestPreview } from "@/lib/queries/digest"
import { PolicyDrawer } from "./policy-drawer"
import { useToast } from "./ui/use-toast"

export function SavedDigest() {
  const { toast } = useToast()
  const { data: savedData, isLoading: isLoadingSaved, error: savedError, refetch: refetchSaved } = useSavedPolicies()
  const { data: digestData, isLoading: isLoadingDigest, error: digestError, refetch: refetchDigest } = useDigestPreview()
  const [selectedPolicyId, setSelectedPolicyId] = useState<number | null>(null)

  const nearTerm = savedData?.['<=90d']?.policies || []
  const midTerm = savedData?.['90-365d']?.policies || []
  const longTerm = savedData?.['>365d']?.policies || []
  const totalCount = nearTerm.length + midTerm.length + longTerm.length

  const handlePolicyClick = (policyId: number) => {
    setSelectedPolicyId(policyId)
  }

  return (
    <div className="flex h-screen flex-col">
      <PolicyHeader />

      <main className="flex-1 overflow-auto">
        <div className="max-w-5xl mx-auto p-8">
          <div className="mb-8 flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-foreground mb-1">Saved Policies</h1>
              <p className="text-sm text-muted-foreground">Total saved: {totalCount}</p>
            </div>
            <div className="shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  refetchSaved()
                  refetchDigest()
                }}
                data-testid="saved-refresh"
              >
                Refresh
              </Button>
            </div>
          </div>

          {isLoadingSaved && (
            <div className="space-y-8">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="h-6 w-32" />
                  {Array.from({ length: 2 }).map((_, j) => (
                    <Skeleton key={j} className="h-24 w-full" />
                  ))}
                </div>
              ))}
            </div>
          )}

          {savedError && (
            <div className="text-center py-12">
              <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
              <p className="text-lg font-medium text-foreground mb-2">Error loading saved policies</p>
              <p className="text-sm text-muted-foreground mb-4">
                {savedError instanceof Error ? savedError.message : 'An unknown error occurred'}
              </p>
              <Button onClick={() => refetchSaved()} variant="default">
                Retry
              </Button>
            </div>
          )}

          {!isLoadingSaved && !savedError && (
            <div className="space-y-8">
              {nearTerm.length === 0 && midTerm.length === 0 && longTerm.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-lg font-medium text-foreground mb-2">No saved policies</p>
                  <p className="text-sm text-muted-foreground">Save policies from the feed to see them here</p>
                </div>
              ) : (
                <>
                  {nearTerm.length > 0 && (
                    <section data-testid="saved-section-<=90d" data-section-alias="saved-section-near-term">
                      <div data-testid="saved-section-near-term" className="hidden" />
                      <h2 className="text-lg font-semibold text-foreground mb-4">
                        ≤ 90 days ({nearTerm.length})
                      </h2>
                      <div className="space-y-3">
                        {nearTerm.map((policy) => (
                          <div key={policy.id} onClick={() => handlePolicyClick(policy.id)}>
                            <SavedCard policy={policy} />
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {midTerm.length > 0 && (
                    <section data-testid="saved-section-90-365d" data-section-alias="saved-section-mid-term">
                      <div data-testid="saved-section-mid-term" className="hidden" />
                      <h2 className="text-lg font-semibold text-foreground mb-4">
                        90–365 days ({midTerm.length})
                      </h2>
                      <div className="space-y-3">
                        {midTerm.map((policy) => (
                          <div key={policy.id} onClick={() => handlePolicyClick(policy.id)}>
                            <SavedCard policy={policy} />
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {longTerm.length > 0 && (
                    <section data-testid="saved-section->365d" data-section-alias="saved-section-long-term">
                      <div data-testid="saved-section-long-term" className="hidden" />
                      <h2 className="text-lg font-semibold text-foreground mb-4">
                        &gt; 365 days ({longTerm.length})
                      </h2>
                      <div className="space-y-3">
                        {longTerm.map((policy) => (
                          <div key={policy.id} onClick={() => handlePolicyClick(policy.id)}>
                            <SavedCard policy={policy} />
                          </div>
                        ))}
                      </div>
                    </section>
                  )}
                </>
              )}
            </div>
          )}

          <div className="mt-12 border-t border-border pt-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">Digest Preview</h2>
            <div className="bg-muted/30 rounded-lg p-6 space-y-4" data-testid="digest-preview">
              {isLoadingDigest && (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-20 w-full" />
                  ))}
                </div>
              )}

              {digestError && (
                <div className="text-center py-8">
                  <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-2" />
                  <p className="text-sm font-medium text-foreground mb-1">Error loading digest</p>
                  <p className="text-xs text-muted-foreground mb-4">
                    {digestError instanceof Error ? digestError.message : 'An unknown error occurred'}
                  </p>
                  <Button onClick={() => refetchDigest()} variant="outline" size="sm">
                    Retry
                  </Button>
                </div>
              )}

              {!isLoadingDigest && !digestError && (
                <>
                  <p className="text-sm text-muted-foreground">Top 5 policies for your digest</p>

                  {digestData?.top5 && digestData.top5.length > 0 ? (
                    digestData.top5.map((item) => (
                      <div key={item.id} className="border-l-2 border-primary pl-4" data-testid="digest-item">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="text-sm font-semibold text-foreground mb-1">{item.title}</h3>
                            <p className="text-xs text-muted-foreground mb-2" data-testid="why-it-matters">{item.why_it_matters}</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span>Impact: {item.score}</span>
                              <span>•</span>
                              <span data-testid="source-name">{item.source_name}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No digest items available</p>
                  )}

                  <div className="flex gap-2 pt-4">
                    <Button 
                      variant="default" 
                      data-testid="copy-link"
                      onClick={async () => {
                        try {
                          await navigator.clipboard.writeText(window.location.href)
                          toast({ title: 'Link copied', description: 'Digest link copied to clipboard' })
                        } catch {
                          toast({ title: 'Copy failed', description: 'Could not copy link' })
                        }
                      }}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy link
                      <span className="sr-only" data-testid="digest-preview-button" />
                    </Button>
                    <Button variant="secondary" disabled>
                      <Rss className="h-4 w-4 mr-2" />
                      Export RSS
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      <PolicyDrawer policyId={selectedPolicyId} onClose={() => setSelectedPolicyId(null)} />
    </div>
  )
}
