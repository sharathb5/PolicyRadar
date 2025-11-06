# E2E Test Blocking Issue - Missing Data-TestId Attributes

**Priority**: 🔴 **CRITICAL**  
**Status**: ⚠️ **BLOCKING** 8 E2E tests  
**Impact**: 2/10 tests passing (20%) → Target: 10/10 (100%)

---

## 📊 Current Situation

### Test Results Summary
- **Total Tests**: 10 (policy-feed.spec.ts)
- **Passing**: 2 (20%) ✅
  - displays policy list ✅
  - loading states - skeletons display ✅
- **Failing**: 8 (80%) ❌
  - **ALL failures due to missing `data-testid` attributes**

### Root Cause
**All 8 failing tests are blocked by missing `data-testid` attributes in frontend components.**

---

## ❌ Failing Tests (All Missing Test IDs)

### 1. filter flow - apply filters ❌
**Missing**: `data-testid="filter-region"`
**Expected**: Filter container should have this test ID

### 2. filter flow - clear filters ❌
**Missing**: `data-testid="filter-region-EU"` (but exists in code - may need verification)
**Expected**: EU filter button should have this test ID

### 3. sort flow - change sort option ❌
**Missing**: `data-testid="sort-select"`
**Expected**: Sort dropdown should have this test ID

### 4. sort flow - change sort order ❌
**Missing**: `data-testid="order-select"`
**Expected**: Order dropdown should have this test ID

### 5. sort flow - verify results displayed in correct order ❌
**Missing**: `data-testid="impact-score"`
**Expected**: Impact score in policy row should have this test ID

### 6. empty states - no results message ❌
**Missing**: `data-testid="filter-region-OTHER"`
**Expected**: OTHER region filter should have this test ID

### 7. active filter chips display correctly ❌
**Missing**: `data-testid="active-filter-EU"`, `data-testid="active-filter-Disclosure"`
**Expected**: Active filter chips should have test IDs

### 8. clear all button resets filters ❌
**Missing**: `data-testid="clear-all-filters"` (but exists in code - may need verification)
**Expected**: Clear all button should have this test ID

---

## 🔧 Required Actions (Frontend Agent)

### Priority 1: Fix Filter Components (HIGH)

**File**: `policy-radar-frontend/components/policy-filters.tsx`

**Actions**:
1. Add `data-testid="filter-region"` to region filter container
2. Add test IDs to ALL region filter toggles:
   - `filter-region-EU` (exists - verify)
   - `filter-region-US-Federal` (missing)
   - `filter-region-US-CA` (missing)
   - `filter-region-UK` (missing)
   - `filter-region-OTHER` (missing - add if exists)
3. Add test IDs to ALL policy type filter toggles:
   - `filter-policy-type-Disclosure` (exists - verify)
   - `filter-policy-type-Pricing` (missing)
   - `filter-policy-type-Ban` (missing)
   - `filter-policy-type-Incentive` (missing)
   - `filter-policy-type-Supply-chain` (missing)
4. Add test IDs to ALL status filter toggles:
   - `filter-status-Proposed` (missing)
   - `filter-status-Adopted` (missing)
   - `filter-status-Effective` (missing)
5. Add test IDs to ALL scope filter toggles:
   - `filter-scope-1` (missing)
   - `filter-scope-2` (missing)
   - `filter-scope-3` (missing)
6. Verify `clear-all-filters` test ID exists and works

### Priority 2: Add Sort & Order Selects (HIGH)

**Location**: Need to find or create sort/order select components

**Actions**:
1. Find where sort/order controls are (or should be)
2. Create sort select component if missing
3. Create order select component if missing
4. Add `data-testid="sort-select"` to sort select
5. Add `data-testid="order-select"` to order select

### Priority 3: Add Impact Score Test ID (HIGH)

**File**: `policy-radar-frontend/components/ui/policy-row.tsx`

**Actions**:
1. Find impact score display element
2. Add `data-testid="impact-score"` to impact score

### Priority 4: Add Active Filter Chips Test IDs (MEDIUM)

**Location**: Find where active filter chips are displayed

**Actions**:
1. Find active filter chip component
2. Add `data-testid="active-filter-{value}"` to each chip

### Priority 5: Update FilterToggle Component (HIGH)

**File**: `policy-radar-frontend/components/ui/filter-toggle.tsx`

**Actions**:
1. Add `data-testid` to FilterToggleProps interface
2. Pass through `data-testid` to Button component

---

## 📋 Detailed Implementation Guide

See `FRONTEND_DATA_TESTID_FIX.md` for complete implementation guide with code examples.

---

## ✅ Success Criteria

**After fixes**:
- [ ] All 10 policy-feed tests pass
- [ ] Filter flow tests pass (apply & clear)
- [ ] Sort flow tests pass (change option, change order, verify order)
- [ ] Empty state test passes
- [ ] Active filter chips test passes
- [ ] Clear all button test passes

**Test Coverage**:
- Before: 2/10 passing (20%)
- After: 10/10 passing (100%) ✅

---

## 🚀 Next Steps

1. **Frontend Agent**: Implement all missing test IDs (see FRONTEND_DATA_TESTID_FIX.md)
2. **Frontend Agent**: Test locally: `npx playwright test policy-feed.spec.ts`
3. **Frontend Agent**: Push code when all tests pass
4. **Testing Agent**: Re-run smoke flow tests
5. **All Agents**: Verify E2E tests now pass

---

**This is the #1 priority for Frontend Agent!** 🔴

