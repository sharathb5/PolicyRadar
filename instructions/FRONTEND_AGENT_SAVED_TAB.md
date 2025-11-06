# Frontend Agent - Saved Policies Tab Implementation

**Copy and paste this entire prompt to the Frontend Agent**

---

You are the Frontend Agent for Policy Radar. You need to implement a visible and functional **Saved Policies Tab** that shows saved policies grouped by effective timeline.

## 🎯 Current Status

**Status**: 🟡 **PARTIALLY IMPLEMENTED** - Tab exists but is hidden  
**Location**: `policy-radar-frontend/app/page.tsx`  
**Issue**: Tabs are hidden with `sr-only` class - user cannot see or switch tabs

---

## 🔴 CRITICAL TASK: Make Saved Policies Tab Visible & Functional

**Status**: 🟡 **NEEDS IMPROVEMENT**  
**Time**: ~1 hour  
**Impact**: Users can view and navigate to saved policies

### Problem

1. **Tabs are hidden**: `TabsList` has `className="sr-only"` - only visible to screen readers
2. **No visible navigation**: Users can't switch between Feed and Saved tabs
3. **Tab switching unclear**: No visual indication of which tab is active

### Solution

Make tabs visible and add proper navigation UI.

---

## 📋 Implementation Steps

### Step 1: Make Tabs Visible

**File**: `policy-radar-frontend/app/page.tsx`

**Update the tabs** (around line 13):
```tsx
export default function PolicyRadarPage() {
  const [activeTab, setActiveTab] = useState("feed")

  return (
    <div className="min-h-screen bg-background">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full justify-start rounded-none border-b bg-background px-6"> {/* Remove sr-only */}
          <TabsTrigger 
            value="feed" 
            data-testid="tab-feed"
            className="data-[state=active]:border-b-2 data-[state=active]:border-primary"
          >
            Feed
          </TabsTrigger>
          <TabsTrigger 
            value="saved" 
            data-testid="tab-saved"
            className="data-[state=active]:border-b-2 data-[state=active]:border-primary"
          >
            Saved
          </TabsTrigger>
        </TabsList>

        <TabsContent value="feed" className="m-0">
          <PolicyFeed />
        </TabsContent>

        <TabsContent value="saved" className="m-0">
          <div data-testid="saved-digest">
            <SavedDigest />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
```

### Step 2: Enhance Saved Policies Tab UI

**File**: `policy-radar-frontend/components/saved-digest.tsx`

