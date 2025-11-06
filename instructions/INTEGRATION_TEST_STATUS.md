# Integration Test Status & How It Works

**Date**: 2025-01-XX  
**Status**: 🔄 Improving | ✅ Infrastructure Ready

---

## 📊 Current Test Status

### Overall: **47.9% (46/96 tests passing)**

| Category | Passed | Total | Coverage | Status |
|----------|--------|-------|----------|--------|
| Contract Tests | 24 | 27 | 88.9% | ✅ Working |
| Golden Tests | 7 | 23 | 30.4% | 🔄 In Progress |
| **Integration Tests** | **11** | **16** | **68.8%** | 🔄 **4 failing** |
| E2E Tests | 5 | 30 | 16.7% | 🔄 Improving |

---

## 🔍 Integration Test Current State

### Execution Results

```
✅ Passing: 11 tests
❌ Failing: 4 tests
⏭ Skipped: 1 test
```

Failing tests (all due to versioning/matching logic):
- `test_different_normalized_hash_version_increment`
- `test_normalized_hash_change_triggers_version_increment`
- `test_policy_changes_log_populated`
- `test_previous_version_data_preserved`

---

## ❌ Root Cause: Matching by content_hash only

Pipeline matches existing policies by `content_hash` only. When raw content changes (e.g., title_raw), `content_hash` changes and the pipeline inserts a new policy instead of updating (no version bump, no change log).

Required behavior:
- If `content_hash` matches → skip (exact duplicate)
- Else lookup by `(source, source_item_id)` → if found, compare `normalized_hash`:
  - If changed → increment version and append `PolicyChangesLog`
  - If same → skip
- Else insert new

---

## 🔧 How Integration Tests Work (reference)

```
Integration Tests
├── Setup: create tables, session
├── Run Pipeline: IngestionPipeline(db).run(source)
├── Verify: counts, versions, change logs
└── Cleanup: rollback, drop tables
```

---

## 🚀 Quick Fix Summary

- Update `app/ingest/pipeline.py::_process_item` to:
  1) Check by `content_hash` (duplicate → skip)
  2) Else check by `(source, source_item_id)` (update path)
  3) Use `normalized_hash` to decide version bump and create `PolicyChangesLog`
- Keep return structure: `{items_fetched, items_inserted, items_updated, errors}`

Expected after fix: **15/16 (93.8%)** integration tests passing.

---

## 🧪 Commands

```bash
export TEST_DATABASE_URL=postgresql://sharath@localhost:5432/policyradar_test
python3 -m pytest tests/integration/ -v --tb=short
```

---

**Status**: 🔄 In progress — waiting on backend pipeline fix to reach 93.8% integration pass rate.

