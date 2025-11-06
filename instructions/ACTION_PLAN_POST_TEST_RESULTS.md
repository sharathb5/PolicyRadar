# Action Plan - Post Test Results Analysis

**Date**: 2025-01-XX  
**Status**: 🔴 **Critical Issues Identified**  
**Overall Test Status**: 30/96 passing (31%) → Target: 96/96 (100%)

---

## 📊 Test Results Summary

### ✅ Passing Tests (30/96 - 31%)

#### Contract Tests: 24/27 (88.9%) ✅
- OpenAPI Validation: 7/7 passing ✅
- Field Names: 11/11 passing ✅
- API Contracts: 6/9 passing (67%) ⚠️

#### Golden Tests: 6/15 (40%) ⚠️
- Scoring Tests: 6/15 passing (3 need time fix)
- Classification Tests: 0/8 (module not found)

#### Integration Tests: 0/16 (0%) ⏳
- Ready to run (test database set up)

#### E2E Tests: 0/30 (0%) 🔴 **BLOCKING ISSUE**
- **2/10 policy-feed tests passing (20%)**
- **8/10 policy-feed tests failing (80%)** - **ALL due to missing data-testid attributes**

---

## 🔴 CRITICAL BLOCKING ISSUE: Missing Data-TestId Attributes

### Problem
**8 E2E tests are failing because frontend components are missing `data-testid` attributes.**

### Test Failures
1. ❌ filter flow - apply filters — Missing `data-testid="filter-region"`
2. ❌ filter flow - clear filters — Missing `data-testid="filter-region-EU"` (or verification needed)
3. ❌ sort flow - change sort option — Missing `data-testid="sort-select"`
4. ❌ sort flow - change sort order — Missing `data-testid="order-select"`
5. ❌ sort flow - verify results displayed in correct order — Missing `data-testid="impact-score"`
6. ❌ empty states - no results message — Missing `data-testid="filter-region-OTHER"`
7. ❌ active filter chips display correctly — Missing filter test IDs
8. ❌ clear all button resets filters — Missing `data-testid="clear-all-filters"` (or verification needed)

---

## 🎯 Action Plan by Agent

### 🔴 Frontend Agent - CRITICAL PRIORITY

#### Task: Add Missing Data-TestId Attributes (1 hour)

**Status**: 🔴 **BLOCKING E2E TESTS**

**Files to Update**:
1. `policy-radar-frontend/components/ui/filter-toggle.tsx`
   - Add `data-testid` prop to FilterToggleProps
   - Pass through to Button component

2. `policy-radar-frontend/components/policy-filters.tsx`
   - Add `data-testid="filter-region"` to region container
   - Add test IDs to ALL filter toggles:
     - Region: `filter-region-US-Federal`, `filter-region-US-CA`, `filter-region-UK`, `filter-region-OTHER`
     - Policy Type: `filter-policy-type-Pricing`, `filter-policy-type-Ban`, `filter-policy-type-Incentive`, `filter-policy-type-Supply-chain`
     - Status: `filter-status-Proposed`, `filter-status-Adopted`, `filter-status-Effective`
     - Scopes: `filter-scope-1`, `filter-scope-2`, `filter-scope-3`

3. `policy-radar-frontend/components/ui/policy-row.tsx` OR `impact-score.tsx`
   - Add `data-testid="impact-score"` to impact score display

4. Create/Find Sort & Order Selects
   - Add `data-testid="sort-select"` to sort dropdown
   - Add `data-testid="order-select"` to order dropdown

5. Find Active Filter Chips Location
   - Add `data-testid="active-filter-{value}"` to active filter chips

**Detailed Guide**: See `FRONTEND_DATA_TESTID_FIX.md`

**Test After Fixing**:
```bash
cd policy-radar-frontend
npx playwright test policy-feed.spec.ts
```

**Expected Result**: 10/10 tests passing ✅

**Push When Complete**:
```bash
git add .
git commit -m "feat: add missing data-testid attributes for E2E tests"
git push origin main
```

---

### 🟠 Backend Agent - HIGH PRIORITY

#### Task 1: Complete API Contract Tests (30 min)

**Status**: 6/9 passing (67%) - Need +3 more tests

**Action**:
- [ ] Verify all API endpoints work correctly
- [ ] Fix any failing API contract tests
- [ ] Verify: 9/9 passing ✅

#### Task 2: Implement Classification Module (2-3 hours)

**Status**: ⏳ Pending - Blocks golden tests (0/8 passing)

**Action**:
- [ ] Check if `app/core/classify.py` exists (or `app/core/classification.py`)
- [ ] If missing, create it per `/contracts/scoring.md`
- [ ] Implement classification logic
- [ ] Write tests alongside implementation
- [ ] Run: `pytest tests/unit/test_classify.py -v`
- [ ] Verify: 8/8 passing ✅
- [ ] **🚀 PUSH CODE**

#### Task 3: Fix Scoring Time Proximity Tests (30 min)

**Status**: 6/15 passing - 3 tests need time fix

**Issue**: Time proximity tests failing because `frozen_datetime` fixture doesn't affect `date.today()` inside scoring function.

