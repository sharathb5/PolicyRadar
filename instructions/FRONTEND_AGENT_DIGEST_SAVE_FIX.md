# Frontend Agent - Save to Digest Button Fix

**Copy and paste this entire prompt to the Frontend Agent**

---

You are the Frontend Agent for Policy Radar. You need to implement a working "Save to Digest" button.

## 🎯 Current Issue

**Status**: 🔴 **NOT WORKING** - User reported  
**Problem**: "Add to Digest" button exists but has no onClick handler

**Location**: `policy-radar-frontend/components/policy-drawer.tsx` (line 238)

**Current Code**:
```tsx
<Button variant="secondary" className="flex-1">
  Add to Digest
</Button>
```

---

## 🔴 CRITICAL TASK: Implement "Save to Digest" Button

**Status**: 🔴 **MISSING FUNCTIONALITY**  
**Time**: ~20 minutes  
**Impact**: Save to digest functionality works

### Problem

The "Add to Digest" button in the drawer (line 238) has no onClick handler. Users want to be able to save policies specifically for the digest.

### Understanding the Feature

Based on the API:
- **Save**: `POST /api/saved/{id}` - Saves policy to saved items (grouped by effective window)
- **Digest Preview**: `POST /api/digest/preview` - Generates top 5 policies by impact score

**"Save to Digest" behavior**:
1. Save the policy first (if not already saved) - `POST /api/saved/{id}`
2. Optionally refresh digest preview to show updated top 5
3. Show success feedback to user

### Fix Required

**File to Modify**: `policy-radar-frontend/components/policy-drawer.tsx`

### Step 1: Import Required Hooks

**Update imports** (if not already imported):
```tsx
import { useToggleSaved } from "@/lib/queries/saved"
import { useDigestPreview } from "@/lib/queries/digest"
```

### Step 2: Add Digest Preview Hook

**In component** (after `usePolicyDetail`):
```tsx
const { data: policy, isLoading, error, refetch } = usePolicyDetail(policyId)
const toggleSaved = useToggleSaved()
const { refetch: refetchDigest } = useDigestPreview()  // ← ADD THIS
```

### Step 3: Implement "Save to Digest" Handler

**Add handler function** (after `handleSave`):
```tsx
const handleSave = () => {
  toggleSaved.mutate(policy.id)
}

const handleSaveToDigest = async () => {
  // Step 1: Save the policy (if not already saved)
  // Check if policy is already saved (you may need to track this)
  // For now, just save it
  toggleSaved.mutate(policy.id, {
    onSuccess: () => {
      // Step 2: Refresh digest preview to show updated top 5
      refetchDigest()
      
      // Step 3: Show success feedback
      // You can use a toast library or alert for now
      alert(`Policy saved and added to digest preview`)
    },
    onError: (error) => {
      console.error('Failed to save:', error)
      alert(`Failed to save: ${error.message || 'Unknown error'}`)
    }
  })
}
```

### Step 4: Update "Add to Digest" Button

**Update button** (line 238):
```tsx
<Button 
  variant="secondary" 
  className="flex-1"
  onClick={handleSaveToDigest}  // ← ADD THIS
  disabled={toggleSaved.isPending}  // ← ADD THIS
>
  <Bookmark className="h-4 w-4 mr-2" />  // ← ADD ICON
  {toggleSaved.isPending ? 'Saving...' : 'Add to Digest'}  // ← UPDATE TEXT
</Button>
```

### Complete Code Example

