# Smoke Test & Integration Failure Analysis

**Date**: 2025-01-XX  
**Status**: 🔍 **Analysis Complete** - Root Causes Identified

---

## 📊 Current Test Status

### Overall: **42.7% (41/96 tests passing)**

| Category | Passed | Total | Coverage | Status |
|----------|--------|-------|----------|--------|
| Contract Tests | 24 | 27 | 88.9% | ✅ Working |
| Golden Tests | 7 | 23 | 30.4% | 🔄 In Progress |
| Integration Tests | **8** | 16 | **50.0%** | 🔄 **FIXING** |
| E2E Tests | **5** | 30 | **16.7%** | 🔄 **IMPROVING** |

---

## 🔍 Integration Test Failure Analysis

### Current Status: **8/16 passing (50.0%)**

**Passing**: 8 tests  
**Failing**: 7 tests  
**Skipped**: 1 test

---

## ❌ Root Causes Identified

### Issue 1: Version Not Incrementing (4 tests) 🔴

**Failed Tests**:
- `test_different_normalized_hash_version_increment` (idempotency)
- `test_normalized_hash_change_triggers_version_increment` (versioning)
- `test_previous_version_data_preserved` (versioning)
- `test_policy_changes_log_populated` (versioning - indirectly)

**Error**:
```
AssertionError: Version should increment from 1 to 2, got 1
assert 1 == (1 + 1)
```

**Root Cause**:

The pipeline checks for existing policies by `content_hash` ONLY:

```python
existing = self.db.query(Policy).filter(Policy.content_hash == content_hash).first()
```

**Problem**: When we change `title_raw` or `summary_raw`, the `content_hash` changes:
```python
content_hash = compute_content_hash(
    source=source,
    source_item_id=raw_item["source_item_id"],
    title_raw=raw_item["title_raw"],  # ← Changes when title changes
    summary_raw=raw_item.get("summary_raw", ""),  # ← Changes when summary changes
    effective_date_raw=raw_item.get("effective_date_raw")
)
```

**Result**: 
- Different `content_hash` → Pipeline thinks it's a NEW policy
- Inserts new policy instead of updating existing one
- Version doesn't increment (because it's a new insert, not update)

**Expected Behavior**:
- Same `source_item_id` with different raw content → Should UPDATE existing policy
- Different `normalized_hash` → Version should increment
- `PolicyChangesLog` entry should be created

**Actual Behavior**:
- Different `content_hash` → Pipeline treats as new item
- Inserts new policy (version=1) instead of updating
- No version increment
- No `PolicyChangesLog` entry

**Fix Required** (Backend):

Pipeline needs to check by `source_item_id` (or `source + source_item_id`) for updates:

```python
# First check by content_hash (exact duplicate)
existing_by_hash = self.db.query(Policy).filter(
    Policy.content_hash == content_hash
).first()

if existing_by_hash:
    # Exact duplicate, skip
    return {"action": "skipped"}

# If not exact duplicate, check by source_item_id (same item, updated content)
existing_by_id = self.db.query(Policy).filter(
    Policy.source == source,
    Policy.source_item_id == raw_item["source_item_id"]
).first()

if existing_by_id:
    # Same item, check if normalized_hash changed
    normalized_hash = compute_normalized_hash(...)
    
    if existing_by_id.normalized_hash != normalized_hash:
        # Version bump + update + log change
    else:
        # No changes, skip
        return {"action": "skipped"}
else:
    # New item, insert
```

---

### Issue 2: Policy Changes Log Not Populated (1 test) 🔴

**Failed Test**: `test_policy_changes_log_populated`

**Error**:
```
assert result2["items_updated"] > 0
AssertionError: assert 0 > 0
```

**Root Cause**: Same as Issue 1 - because `content_hash` changes, pipeline treats as new insert, not update. Therefore:
- `items_updated` = 0 (no updates happened)
- No `PolicyChangesLog` entry created (only created on updates)

**Fix**: Same as Issue 1 - need to match by `source_item_id` for updates

---

### Issue 3: Pipeline Tests Status Assertions (3 tests) 🟠

**Failed Tests**:
- `test_deterministic_pipeline_run`
- `test_ingest_runs_table_populated`
- `test_pipeline_with_frozen_timestamps`

**Error**:
```
KeyError: 'status'
```

**Root Cause**: Tests still check `result["status"] == "completed"` but pipeline returns `{"items_inserted": ..., "items_updated": ...}`

**Fix**: ✅ **Fixed** - Removed status assertions, updated to check `items_inserted`/`items_updated`

**Status**: ✅ **Fixed in test_pipeline.py**

---

## 🧪 Smoke Flow Test Status

### Current Status: **5/10 tests passing (50%)**

**Progress**: 2/10 (20%) → **5/10 (50%)** ✅

**Passing Tests**:
1. ✅ `displays policy list`
2. ✅ `loading states - skeletons display`
3. ✅ `sort flow - verify results displayed in correct order`
4. ✅ `active filter chips display correctly`
5. ✅ `clear all button resets filters`

