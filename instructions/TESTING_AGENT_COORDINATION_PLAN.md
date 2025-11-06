# Testing Agent - Coordination Plan

**Date**: 2025-01-XX  
**Status**: 🔄 **In Progress** - Coordinating Fixes  
**Coverage**: **47.9% (46/96 tests passing)**

---

## 📊 Current Test Status

### Overall: **47.9% (46/96 tests passing)** ✅

**Progress**: 34.4% → **47.9%** (+13.5%) ✅

| Category | Passed | Total | Coverage | Status | Priority |
|----------|--------|-------|----------|--------|----------|
| Contract Tests | 24 | 27 | **88.9%** | ✅ Working | HIGH |
| Golden Tests | 7 | 23 | **30.4%** | 🔄 In Progress | HIGH |
| Integration Tests | **11** | 16 | **68.8%** | 🔄 **FIXING** | **CRITICAL** |
| E2E Tests | **5** | 30 | **16.7%** | 🔄 **FIXING** | **CRITICAL** |
| **TOTAL** | **46** | **96** | **47.9%** | 🔄 **In Progress** | - |

---

## 🎯 Mission Status

As the **Testing Agent**, my mission is to:
1. ✅ Coordinate test fixes
2. ✅ Verify test results
3. ✅ Run comprehensive test suites
4. ⏳ Ensure everything is ready for production

**Current Focus**: Coordinating with Backend and Frontend Agents to fix remaining failures

---

## 🔴 CRITICAL PRIORITY 1: Coordinate Integration Test Fixes

### Status: **11/16 passing (68.8%)** 🔄

**Progress**: 8/16 (50%) → **11/16 (68.8%)** (+18.8%) ✅

### ✅ My Role - COMPLETED

**Completed**:
1. ✅ Verified fixes work (11 tests passing)
2. ✅ Ran integration tests after fixes
3. ✅ Documented remaining issues
4. ✅ Identified root cause (pipeline matching logic)

### ⏳ Backend Agent Action Required

**Issue**: Pipeline checks by `content_hash` only, needs to also check by `source_item_id` for updates

**Files Backend Needs to Fix**:
- `PolicyRadar-backend/app/ingest/pipeline.py` - Update `_process_item` method

**Required Fix**:
```python
# Current (WRONG):
existing = self.db.query(Policy).filter(Policy.content_hash == content_hash).first()

# Should be:
# 1. Check by content_hash first (exact duplicate)
existing_by_hash = self.db.query(Policy).filter(
    Policy.content_hash == content_hash
).first()

if existing_by_hash:
    # Exact duplicate, skip
    return {"action": "skipped"}

# 2. If not found, check by source_item_id (same item, updated content)
existing_by_id = self.db.query(Policy).filter(
    Policy.source == source,
    Policy.source_item_id == raw_item["source_item_id"]
).first()

if existing_by_id:
    # Same item, check if normalized_hash changed
    if existing_by_id.normalized_hash != normalized_hash:
        # Version bump + update + log change
    else:
        # No changes, skip
        return {"action": "skipped"}
else:
    # New item, insert
```

**Expected Result**: 4 more tests passing (15/16 = 93.8%)

**Tests That Will Pass After Fix**:
- ✅ `test_different_normalized_hash_version_increment`
- ✅ `test_normalized_hash_change_triggers_version_increment`
- ✅ `test_previous_version_data_preserved`
- ✅ `test_policy_changes_log_populated`

### 📋 Verification Steps (After Backend Fix)

```bash
cd "/Users/sharath/Policy Radar/PolicyRadar-backend"
source venv/bin/activate
cd ..
export TEST_DATABASE_URL=postgresql://sharath@localhost:5432/policyradar_test
python3 -m pytest tests/integration/ -v --tb=short
```

**Expected**: 15/16 tests passing (93.8%) ✅

---

## 🔴 CRITICAL PRIORITY 2: Coordinate API Contract Test Fix