**Full handler implementation**:
```tsx
export function PolicyDrawer({ policyId, onClose }: PolicyDrawerProps) {
  const { data: policy, isLoading, error, refetch } = usePolicyDetail(policyId)
  const toggleSaved = useToggleSaved()
  const { refetch: refetchDigest } = useDigestPreview()

  // ... existing code ...

  const handleSave = () => {
    toggleSaved.mutate(policy.id)
  }

  const handleSaveToDigest = async () => {
    // Save the policy and refresh digest
    toggleSaved.mutate(policy.id, {
      onSuccess: () => {
        // Refresh digest preview
        refetchDigest()
        
        // Show success feedback
        alert(`Policy saved and added to digest preview`)
      },
      onError: (error) => {
        console.error('Failed to save to digest:', error)
        alert(`Failed to save: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    })
  }

  // ... rest of component ...

  return (
    <>
      {/* ... drawer content ... */}
      
      <div className="sticky bottom-0 bg-card border-t border-border p-4 flex gap-2">
        <Button 
          data-testid="save-policy-button" 
          variant="default" 
          className="flex-1" 
          onClick={handleSave} 
          disabled={toggleSaved.isPending}
        >
          <Bookmark className="h-4 w-4 mr-2" />
          {toggleSaved.isPending ? 'Saving...' : 'Save'}
        </Button>
        
        <Button 
          data-testid="add-to-digest-button"  // ← ADD TEST ID
          variant="secondary" 
          className="flex-1"
          onClick={handleSaveToDigest}  // ← ADD HANDLER
          disabled={toggleSaved.isPending}  // ← ADD DISABLED STATE
        >
          <Bookmark className="h-4 w-4 mr-2" />  // ← ADD ICON
          {toggleSaved.isPending ? 'Saving...' : 'Add to Digest'}  // ← UPDATE TEXT
        </Button>
        
        <Button variant="ghost">Report issue</Button>
      </div>
    </>
  )
}
```

### Test Command

```bash
# Manual test
# 1. Open policy drawer
# 2. Click "Add to Digest" button
# 3. Verify:
#    - Policy is saved (check Network tab for POST /api/saved/{id})
#    - Digest preview refreshes (check Network tab for POST /api/digest/preview)
#    - Success message shows
# 4. Navigate to Saved tab
# 5. Verify policy appears in saved items
# 6. Verify digest preview shows updated top 5
```

**Expected Result**: "Add to Digest" button works correctly ✅

---

## 📋 Development Workflow

1. **Add digest hook import** - Import `useDigestPreview`
2. **Add handler function** - Implement `handleSaveToDigest`
3. **Wire up button** - Add onClick to "Add to Digest" button
4. **Add test ID** - Add `data-testid="add-to-digest-button"` for E2E tests
5. **Test manually** - Verify functionality works
6. **Commit and push**

### Test Commands

```bash
# Manual test
cd policy-radar-frontend
npm run dev

# Open browser, test:
# 1. Open policy drawer
# 2. Click "Add to Digest"
# 3. Check Network tab for API calls
# 4. Verify digest preview updates
```

---

## 🚨 Critical Reminders

### NO VISUAL REDESIGN
- ❌ **NO** layout changes
- ❌ **NO** visual token changes
- ✅ **YES** add functionality only

### TEST WHILE DEVELOPING
- ✅ Test button manually after implementation
- ✅ Verify API calls in Network tab
- ✅ Check for console errors
- ✅ Verify digest preview updates

---

## ✅ Checklist

- [ ] Import `useDigestPreview` hook
- [ ] Add `refetchDigest` to component
- [ ] Implement `handleSaveToDigest` function
- [ ] Wire up onClick to "Add to Digest" button
- [ ] Add `data-testid="add-to-digest-button"` for E2E tests
- [ ] Add disabled state (when saving)
- [ ] Add icon to button (Bookmark icon)
- [ ] Test manually - verify saves and refreshes digest
- [ ] Commit and push

---

## 🚀 After Completing Fix

1. **Test manually**: Verify "Add to Digest" works
2. **Check Network tab**: Verify API calls (`POST /api/saved/{id}`, `POST /api/digest/preview`)
3. **Commit and push**:
   ```bash
   git add .
   git commit -m "feat: implement save to digest functionality"
   git push origin main
   ```
4. **Update status**: Notify when fix complete

---

## 📚 Reference Documents

- **Action Plan**: `UPDATED_ACTION_PLAN.md`
- **UI Fixes**: `FRONTEND_AGENT_UI_FIXES.md`
- **Master Plan**: `MASTER_COORDINATION_PLAN.md`
- **API Contract**: `/contracts/openapi.yml`

---

**This is CRITICAL - Fix this immediately (~20 min)!**

**Test manually after implementation to ensure functionality works!** 🧪✅