**Failing Tests** (Missing Test IDs):
1. ❌ `filter flow - apply filters` - Missing `data-testid="filter-region"`
2. ❌ `filter flow - clear filters` - Missing `data-testid="filter-region-EU"`
3. ❌ `sort flow - change sort option` - Missing `data-testid="sort-select"`
4. ❌ `sort flow - change sort order` - Missing `data-testid="order-select"`
5. ❌ `empty states - no results message` - Missing test IDs + wrong selector (slider)

**Issues Found**:
- Missing `data-testid` attributes in frontend
- Wrong selector in test (`selectOption` for slider instead of drag)

---

## 🔧 Fixes Applied

### ✅ Fixed: Pipeline Test Status Assertions

**Status**: ✅ **COMPLETE**

**Changes**:
- Removed all `assert result["status"] == "completed"` assertions
- Updated to check `items_inserted`/`items_updated` instead
- Updated error handling assertions to check `errors` list

**Files Fixed**:
- `tests/integration/test_pipeline.py`

**Expected**: 3 more tests passing after this fix

---

## 🔧 Fixes Needed

### 🔴 CRITICAL: Backend Pipeline Matching Logic (4 tests)

**Issue**: Pipeline checks by `content_hash` only, needs to also check by `source_item_id` for updates

**Fix Required**: Update `PolicyRadar-backend/app/ingest/pipeline.py`:
1. Check by `content_hash` first (exact duplicate)
2. If not found, check by `source + source_item_id` (same item, updated content)
3. If found by `source_item_id`, update existing (version increment)
4. If not found at all, insert new

**Impact**: Fixes 4 version-related tests

**Status**: ⏳ **Needs Backend Fix**

---

### 🟠 HIGH: Frontend Test IDs (5 E2E tests)

**Issue**: Missing `data-testid` attributes

**Fix Required**: Add `data-testid` attributes to:
- Filter buttons: `data-testid="filter-region-EU"`
- Sort controls: `data-testid="sort-select"`, `data-testid="order-select"`
- Policy rows: `data-testid="impact-score"`
- Clear button: `data-testid="clear-all-filters"`

**Impact**: Fixes 5 E2E tests

**Status**: ⏳ **Needs Frontend Fix**

---

### 🟡 MEDIUM: Test Selector Fix (1 E2E test)

**Issue**: Test uses `selectOption` for slider (should use drag)

**Fix Required**: Update test to drag slider instead of `selectOption`

**Impact**: Fixes 1 E2E test

**Status**: ✅ **Can Fix Now** (Test fix)

---

## 📊 Expected Results After Fixes

### After Backend Fix (Pipeline Matching)

**Expected**: 4 more integration tests passing
- ✅ `test_different_normalized_hash_version_increment`
- ✅ `test_normalized_hash_change_triggers_version_increment`
- ✅ `test_previous_version_data_preserved`
- ✅ `test_policy_changes_log_populated`

**Integration Tests**: 8/16 → **12/16 (75%)**

---

### After Frontend Fix (Test IDs)

**Expected**: 5 more E2E tests passing
- ✅ `filter flow - apply filters`
- ✅ `filter flow - clear filters`
- ✅ `sort flow - change sort option`
- ✅ `sort flow - change sort order`
- ✅ `empty states - no results message` (after selector fix)

**E2E Tests**: 5/30 → **10/30 (33%)**

---

### After Test Selector Fix

**Expected**: 1 more E2E test passing
- ✅ `empty states - no results message`

**E2E Tests**: 10/30 → **11/30 (37%)**

---

### Final Status (After All Fixes)

**Integration Tests**: 8/16 → **12/16 (75%)**  
**E2E Tests**: 5/30 → **11/30 (37%)**  
**Overall Coverage**: 42.7% → **54.2%** (+11.5%)

---

## 🚀 Next Steps

### CRITICAL (30 min)

1. **Coordinate with Backend Agent** - Fix pipeline matching logic
   - Update `_process_item` to check by `source_item_id` for updates
   - Ensure version increment works
   - Ensure `PolicyChangesLog` populated

### HIGH (15 min)

2. **Coordinate with Frontend Agent** - Add test IDs
   - Add `data-testid` to all filter buttons
   - Add `data-testid` to sort controls
   - Add `data-testid` to policy rows

### MEDIUM (5 min)

3. **Fix Test Selector** - Update slider test
   - Change `selectOption` to drag action
   - Fix empty states test

---

## 📋 Summary

### Root Causes

1. **Pipeline Matching Logic** (Backend) 🔴
   - Checks by `content_hash` only
   - Should check by `source_item_id` for updates
   - Impact: 4 tests failing

2. **Missing Test IDs** (Frontend) 🟠
   - Need `data-testid` attributes
   - Impact: 5 tests failing

3. **Wrong Selector** (Test) 🟡
   - Using `selectOption` for slider
   - Should use drag action
   - Impact: 1 test failing

### Fixes Applied

1. ✅ **Pipeline Test Assertions** - Fixed status assertions

### Fixes Needed

1. ⏳ **Pipeline Matching** - Backend fix required
2. ⏳ **Test IDs** - Frontend fix required
3. ⏳ **Test Selector** - Test fix required

---

**Status**: 🔍 **Root Causes Identified**  
**Next Action**: Coordinate fixes with Backend and Frontend Agents  
**Expected Time**: ~50 minutes (30 min backend + 15 min frontend + 5 min test)

