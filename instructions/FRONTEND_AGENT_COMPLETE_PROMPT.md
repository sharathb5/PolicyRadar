# Frontend Agent - Complete Prompt (All Tasks)

**Copy and paste this entire prompt to the Frontend Agent**

---

You are the Frontend Agent for Policy Radar. You have **multiple critical tasks** to complete.

## 🎯 Current Status

**Overall Coverage**: 47.9% (46/96 tests passing)

**Current Issues**:
- 🔴 Missing test IDs (blocking 5+ E2E tests)
- 🔴 Legend/Help dialog missing (user reported)
- 🔴 Share button not working (user reported)
- 🔴 Save/Add to Digest buttons not working (user reported)

---

## 🔴 CRITICAL PRIORITY 1: Add Missing Test IDs (15 min)

**Status**: 🔴 **BLOCKING 5+ E2E TESTS**  
**Time**: ~15 minutes  
**Impact**: E2E tests 5/30 → **11/30 (37%)**

### Quick Fix

See `FRONTEND_AGENT_TEST_ID_FIX.md` for detailed instructions.

**Key Points**:
- Add `data-testid="filter-region-{region}"` to all filter buttons
- Verify/add `data-testid="sort-select"` and `data-testid="order-select"`
- Add `data-testid="impact-score"` to policy rows
- Add `data-testid="clear-all-filters"` to clear button

**Test Command**:
```bash
cd policy-radar-frontend
npx playwright test -v
```

**Expected**: 5+ tests passing ✅

---

## 🔴 CRITICAL PRIORITY 2: Fix Share Button (15 min)

**Status**: 🔴 **NOT WORKING** - User reported issue  
**Time**: ~15 minutes  
**Impact**: Share functionality works

### Problem

Share button exists but has no onClick handler.

**Files to Fix**:
- `policy-radar-frontend/components/ui/policy-row.tsx` (line 96-107)
- `policy-radar-frontend/components/policy-drawer.tsx` (line 114-117)

### Fix

**In `policy-row.tsx`**:
```tsx
const handleShare = (e: React.MouseEvent) => {
  e.stopPropagation()
  const url = `${window.location.origin}?policy=${policy.id}`
  navigator.clipboard.writeText(url).then(() => {
    alert(`Link copied: ${url}`)
  }).catch(() => {
    alert(`Policy URL: ${url}`)
  })
}

// Update button:
<Button onClick={handleShare} ...>
```

**In `policy-drawer.tsx`**:
```tsx
const handleCopyLink = () => {
  const url = `${window.location.origin}?policy=${policy.id}`
  navigator.clipboard.writeText(url).then(() => {
    alert(`Link copied: ${url}`)
  }).catch(() => {
    alert(`Policy URL: ${url}`)
  })
}

// Update button:
<Button onClick={handleCopyLink} ...>
```

**Expected**: Share/Copy link works ✅

---

## 🔴 CRITICAL PRIORITY 3: Fix Save Buttons (10 min)

**Status**: 🔴 **PARTIALLY WORKING** - User reported issue  
**Time**: ~10 minutes  
**Impact**: Save functionality works everywhere

### Problem

1. Header save button (line 110 in drawer) - No onClick
2. "Add to Digest" button (line 238) - No onClick

### Fix

**In `policy-drawer.tsx`**:

