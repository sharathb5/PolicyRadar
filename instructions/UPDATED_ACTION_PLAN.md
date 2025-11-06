# Updated Action Plan - Based on Testing Agent Final Summary

**Date**: 2025-01-XX  
**Status**: 🎯 **ACTIVE**  
**Current Coverage**: 47.9% (46/96 tests) → **Target**: 100% (96/96 tests)  
**Progress**: +13.5% improvement since last report ✅

---

## 📊 Current Test Status

### Overall: **47.9% (46/96 tests passing)** ✅

| Category | Passed | Total | Coverage | Status | Priority |
|----------|--------|-------|----------|--------|----------|
| Contract Tests | 24 | 27 | 88.9% | ✅ Working | - |
| Golden Tests | 7 | 23 | 30.4% | 🔄 In Progress | 🟠 HIGH |
| Integration Tests | **11** | **16** | **68.8%** | 🔄 **FIXING** | 🔴 **CRITICAL** |
| E2E Tests | **5** | **30** | **16.7%** | 🔄 **IMPROVING** | 🔴 **CRITICAL** |
| **TOTAL** | **46** | **96** | **47.9%** | 🔄 **In Progress** | |

---

## 🔍 Root Causes Identified

### 🔴 CRITICAL: Pipeline Matching Logic (Backend)

**Impact**: 4 integration tests failing  
**Time**: ~30 minutes  
**Status**: ⏳ **Needs Backend Fix**

**Problem**:
- Pipeline checks for existing policies by `content_hash` ONLY
- When `title_raw` or `summary_raw` changes, `content_hash` changes
- Pipeline treats it as NEW policy and inserts it (version=1)
- Should check by `source_item_id` for updates (version increment)

**Expected Behavior**:
- Same `source_item_id` with different content → UPDATE existing policy
- Different `normalized_hash` → Version increment
- `PolicyChangesLog` entry created

**Actual Behavior**:
- Different `content_hash` → Pipeline treats as new item
- Inserts new policy (version=1) instead of updating
- No version increment
- No `PolicyChangesLog` entry

**Fix Required**:
- Update `_process_item` in pipeline to check by `source_item_id` (or `source + source_item_id`) for updates
- Ensure version increment works correctly
- Ensure `PolicyChangesLog` populated

**Tests This Will Fix**:
- ✅ `test_different_normalized_hash_version_increment`
- ✅ `test_normalized_hash_change_triggers_version_increment`
- ✅ `test_previous_version_data_preserved`
- ✅ `test_policy_changes_log_populated`

**Expected Result**: Integration tests 11/16 → **15/16 (93.8%)**

---

### 🔴 CRITICAL: Missing Test IDs (Frontend)

**Impact**: 5 E2E tests failing  
**Time**: ~15 minutes  
**Status**: ⏳ **Needs Frontend Fix**

**Problem**:
- Frontend missing `data-testid` attributes on:
  - Filter buttons: `data-testid="filter-region-EU"`
  - Sort controls: `data-testid="sort-select"`, `data-testid="order-select"`
  - Policy rows: `data-testid="impact-score"`
  - Clear button: `data-testid="clear-all-filters"`

**Fix Required**:
- Add `data-testid` attributes to all filter buttons
- Add `data-testid` to sort controls
- Add `data-testid` to policy rows
- Add `data-testid` to clear button

**Tests This Will Fix**:
- ✅ `filter flow - apply filters`
- ✅ `filter flow - clear filters`
- ✅ `sort flow - change sort option`
- ✅ `sort flow - change sort order`
- ✅ `empty states - no results message` (after selector fix)

**Expected Result**: E2E tests 5/30 → **11/30 (37%)**

---

### 🟡 MEDIUM: Wrong Selector in Test (Testing)

**Impact**: 1 E2E test failing  
**Time**: ~5 minutes  
**Status**: ✅ **Can Fix Now**

**Problem**:
- Test uses `selectOption` for slider (should use drag action)
- `empty states - no results message` test has wrong selector

**Fix Required**:
- Update test to drag slider instead of `selectOption`
- Fix selector for empty state test

