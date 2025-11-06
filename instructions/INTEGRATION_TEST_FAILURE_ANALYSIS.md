# Integration Test Failure Analysis

**Date**: 2025-01-XX  
**Status**: 🔍 **Investigating Root Causes**

---

## 📊 Current Test Status

**Integration Tests**: **8/16 passing (50.0%)**

**Passing**: 8 tests  
**Failing**: 7 tests  
**Skipped**: 1 test

---

## 🔍 Failure Analysis

### Issue 1: Version Not Incrementing (4 tests failing)

**Failed Tests**:
- `test_different_normalized_hash_version_increment` (idempotency)
- `test_normalized_hash_change_triggers_version_increment` (versioning)
- `test_previous_version_data_preserved` (versioning)

**Error**:
```
AssertionError: Version should increment from 1 to 2, got 1
```

**Root Cause Analysis**:

The pipeline checks for existing policies by `content_hash`:
```python
existing = self.db.query(Policy).filter(Policy.content_hash == content_hash).first()
```

**Problem**: When we change `title_raw` or `summary_raw`, the `content_hash` changes because it's computed from raw data:
```python
content_hash = compute_content_hash(
    source=source,
    source_item_id=raw_item["source_item_id"],
    title_raw=raw_item["title_raw"],  # ← This changes
    summary_raw=raw_item.get("summary_raw", ""),  # ← This changes
    effective_date_raw=raw_item.get("effective_date_raw")
)
```

**Result**: Different `content_hash` → Pipeline thinks it's a NEW policy → Inserts new instead of updating → Version doesn't increment.

**Expected Behavior**: Pipeline should match by `source_item_id` (or `source + source_item_id`) for updates, not just `content_hash`.

**Fix Required**: Pipeline needs to:
1. First check if policy exists by `content_hash` (exact duplicate)
2. If not found, check by `source + source_item_id` (same item, updated content)
3. If found by source_item_id, update existing policy (version increment)
4. If not found at all, insert new policy

---

### Issue 2: Policy Changes Log Not Populated (1 test failing)

**Failed Test**:
- `test_policy_changes_log_populated`

**Error**:
```
assert result2["items_updated"] > 0
AssertionError: assert 0 > 0
```

**Root Cause**: Same as Issue 1 - because `content_hash` changes, pipeline treats it as a new insert, not an update. Therefore:
- `items_updated` = 0 (no updates happened)
- No `PolicyChangesLog` entry created (only created on updates)

**Fix Required**: Same as Issue 1 - need to match by `source_item_id` for updates.

---

### Issue 3: Pipeline Tests Still Have Status Assertions (3 tests failing)

**Failed Tests**:
- `test_deterministic_pipeline_run`
- `test_ingest_runs_table_populated`
- `test_pipeline_with_frozen_timestamps`

**Error**:
```
KeyError: 'status'
```

**Root Cause**: These tests still have `assert result["status"] == "completed"` assertions that need to be removed.

**Fix Required**: Remove `status` assertions and check `items_inserted`/`items_updated` instead.

---

## 🔧 Root Cause Summary

### Main Issue: Pipeline Matching Logic

**Current Logic** (WRONG):
```
1. Compute content_hash from raw data
2. Check if policy exists by content_hash
3. If exists → update (if normalized_hash changed) or skip
4. If not exists → insert new
```

**Problem**: When raw data changes (title_raw, summary_raw), `content_hash` changes, so pipeline thinks it's a completely new item and inserts it, rather than updating the existing one.

**Correct Logic** (SHOULD BE):
```
1. Compute content_hash from raw data
2. Check if policy exists by content_hash (exact duplicate check)
   - If exists → skip (exact duplicate)
3. If not found by content_hash, check by (source + source_item_id)
   - If exists → update existing (version increment)
   - Compute normalized_hash
   - If normalized_hash changed → version bump + log change
   - If normalized_hash same → no version bump
4. If not found at all → insert new
```

---

## 🚀 Fix Plan

### Fix 1: Update Pipeline Matching Logic

**File**: `PolicyRadar-backend/app/ingest/pipeline.py`

**Current Code** (around line 120):
```python
existing = self.db.query(Policy).filter(Policy.content_hash == content_hash).first()

if existing:
    # Update logic
else:
    # Insert logic
```