**Fix header save button (line 110)**:
```tsx
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

**Expected**: Header save button works ✅

---

## 🔴 CRITICAL PRIORITY 4: Implement "Save to Digest" Button (20 min)

**Status**: 🔴 **NOT WORKING** - User reported issue  
**Time**: ~20 minutes  
**Impact**: Save to digest functionality works

### Problem

"Add to Digest" button (line 238) - No onClick handler

### Fix Required

See `FRONTEND_AGENT_DIGEST_SAVE_FIX.md` for complete implementation details.

**Quick Summary**:
1. Import `useDigestPreview` hook
2. Implement `handleSaveToDigest` function
3. Wire up onClick to "Add to Digest" button
4. Refresh digest preview after save

**Expected**: "Save to Digest" button works correctly ✅

---

## 🟠 HIGH PRIORITY 4: Implement Legend Dialog (2 hours)

**Status**: 🔴 **MISSING** - User reported issue  
**Time**: ~2 hours  
**Impact**: User experience improvement

### Problem

Help icon exists in header but clicking it doesn't open dialog (component doesn't exist).

### Fix Required

**File to Create**: `policy-radar-frontend/components/legend-dialog.tsx` (NEW)

**File to Modify**: `policy-radar-frontend/components/policy-header.tsx`

### Implementation

See `FRONTEND_AGENT_UI_FIXES.md` Priority 1 for complete implementation, OR see `LEGEND_IMPLEMENTATION_PLAN.md` for detailed guide.

**Quick Steps**:
1. Create `legend-dialog.tsx` with Dialog component
2. Add all legend content (verbatim from user's text)
3. Add state for dialog open/close in header
4. Wire up help icon button
5. Test manually

**Expected**: Legend dialog opens and displays correctly ✅

---

## 📋 Complete Task List

### Immediate (Do First - 40 min total)
1. ✅ Add missing test IDs (15 min) → Fixes 5+ E2E tests
2. ✅ Fix share button (15 min) → Share works
3. ✅ Fix save buttons (10 min) → All save buttons work

### High Priority (Do Next - 2 hours)
4. ✅ Implement Legend dialog (2 hours) → Help available

---

## 📋 Development Workflow

### Priority Order

1. **Add Test IDs** (15 min) - Unblocks E2E tests
2. **Fix Share Button** (15 min) - Quick UI fix
3. **Fix Save Buttons** (10 min) - Quick UI fix
4. **Implement Legend** (2 hours) - Feature implementation

### Test Commands

```bash
# After test ID fixes
cd policy-radar-frontend
npx playwright test -v

# Manual testing
# 1. Test share button - copy URL
# 2. Test save buttons - verify saves
# 3. Test legend dialog - verify opens
```

---

## 🚨 Critical Reminders

### NO VISUAL REDESIGN
- ❌ **NO** layout changes
- ❌ **NO** visual token changes
- ❌ **NO** color/style changes
- ✅ **YES** add functionality only

### TEST WHILE DEVELOPING
- ✅ Run E2E tests after test ID fixes
- ✅ Test buttons manually after each fix
- ✅ Verify functionality works
- ✅ Check browser console for errors

---

## ✅ Complete Checklist

### Test ID Fix (15 min)
- [ ] Update filter-toggle.tsx to accept data-testid prop
- [ ] Add test IDs to all filter buttons
- [ ] Add test ID to impact-score
- [ ] Verify/add sort/order test IDs
- [ ] Add clear-all-filters test ID
- [ ] Run E2E tests - verify 5+ tests pass

### Share Button Fix (15 min)
- [ ] Add handleShare to policy-row.tsx
- [ ] Wire up share button in policy-row.tsx
- [ ] Add handleCopyLink to policy-drawer.tsx
- [ ] Wire up copy link button in drawer
- [ ] Test share functionality

### Save Button Fix (10 min)
- [ ] Add onClick to header save button
- [ ] Add handleAddToDigest function
- [ ] Wire up "Add to Digest" button
- [ ] Verify bottom save button works
- [ ] Test all save buttons

### Legend Dialog (2 hours)
- [ ] Create legend-dialog.tsx component
- [ ] Add all legend content (verbatim)
- [ ] Add dialog state to header
- [ ] Wire up help icon button
- [ ] Test dialog opens/closes
- [ ] Test responsive design

---

## 🚀 After Completing All Tasks

1. **Run E2E tests**: `npx playwright test -v`
2. **Test manually**: Verify all buttons work
3. **Commit and push**:
   ```bash
   git add .
   git commit -m "feat: add test IDs, fix share/save buttons, implement legend dialog"
   git push origin main
   ```
4. **Update status**: Notify when all fixes complete

---

## 📚 Reference Documents

- **Test ID Fix**: `FRONTEND_AGENT_TEST_ID_FIX.md`
- **UI Fixes**: `FRONTEND_AGENT_UI_FIXES.md`
- **Legend Plan**: `LEGEND_IMPLEMENTATION_PLAN.md`
- **Action Plan**: `UPDATED_ACTION_PLAN.md`
- **Master Plan**: `MASTER_COORDINATION_PLAN.md`

---

**Start with Test IDs (15 min), then Share/Save fixes (25 min), then Legend (2 hours)!**

**Total time: ~2.5 hours to complete all Frontend Agent tasks!** 🚀