**Expected Result**: E2E tests 11/30 → **11/30 (37%)** (already included above)

---

### 🟠 HIGH: Classification & Scoring Modules (Backend)

**Impact**: 16 golden tests failing  
**Time**: ~4 hours  
**Status**: ⏳ **Pending**

**Problem**:
- Golden tests require `app/core/classify.py` and `app/core/scoring.py`
- Modules don't exist or are incomplete

**Fix Required**:
- Implement classification module (`app/core/classify.py`)
- Implement scoring module (`app/core/scoring.py`)
- Match `/contracts/scoring.md` exactly

**Expected Result**: Golden tests 7/23 → **23/23 (100%)**

---

## 🎯 Action Steps by Agent

### 🔵 BACKEND AGENT - Priorities

#### Priority 1: Fix Pipeline Matching Logic (🔴 CRITICAL)
**Time**: ~30 minutes  
**Impact**: Integration tests 11/16 → 15/16 (93.8%)

**Action**:
1. Open `PolicyRadar-backend/app/ingest/pipeline.py`
2. Find `_process_item` method
3. Update logic to:
   - Check by `content_hash` first (exact duplicate)
   - If not found, check by `source + source_item_id` (same item, updated content)
   - If found by `source_item_id`, UPDATE existing (version increment)
   - If not found at all, INSERT new
4. Ensure version increment works correctly
5. Ensure `PolicyChangesLog` populated
6. Test: Run integration tests

**Test Command**:
```bash
cd PolicyRadar-backend
source venv/bin/activate
export TEST_DATABASE_URL=postgresql://sharath@localhost:5432/policyradar_test
pytest tests/integration/test_versioning.py -v
```

**Expected**: 4 more tests passing ✅

---

#### Priority 2: Implement Classification Module (🟠 HIGH)
**Time**: ~2 hours  
**Impact**: Golden tests 7/23 → 14/23 (60.9%)

**Action**: See `BACKEND_AGENT_START_PROMPT.md` Priority 3

---

#### Priority 3: Implement Scoring Module (🟠 HIGH)
**Time**: ~2 hours  
**Impact**: Golden tests 14/23 → 23/23 (100%)

**Action**: See `BACKEND_AGENT_START_PROMPT.md` Priority 4

---

### 🟢 FRONTEND AGENT - Priorities

#### Priority 1: Add Missing Test IDs (🔴 CRITICAL)
**Time**: ~15 minutes  
**Impact**: E2E tests 5/30 → 11/30 (37%)

**Action**:
1. Add `data-testid="filter-region-EU"` to EU filter button
2. Add `data-testid="filter-region-US-Federal"` to US-Federal filter button
3. Add `data-testid="filter-region-{region}"` to all region filters
4. Verify `data-testid="sort-select"` exists on sort select
5. Verify `data-testid="order-select"` exists on order select
6. Add `data-testid="impact-score"` to policy row impact score
7. Add `data-testid="clear-all-filters"` to clear button
8. Test: Run E2E tests

**Files to Fix**:
- `policy-radar-frontend/components/policy-filters.tsx`
- `policy-radar-frontend/components/ui/policy-row.tsx`
- `policy-radar-frontend/components/policy-header.tsx`

**Test Command**:
```bash
cd policy-radar-frontend
npx playwright test -v
```

**Expected**: 5 more tests passing ✅

---

#### Priority 2: Implement Legend Dialog (🟠 HIGH)
**Time**: ~2 hours  
**Impact**: User experience improvement

**Action**: See `FRONTEND_AGENT_START_PROMPT.md` Priority 2

---

### 🟡 TESTING AGENT - Priorities

#### Priority 1: Fix Test Selector (🟡 MEDIUM)
**Time**: ~5 minutes  
**Impact**: 1 E2E test fixed

**Action**:
1. Open `playwright/policy-feed.spec.ts`
2. Find `empty states - no results message` test
3. Fix selector for empty state
4. Update slider test to use drag action instead of `selectOption`
5. Test: Run E2E tests

