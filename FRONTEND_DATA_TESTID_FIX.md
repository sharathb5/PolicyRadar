# Frontend Data-TestId Fix - E2E Test Blocking Issue

**Priority**: 🔴 **CRITICAL**  
**Assigned To**: Frontend Agent  
**Status**: ⏳ Pending  
**Blocks**: 8 E2E tests failing (0/10 passing in policy-feed tests)

---

## 🎯 Problem Summary

**All E2E test failures are due to missing `data-testid` attributes in frontend components.**

### Current Test Status
- ✅ **2/10 tests passing** (20%)
  - displays policy list ✅
  - loading states - skeletons display ✅
- ❌ **8/10 tests failing** (80%) - **ALL due to missing test IDs**

---

## 📋 Missing Data-TestId Attributes

### 1. Filter Components (policy-filters.tsx)

#### Region Filters
**File**: `policy-radar-frontend/components/policy-filters.tsx`

**Missing**:
- [ ] `data-testid="filter-region"` - Region filter container (line ~101)
- [x] `data-testid="filter-region-EU"` - ✅ EXISTS (line 104)
- [ ] `data-testid="filter-region-US-Federal"` - Missing (line ~111)
- [ ] `data-testid="filter-region-US-CA"` - Missing (line ~117)
- [ ] `data-testid="filter-region-UK"` - Missing (line ~123)
- [ ] `data-testid="filter-region-OTHER"` - Missing (needs to be added if OTHER option exists)

#### Policy Type Filters
**Missing**:
- [x] `data-testid="filter-policy-type-Disclosure"` - ✅ EXISTS (line 135)
- [ ] `data-testid="filter-policy-type-Pricing"` - Missing (line ~142)
- [ ] `data-testid="filter-policy-type-Ban"` - Missing (line ~148)
- [ ] `data-testid="filter-policy-type-Incentive"` - Missing (line ~154)
- [ ] `data-testid="filter-policy-type-Supply-chain"` - Missing (line ~160)

#### Status Filters
**Missing**:
- [ ] `data-testid="filter-status-Proposed"` - Missing (line ~172)
- [ ] `data-testid="filter-status-Adopted"` - Missing (line ~178)
- [ ] `data-testid="filter-status-Effective"` - Missing (line ~184)

#### Scope Filters
**Missing**:
- [ ] `data-testid="filter-scope-1"` - Missing (line ~195)
- [ ] `data-testid="filter-scope-2"` - Missing (line ~198)
- [ ] `data-testid="filter-scope-3"` - Missing (line ~201)

#### Clear Filters Button
- [x] `data-testid="clear-all-filters"` - ✅ EXISTS (line 89)

---

### 2. Sort & Order Components

**Issue**: Sort and order selects are missing entirely or don't have test IDs.

**Missing**:
- [ ] `data-testid="sort-select"` - Sort dropdown select
- [ ] `data-testid="order-select"` - Order dropdown select

**Location**: Need to check `policy-header.tsx` or create sort/order UI components.

---

### 3. Policy Row Components (policy-row.tsx)

**Missing**:
- [ ] `data-testid="impact-score"` - Impact score display in policy row

**File**: `policy-radar-frontend/components/ui/policy-row.tsx`

---

### 4. Active Filter Chips

**Missing**:
- [ ] `data-testid="active-filter-{value}"` - Active filter chip display
  - `data-testid="active-filter-EU"`
  - `data-testid="active-filter-Disclosure"`
  - etc.

**Location**: Need to find where active filter chips are displayed (likely in header or filter section).

---

### 5. Impact Score Display

**Missing**:
- [ ] `data-testid="impact-score"` - Inside each policy row

**File**: `policy-radar-frontend/components/ui/policy-row.tsx`

---

## 🔧 Required Fixes

### Fix 1: Add Missing Filter Test IDs (policy-filters.tsx)

**File**: `policy-radar-frontend/components/policy-filters.tsx`

