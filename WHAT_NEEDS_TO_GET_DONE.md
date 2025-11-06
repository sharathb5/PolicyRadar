# What Needs to Get Done - Summary

**Date**: 2025-01-XX  
**Current Coverage**: 47.9% (46/96 tests)  
**Target Coverage**: 100% (96/96 tests)  
**Time to Complete**: ~50 minutes for critical fixes + 6 hours for remaining work

---

## 🚨 CRITICAL PRIORITIES (Do First - 50 minutes total)

### 1. Backend Agent: Fix Pipeline Matching Logic (30 min)
**Impact**: 4 integration tests fixed  
**Status**: 🔴 URGENT

**What to do**:
- Update `_process_item` in `pipeline.py`
- Change logic to check by `source_item_id` for updates (not just `content_hash`)
- Ensure version increment works
- Ensure `PolicyChangesLog` populated

**Result**: Integration tests 11/16 → **15/16 (93.8%)**

---

### 2. Frontend Agent: Add Missing Test IDs (15 min)
**Impact**: 5 E2E tests fixed  
**Status**: 🔴 URGENT

**What to do**:
- Add `data-testid="filter-region-{region}"` to all filter buttons
- Verify `data-testid="sort-select"` and `data-testid="order-select"` exist
- Add `data-testid="impact-score"` to policy rows
- Add `data-testid="clear-all-filters"` to clear button

**Result**: E2E tests 5/30 → **11/30 (37%)**

---

### 3. Testing Agent: Fix Test Selector (5 min)
**Impact**: 1 E2E test fixed  
**Status**: 🟡 Can do now

**What to do**:
- Fix slider test to use drag action (not `selectOption`)
- Fix empty state test selector

**Result**: E2E tests 6/30 → **6/30 (20%)**

---

## 🟠 HIGH PRIORITIES (Do Next - 6 hours total)

### 4. Backend Agent: Implement Classification Module (2 hours)
**Impact**: 7 golden tests fixed  
**Result**: Golden tests 7/23 → **14/23 (60.9%)**

---

### 5. Backend Agent: Implement Scoring Module (2 hours)
**Impact**: 9 golden tests fixed  
**Result**: Golden tests 14/23 → **23/23 (100%)**

---

### 6. Frontend Agent: Implement Legend Dialog (2 hours)
**Impact**: User experience improvement  
**Result**: Help dialog available for users

---

## 📊 Expected Progress Timeline

### After Critical Fixes (50 min)
```
Coverage: [██████████████░░░░░░░░░░] 52.1% (50/96) ✅
├── Integration: [████████████████████░░] 93.8% (15/16)
└── E2E:      [████░░░░░░░░░░░░░░░░░░] 37% (11/30)
```

### After High Priorities (6 hours)
```
Coverage: [████████████████████░░░░] 78.1% (75/96) ✅
├── Golden:   [████████████████████████] 100% (23/23)
└── All modules complete
```

### Remaining Work (To Reach 100%)
```
- Remaining E2E tests: 19 tests need investigation
- Remaining integration tests: 1 test needs investigation
- API contract tests: 3 tests need investigation
```

---

## ⏱️ Quick Action Summary

### Backend Agent (4.5 hours)
1. 🔴 Fix pipeline matching logic (30 min) → +4 tests
2. 🟠 Implement classification module (2 hours) → +7 tests
3. 🟠 Implement scoring module (2 hours) → +9 tests

### Frontend Agent (2.25 hours)
1. 🔴 Add missing test IDs (15 min) → +5 tests
2. 🟠 Implement Legend dialog (2 hours) → UX improvement

### Testing Agent (1 hour)
1. 🟡 Fix test selector (5 min) → +1 test
2. 🔴 Verify Backend fix (10 min) → Verify +4 tests
3. 🔴 Verify Frontend fix (10 min) → Verify +5 tests
4. 🟠 Verify Golden tests (30 min) → Verify +16 tests

---

## 🎯 Success Criteria

### Must Have (Before Production)
- [ ] ✅ All 96 tests passing (100% coverage)
- [ ] ✅ Integration tests fixed (15/16 passing minimum)
- [ ] ✅ E2E tests fixed (11/30 passing minimum, more if possible)
- [ ] ✅ Golden tests passing (23/23 passing)
- [ ] ✅ Pipeline matching logic fixed
- [ ] ✅ Test IDs added
- [ ] ✅ No hardcoded secrets
- [ ] ✅ All field names comply (snake_case)

### Nice to Have (Can Add Later)
- [ ] Legend/Help dialog implemented
- [ ] All E2E tests passing (30/30)
- [ ] All integration tests passing (16/16)
- [ ] API contract tests passing (8/8)

---

**Status**: 🎯 **ACTIVE**  
**Next Milestone**: Critical fixes complete → Coverage 52.1%  
**Final Goal**: 100% test coverage + Legend feature complete

