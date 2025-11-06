# Frontend Agent - Start Work Prompt

**Copy and paste this entire prompt to the Frontend Agent**

---

You are the Frontend Agent for Policy Radar. Your mission is to fix E2E test blockers by adding missing `data-testid` attributes and implement the Legend/Help dialog feature.

## 🎯 Current Status

**Overall Coverage**: 34.4% (33/96 tests passing)
**Your Priority**: Fix E2E test blockers + implement Legend dialog

**Current Test Status**:
- ✅ Contract Tests: 24/27 passing (88.9%)
- ⏳ Golden Tests: 7/23 passing (30.4%)
- ⏳ Integration Tests: 1/16 passing (6.3%)
- 🔴 **E2E Tests: 2/30 passing (6.7%)** - **BLOCKED by missing data-testid** 🔴

## 🔴 CRITICAL PRIORITY 1: Add Missing Data-TestId Attributes

**Status**: URGENT - 28/30 E2E tests failing  
**Time**: ~1 hour  
**Impact**: E2E coverage 6.7% → 100% (30/30 tests)

### Problem

Playwright E2E tests are failing because components are missing `data-testid` attributes. Tests can't find elements to interact with.

### Missing Test IDs

The following `data-testid` attributes are missing:

1. **Filter Components**:
   - `filter-region`
   - `filter-region-EU`
   - `filter-region-US-Federal`
   - `filter-region-US-CA`
   - `filter-region-UK`
   - `filter-region-OTHER`
   - `filter-policy-type-{type}`
   - `filter-status-{status}`
   - `filter-scope-{scope}`

2. **Header Components**:
   - `sort-select` (already exists, verify)
   - `order-select` (already exists, verify)
   - `clear-all-filters`

3. **Policy Row Components**:
   - `impact-score`

### Files to Fix

1. **`policy-radar-frontend/components/policy-filters.tsx`**
   - Add `data-testid="filter-region"` to region filter container
   - Add `data-testid="filter-region-{region}"` to each region toggle
   - Add similar IDs for policy_type, status, scopes

2. **`policy-radar-frontend/components/ui/filter-toggle.tsx`**
   - Accept `data-testid` prop
   - Pass to underlying button component

3. **`policy-radar-frontend/components/ui/policy-row.tsx`**
   - Add `data-testid="impact-score"` to impact score display

4. **`policy-radar-frontend/components/policy-header.tsx`**
   - Verify `data-testid="sort-select"` exists
   - Verify `data-testid="order-select"` exists
   - Add `data-testid="clear-all-filters"` to clear button

### Implementation Examples

#### Filter Toggle Component

**Update `components/ui/filter-toggle.tsx`**:
```tsx
interface FilterToggleProps {
  // ... existing props
  'data-testid'?: string
}

export function FilterToggle({ 'data-testid': testId, ...props }: FilterToggleProps) {
  return (
    <Button
      variant={props.isActive ? "default" : "outline"}
      size="sm"
      data-testid={testId}
      {...props}
    >
      {props.label}
    </Button>
  )
}
```

#### Policy Filters Component

**Update `components/policy-filters.tsx`**:
```tsx
// Region filters
<div data-testid="filter-region">
  {regions.map((region) => (
    <FilterToggle
      key={region}
      data-testid={`filter-region-${region}`}
      label={region}
      isActive={filters.region?.includes(region)}
      onClick={() => handleRegionToggle(region)}
    />
  ))}
</div>

// Similar for policy_type, status, scopes
```

#### Policy Row Component

**Update `components/ui/policy-row.tsx`**:
```tsx
<div className="flex items-center gap-2">
  <Badge 
    variant="outline"
    data-testid="impact-score"
  >
    {policy.impact_score}
  </Badge>
</div>
```

#### Policy Header Component

**Update `components/policy-header.tsx`**:
```tsx
// Verify sort-select exists
<Select
  data-testid="sort-select"
  value={`${currentSort}-${currentOrder}`}
  onValueChange={handleSortChange}
>
  {/* ... */}
</Select>

// Add clear-all button
<Button
  data-testid="clear-all-filters"
  variant="outline"
  size="sm"
  onClick={handleClearAll}
>
  Clear All
</Button>
```

### Reference

See `FRONTEND_DATA_TESTID_FIX.md` for detailed guide (if exists)

### Test Command

```bash
cd policy-radar-frontend
npx playwright test -v
```

**Expected Result**: 30/30 E2E tests passing ✅

---

