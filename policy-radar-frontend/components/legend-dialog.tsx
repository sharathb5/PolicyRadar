"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface LegendDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function LegendDialog({ open, onOpenChange }: LegendDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto" data-testid="legend-content">
        <DialogHeader>
          <DialogTitle>Policy Radar – Number Key</DialogTitle>
          <DialogDescription>
            How to interpret the scores, labels, and metrics shown in Policy Radar
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 mt-4">
          {/* Impact Score Section */}
          <section>
            <h3 className="text-lg font-semibold mb-2">Impact Score (0–100)</h3>
            <p className="text-sm text-muted-foreground mb-2">
              How disruptive/actionable this policy is, based on simple rules (mandatory vs voluntary, how soon it takes effect, which scopes/sectors it touches, and disclosure complexity).
            </p>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li><strong>0–39</strong> = Low impact</li>
              <li><strong>40–69</strong> = Medium impact</li>
              <li><strong>70–100</strong> = High impact</li>
            </ul>
            <p className="text-xs text-muted-foreground mt-2">
              Color on the pill only reflects this band; higher number = higher urgency.
            </p>
          </section>

          {/* Confidence Section */}
          <section>
            <h3 className="text-lg font-semibold mb-2">Confidence (0.00–1.00)</h3>
            <p className="text-sm text-muted-foreground mb-2">
              How sure our classifier is about the tags shown (policy type, status, scopes, jurisdiction).
            </p>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li><strong>1.00</strong> = very confident</li>
              <li><strong>0.60–0.79</strong> = moderate</li>
              <li><strong>&lt;0.60</strong> = review recommended</li>
            </ul>
            <p className="text-xs text-muted-foreground mt-2">
              Confidence is about the labels, not whether the policy is "good/bad."
            </p>
          </section>

          {/* Impact Factor Bars Section */}
          <section>
            <h3 className="text-lg font-semibold mb-2">Impact factor bars (0–100 each)</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Breakdown of what drove the Impact Score. Each bar is one factor:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li><strong>Mandatory</strong> (mandatory requirements vs guidance)</li>
              <li><strong>Time proximity</strong> (how soon it becomes effective)</li>
              <li><strong>Scope coverage</strong> (Scopes 1/2/3 touched)</li>
              <li><strong>Sector breadth</strong> (how many industries it covers)</li>
              <li><strong>Disclosure complexity</strong> (assurance, new data fields, versioning)</li>
            </ul>
            <p className="text-xs text-muted-foreground mt-2">
              Higher bar = bigger contribution to the total score.
            </p>
          </section>

          {/* Additional Sections */}
          <section>
            <h3 className="text-lg font-semibold mb-2">Effective date</h3>
            <p className="text-sm text-muted-foreground">
              The date requirements start to apply. We also show <strong>"Effective in X days"</strong> to make timing obvious.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-2">Last updated</h3>
            <p className="text-sm text-muted-foreground">
              When the source last changed or we last detected an update.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-2">Version</h3>
            <p className="text-sm text-muted-foreground">
              Internal policy version we increment when the source text/metadata meaningfully changes. The <strong>History</strong> section lists what changed.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-2">Saved groupings (≤3 mo / 3–12 mo / &gt;12 mo)</h3>
            <p className="text-sm text-muted-foreground">
              Buckets based on time until effective date, to help you prioritize.
            </p>
          </section>

          {/* Color Band Legend */}
          <section className="pt-4 border-t">
            <h3 className="text-lg font-semibold mb-2">Impact Score Color Bands</h3>
            <div className="flex items-center gap-4 text-sm">
              <span>Low 0–39 • Medium 40–69 • High 70–100</span>
            </div>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  )
}