**Current implementation** is good, but let's add:
1. **Better tab header** - Remove duplicate PolicyHeader (it's already in component)
2. **Empty state improvements** - Better messaging when no saved policies
3. **Refresh functionality** - Button to refresh saved policies
4. **Unsave functionality** - Allow unsaving from saved tab

**Update `SavedDigest` component**:
```tsx
"use client"

import { useState } from "react"
import { SavedCard } from "./ui/saved-card"
import { Button } from "./ui/button"
import { Skeleton } from "./ui/skeleton"
import { AlertCircle, Copy, Rss, RefreshCw } from "lucide-react"
import { useSavedPolicies } from "@/lib/queries/saved"
import { useDigestPreview } from "@/lib/queries/digest"
import { PolicyDrawer } from "./policy-drawer"

export function SavedDigest() {
  const { data: savedData, isLoading: isLoadingSaved, error: savedError, refetch: refetchSaved } = useSavedPolicies()
  const { data: digestData, isLoading: isLoadingDigest, error: digestError, refetch: refetchDigest } = useDigestPreview()
  const [selectedPolicyId, setSelectedPolicyId] = useState<number | null>(null)

  const nearTerm = savedData?.['<=90d']?.policies || []
  const midTerm = savedData?.['90-365d']?.policies || []
  const longTerm = savedData?.['>365d']?.policies || []

  const handlePolicyClick = (policyId: number) => {
    setSelectedPolicyId(policyId)
  }

  const totalSaved = nearTerm.length + midTerm.length + longTerm.length

  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <div className="border-b border-border bg-card px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground mb-1">Saved Policies</h1>
            <p className="text-sm text-muted-foreground">
              {totalSaved === 0 
                ? "No saved policies yet" 
                : `${totalSaved} ${totalSaved === 1 ? 'policy' : 'policies'} saved`}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              refetchSaved()
              refetchDigest()
            }}
            disabled={isLoadingSaved || isLoadingDigest}
            data-testid="refresh-saved-button"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${(isLoadingSaved || isLoadingDigest) ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-5xl mx-auto p-8">
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
                  <p className="text-sm text-muted-foreground mb-4">
                    Save policies from the feed to see them here. Policies are automatically organized by their effective date.
                  </p>
                </div>
              ) : (
                <>
                  {nearTerm.length > 0 && (
                    <section data-testid="saved-section-near-term">
                      <h2 className="text-lg font-semibold text-foreground mb-4">
                        Effective in ≤ 90 days ({nearTerm.length})
                      </h2>
                      <div className="space-y-3">
                        {nearTerm.map((policy) => (
                          <div 
                            key={policy.id} 
                            onClick={() => handlePolicyClick(policy.id)}
                            className="cursor-pointer"
                          >
                            <SavedCard policy={policy} />
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {midTerm.length > 0 && (
                    <section data-testid="saved-section-mid-term">
                      <h2 className="text-lg font-semibold text-foreground mb-4">
                        Effective in 90–365 days ({midTerm.length})
                      </h2>
                      <div className="space-y-3">
                        {midTerm.map((policy) => (
                          <div 
                            key={policy.id} 
                            onClick={() => handlePolicyClick(policy.id)}
                            className="cursor-pointer"
                          >
                            <SavedCard policy={policy} />
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {longTerm.length > 0 && (
                    <section data-testid="saved-section-long-term">
                      <h2 className="text-lg font-semibold text-foreground mb-4">
                        Effective in &gt; 365 days ({longTerm.length})
                      </h2>
                      <div className="space-y-3">
                        {longTerm.map((policy) => (
                          <div 
                            key={policy.id} 
                            onClick={() => handlePolicyClick(policy.id)}
                            className="cursor-pointer"
                          >
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

          {/* Digest Preview Section */}
          {!isLoadingSaved && !savedError && totalSaved > 0 && (
            <div className="mt-12 border-t border-border pt-8">
              <h2 className="text-xl font-semibold text-foreground mb-4">Digest Preview</h2>
              <div className="bg-muted/30 rounded-lg p-6 space-y-4">
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
                              <p className="text-xs text-muted-foreground mb-2" data-testid="why-it-matters">
                                {item.why_it_matters}
                              </p>
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
                      <Button variant="default">
                        <Copy className="h-4 w-4 mr-2" />
                        Copy link
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
          )}
        </div>
      </main>

      <PolicyDrawer policyId={selectedPolicyId} onClose={() => setSelectedPolicyId(null)} />
    </div>
  )
}
```

---

## ✅ Checklist

- [ ] Remove `sr-only` from TabsList in `app/page.tsx`
- [ ] Add visible tab navigation with proper styling
- [ ] Add `data-testid` attributes for E2E tests
- [ ] Update SavedDigest component header (remove duplicate PolicyHeader)
- [ ] Add refresh button to SavedDigest
- [ ] Improve empty state messaging
- [ ] Add test IDs for saved sections
- [ ] Ensure tabs are visually distinct when active
- [ ] Test tab switching works correctly
- [ ] Verify saved policies display correctly
- [ ] Test clicking on saved policy opens drawer
- [ ] Verify digest preview shows when policies are saved

---

## 🧪 Testing Steps

### Manual Testing:

1. **Open app** in browser
2. **Verify tabs visible** - Should see "Feed" and "Saved" tabs at top
3. **Click "Saved" tab** - Should switch to saved policies view
4. **Verify saved policies display** - Should show policies grouped by timeline
5. **Click on a policy** - Should open drawer
6. **Click "Feed" tab** - Should switch back to feed
7. **Click refresh button** - Should refresh saved policies
8. **Test empty state** - Save a policy, then unsave it, verify empty message

### Expected Behavior:

- ✅ Tabs are visible and clickable
- ✅ Active tab has visual indicator (underline/border)
- ✅ Switching tabs works smoothly
- ✅ Saved policies grouped by effective window
- ✅ Clicking policy opens drawer
- ✅ Refresh button updates data
- ✅ Empty state shows helpful message

---

## 🚀 After Implementation

1. **Test manually**: Verify tabs work and saved policies display
2. **Check console**: Look for any errors
3. **Test tab switching**: Ensure smooth transitions
4. **Commit and push**:
   ```bash
   git add .
   git commit -m "feat: make saved policies tab visible and functional"
   git push origin main
   ```

---

## 📚 Reference Documents

- **API Contract**: `/contracts/openapi.yml`
- **Action Plan**: `UPDATED_ACTION_PLAN.md`
- **Master Plan**: `MASTER_COORDINATION_PLAN.md`

---

**Make the saved policies tab visible and functional so users can easily view their saved policies!**

**Test tab switching and ensure saved policies display correctly!** 🧪✅

