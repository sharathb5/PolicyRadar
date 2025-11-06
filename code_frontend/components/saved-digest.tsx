"use client"

import { PolicyHeader } from "./policy-header"
import { SavedCard } from "./ui/saved-card"
import { Button } from "./ui/button"
import { Copy, Rss } from "lucide-react"
import { policies } from "@/lib/policy-data"

export function SavedDigest() {
  // Group by effective window
  const now = new Date()
  const threeMonths = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000)
  const twelveMonths = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000)

  const nearTerm = policies
    .filter((p) => {
      const effectiveDate = new Date(p.effective_date)
      return effectiveDate <= threeMonths
    })
    .slice(0, 3)

  const midTerm = policies
    .filter((p) => {
      const effectiveDate = new Date(p.effective_date)
      return effectiveDate > threeMonths && effectiveDate <= twelveMonths
    })
    .slice(0, 2)

  const longTerm = policies
    .filter((p) => {
      const effectiveDate = new Date(p.effective_date)
      return effectiveDate > twelveMonths
    })
    .slice(0, 2)

  const recommendedPolicies = [...policies].sort((a, b) => b.impact_score - a.impact_score).slice(0, 5)

  return (
    <div className="flex h-screen flex-col">
      <PolicyHeader />

      <main className="flex-1 overflow-auto">
        <div className="max-w-5xl mx-auto p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-foreground mb-2">Saved Policies</h1>
            <p className="text-sm text-muted-foreground">Track policies by effective timeline</p>
          </div>

          <div className="space-y-8">
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-4">≤ 3 months</h2>
              <div className="space-y-3">
                {nearTerm.map((policy) => (
                  <SavedCard key={policy.id} policy={policy} />
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-4">3–12 months</h2>
              <div className="space-y-3">
                {midTerm.map((policy) => (
                  <SavedCard key={policy.id} policy={policy} />
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-4">&gt; 12 months</h2>
              <div className="space-y-3">
                {longTerm.map((policy) => (
                  <SavedCard key={policy.id} policy={policy} />
                ))}
              </div>
            </section>
          </div>

          <div className="mt-12 border-t border-border pt-8">
            <h2 className="text-xl font-semibold text-foreground mb-2">Recommended Policies</h2>
            <p className="text-sm text-muted-foreground mb-6">High-impact policies you should review</p>

            <div className="space-y-4">
              {recommendedPolicies.map((policy) => (
                <div
                  key={policy.id}
                  className="border border-border rounded-lg p-4 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-foreground mb-1">{policy.title}</h3>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-xs font-medium text-primary">
                          Impact: {policy.impact_score}
                        </span>
                        <span className="text-xs text-muted-foreground">{policy.status}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{policy.what_might_change}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{policy.jurisdiction}</span>
                    <span>•</span>
                    <span>Effective: {policy.effective_date}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2 pt-6">
              <Button variant="default">
                <Copy className="h-4 w-4 mr-2" />
                Copy Link
              </Button>
              <Button variant="secondary" disabled>
                <Rss className="h-4 w-4 mr-2" />
                Export RSS
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
