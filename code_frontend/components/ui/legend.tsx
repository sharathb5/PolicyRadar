"use client"

import { Info } from "lucide-react"
import { useState } from "react"

export function Legend() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
        title="View legend"
      >
        <Info className="h-4 w-4" />
        <span>Legend</span>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-card border border-border rounded-lg shadow-lg z-50 w-96 p-4 space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-2">Impact Score (0–100)</h3>
            <p className="text-xs text-muted-foreground mb-2">
              How disruptive/actionable this policy is, based on mandatory requirements, time to effect, sector
              coverage, and complexity.
            </p>
            <div className="space-y-1 text-xs text-muted-foreground">
              <div>
                <span className="font-medium text-foreground">0–39</span> = Low impact
              </div>
              <div>
                <span className="font-medium text-foreground">40–69</span> = Medium impact
              </div>
              <div>
                <span className="font-medium text-foreground">70–100</span> = High impact
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground mb-2">Confidence (0.00–1.00)</h3>
            <p className="text-xs text-muted-foreground mb-2">
              How sure our classifier is about the tags, policy type, status, and jurisdiction.
            </p>
            <div className="space-y-1 text-xs text-muted-foreground">
              <div>
                <span className="font-medium text-foreground">1.00</span> = Very confident
              </div>
              <div>
                <span className="font-medium text-foreground">0.60–0.79</span> = Moderate
              </div>
              <div>
                <span className="font-medium text-foreground">&lt;0.60</span> = Review recommended
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground mb-2">Impact Factor Bars</h3>
            <p className="text-xs text-muted-foreground">
              Breakdown of what drove the Impact Score. Higher bar = bigger contribution.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground mb-2">Saved Groupings</h3>
            <p className="text-xs text-muted-foreground">
              Policies are grouped by time until effective date: ≤3 months, 3–12 months, &gt;12 months.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