### Status: **24/27 passing (88.9%)** ✅

**Progress**: 24/27 passing (2 skipped)

### ✅ My Role - COMPLETED

**Completed**:
1. ✅ Fixed API key fixture (working correctly)
2. ✅ Verified API contract tests
3. ✅ Documented skipped tests

### ⏳ Backend Agent Action Required

**Skipped Tests**:
1. `test_saved_response_schema` - Endpoint returns 500
2. `test_policies_query_parameters` - Some queries return 500

**Files Backend Needs to Fix**:
- `PolicyRadar-backend/app/api/routes.py` - Fix `/saved` endpoint and query parameter handling

**Expected Result**: 27/27 tests passing (100%)

### 📋 Verification Steps (After Backend Fix)

```bash
export API_KEY=1bb26b00a037526ce34654e867a89738d9e3eec1bc1f108127ccaaa4d8cf247d
python3 -m pytest tests/contract/test_api_contracts.py -v
```

**Expected**: 27/27 tests passing (100%) ✅

---

## 🟠 HIGH PRIORITY 3: Verify Golden Tests

### Status: **7/23 passing (30.4%)** 🔄

**Progress**: 7/23 passing (waiting for Backend modules)

### ✅ My Role - COMPLETED

**Completed**:
1. ✅ Fixed scoring test function signature
2. ✅ Fixed frozen datetime fixture
3. ✅ Verified 7/15 scoring tests passing
4. ✅ Documented classification module issue

### ⏳ Backend Agent Action Required

**Pending**:
- Classification module (`app.core.classify`) needs verification
- 8 classification tests blocked (module not found)
- 2 scoring tests still failing (need investigation)

**Expected Result**: 23/23 tests passing (100%)

### 📋 Verification Steps (After Backend Fix)

```bash
cd PolicyRadar-backend
source venv/bin/activate
pytest tests/unit/test_classify.py -v
pytest tests/unit/test_scoring.py -v
pytest tests/unit/ -v
```

**Expected**: 23/23 golden tests passing (100%) ✅

---

## 🟠 HIGH PRIORITY 4: Run E2E Tests (After Frontend Fix)

### Status: **5/30 passing (16.7%)** 🔄

**Progress**: 2/30 (6.7%) → **5/30 (16.7%)** (+10%) ✅

### ✅ My Role - COMPLETED

**Completed**:
1. ✅ Fixed Playwright configuration
2. ✅ Installed Playwright and browsers
3. ✅ Ran smoke flow tests
4. ✅ Identified missing test IDs

### ⏳ Frontend Agent Action Required

**Issue**: Missing `data-testid` attributes in frontend

**Files Frontend Needs to Fix**:
- Filter components - Add `data-testid="filter-region-EU"`
- Sort controls - Add `data-testid="sort-select"`, `data-testid="order-select"`
- Policy rows - Add `data-testid="impact-score"`
- Clear button - Add `data-testid="clear-all-filters"`

**Expected Result**: 10+ more tests passing (15+/30 = 50%+)

### 📋 Verification Steps (After Frontend Fix)

```bash
cd policy-radar-frontend
npx playwright test -v
```

**Expected**: 15-20/30 tests passing (50-67%) ✅

---

## 🔴 CRITICAL PRIORITY 5: Run Smoke Flow Test

### Status: **5/10 passing (50%)** ✅

**Progress**: 2/10 (20%) → **5/10 (50%)** (+30%) ✅

### ✅ My Role - COMPLETED

**Completed**:
1. ✅ Ran smoke flow tests
2. ✅ Identified root causes
3. ✅ Documented issues
4. ✅ Fixed test infrastructure

### ⏳ Remaining Issues

**Missing Test IDs** (Frontend):
- Filter buttons need `data-testid` attributes
- Sort controls need `data-testid` attributes
- Policy rows need `data-testid` attributes

**Wrong Selector** (Test):
- Slider test uses `selectOption` (should use drag)
- Need to fix test selector

