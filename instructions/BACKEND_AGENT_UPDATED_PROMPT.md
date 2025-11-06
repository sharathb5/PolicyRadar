# Backend Agent - Updated Prompt (Based on Testing Agent Final Summary)

**Copy and paste this entire prompt to the Backend Agent**

---

You are the Backend Agent for Policy Radar. Based on the Testing Agent's final summary, you have **CRITICAL priority work** that will fix 4 integration tests immediately.

## 🎯 Current Status

**Overall Coverage**: 47.9% (46/96 tests passing) ✅ **Improved +13.5%!**

**Current Test Status**:
- ✅ Contract Tests: 24/27 passing (88.9%)
- ⏳ Golden Tests: 7/23 passing (30.4%) - Need classification/scoring modules
- 🔄 **Integration Tests: 11/16 passing (68.8%)** - **4 tests failing due to pipeline matching logic** 🔴
- 🔄 E2E Tests: 5/30 passing (16.7%)

---

## 🔴 CRITICAL PRIORITY 1: Fix Pipeline Matching Logic (URGENT)

**Status**: 🔴 **BLOCKING 4 INTEGRATION TESTS**  
**Time**: ~30 minutes  
**Impact**: Integration tests 11/16 → **15/16 (93.8%)** → Coverage 47.9% → **51.0%** (+3.1%)

### Problem Identified by Testing Agent

**Root Cause**:
- Pipeline checks for existing policies by `content_hash` ONLY
- When `title_raw` or `summary_raw` changes, `content_hash` changes
- Pipeline treats it as NEW policy and inserts it (version=1)
- Should check by `source_item_id` for updates (version increment)

**Expected Behavior**:
- Same `source_item_id` with different content → UPDATE existing policy
- Different `normalized_hash` → Version increment
- `PolicyChangesLog` entry created

**Actual Behavior** (WRONG):
- Different `content_hash` → Pipeline treats as new item
- Inserts new policy (version=1) instead of updating
- No version increment
- No `PolicyChangesLog` entry

### Fix Required

**File to Fix**: `PolicyRadar-backend/app/ingest/pipeline.py`

**Method to Update**: `_process_item` (or equivalent method that processes ingested items)

**Required Logic Change**:

```python
# CURRENT LOGIC (WRONG):
# 1. Check by content_hash only
# 2. If not found, insert new

# CORRECT LOGIC (NEEDED):
def _process_item(self, item: dict, source: str):
    """
    Process an ingested item:
    1. Check by content_hash (exact duplicate) → skip
    2. Check by source + source_item_id (same item, updated content) → UPDATE with version increment
    3. If not found at all → INSERT new
    """
    db = self.db
    
    # Step 1: Check by content_hash (exact duplicate)
    content_hash = compute_content_hash(item)
    existing_by_hash = db.query(Policy).filter(
        Policy.content_hash == content_hash
    ).first()
    
    if existing_by_hash:
        # Exact duplicate, skip
        return {"action": "skipped", "reason": "duplicate_content_hash"}
    
    # Step 2: Check by source + source_item_id (same item, updated content)
    source_item_id = item.get("source_item_id") or item.get("id")
    existing_by_source_id = db.query(Policy).filter(
        Policy.source == source,
        Policy.source_item_id == source_item_id
    ).first()
    
    if existing_by_source_id:
        # Same item, updated content → UPDATE with version increment
        normalized_hash = compute_normalized_hash(item)
        
        if existing_by_source_id.normalized_hash != normalized_hash:
            # Content changed → version increment
            old_version = existing_by_source_id.version
            new_version = old_version + 1
            
            # Create policy_changes_log entry
            changes_log = PolicyChangesLog(
                policy_id=existing_by_source_id.id,
                version_from=old_version,
                version_to=new_version,
                change_type="content_update",
                changes_summary=f"Content updated from version {old_version} to {new_version}"
            )
            db.add(changes_log)
            
            # Update existing policy
            # ... update all fields from item ...
            existing_by_source_id.version = new_version
            existing_by_source_id.normalized_hash = normalized_hash
            # ... update other fields ...
            
            db.commit()
            
            return {"action": "updated", "version": new_version, "policy_id": existing_by_source_id.id}
        else:
            # Same normalized hash, no change
            return {"action": "skipped", "reason": "same_normalized_hash"}
    
    # Step 3: Not found → INSERT new
    new_policy = Policy(
        source=source,
        source_item_id=source_item_id,
        content_hash=content_hash,
        normalized_hash=compute_normalized_hash(item),
        version=1,
        # ... other fields from item ...
    )
    db.add(new_policy)
    db.commit()
    
    return {"action": "inserted", "version": 1, "policy_id": new_policy.id}
```

### Tests This Will Fix

After this fix, these 4 tests should pass:
- ✅ `test_different_normalized_hash_version_increment`
- ✅ `test_normalized_hash_change_triggers_version_increment`
- ✅ `test_previous_version_data_preserved`
- ✅ `test_policy_changes_log_populated`