**Add to Region Filter Section** (around line 100):
```tsx
<div data-testid="filter-region">  {/* Add this wrapper */}
  <Label className="text-sm font-semibold mb-3 block">Region</Label>
  <div className="space-y-2">
    <FilterToggle
      data-testid="filter-region-EU"  {/* Already exists */}
      active={selectedRegions.includes("EU")}
      onClick={() => toggleFilter("EU", selectedRegions, 'region')}
    >
      EU
    </FilterToggle>
    <FilterToggle
      data-testid="filter-region-US-Federal"  {/* ADD THIS */}
      active={selectedRegions.includes("US-Federal")}
      onClick={() => toggleFilter("US-Federal", selectedRegions, 'region')}
    >
      US-Federal
    </FilterToggle>
    <FilterToggle
      data-testid="filter-region-US-CA"  {/* ADD THIS */}
      active={selectedRegions.includes("US-CA")}
      onClick={() => toggleFilter("US-CA", selectedRegions, 'region')}
    >
      US-CA
    </FilterToggle>
    <FilterToggle
      data-testid="filter-region-UK"  {/* ADD THIS */}
      active={selectedRegions.includes("UK")}
      onClick={() => toggleFilter("UK", selectedRegions, 'region')}
    >
      UK
    </FilterToggle>
    <FilterToggle
      data-testid="filter-region-OTHER"  {/* ADD THIS if OTHER option exists */}
      active={selectedRegions.includes("OTHER")}
      onClick={() => toggleFilter("OTHER", selectedRegions, 'region')}
    >
      OTHER
    </FilterToggle>
  </div>
</div>
```

**Add to Policy Type Filter Section** (around line 132):
```tsx
<FilterToggle
  data-testid="filter-policy-type-Disclosure"  {/* Already exists */}
  active={selectedTypes.includes("Disclosure")}
  onClick={() => toggleFilter("Disclosure", selectedTypes, 'policy_type')}
>
  Disclosure
</FilterToggle>
<FilterToggle
  data-testid="filter-policy-type-Pricing"  {/* ADD THIS */}
  active={selectedTypes.includes("Pricing")}
  onClick={() => toggleFilter("Pricing", selectedTypes, 'policy_type')}
>
  Pricing
</FilterToggle>
<FilterToggle
  data-testid="filter-policy-type-Ban"  {/* ADD THIS */}
  active={selectedTypes.includes("Ban")}
  onClick={() => toggleFilter("Ban", selectedTypes, 'policy_type')}
>
  Ban/Phase-out
</FilterToggle>
<FilterToggle
  data-testid="filter-policy-type-Incentive"  {/* ADD THIS */}
  active={selectedTypes.includes("Incentive")}
  onClick={() => toggleFilter("Incentive", selectedTypes, 'policy_type')}
>
  Incentive/Subsidy
</FilterToggle>
<FilterToggle
  data-testid="filter-policy-type-Supply-chain"  {/* ADD THIS */}
  active={selectedTypes.includes("Supply-chain")}
  onClick={() => toggleFilter("Supply-chain", selectedTypes, 'policy_type')}
>
  Supply-chain Due Diligence
</FilterToggle>
```

**Add to Status Filter Section** (around line 168):
```tsx
<FilterToggle
  data-testid="filter-status-Proposed"  {/* ADD THIS */}
  active={selectedStatuses.includes("Proposed")}
  onClick={() => toggleFilter("Proposed", selectedStatuses, 'status')}
>
  Proposed
</FilterToggle>
<FilterToggle
  data-testid="filter-status-Adopted"  {/* ADD THIS */}
  active={selectedStatuses.includes("Adopted")}
  onClick={() => toggleFilter("Adopted", selectedStatuses, 'status')}
>
  Adopted
</FilterToggle>
<FilterToggle
  data-testid="filter-status-Effective"  {/* ADD THIS */}
  active={selectedStatuses.includes("Effective")}
  onClick={() => toggleFilter("Effective", selectedStatuses, 'status')}
>
  Effective
</FilterToggle>
```

**Add to Scope Filter Section** (around line 192):
```tsx
<FilterToggle
  data-testid="filter-scope-1"  {/* ADD THIS */}
  active={selectedScopes.includes(1)}
  onClick={() => toggleScope(1)}
>
  Scope 1
</FilterToggle>
<FilterToggle
  data-testid="filter-scope-2"  {/* ADD THIS */}
  active={selectedScopes.includes(2)}
  onClick={() => toggleScope(2)}
>
  Scope 2
</FilterToggle>
<FilterToggle
  data-testid="filter-scope-3"  {/* ADD THIS */}
  active={selectedScopes.includes(3)}
  onClick={() => toggleScope(3)}
>
  Scope 3
</FilterToggle>
```

---

### Fix 2: Add Sort & Order Select Test IDs

**Location**: Need to find or create sort/order select components.

**If sort/order selects exist, add**:
```tsx
<Select data-testid="sort-select" ...>
  {/* sort options */}
</Select>

<Select data-testid="order-select" ...>
  {/* order options (asc/desc) */}
</Select>
```

