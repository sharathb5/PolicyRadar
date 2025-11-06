# Testing Agent - Updated Prompt (Based on Final Summary)

**Copy and paste this entire prompt to the Testing Agent**

---

You are the Testing Agent for Policy Radar. Based on your final summary analysis, you've identified root causes and now need to verify fixes and complete remaining test work.

## 🎯 Current Status

**Overall Coverage**: 47.9% (46/96 tests passing) ✅ **Improved +13.5%!**

**Current Test Status**:
- ✅ Contract Tests: 24/27 passing (88.9%)
- ⏳ Golden Tests: 7/23 passing (30.4%) - Waiting for Backend modules
- 🔄 **Integration Tests: 11/16 passing (68.8%)** - **4 tests need backend pipeline fix** 🔴
- 🔄 **E2E Tests: 5/30 passing (16.7%)** - **5 tests need frontend test IDs** 🔴

---

## 🎯 Your Analysis Summary

**Excellent work!** You've identified root causes:

1. ✅ **Pipeline Matching Logic** (Backend) - 4 tests failing
2. ✅ **Missing Test IDs** (Frontend) - 5 tests failing
3. ✅ **Wrong Selector in Test** (Testing) - 1 test failing

**Next Steps**: Verify Backend/Frontend fixes, then fix test selector

---

## 🟡 PRIORITY 1: Fix Test Selector (Can Do Now)

**Status**: ✅ **Can Fix Immediately**  
**Time**: ~5 minutes  
**Impact**: 1 E2E test fixed

### Problem

**Root Cause**:
- Test uses `selectOption` for slider (should use drag action)
- `empty states - no results message` test has wrong selector

### Fix Required

**File to Fix**: `playwright/policy-feed.spec.ts`

**Find**: `empty states - no results message` test

**Update**:

```typescript
// BEFORE (Wrong)
await page.selectOption('select[data-testid="filter-impact"]', '70')  // Wrong for slider

// AFTER (Correct)
// For slider, use drag action instead
await page.locator('[data-testid="filter-impact"]').dragTo(
  page.locator('[data-testid="filter-impact"]'),
  { targetPosition: { x: 70, y: 0 } }
)

// Or fix selector for empty state message:
await expect(page.locator('[data-testid="empty-state"]')).toBeVisible()
```

### Test Command

```bash
cd policy-radar-frontend
npx playwright test policy-feed.spec.ts -v
```

**Expected Result**: 1 test fixed ✅

---

## 🔴 CRITICAL PRIORITY 2: Verify Backend Pipeline Fix

**Status**: ⏳ **Waiting for Backend Agent**  
**Time**: ~10 minutes  
**Impact**: Verify 4 integration tests pass

### What Backend Agent Will Fix

**File**: `PolicyRadar-backend/app/ingest/pipeline.py`  
**Method**: `_process_item`

**Fix**: Update logic to check by `source_item_id` for updates (not just `content_hash`)

### Your Action

**After Backend Agent fixes pipeline matching logic**:

1. **Run integration tests**:
   ```bash
   cd PolicyRadar-backend
   source venv/bin/activate
   export TEST_DATABASE_URL=postgresql://sharath@localhost:5432/policyradar_test
   pytest tests/integration/test_versioning.py -v --tb=short
   ```

2. **Verify these 4 tests pass**:
   - ✅ `test_different_normalized_hash_version_increment`
   - ✅ `test_normalized_hash_change_triggers_version_increment`
   - ✅ `test_previous_version_data_preserved`
   - ✅ `test_policy_changes_log_populated`

3. **Check integration test status**:
   ```bash
   pytest tests/integration/ -v
   ```

**Expected Result**: Integration tests 11/16 → **15/16 (93.8%)** ✅

---

## 🔴 CRITICAL PRIORITY 3: Verify Frontend Test ID Fix

**Status**: ⏳ **Waiting for Frontend Agent**  
**Time**: ~10 minutes  
**Impact**: Verify 5 E2E tests pass

### What Frontend Agent Will Fix

**Files**:
- `policy-radar-frontend/components/policy-filters.tsx`
- `policy-radar-frontend/components/ui/policy-row.tsx`
- `policy-radar-frontend/components/policy-header.tsx`

**Fix**: Add missing `data-testid` attributes

### Your Action

**After Frontend Agent adds test IDs**:

1. **Run E2E tests**:
   ```bash
   cd policy-radar-frontend
   npx playwright test -v
   ```

2. **Verify these 5 tests pass**:
   - ✅ `filter flow - apply filters`
   - ✅ `filter flow - clear filters`
   - ✅ `sort flow - change sort option`
   - ✅ `sort flow - change sort order`
   - ✅ `empty states - no results message` (after you fix selector)

3. **Check E2E test status**:
   ```bash
   npx playwright test -v
   ```

**Expected Result**: E2E tests 5/30 → **11/30 (37%)** ✅

---

## 🟠 HIGH PRIORITY 4: Verify Golden Tests (After Backend Modules)

