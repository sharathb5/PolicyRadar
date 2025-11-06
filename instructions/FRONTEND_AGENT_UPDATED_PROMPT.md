# Frontend Agent - Updated Prompt (Based on Testing Agent Final Summary)

**Copy and paste this entire prompt to the Frontend Agent**

---

You are the Frontend Agent for Policy Radar. Based on the Testing Agent's final summary, you have **CRITICAL priority work** that will fix 5 E2E tests immediately.

## 🎯 Current Status

**Overall Coverage**: 47.9% (46/96 tests passing) ✅ **Improved +13.5%!**

**Current Test Status**:
- ✅ Contract Tests: 24/27 passing (88.9%)
- ⏳ Golden Tests: 7/23 passing (30.4%)
- 🔄 Integration Tests: 11/16 passing (68.8%)
- 🔄 **E2E Tests: 5/30 passing (16.7%)** - **5 tests failing due to missing test IDs** 🔴

---

## 🔴 CRITICAL PRIORITY 1: Add Missing Test IDs (URGENT)

**Status**: 🔴 **BLOCKING 5 E2E TESTS**  
**Time**: ~15 minutes  
**Impact**: E2E tests 5/30 → **11/30 (37%)** → Coverage 47.9% → **50.0%** (+2.1%)

### Problem Identified by Testing Agent

**Root Cause**:
- Frontend missing `data-testid` attributes on interactive elements
- Playwright tests can't find elements to interact with

**Missing Test IDs**:
1. `data-testid="filter-region-EU"` - EU filter button
2. `data-testid="filter-region-US-Federal"` - US-Federal filter button  
3. `data-testid="filter-region-{region}"` - All region filters
4. `data-testid="sort-select"` - Sort select dropdown (verify exists)
5. `data-testid="order-select"` - Order select dropdown (verify exists)
6. `data-testid="impact-score"` - Policy row impact score
7. `data-testid="clear-all-filters"` - Clear all filters button

### Fix Required

**Files to Fix**:

1. **`policy-radar-frontend/components/policy-filters.tsx`**
2. **`policy-radar-frontend/components/ui/policy-row.tsx`**
3. **`policy-radar-frontend/components/policy-header.tsx`**

### Implementation Steps

#### Step 1: Fix Filter Components

**Update `components/policy-filters.tsx`**:

```tsx
// Region filters
<div data-testid="filter-region">
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

// Similar for policy_type, status, scopes
<div data-testid="filter-policy-type">
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
```

#### Step 2: Fix Filter Toggle Component

**Update `components/ui/filter-toggle.tsx`**:

```tsx
interface FilterToggleProps {
  label: string
  isActive: boolean
  onClick: () => void
  'data-testid'?: string  // ← ADD THIS PROP
}

export function FilterToggle({ 'data-testid': testId, ...props }: FilterToggleProps) {
  return (
    <Button
      variant={props.isActive ? "default" : "outline"}
      size="sm"
      data-testid={testId}  // ← PASS TO BUTTON
      onClick={props.onClick}
    >
      {props.label}
    </Button>
  )
}
```

#### Step 3: Fix Policy Row Component

**Update `components/ui/policy-row.tsx`**:

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

#### Step 4: Fix Header Component

**Update `components/policy-header.tsx`**:

```tsx
// Verify these exist, add if missing:
<Select
  data-testid="sort-select"  // ← VERIFY/ADD
  value={`${currentSort}-${currentOrder}`}
  onValueChange={handleSortChange}
>
  {/* ... */}
</Select>

<Select
  data-testid="order-select"  // ← VERIFY/ADD
  value={currentOrder}
  onValueChange={handleOrderChange}
>
  {/* ... */}
</Select>

// Add clear button if missing:
<Button
  data-testid="clear-all-filters"  // ← ADD THIS
  variant="outline"
  size="sm"
  onClick={handleClearAll}
>
  Clear All
</Button>
```

### Tests This Will Fix

After this fix, these 5 tests should pass:
- ✅ `filter flow - apply filters`
- ✅ `filter flow - clear filters`
- ✅ `sort flow - change sort option`
- ✅ `sort flow - change sort order`
- ✅ `empty states - no results message` (after Testing Agent fixes selector)

### Test Command

```bash
cd policy-radar-frontend
npx playwright test -v
```

**Expected Result**: 5 more tests passing (5/30 → 11/30) ✅

---

## 🟠 HIGH PRIORITY 2: Implement Legend/Help Dialog

**Status**: ⏳ New Feature  
**Time**: ~2 hours  
**Impact**: User experience improvement

### Problem

Users need help understanding the number key (Impact Score, Confidence, Impact Factors, etc.)

### Files to Create

1. **`policy-radar-frontend/components/legend-dialog.tsx`** (NEW)

### Files to Modify

1. **`policy-radar-frontend/components/policy-header.tsx`**

### Implementation

See `LEGEND_IMPLEMENTATION_PLAN.md` for detailed implementation guide.

**Quick Steps**:
1. Create `legend-dialog.tsx` component with Dialog
2. Add all legend content (verbatim from user's provided text)
3. Add help icon button to `policy-header.tsx`
4. Wire up dialog open/close
5. Test manually

---

## 📋 Development Workflow

### Test-First Development

1. **Add test IDs FIRST** (Priority 1 - 15 min)
2. **Run E2E tests** - Verify 5 tests pass
3. **Then implement Legend** (Priority 2 - 2 hours)
4. **Test manually** - Verify dialog works
5. **Commit and push** - Include all fixes

### Test Commands

```bash
cd policy-radar-frontend

# Run E2E tests (after Priority 1 fix)
npx playwright test -v

# Run specific test file
npx playwright test policy-feed.spec.ts -v

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

## 🚀 After Completing Priority 1 (Test IDs)

1. **Run E2E tests**: `npx playwright test -v`
2. **Verify**: 5 tests should pass (5/30 → 11/30)
3. **Commit and push**: 
   ```bash
   git add .
   git commit -m "feat: add missing data-testid attributes for E2E tests"
   git push origin main
   ```
4. **Update status**: Notify Testing Agent to verify

---

## 📚 Reference Documents

- **Action Plan**: `UPDATED_ACTION_PLAN.md`
- **Testing Agent Summary**: `TESTING_AGENT_FINAL_SUMMARY.md`
- **Legend Plan**: `LEGEND_IMPLEMENTATION_PLAN.md`
- **Master Plan**: `MASTER_COORDINATION_PLAN.md`
- **Dictionary**: `/dictionary.md`

---

**Start with Priority 1 (Test IDs) - this is CRITICAL and only takes 15 minutes!**

**Run E2E tests after EVERY change to ensure progress!** 🧪✅