### Test Command

```bash
cd PolicyRadar-backend
source venv/bin/activate
export TEST_DATABASE_URL=postgresql://sharath@localhost:5432/policyradar_test
pytest tests/integration/test_versioning.py -v --tb=short
```

**Expected Result**: 4 more tests passing (11/16 → 15/16) ✅

---

## 🟠 HIGH PRIORITY 2: Implement Classification Module

**Status**: ⏳ Pending - Blocks 7 golden tests  
**Time**: ~2 hours  
**Impact**: Golden tests 7/23 → 14/23 (60.9%)

### Problem

Golden tests require `app/core/classify.py` but it doesn't exist or is incomplete.

### File to Create

**`PolicyRadar-backend/app/core/classify.py`**

### Requirements

Per `/contracts/scoring.md`, implement classification logic:

1. **Policy type**: Keywords → Disclosure, Pricing, Ban, Incentive, Supply-chain
2. **Scopes**: Text patterns → [1, 2, 3]
3. **Jurisdiction**: Source + text → EU, US-Federal, US-CA, UK, OTHER
4. **Status**: Heuristics → Proposed, Adopted, Effective

### Test Command

```bash
pytest tests/unit/test_classify.py -v
```

**Expected Result**: 7/7 classification tests passing ✅

---

## 🟠 HIGH PRIORITY 3: Implement Scoring Module

**Status**: ⏳ Pending - Blocks remaining 9 golden tests  
**Time**: ~2 hours  
**Impact**: Golden tests 14/23 → 23/23 (100%)

### Problem

Golden tests require `app/core/scoring.py` but it doesn't exist or is incomplete.

### File to Create

**`PolicyRadar-backend/app/core/scoring.py`**

### Requirements

Per `/contracts/scoring.md`, implement 5-factor scoring algorithm:

1. **Mandatory**: +20 vs Voluntary: +10
2. **Time proximity**: ≤12m (+20), 12-24m (+10), >24m (0)
3. **Scope coverage**: S1 (+7), S2 (+7), S3 (+7), capped at 20
4. **Sector breadth**: narrow (+5), medium (+12), cross-sector (+20)
5. **Disclosure complexity**: 0-20
6. **Total score**: Capped at 100

### Test Command

```bash
pytest tests/unit/test_scoring.py -v
```

**Expected Result**: 16/16 scoring tests passing ✅

---

## 📋 Development Workflow

### Test-First Development

1. **Fix pipeline matching logic FIRST** (Priority 1 - 30 min)
2. **Run integration tests** - Verify 4 tests pass
3. **Then implement modules** (Priorities 2 & 3 - 4 hours)
4. **Run golden tests** - Verify all pass
5. **Commit and push** - Include all fixes

### Test Commands (Run After Each Change)

```bash
cd PolicyRadar-backend
source venv/bin/activate

# Integration tests (after Priority 1 fix)
export TEST_DATABASE_URL=postgresql://sharath@localhost:5432/policyradar_test
pytest tests/integration/test_versioning.py -v

# Classification tests (after Priority 2)
pytest tests/unit/test_classify.py -v

# Scoring tests (after Priority 3)
pytest tests/unit/test_scoring.py -v

# Full test suite
pytest tests/ -v --tb=short
```

---

## 🚨 Critical Reminders

### NO HARDCODED VALUES
- ❌ **NO** hardcoded API keys, passwords, tokens, URLs
- ✅ **YES** use `.env` file or environment variables

### FIELD NAME COMPLIANCE
- ✅ All field names must be `snake_case` (e.g., `impact_score`, NOT `impactScore`)
- ✅ All enum values must match `/dictionary.md` exactly (e.g., `US-Federal` with hyphen)

### TEST WHILE DEVELOPING
- ✅ Run tests after EVERY change
- ✅ Verify tests pass before moving to next priority
- ✅ Commit and push incrementally

---

## 🚀 After Completing Priority 1 (Pipeline Fix)

1. **Run integration tests**: `pytest tests/integration/test_versioning.py -v`
2. **Verify**: 4 tests should pass (11/16 → 15/16)
3. **Commit and push**: 
   ```bash
   git add .
   git commit -m "fix: pipeline matching logic - check by source_item_id for updates"
   git push origin main
   ```
4. **Update status**: Notify Testing Agent to verify

---

## 📚 Reference Documents

- **Action Plan**: `UPDATED_ACTION_PLAN.md`
- **Testing Agent Summary**: `TESTING_AGENT_FINAL_SUMMARY.md`
- **Master Plan**: `MASTER_COORDINATION_PLAN.md`
- **Contracts**: `/contracts/scoring.md`, `/contracts/openapi.yml`
- **Dictionary**: `/dictionary.md`

---

**Start with Priority 1 (Pipeline Matching Logic) - this is CRITICAL and only takes 30 minutes!**

**Run tests after EVERY change to ensure progress!** 🧪✅

