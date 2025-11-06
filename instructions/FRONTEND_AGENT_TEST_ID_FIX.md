# Frontend Agent - CRITICAL Test ID Fix Task

**Copy and paste this entire prompt to the Frontend Agent**

---

You are the Frontend Agent for Policy Radar. You have a **CRITICAL priority task** that will fix 5+ E2E tests immediately.

## 🎯 Current Status

**Overall Coverage**: 47.9% (46/96 tests passing)

**E2E Tests**: 5/30 passing (16.7%) - **5+ tests failing** 🔴

**Problem**: Missing `data-testid` attributes on interactive elements - Playwright tests can't find elements.

---

## 🔴 CRITICAL TASK: Add Missing Test IDs

**Status**: 🔴 **BLOCKING 5+ E2E TESTS**  
**Time**: ~15 minutes  
**Impact**: E2E tests 5/30 → **11/30 (37%)** ✅

### Problem

The Testing Agent identified the root cause:

**Missing Test IDs**:
1. Filter buttons: `data-testid="filter-region-EU"`, `data-testid="filter-region-US-Federal"`, etc.
2. Sort controls: `data-testid="sort-select"`, `data-testid="order-select"`
3. Policy rows: `data-testid="impact-score"`
4. Clear button: `data-testid="clear-all-filters"`

### Fix Required

**Files to Fix**:

1. **`policy-radar-frontend/components/policy-filters.tsx`**
2. **`policy-radar-frontend/components/ui/filter-toggle.tsx`**
3. **`policy-radar-frontend/components/ui/policy-row.tsx`**
4. **`policy-radar-frontend/components/policy-header.tsx`**

---

## Step-by-Step Fix

### Step 1: Fix Filter Toggle Component

**File**: `policy-radar-frontend/components/ui/filter-toggle.tsx`

**Update**:
```tsx
interface FilterToggleProps {
  label: string
  isActive: boolean
  onClick: () => void
  'data-testid'?: string  // ← ADD THIS PROP
  // ... other props
}

export function FilterToggle({ 
  'data-testid': testId,  // ← ADD THIS
  label, 
  isActive, 
  onClick,
  ...props 
}: FilterToggleProps) {
  return (
    <Button
      variant={isActive ? "default" : "outline"}
      size="sm"
      data-testid={testId}  // ← PASS TO BUTTON
      onClick={onClick}
      {...props}
    >
      {label}
    </Button>
  )
}
```

### Step 2: Fix Policy Filters Component

**File**: `policy-radar-frontend/components/policy-filters.tsx`

**Update**:
```tsx
// Region filters
<div data-testid="filter-region">  {/* ← ADD CONTAINER */}
  {regions.map((region) => (
    <FilterToggle
      key={region}
      data-testid={`filter-region-${region}`}  // ← ADD THIS
      label={region}
      isActive={filters.region?.includes(region)}
      onClick={() => handleRegionToggle(region)}
    />
  ))}
</div>

// Policy type filters
<div data-testid="filter-policy-type">  {/* ← ADD CONTAINER */}
  {policyTypes.map((type) => (
    <FilterToggle
      key={type}
      data-testid={`filter-policy-type-${type}`}  // ← ADD THIS
      label={type}
      isActive={filters.policy_type?.includes(type)}
      onClick={() => handleTypeToggle(type)}
    />
  ))}
</div>

// Status filters
<div data-testid="filter-status">  {/* ← ADD CONTAINER */}
  {statuses.map((status) => (
    <FilterToggle
      key={status}
      data-testid={`filter-status-${status}`}  // ← ADD THIS
      label={status}
      isActive={filters.status?.includes(status)}
      onClick={() => handleStatusToggle(status)}
    />
  ))}
</div>

// Scope filters
<div data-testid="filter-scope">  {/* ← ADD CONTAINER */}
  {scopes.map((scope) => (
    <FilterToggle
      key={scope}
      data-testid={`filter-scope-${scope}`}  // ← ADD THIS
      label={`Scope ${scope}`}
      isActive={filters.scopes?.includes(scope)}
      onClick={() => handleScopeToggle(scope)}
    />
  ))}
</div>
```

**Required Test IDs**:
- ✅ `filter-region-EU`
- ✅ `filter-region-US-Federal`
- ✅ `filter-region-US-CA`
- ✅ `filter-region-UK`
- ✅ `filter-region-OTHER`
- ✅ `filter-policy-type-Disclosure`
- ✅ `filter-policy-type-Pricing`
- ✅ `filter-policy-type-Ban`
- ✅ `filter-policy-type-Incentive`
- ✅ `filter-policy-type-Supply-chain`
- ✅ `filter-status-Proposed`
- ✅ `filter-status-Adopted`
- ✅ `filter-status-Effective`
- ✅ `filter-scope-1`
- ✅ `filter-scope-2`
- ✅ `filter-scope-3`