**Fix Required**:
```python
# First check by content_hash (exact duplicate)
existing_by_hash = self.db.query(Policy).filter(
    Policy.content_hash == content_hash
).first()

if existing_by_hash:
    # Exact duplicate, skip
    return {"action": "skipped", "policy_id": existing_by_hash.id}

# If not exact duplicate, check by source_item_id (same item, updated content)
existing_by_id = self.db.query(Policy).filter(
    Policy.source == source,
    Policy.source_item_id == raw_item["source_item_id"]
).first()

if existing_by_id:
    # Same item, check if update needed
    normalized_hash = compute_normalized_hash(...)
    
    if existing_by_id.normalized_hash != normalized_hash:
        # Version bump logic
    else:
        # No changes, skip
        return {"action": "skipped", "policy_id": existing_by_id.id}
else:
    # New item, insert
    # Insert logic
```

**Status**: ⏳ **Requires Backend Fix**

---

### Fix 2: Remove Status Assertions from Pipeline Tests

**File**: `tests/integration/test_pipeline.py`

**Fix Required**: Remove all `assert result["status"]` assertions and update to check `items_inserted`/`items_updated`.

**Status**: ✅ **Can Fix Now** (Test Infrastructure Fix)

---

## 📋 Action Items

### For Backend Agent (CRITICAL)

1. **Fix Pipeline Matching Logic** (30 min)
   - Update `_process_item` method to check by `source_item_id` for updates
   - Ensure version increment works correctly
   - Ensure `PolicyChangesLog` is populated

**Impact**: Fixes 4 version-related tests

---

### For Testing Agent (HIGH)

2. **Fix Pipeline Test Status Assertions** (10 min)
   - Remove `assert result["status"]` from test_pipeline.py
   - Update to check `items_inserted`/`items_updated`
   - Add async support where missing

**Impact**: Fixes 3 pipeline tests

---

## 🔍 Detailed Failure Breakdown

### Version Increment Failures (4 tests)

**Tests Affected**:
1. `test_different_normalized_hash_version_increment` (idempotency)
2. `test_normalized_hash_change_triggers_version_increment` (versioning)
3. `test_previous_version_data_preserved` (versioning)
4. Indirectly: `test_policy_changes_log_populated` (versioning)

**Root Cause**: Pipeline checks by `content_hash` only, not by `source_item_id`

**Expected Behavior**:
- Same `source_item_id` with different raw content → Update existing policy
- Different `normalized_hash` → Version increment
- `PolicyChangesLog` entry created

**Actual Behavior**:
- Different `content_hash` → Treats as new item
- Inserts new policy instead of updating
- Version doesn't increment
- No `PolicyChangesLog` entry

---

### Status Assertion Failures (3 tests)

**Tests Affected**:
1. `test_deterministic_pipeline_run`
2. `test_ingest_runs_table_populated`
3. `test_pipeline_with_frozen_timestamps`

**Root Cause**: Tests still check `result["status"]` but pipeline returns `{"items_inserted": ..., "items_updated": ...}`

**Fix**: Remove status assertions, check `items_inserted`/`items_updated` instead

---

## 📊 Expected Results After Fixes

### After Backend Fix (Pipeline Matching)

**Expected**: 4 version-related tests pass
- ✅ `test_different_normalized_hash_version_increment`
- ✅ `test_normalized_hash_change_triggers_version_increment`
- ✅ `test_previous_version_data_preserved`
- ✅ `test_policy_changes_log_populated`

**Coverage**: 8/16 → **12/16 (75%)**

---

### After Test Fix (Status Assertions)

**Expected**: 3 pipeline tests pass
- ✅ `test_deterministic_pipeline_run`
- ✅ `test_ingest_runs_table_populated`
- ✅ `test_pipeline_with_frozen_timestamps`

**Coverage**: 12/16 → **15/16 (93.8%)**

---

### Final Status (After All Fixes)

**Expected**: 15-16/16 tests passing (93.8-100%)

**Coverage**: 50% → **93.8-100%**

---

## 🎯 Summary

**Main Issue**: Pipeline matching logic uses `content_hash` only, needs to also check `source_item_id` for updates.

**Secondary Issue**: Pipeline tests still have old `status` assertions.

**Fix Priority**:
1. **CRITICAL**: Backend needs to fix pipeline matching logic
2. **HIGH**: Testing Agent can fix test assertions now

**Expected Time**: 40 minutes total (30 min backend + 10 min test fixes)

---

**Status**: 🔍 **Root Causes Identified**  
**Next Action**: Coordinate with Backend Agent to fix pipeline matching logic  
**Test Action**: Fix status assertions in pipeline tests

