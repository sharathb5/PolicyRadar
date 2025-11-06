# Frontend Agent - CRITICAL UI Fixes

**Copy and paste this entire prompt to the Frontend Agent**

---

You are the Frontend Agent for Policy Radar. You have **CRITICAL UI fixes** that need to be implemented immediately.

## 🎯 Current Issues

### Issue 1: No Legend/Help Dialog 🔴
**Status**: Missing entirely  
**Problem**: Help icon exists but Legend dialog component doesn't exist

### Issue 2: Share Button Not Working 🔴
**Status**: Button exists but no functionality  
**Problem**: Share button has comment "Share functionality can be implemented later"

### Issue 3: Save Button Not Working 🔴
**Status**: Partially working  
**Problem**: 
- Header save button (line 110 in drawer) has no onClick handler
- Bottom save button works but might have issues
- "Add to Digest" button has no onClick handler

---

## 🔴 CRITICAL PRIORITY 1: Implement Legend/Help Dialog

**Status**: 🔴 **MISSING** - Help icon exists but dialog doesn't  
**Time**: ~2 hours  
**Impact**: User experience improvement

### Problem

The header has a help icon button (line 85-95 in `policy-header.tsx`) but clicking it doesn't open anything because the `LegendDialog` component doesn't exist.

### Fix Required

**File to Create**: `policy-radar-frontend/components/legend-dialog.tsx` (NEW)

**File to Modify**: `policy-radar-frontend/components/policy-header.tsx`

### Step 1: Create Legend Dialog Component

**Create `components/legend-dialog.tsx`**:

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
        
        <div className="space-y-6 mt-4 text-sm">
          {/* Impact Score Section */}
          <section>
            <h3 className="text-lg font-semibold mb-2">Impact Score (0–100)</h3>
            <p className="text-muted-foreground mb-2">
              How disruptive/actionable this policy is, based on simple rules (mandatory vs voluntary, how soon it takes effect, which scopes/sectors it touches, and disclosure complexity).
            </p>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li><strong>0–39</strong> = <strong>Low</strong> impact</li>
              <li><strong>40–69</strong> = <strong>Medium</strong> impact</li>
              <li><strong>70–100</strong> = <strong>High</strong> impact</li>
            </ul>
            <p className="text-xs text-muted-foreground mt-2 italic">
              Color on the pill only reflects this band; higher number = higher urgency.
            </p>
          </section>

          {/* Confidence Section */}
          <section>
            <h3 className="text-lg font-semibold mb-2">Confidence (0.00–1.00)</h3>
            <p className="text-muted-foreground mb-2">
              How sure our classifier is about the tags shown (policy type, status, scopes, jurisdiction).
            </p>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li><strong>1.00</strong> = very confident</li>
              <li><strong>0.60–0.79</strong> = moderate</li>
              <li><strong>&lt;0.60</strong> = review recommended</li>
            </ul>
            <p className="text-xs text-muted-foreground mt-2 italic">
              Confidence is about the labels, not whether the policy is "good/bad."
            </p>
          </section>

          {/* Impact Factor Bars Section */}
          <section>
            <h3 className="text-lg font-semibold mb-2">Impact factor bars (0–100 each)</h3>
            <p className="text-muted-foreground mb-2">
              Breakdown of what drove the Impact Score. Each bar is one factor:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li><strong>Mandatory</strong> (mandatory requirements vs guidance)</li>
              <li><strong>Time proximity</strong> (how soon it becomes effective)</li>
              <li><strong>Scope coverage</strong> (Scopes 1/2/3 touched)</li>
              <li><strong>Sector breadth</strong> (how many industries it covers)</li>
              <li><strong>Disclosure complexity</strong> (assurance, new data fields, versioning)</li>
            </ul>
            <p className="text-xs text-muted-foreground mt-2 italic">
              Higher bar = bigger contribution to the total score.
            </p>
          </section>

          {/* Additional Sections */}
          <section>
            <h3 className="text-lg font-semibold mb-2">Effective date</h3>
            <p className="text-muted-foreground">
              The date requirements start to apply. We also show <strong>"Effective in X days"</strong> to make timing obvious.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-2">Last updated</h3>
            <p className="text-muted-foreground">
              When the source last changed or we last detected an update.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-2">Version</h3>
            <p className="text-muted-foreground">
              Internal policy version we increment when the source text/metadata meaningfully changes. The <strong>History</strong> section lists what changed.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-2">Saved groupings (≤3 mo / 3–12 mo / >12 mo)</h3>
            <p className="text-muted-foreground">
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