### Step 3: Fix Policy Row Component

**File**: `policy-radar-frontend/components/ui/policy-row.tsx`

**Update**:
```tsx
<div className="flex items-center gap-2">
  <Badge 
    variant="outline"
    data-testid="impact-score"  // ← ADD THIS
  >
    {policy.impact_score}
  </Badge>
</div>
```

### Step 4: Fix Policy Header Component

**File**: `policy-radar-frontend/components/policy-header.tsx`

**Update**:
```tsx
// Verify/Add sort select
<Select
  data-testid="sort-select"  // ← VERIFY/ADD THIS
  value={`${currentSort}-${currentOrder}`}
  onValueChange={handleSortChange}
>
  <SelectTrigger className="w-[140px]">
    <SelectValue />
  </SelectTrigger>
  <SelectContent>
    {/* ... options ... */}
  </SelectContent>
</Select>

// Verify/Add order select
<Select
  data-testid="order-select"  // ← VERIFY/ADD THIS
  value={currentOrder}
  onValueChange={handleOrderChange}
>
  <SelectTrigger className="w-[100px]">
    <SelectValue />
  </SelectTrigger>
  <SelectContent>
    {/* ... options ... */}
  </SelectContent>
</Select>

// Add clear button if missing
<Button
  data-testid="clear-all-filters"  // ← ADD THIS
  variant="outline"
  size="sm"
  onClick={handleClearAll}
>
  Clear All
</Button>
```

---

## Tests This Will Fix

After this fix, these 5+ tests should pass:
- ✅ `filter flow - apply filters`
- ✅ `filter flow - clear filters`
- ✅ `sort flow - change sort option`
- ✅ `sort flow - change sort order`
- ✅ `sort flow - verify results displayed in correct order`
- ✅ `empty states - no results message` (after Testing Agent fixes selector)

### Test Command

```bash
cd policy-radar-frontend
npx playwright test -v
```

**Expected Result**: 5+ more tests passing (5/30 → 11/30) ✅

### Verification Command

```bash
# Run E2E tests
cd policy-radar-frontend
npx playwright test -v

# Expected: 11/30 passing (37%)
```

---

## 📋 Development Workflow

1. **Update filter-toggle.tsx** - Add data-testid prop support
2. **Update policy-filters.tsx** - Add test IDs to all filters
3. **Update policy-row.tsx** - Add impact-score test ID
4. **Update policy-header.tsx** - Verify/add sort/order/clear test IDs
5. **Test immediately**: Run E2E tests
6. **Verify**: 5+ tests should pass
7. **Commit and push**:
   ```bash
   git add .
   git commit -m "feat: add missing data-testid attributes for E2E tests"
   git push origin main
   ```

---

## 🚨 Critical Reminders

### NO VISUAL REDESIGN
- ❌ **NO** layout changes
- ❌ **NO** visual token changes
- ❌ **NO** color/style changes
- ✅ **YES** add data-testid attributes only

### TEST WHILE DEVELOPING
- ✅ Run E2E tests after EVERY change
- ✅ Verify tests pass before committing
- ✅ Test with: `npx playwright test -v`

---

## 🚀 After Completing Fix

1. **Run E2E tests**: `npx playwright test -v`
2. **Verify**: 5+ tests should pass (5/30 → 11/30)
3. **Commit and push**: Include fix and test results
4. **Update status**: Notify Testing Agent to verify

---

## 📚 Reference Documents

- **Testing Agent Summary**: `TESTING_AGENT_COORDINATION_PLAN.md`
- **Data-TestId Fix Guide**: `FRONTEND_DATA_TESTID_FIX.md`
- **Action Plan**: `UPDATED_ACTION_PLAN.md`
- **Master Plan**: `MASTER_COORDINATION_PLAN.md`

---

## ✅ Checklist

- [ ] Update `filter-toggle.tsx` to accept `data-testid` prop
- [ ] Add `data-testid="filter-region-{region}"` to all region filters
- [ ] Add `data-testid="filter-policy-type-{type}"` to all policy type filters
- [ ] Add `data-testid="filter-status-{status}"` to all status filters
- [ ] Add `data-testid="filter-scope-{scope}"` to all scope filters
- [ ] Verify/add `data-testid="sort-select"` to sort select
- [ ] Verify/add `data-testid="order-select"` to order select
- [ ] Add `data-testid="impact-score"` to policy row impact score
- [ ] Add `data-testid="clear-all-filters"` to clear button
- [ ] Run E2E tests: `npx playwright test -v`
- [ ] Verify: 5+ tests passing
- [ ] Commit and push

---

**This is CRITICAL - Fix this first! Only takes ~15 minutes and fixes 5+ tests!** 🚀

**Run E2E tests after EVERY change to ensure progress!** 🧪✅