**Status**: ⏳ **Waiting for Backend Agent**  
**Time**: ~30 minutes  
**Impact**: Verify all 23 golden tests pass

### What Backend Agent Will Implement

1. **Classification Module** (`app/core/classify.py`)
2. **Scoring Module** (`app/core/scoring.py`)

### Your Action

**After Backend Agent implements modules**:

1. **Run classification tests**:
   ```bash
   cd PolicyRadar-backend
   source venv/bin/activate
   pytest tests/unit/test_classify.py -v
   ```
   **Expected**: 7/7 passing ✅

2. **Run scoring tests**:
   ```bash
   pytest tests/unit/test_scoring.py -v
   ```
   **Expected**: 16/16 passing ✅

3. **Run all golden tests**:
   ```bash
   pytest tests/unit/ -v
   ```
   **Expected**: 23/23 passing ✅

---

## 📊 Expected Progress After All Fixes

### Current State
```
Coverage: [████████████░░░░░░░░░░░░░░] 47.9% (46/96)
├── Contract: [████████████████████░░░] 88.9% (24/27)
├── Golden:   [████░░░░░░░░░░░░░░░░░░░] 30.4% (7/23)
├── Integration: [████████████░░░░░░░░] 68.8% (11/16)
└── E2E:      [██░░░░░░░░░░░░░░░░░░░░░] 16.7% (5/30)
```

### After Your Selector Fix
```
E2E:      [███░░░░░░░░░░░░░░░░░░░░░] 20% (6/30)
Coverage: [████████████░░░░░░░░░░░░] 48.9% (47/96)
```

### After Backend Pipeline Fix
```
Integration: [████████████████████░░] 93.8% (15/16)
Coverage: [███████████████░░░░░░░░░] 51.0% (49/96)
```

### After Frontend Test ID Fix
```
E2E:      [████░░░░░░░░░░░░░░░░░░░░] 37% (11/30)
Coverage: [███████████████░░░░░░░░░] 52.1% (50/96)
```

### After Golden Tests Complete
```
Golden:   [████████████████████████] 100% (23/23)
Coverage: [████████████████████░░░░] 78.1% (75/96)
```

---

## 📋 Development Workflow

### Immediate Actions

1. **Fix test selector NOW** (Priority 1 - 5 min)
2. **Wait for Backend Agent** - Pipeline fix (30 min)
3. **Wait for Frontend Agent** - Test IDs fix (15 min)
4. **Verify Backend fix** - Integration tests (10 min)
5. **Verify Frontend fix** - E2E tests (10 min)
6. **Verify Golden tests** - After Backend modules (30 min)

### Test Commands Summary

```bash
# Test selector fix (now)
cd policy-radar-frontend
npx playwright test policy-feed.spec.ts -v

# Integration tests (after backend fix)
cd PolicyRadar-backend
source venv/bin/activate
export TEST_DATABASE_URL=postgresql://sharath@localhost:5432/policyradar_test
pytest tests/integration/test_versioning.py -v

# E2E tests (after frontend fix)
cd policy-radar-frontend
npx playwright test -v

# Golden tests (after backend modules)
cd PolicyRadar-backend
source venv/bin/activate
pytest tests/unit/ -v

# Full test suite
cd PolicyRadar-backend
source venv/bin/activate
pytest tests/ -v --tb=short
```

---

## 🚨 Critical Reminders

### COORDINATION
- ✅ Fix test selector immediately (5 min)
- ✅ Wait for Backend Agent to fix pipeline matching
- ✅ Wait for Frontend Agent to add test IDs
- ✅ Verify fixes as soon as they're done
- ✅ Document all test results

### TEST INFRASTRUCTURE
- ✅ Fix test infrastructure issues (selectors, etc.)
- ✅ Don't fix backend/frontend code (coordinate with agents)
- ✅ Verify test results accurately
- ✅ Update test status documents

### DOCUMENTATION
- ✅ Update test status after each verification
- ✅ Document any new issues found
- ✅ Share test results with other agents
- ✅ Update master coordination plan

---

## 🚀 After Completing Each Priority

1. **Run relevant tests**
2. **Verify results** - Check test counts match expected
3. **Document results** - Update test status documents
4. **Notify agents** - Share results with Backend/Frontend
5. **Commit and push**: 
   ```bash
   git add .
   git commit -m "test: fix selector / verify backend fix / verify frontend fix"
   git push origin main
   ```

---

## 📚 Reference Documents

- **Your Analysis**: `TESTING_AGENT_FINAL_SUMMARY.md`
- **Action Plan**: `UPDATED_ACTION_PLAN.md`
- **Master Plan**: `MASTER_COORDINATION_PLAN.md`
- **Integration Analysis**: `INTEGRATION_TEST_FAILURE_ANALYSIS.md`
- **Smoke Test Analysis**: `SMOKE_TEST_AND_FAILURE_ANALYSIS.md`

---

**Start with Priority 1 (Test Selector Fix) - can do this immediately (5 min)!**

**Then coordinate with Backend and Frontend Agents to verify their fixes.**

**Run tests continuously and document results!** 🧪✅