**Action**:
- [ ] Mock `date.today()` in scoring function
- [ ] Or pass `reference_date` parameter to function
- [ ] Fix time proximity tests
- [ ] Verify: 15/15 passing ✅
- [ ] **🚀 PUSH CODE**

---

### 🟠 Testing Agent - HIGH PRIORITY

#### Task 1: Run Integration Tests (15 min)

**Status**: ⏳ Ready to run (test database set up)

**Action**:
- [ ] Run integration tests:
  ```bash
  export TEST_DATABASE_URL=postgresql://sharath@localhost:5432/policyradar_test
  pytest tests/integration/ -v --no-cov
  ```
- [ ] Verify: 16/16 passing ✅
- [ ] Document results
- [ ] **🚀 PUSH CODE** if tests pass

#### Task 2: Verify API Contract Tests (30 min)

**Status**: 6/9 passing - Need to verify remaining 3

**Action**:
- [ ] Run all API contract tests
- [ ] Fix any remaining failures
- [ ] Verify: 9/9 passing ✅
- [ ] **🚀 PUSH CODE**

#### Task 3: Re-run Smoke Flow After Frontend Fix (1 hour)

**Status**: ⏳ Waiting for Frontend Agent to add test IDs

**Action**:
- [ ] Wait for Frontend Agent to complete data-testid fix
- [ ] Run smoke flow tests: `npx playwright test policy-feed.spec.ts`
- [ ] Verify: 10/10 passing ✅
- [ ] Run remaining E2E tests
- [ ] Verify: 30/30 passing ✅
- [ ] **🚀 PUSH CODE**

---

## 📋 Priority Order

### Immediate (Today)
1. 🔴 **Frontend Agent**: Add missing data-testid attributes (1 hour) - **BLOCKING E2E TESTS**
2. 🟠 **Backend Agent**: Complete API contract tests (30 min)
3. 🟠 **Testing Agent**: Run integration tests (15 min)

### Short Term (This Week)
4. 🟠 **Backend Agent**: Implement classification module (2-3 hours)
5. 🟠 **Backend Agent**: Fix scoring time proximity tests (30 min)
6. 🟠 **Testing Agent**: Re-run smoke flow after frontend fix (1 hour)

---

## 📊 Expected Progress After Actions

### After Frontend Data-TestId Fix
- E2E Tests: 0/30 → 10/30 passing (policy-feed tests)
- **Overall**: 30/96 → 40/96 (31% → 42%) ✅

### After Backend Classification Module
- Golden Tests: 6/23 → 14/23 passing
- **Overall**: 40/96 → 48/96 (42% → 50%) ✅

### After Backend Scoring Time Fix
- Golden Tests: 14/23 → 17/23 passing
- **Overall**: 48/96 → 51/96 (50% → 53%) ✅

### After Integration Tests Run
- Integration Tests: 0/16 → 16/16 passing
- **Overall**: 51/96 → 67/96 (53% → 70%) ✅

### After All E2E Tests Run
- E2E Tests: 10/30 → 30/30 passing
- **Overall**: 67/96 → 96/96 (70% → 100%) ✅

---

## 🚨 Critical Blockers

### Blocker 1: Missing Data-TestId Attributes (Frontend) 🔴
- **Status**: 🔴 **BLOCKING**
- **Agent**: Frontend
- **Impact**: 8 E2E tests failing
- **Fix Time**: 1 hour
- **Blocks**: All E2E test progress

### Blocker 2: Classification Module Missing (Backend) 🟠
- **Status**: ⏳ Pending
- **Agent**: Backend
- **Impact**: 8 golden tests can't run
- **Fix Time**: 2-3 hours
- **Blocks**: Classification golden tests

### Blocker 3: Time Proximity Test Fix (Backend) 🟠
- **Status**: ⏳ Pending
- **Agent**: Backend
- **Impact**: 3 scoring tests failing
- **Fix Time**: 30 min
- **Blocks**: Complete scoring test suite

---

## 📝 Quick Reference

### Frontend Agent - Start Here 🔴
**See**: `FRONTEND_DATA_TESTID_FIX.md` for complete implementation guide

### Backend Agent - Next Steps 🟠
1. Complete API contract tests
2. Implement classification module
3. Fix scoring time proximity tests

### Testing Agent - Next Steps 🟠
1. Run integration tests
2. Wait for frontend fix
3. Re-run smoke flow tests

---

## 🎯 Success Criteria

### Immediate (Today)
- [ ] Frontend: All data-testid attributes added ✅
- [ ] Frontend: 10/10 policy-feed tests passing ✅
- [ ] Backend: 9/9 API contract tests passing ✅
- [ ] Testing: 16/16 integration tests passing ✅

### This Week
- [ ] Backend: 8/8 classification tests passing ✅
- [ ] Backend: 15/15 scoring tests passing ✅
- [ ] Testing: 30/30 E2E tests passing ✅
- [ ] **Overall**: 96/96 tests passing (100%) ✅

---

**Frontend Agent: This is your #1 priority - blocking all E2E tests!** 🔴

**Reference**: `FRONTEND_DATA_TESTID_FIX.md` for detailed fix guide

