# Backend Agent - CRITICAL Pipeline Fix Task

**Copy and paste this entire prompt to the Backend Agent**

---

You are the Backend Agent for Policy Radar. You have a **CRITICAL priority task** that will fix 4 integration tests immediately.

## 🎯 Current Status

**Overall Coverage**: 47.9% (46/96 tests passing)

**Integration Tests**: 11/16 passing (68.8%) - **4 tests failing** 🔴

**Problem**: Pipeline matching logic is wrong - it checks by `content_hash` only, not by `source_item_id` for updates.

---

## 🔴 CRITICAL TASK: Fix Pipeline Matching Logic

**Status**: 🔴 **BLOCKING 4 INTEGRATION TESTS**  
**Time**: ~30 minutes  
**Impact**: Integration tests 11/16 → **15/16 (93.8%)** ✅

### Problem

The Testing Agent identified the root cause:

**Current Behavior (WRONG)**:
- Pipeline checks for existing policies by `content_hash` ONLY
- When `title_raw` or `summary_raw` changes, `content_hash` changes
- Pipeline treats it as NEW policy and inserts it (version=1)
- No version increment
- No `PolicyChangesLog` entry

**Expected Behavior (CORRECT)**:
- Same `source_item_id` with different content → UPDATE existing policy
- Different `normalized_hash` → Version increment
- `PolicyChangesLog` entry created

### Fix Required

**File to Fix**: `PolicyRadar-backend/app/ingest/pipeline.py`

**Method to Update**: `_process_item` (or equivalent method that processes ingested items)

### Required Logic Change

```python
def _process_item(self, raw_item: dict, source: str):
    """
    Process an ingested item with correct matching logic:
    1. Check by content_hash (exact duplicate) → skip
    2. Check by source + source_item_id (same item, updated content) → UPDATE with version increment
    3. If not found at all → INSERT new
    """
    db = self.db
    
    # Calculate hashes
    content_hash = compute_content_hash(raw_item)
    normalized_hash = compute_normalized_hash(raw_item)
    source_item_id = raw_item.get("source_item_id") or raw_item.get("id")
    
    # Step 1: Check by content_hash (exact duplicate)
    existing_by_hash = db.query(Policy).filter(
        Policy.content_hash == content_hash
    ).first()
    
    if existing_by_hash:
        # Exact duplicate, skip
        return {"action": "skipped", "reason": "duplicate_content_hash"}
    
    # Step 2: Check by source + source_item_id (same item, updated content)
    if source_item_id:
        existing_by_id = db.query(Policy).filter(
            Policy.source == source,
            Policy.source_item_id == source_item_id
        ).first()
        
        if existing_by_id:
            # Same item, check if normalized_hash changed
            if existing_by_id.normalized_hash != normalized_hash:
                # Content changed → version increment
                old_version = existing_by_id.version
                new_version = old_version + 1
                
                # Create policy_changes_log entry
                from app.models.policy import PolicyChangesLog
                changes_log = PolicyChangesLog(
                    policy_id=existing_by_id.id,
                    version_from=old_version,
                    version_to=new_version,
                    change_type="content_update",
                    changes_summary=f"Content updated from version {old_version} to {new_version}"
                )
                db.add(changes_log)
                
                # Update existing policy with new content
                # Update all fields from raw_item
                existing_by_id.content_hash = content_hash
                existing_by_id.normalized_hash = normalized_hash
                existing_by_id.version = new_version
                existing_by_id.title_raw = raw_item.get("title_raw")
                existing_by_id.summary_raw = raw_item.get("summary_raw")
                # ... update other fields from raw_item ...
                
                db.commit()
                
                return {
                    "action": "updated",
                    "version": new_version,
                    "policy_id": existing_by_id.id,
                    "version_from": old_version
                }
            else:
                # Same normalized hash, no change
                return {"action": "skipped", "reason": "same_normalized_hash"}
    
    # Step 3: Not found → INSERT new
    new_policy = Policy(
        source=source,
        source_item_id=source_item_id,
        content_hash=content_hash,
        normalized_hash=normalized_hash,
        version=1,
        title_raw=raw_item.get("title_raw"),
        summary_raw=raw_item.get("summary_raw"),
        # ... other fields from raw_item ...
    )
    db.add(new_policy)
    db.commit()
    
    return {
        "action": "inserted",
        "version": 1,
        "policy_id": new_policy.id
    }
```

### Key Changes

1. ✅ **Check by content_hash first** - Skip exact duplicates
2. ✅ **Check by source + source_item_id** - Find same item with updated content
3. ✅ **Compare normalized_hash** - If different, update with version increment
4. ✅ **Create PolicyChangesLog entry** - Log the version change
5. ✅ **Update existing policy** - Don't insert new one
6. ✅ **Insert only if not found** - New item

### Tests This Will Fix

After this fix, these 4 tests should pass:
- ✅ `test_different_normalized_hash_version_increment`
- ✅ `test_normalized_hash_change_triggers_version_increment`
- ✅ `test_previous_version_data_preserved`
- ✅ `test_policy_changes_log_populated`

### Test Command

```bash
cd "/Users/sharath/Policy Radar"
cd PolicyRadar-backend
source venv/bin/activate
cd ..
export TEST_DATABASE_URL=postgresql://sharath@localhost:5432/policyradar_test
pytest tests/integration/test_versioning.py -v --tb=short
```

**Expected Result**: 4 more tests passing (11/16 → 15/16) ✅

### Verification Command

```bash
# Run all integration tests
pytest tests/integration/ -v

# Expected: 15/16 passing (93.8%)
```

---

## 📋 Development Workflow

1. **Open file**: `PolicyRadar-backend/app/ingest/pipeline.py`
2. **Find method**: `_process_item` (or equivalent)
3. **Update logic**: Add source_item_id check
4. **Test immediately**: Run integration tests
5. **Verify**: 4 tests should pass
6. **Commit and push**:
   ```bash
   git add .
   git commit -m "fix: pipeline matching logic - check by source_item_id for updates with version increment"
   git push origin main
   ```

---

## 🚨 Critical Reminders

### NO HARDCODED VALUES
- ❌ **NO** hardcoded API keys, passwords, tokens, URLs
- ✅ **YES** use `.env` file or environment variables

### TEST WHILE DEVELOPING
- ✅ Run tests after EVERY change
- ✅ Verify tests pass before committing
- ✅ Test with: `pytest tests/integration/test_versioning.py -v`

---

## 🚀 After Completing Fix

1. **Run integration tests**: `pytest tests/integration/test_versioning.py -v`
2. **Verify**: 4 tests should pass (11/16 → 15/16)
3. **Commit and push**: Include fix and test results
4. **Update status**: Notify Testing Agent to verify

---

## 📚 Reference Documents

- **Testing Agent Summary**: `TESTING_AGENT_COORDINATION_PLAN.md`
- **Integration Analysis**: `INTEGRATION_TEST_FAILURE_ANALYSIS.md`
- **Action Plan**: `UPDATED_ACTION_PLAN.md`
- **Master Plan**: `MASTER_COORDINATION_PLAN.md`

---

**This is CRITICAL - Fix this first! Only takes ~30 minutes and fixes 4 tests!** 🚀

**Run tests after EVERY change to ensure progress!** 🧪✅