### Step 2: Wire Up Dialog in Header

**Update `components/policy-header.tsx`**:

```tsx
"use client"

import { useState } from "react"
import { HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LegendDialog } from "@/components/legend-dialog"
// ... other imports

export function PolicyHeader({ ...props }) {
  const [isLegendOpen, setIsLegendOpen] = useState(false)  // ← ADD THIS

  return (
    <>
      <header className="border-b border-border bg-card">
        <div className="flex flex-col gap-2 px-6 py-3">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold text-foreground">Policy Radar</h1>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => setIsLegendOpen(true)}  // ← ADD THIS
                aria-label="Open help legend"
                title="Help - Number Key"
              >
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
                <span className="sr-only">Open help legend</span>
              </Button>
            </div>
            {/* ... rest of header ... */}
          </div>
        </div>
      </header>

      {/* Add Legend Dialog */}
      <LegendDialog open={isLegendOpen} onOpenChange={setIsLegendOpen} />  // ← ADD THIS
    </>
  )
}
```

### Test Command

```bash
# Manual test
# 1. Click help icon in header
# 2. Verify dialog opens
# 3. Verify content displays correctly
# 4. Verify dialog closes (X button, ESC key)
```

**Expected Result**: Legend dialog opens and displays correctly ✅

---

## 🔴 CRITICAL PRIORITY 2: Fix Share Button

**Status**: 🔴 **NOT WORKING** - Button exists but no functionality  
**Time**: ~15 minutes  
**Impact**: Share functionality works

### Problem

Share button exists in two places:
1. Policy row (line 96-107 in `policy-row.tsx`) - has comment "Share functionality can be implemented later"
2. Drawer header (line 114-117 in `policy-drawer.tsx`) - labeled "Copy link" but no onClick

### Fix Required

**File to Modify**: `policy-radar-frontend/components/policy-row.tsx`

**File to Modify**: `policy-radar-frontend/components/policy-drawer.tsx`

### Step 1: Fix Share Button in Policy Row

**Update `components/ui/policy-row.tsx`**:

```tsx
const handleShare = (e: React.MouseEvent) => {
  e.stopPropagation()
  
  // Copy policy URL to clipboard
  const url = `${window.location.origin}?policy=${policy.id}`
  
  navigator.clipboard.writeText(url).then(() => {
    // Show toast or notification
    // You can add a toast library or use alert for now
    alert(`Link copied to clipboard: ${url}`)
  }).catch((err) => {
    console.error('Failed to copy:', err)
    // Fallback: select text
    alert(`Policy URL: ${url}`)
  })
}

// Update share button:
<Button
  variant="ghost"
  size="icon"
  className="h-8 w-8"
  onClick={handleShare}  // ← ADD THIS
  title="Share policy"
>
  <Share2 className="h-4 w-4" />
  <span className="sr-only">Share</span>
</Button>
```

### Step 2: Fix Copy Link Button in Drawer

**Update `components/policy-drawer.tsx`**:

```tsx
const handleCopyLink = () => {
  // Copy policy URL to clipboard
  const url = `${window.location.origin}?policy=${policy.id}`
  
  navigator.clipboard.writeText(url).then(() => {
    // Show toast or notification
    alert(`Link copied to clipboard: ${url}`)
  }).catch((err) => {
    console.error('Failed to copy:', err)
    alert(`Policy URL: ${url}`)
  })
}

// Update copy link button (line 114-117):
<Button 
  variant="ghost" 
  size="icon" 
  title="Copy link"
  onClick={handleCopyLink}  // ← ADD THIS
>
  <Copy className="h-4 w-4" />
  <span className="sr-only">Copy link</span>
</Button>
```

### Test Command

```bash
# Manual test
# 1. Click share button in policy row
# 2. Verify clipboard has URL
# 3. Click copy link button in drawer
# 4. Verify clipboard has URL
```

**Expected Result**: Share/Copy link functionality works ✅

---

## 🔴 CRITICAL PRIORITY 3: Fix Save Buttons

**Status**: 🔴 **PARTIALLY WORKING** - Some buttons missing onClick  
**Time**: ~10 minutes  
**Impact**: Save functionality works everywhere

### Problem

1. **Header save button** (line 110 in drawer) - No onClick handler
2. **Bottom save button** (line 234) - Has `handleSave` but verify it works
3. **"Add to Digest" button** (line 238) - No onClick handler

### Fix Required

**File to Modify**: `policy-radar-frontend/components/policy-drawer.tsx`