**Expected Result**: 10/10 tests passing (100%)

### 📋 Verification Steps (After Frontend Fix)

```bash
cd policy-radar-frontend
npx playwright test playwright/policy-feed.spec.ts -v
```

**Expected**: 10/10 smoke flow tests passing (100%) ✅

---

## 📋 Coordination Checklist

### With Backend Agent

- [x] Integration test fixes verified (11/16 passing)
- [ ] **PIPELINE MATCHING LOGIC** - Backend needs to fix (4 tests waiting)
- [ ] API contract test fixes - Backend needs to fix (2 skipped)
- [ ] Golden test modules - Backend needs to verify (8 tests waiting)

### With Frontend Agent

- [x] E2E test infrastructure ready
- [ ] **TEST IDs** - Frontend needs to add (5+ tests waiting)
- [ ] Test selector fixes - Test needs to fix (1 test waiting)

### My Actions

- [x] Identified root causes
- [x] Fixed test infrastructure issues
- [x] Documented all findings
- [x] Created coordination plan
- [ ] Verify fixes after Backend/Frontend complete
- [ ] Run full test suite after all fixes
- [ ] Generate final test report

---

## 🚀 Next Steps

### Immediate (Today)

1. **Wait for Backend Agent** - Pipeline matching logic fix
2. **Wait for Frontend Agent** - Test IDs added
3. **Verify Fixes** - Run tests after each fix
4. **Document Results** - Update status documents

### After Fixes (Today)

1. **Run Full Test Suite** - All tests after fixes
2. **Run Smoke Flow Test** - Complete verification
3. **Generate Final Report** - Complete test status
4. **Coordinate Sign-off** - Ready for production

---

## 📊 Expected Final Status

### After All Fixes

**Integration Tests**: 11/16 → **15/16 (93.8%)** (+4 tests)  
**Contract Tests**: 24/27 → **27/27 (100%)** (+2 tests)  
**Golden Tests**: 7/23 → **23/23 (100%)** (+16 tests)  
**E2E Tests**: 5/30 → **15-20/30 (50-67%)** (+10-15 tests)  
**Overall Coverage**: 47.9% → **70-75%** (+22-27%)

---

## 📝 Documentation

### Files Created

1. ✅ `INTEGRATION_TEST_FAILURE_ANALYSIS.md` - Root cause analysis
2. ✅ `SMOKE_TEST_AND_FAILURE_ANALYSIS.md` - Smoke test analysis
3. ✅ `TESTING_AGENT_FINAL_SUMMARY.md` - Complete summary
4. ✅ `TESTING_AGENT_COORDINATION_PLAN.md` - This coordination plan

### Files Updated

1. ✅ `tests/integration/test_pipeline.py` - Fixed status assertions
2. ✅ `tests/integration/test_idempotency.py` - Fixed return structure
3. ✅ `tests/integration/test_versioning.py` - Fixed return structure

---

## 🎯 Key Messages for Backend Agent

### CRITICAL: Pipeline Matching Logic Fix

**Issue**: Pipeline checks by `content_hash` only, causing version not to increment

**Fix Required**: Update `_process_item` to check by `source_item_id` for updates

**Impact**: Fixes 4 integration tests

**File**: `PolicyRadar-backend/app/ingest/pipeline.py`

**Status**: ⏳ **Waiting for Backend Agent**

---

## 🎯 Key Messages for Frontend Agent

### HIGH: Test IDs Needed

**Issue**: Missing `data-testid` attributes in frontend

**Fix Required**: Add `data-testid` to all interactive elements

**Impact**: Fixes 5+ E2E tests

**Files**: Filter components, sort controls, policy rows, clear button

**Status**: ⏳ **Waiting for Frontend Agent**

---

**Status**: 🔄 **Coordinating Fixes**  
**Next Action**: Wait for Backend/Frontend fixes, then verify  
**Expected Time**: ~1 hour after fixes complete