## 🟠 HIGH PRIORITY 2: Implement Legend/Help Dialog

**Status**: New Feature  
**Time**: ~2 hours  
**Impact**: User experience improvement

### Problem

Users need help understanding the number key (Impact Score, Confidence, Impact Factors, etc.)

### Implementation Plan

See `LEGEND_IMPLEMENTATION_PLAN.md` for full details.

### Files to Create

1. **`policy-radar-frontend/components/legend-dialog.tsx`** (NEW)

### Files to Modify

1. **`policy-radar-frontend/components/policy-header.tsx`**

### Steps

#### Step 1: Create Legend Dialog Component

Create `components/legend-dialog.tsx`:

```tsx
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
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
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
            <h3 className="text-lg font-semibold mb-2">Saved groupings (≤3 mo / 3–12 mo / >12 mo)</h3>
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
```

#### Step 2: Add Help Icon to Header

Update `components/policy-header.tsx`:

```tsx
"use client"

import { HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LegendDialog } from "@/components/legend-dialog"
import { useState } from "react"

export function PolicyHeader({ ...props }) {
  const [isLegendOpen, setIsLegendOpen] = useState(false)

  return (
    <header className="border-b border-border bg-card">
      <div className="flex flex-col gap-2 px-6 py-3">
        <div className="flex items-center gap-4">
          {/* Add help icon next to title */}
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold text-foreground">Policy Radar</h1>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => setIsLegendOpen(true)}
              aria-label="Open help legend"
            >
              <HelpCircle className="h-4 w-4 text-muted-foreground" />
            </Button>
          </div>

          {/* ... rest of header ... */}
        </div>
      </div>

      {/* Add Legend Dialog */}
      <LegendDialog open={isLegendOpen} onOpenChange={setIsLegendOpen} />
    </header>
  )
}
```

### Requirements

- ✅ Non-invasive (doesn't clutter UI)
- ✅ Accessible (keyboard navigation, ARIA labels)
- ✅ Responsive (works on mobile)
- ✅ Content verbatim (use exact text from user's legend)

### Test Command

```bash
# Manual test
# 1. Click help icon in header
# 2. Verify dialog opens
# 3. Verify content displays correctly
# 4. Verify dialog closes (X button, ESC key)
# 5. Test on mobile (responsive)
```

**Expected Result**: Help dialog functional and accessible ✅

---

## 📋 Development Workflow

### Test-First Development

1. **Add data-testid attributes** (Priority 1)
2. **Run E2E tests** - Verify they pass
3. **Implement Legend dialog** (Priority 2)
4. **Test manually** - Verify dialog works
5. **Commit and push** - Include both fixes

### Test Commands

```bash
cd policy-radar-frontend

# Run E2E tests
npx playwright test -v

# Run specific test file
npx playwright test policy-feed.spec.ts

# Run with UI (watch mode)
npx playwright test --ui
```

---

## 🚨 Critical Reminders

### NO VISUAL REDESIGN
- ❌ **NO** layout changes
- ❌ **NO** visual token changes
- ❌ **NO** color/style changes
- ✅ **YES** add data-testid attributes
- ✅ **YES** add help dialog (new feature, not redesign)

### FIELD NAME COMPLIANCE
- ✅ All field names must be `snake_case` (e.g., `impact_score`, NOT `impactScore`)
- ✅ All enum values must match `/dictionary.md` exactly (e.g., `US-Federal` with hyphen)

### TEST WHILE DEVELOPING
- ✅ Run E2E tests after adding each `data-testid`
- ✅ Verify tests pass before moving to next component
- ✅ Test Legend dialog manually after implementation

---

## 🚀 After Completing Tasks

1. **Run E2E tests**: `npx playwright test -v`
2. **Verify progress**: All 30 tests should pass
3. **Test Legend dialog**: Manual testing
4. **Commit and push**: 
   ```bash
   git add .
   git commit -m "feat: add data-testid attributes and legend dialog"
   git push origin main
   ```
5. **Update status**: Notify when E2E tests are fixed

---

## 📚 Reference Documents

- **Action Plan**: `COMPREHENSIVE_ACTION_PLAN.md`
- **Legend Plan**: `LEGEND_IMPLEMENTATION_PLAN.md`
- **Master Plan**: `MASTER_COORDINATION_PLAN.md`
- **Dictionary**: `/dictionary.md`

---

**Start with Priority 1 (data-testid attributes), then Priority 2 (Legend dialog).**

**Run E2E tests after EVERY change to ensure progress!** 🧪✅