**If sort/order selects don't exist**, create them in `policy-header.tsx` or appropriate location.

---

### Fix 3: Add Impact Score Test ID (policy-row.tsx)

**File**: `policy-radar-frontend/components/ui/policy-row.tsx`

**Find the impact score display and add**:
```tsx
<span data-testid="impact-score">{policy.impact_score}</span>
```

**Or if impact score is in a badge/component**:
```tsx
<Badge data-testid="impact-score">{policy.impact_score}</Badge>
```

---

### Fix 4: Update FilterToggle Component

**File**: `policy-radar-frontend/components/ui/filter-toggle.tsx`

**Ensure FilterToggle accepts and passes through `data-testid`**:
```tsx
interface FilterToggleProps {
  children: React.ReactNode
  active?: boolean
  onClick?: () => void
  'data-testid'?: string  // ADD THIS
}

export function FilterToggle({ children, active, onClick, ...props }: FilterToggleProps) {
  return (
    <Button
      variant={active ? "default" : "ghost"}
      size="sm"
      className={cn("w-full justify-start text-xs font-normal", active && "bg-primary text-primary-foreground")}
      onClick={onClick}
      {...props}  // Spread props to pass through data-testid
    >
      {children}
    </Button>
  )
}
```

---

### Fix 5: Add Active Filter Chips Test IDs

**Location**: Find where active filter chips are displayed (likely in `policy-header.tsx` or filter section).

**Add test IDs**:
```tsx
<Chip data-testid={`active-filter-${filterValue}`}>
  {filterValue}
</Chip>
```

---

## 📝 Implementation Checklist

### Step 1: Update FilterToggle Component
- [ ] Add `data-testid` to FilterToggleProps interface
- [ ] Spread props to pass through `data-testid` to Button

### Step 2: Update Policy Filters Component
- [ ] Add `data-testid="filter-region"` to region filter container
- [ ] Add test IDs to all region filter toggles (US-Federal, US-CA, UK, OTHER)
- [ ] Add test IDs to all policy type filter toggles (Pricing, Ban, Incentive, Supply-chain)
- [ ] Add test IDs to all status filter toggles (Proposed, Adopted, Effective)
- [ ] Add test IDs to all scope filter toggles (1, 2, 3)
- [ ] Verify `clear-all-filters` test ID exists

### Step 3: Add Sort & Order Selects
- [ ] Find or create sort select component
- [ ] Add `data-testid="sort-select"` to sort select
- [ ] Find or create order select component
- [ ] Add `data-testid="order-select"` to order select

### Step 4: Add Impact Score Test ID
- [ ] Find impact score display in policy-row.tsx
- [ ] Add `data-testid="impact-score"` to impact score element

### Step 5: Add Active Filter Chips Test IDs
- [ ] Find where active filter chips are displayed
- [ ] Add `data-testid="active-filter-{value}"` to each chip

### Step 6: Test & Verify
- [ ] Run Playwright tests: `npx playwright test policy-feed.spec.ts`
- [ ] Verify all 10 tests pass
- [ ] Push code: `git commit -m "feat: add missing data-testid attributes for E2E tests" && git push`

---

## 🎯 Expected Result

**After fixes**:
- ✅ All 10 policy-feed tests pass
- ✅ Filter flow tests pass
- ✅ Sort flow tests pass
- ✅ Empty state tests pass
- ✅ Active filter chips tests pass
- ✅ Clear all button test passes

**Test Coverage**:
- Before: 2/10 passing (20%)
- After: 10/10 passing (100%) ✅

---

## 🚀 Quick Start

1. **Update FilterToggle component** (5 min)
   - Add `data-testid` to props
   - Pass through to Button

2. **Add missing filter test IDs** (15 min)
   - Update policy-filters.tsx
   - Add test IDs to all filter toggles

3. **Add sort/order select test IDs** (10 min)
   - Find or create select components
   - Add test IDs

4. **Add impact score test ID** (5 min)
   - Update policy-row.tsx

5. **Add active filter chips test IDs** (10 min)
   - Find chip display location
   - Add test IDs

6. **Test & Push** (10 min)
   - Run Playwright tests
   - Verify all pass
   - Commit and push

**Total Time**: ~55 minutes

---

## 📋 Test Reference

See test expectations in:
- `playwright/policy-feed.spec.ts` - Lines 17-167
- Expected test IDs documented in tests

---

**Priority**: 🔴 **CRITICAL** - Blocking all E2E tests  
**Once fixed**: E2E tests can proceed and smoke flow can pass