**Test Command**:
```bash
cd policy-radar-frontend
npx playwright test policy-feed.spec.ts -v
```

**Expected**: 1 test fixed ✅

---

#### Priority 2: Verify Backend Pipeline Fix (🔴 CRITICAL)
**Time**: ~10 minutes  
**Impact**: Verify 4 integration tests pass

**Action**:
1. Wait for Backend Agent to fix pipeline matching logic
2. Run integration tests
3. Verify 4 version-related tests pass
4. Document results

**Test Command**:
```bash
cd PolicyRadar-backend
source venv/bin/activate
export TEST_DATABASE_URL=postgresql://sharath@localhost:5432/policyradar_test
pytest tests/integration/test_versioning.py -v
```

**Expected**: 4 tests passing ✅

---

#### Priority 3: Verify Frontend Test ID Fix (🔴 CRITICAL)
**Time**: ~10 minutes  
**Impact**: Verify 5 E2E tests pass

**Action**:
1. Wait for Frontend Agent to add test IDs
2. Run E2E tests
3. Verify 5 tests pass
4. Document results

**Test Command**:
```bash
cd policy-radar-frontend
npx playwright test -v
```

**Expected**: 5 tests passing ✅

---

## 📊 Expected Progress After All Fixes

### Current State
```
Coverage: [████████████░░░░░░░░░░░░░░░░] 47.9% (46/96)
├── Contract: [████████████████████░░░] 88.9% (24/27)
├── Golden:   [████░░░░░░░░░░░░░░░░░░░] 30.4% (7/23)
├── Integration: [████████████░░░░░░░░] 68.8% (11/16)
└── E2E:      [██░░░░░░░░░░░░░░░░░░░░░] 16.7% (5/30)
```

### After Backend Pipeline Fix
```
Integration: [████████████████████░░] 93.8% (15/16)
Coverage: [██████████████░░░░░░░░░░] 51.0% (49/96)
```

### After Frontend Test ID Fix
```
E2E:      [████░░░░░░░░░░░░░░░░░░░░] 37% (11/30)
Coverage: [███████████████░░░░░░░░░] 52.1% (50/96)
```

### After Golden Tests Complete
```
Golden:   [████████████████████████] 100% (23/23)
Coverage: [████████████████████░░░] 78.1% (75/96)
```

### Final Goal
```
Coverage: [████████████████████████] 100% (96/96) ✅
```

---

## ⏱️ Time Estimates

### Immediate (Today)
- Backend Pipeline Fix: 30 min → +4 tests
- Frontend Test IDs: 15 min → +5 tests
- Testing Selector Fix: 5 min → +1 test
- **Total**: ~50 minutes → Coverage: 47.9% → **52.1%** (+4.2%)

### Short Term (This Week)
- Backend Classification: 2 hours → +7 tests
- Backend Scoring: 2 hours → +9 tests
- Frontend Legend: 2 hours → UX improvement
- **Total**: ~6 hours → Coverage: 52.1% → **78.1%** (+26%)

### Remaining Work
- Remaining E2E tests: Need to identify blockers
- Remaining integration tests: 1 test needs investigation
- API contract tests: 3 tests need investigation

---

## 🚨 Critical Reminders

### For All Agents
- ✅ Follow `MASTER_COORDINATION_PLAN.md` priorities
- ✅ Test after EVERY change
- ✅ Commit and push incrementally
- ✅ Update status documents after completing tasks

### For Backend Agent
- ✅ Fix pipeline matching logic FIRST (30 min, highest impact)
- ✅ Then implement modules (4 hours total)

### For Frontend Agent
- ✅ Add test IDs FIRST (15 min, unblocks E2E tests)
- ✅ Then implement Legend (2 hours)

### For Testing Agent
- ✅ Fix test selector (5 min)
- ✅ Verify Backend/Frontend fixes (20 min total)
- ✅ Coordinate with other agents

---

**Status**: 🎯 **ACTIVE**  
**Next Milestone**: Backend Pipeline Fix → Coverage 51%  
**Target**: 100% test coverage + Legend feature complete