### Step 1: Fix Header Save Button

**Update `components/policy-drawer.tsx`** (line 110):

```tsx
// Current (line 110):
<Button variant="ghost" size="icon" title="Save policy">
  <Bookmark className="h-4 w-4" />
  <span className="sr-only">Save policy</span>
</Button>

// Fix to:
<Button 
  variant="ghost" 
  size="icon" 
  title="Save policy"
  onClick={handleSave}  // ← ADD THIS
  disabled={toggleSaved.isPending}
>
  <Bookmark className="h-4 w-4" />
  <span className="sr-only">Save policy</span>
</Button>
```

### Step 2: Fix "Add to Digest" Button

**Update `components/policy-drawer.tsx`** (line 238):

```tsx
// Current (line 238):
<Button variant="secondary" className="flex-1">
  Add to Digest
</Button>

// Fix to:
const handleAddToDigest = () => {
  // For now, this can just save the policy (same as save)
  // Later can add separate digest logic
  handleSave()
}

// Update button:
<Button 
  variant="secondary" 
  className="flex-1"
  onClick={handleAddToDigest}  // ← ADD THIS
  disabled={toggleSaved.isPending}
>
  Add to Digest
</Button>
```

### Step 3: Verify Bottom Save Button Works

**Verify** that `handleSave` (line 84-86) is correctly wired and `toggleSaved.mutate` is working.

**If not working**, check:
1. Is `useToggleSaved` hook working?
2. Is API endpoint `/api/saved/{id}` accessible?
3. Are there any console errors?

### Test Command

```bash
# Manual test
# 1. Open policy drawer
# 2. Click save button in header - verify saves
# 3. Click save button at bottom - verify saves
# 4. Click "Add to Digest" - verify saves (or adds to digest)
# 5. Check browser network tab for POST /api/saved/{id} request
```

**Expected Result**: All save buttons work correctly ✅

---

## 📋 Development Workflow

### Priority Order

1. **Fix Share Button** (15 min) - Quick fix
2. **Fix Save Buttons** (10 min) - Quick fix
3. **Implement Legend Dialog** (2 hours) - Feature implementation

### Test Commands

```bash
# Run dev server
cd policy-radar-frontend
npm run dev

# Manual testing
# 1. Test share button - copy URL to clipboard
# 2. Test save buttons - verify saves work
# 3. Test legend dialog - verify opens and displays

# Run E2E tests (after test ID fixes)
npx playwright test -v
```

---

## 🚨 Critical Reminders

### NO VISUAL REDESIGN
- ❌ **NO** layout changes
- ❌ **NO** visual token changes
- ❌ **NO** color/style changes
- ✅ **YES** add functionality only

### TEST WHILE DEVELOPING
- ✅ Test buttons manually after each fix
- ✅ Verify functionality works
- ✅ Check browser console for errors
- ✅ Check network tab for API calls

---

## ✅ Checklist

### Share Button Fix
- [ ] Add `handleShare` function to policy-row.tsx
- [ ] Wire up onClick for share button in policy-row.tsx
- [ ] Add `handleCopyLink` function to policy-drawer.tsx
- [ ] Wire up onClick for copy link button in drawer
- [ ] Test share functionality

### Save Button Fix
- [ ] Add onClick to header save button in drawer
- [ ] Add `handleAddToDigest` function to drawer
- [ ] Wire up onClick for "Add to Digest" button
- [ ] Verify bottom save button works
- [ ] Test all save buttons

### Legend Dialog Implementation
- [ ] Create `legend-dialog.tsx` component
- [ ] Add all legend content (verbatim from user)
- [ ] Add state for dialog open/close in header
- [ ] Wire up help icon button
- [ ] Test dialog opens/closes
- [ ] Test on mobile (responsive)

---

## 🚀 After Completing Fixes

1. **Test all buttons**: Verify share, save, and legend work
2. **Commit and push**:
   ```bash
   git add .
   git commit -m "feat: implement legend dialog, fix share and save buttons"
   git push origin main
   ```
3. **Update status**: Notify when UI fixes complete

---

## 📚 Reference Documents

- **Legend Plan**: `LEGEND_IMPLEMENTATION_PLAN.md`
- **Master Plan**: `MASTER_COORDINATION_PLAN.md`
- **Dictionary**: `/dictionary.md`

---

**Start with Share and Save fixes (25 min), then implement Legend dialog (2 hours)!**

**Test manually after EVERY change to ensure functionality works!** 🧪✅

