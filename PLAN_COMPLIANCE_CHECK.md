# Plan Compliance Check

**Last Updated**: 2025-01-XX  
**Status**: 🔴 ACTIVE MONITORING  
**Purpose**: Quick reference for checking agent compliance with `MASTER_COORDINATION_PLAN.md`

---

## 🎯 Quick Compliance Checklist

### ✅ Backend Agent Compliance
- [ ] Following Priority 1: API Contract Fix (CRITICAL)
- [ ] Following Priority 2: Classification Module (HIGH)
- [ ] Following Priority 3: Scoring Module (HIGH)
- [ ] Following Priority 4: Test Database Setup (MEDIUM)
- [ ] All field names are `snake_case`
- [ ] All enum values match `/dictionary.md`
- [ ] No hardcoded secrets
- [ ] Tests written alongside code
- [ ] Commits are small and focused

### ✅ Frontend Agent Compliance
- [ ] Following Priority 1: Data-TestId Fix (CRITICAL - BLOCKING E2E)
- [ ] Following Priority 2: API Integration Verify (HIGH)
- [ ] Following Priority 3: Playwright Setup (MEDIUM)
- [ ] All field names are `snake_case`
- [ ] All enum values match `/dictionary.md`
- [ ] No hardcoded secrets
- [ ] No visual redesign (layout/tokens unchanged)
- [ ] `data-testid` attributes added for E2E tests
- [ ] Commits are small and focused

### ✅ Testing Agent Compliance
- [ ] Following Priority 1: API Contract Fix (CRITICAL)
- [ ] Following Priority 2: Test Database Setup (HIGH)
- [ ] Following Priority 3: Golden Tests (HIGH)
- [ ] Following Priority 4: Playwright Setup (MEDIUM)
- [ ] Following Priority 5: Smoke Flow Test (CRITICAL)
- [ ] All tests match contracts
- [ ] No hardcoded secrets in tests
- [ ] Tests are deterministic
- [ ] Commits are small and focused

---

## 🔍 How to Check Compliance

### Step 1: Review Master Plan
```bash
cat MASTER_COORDINATION_PLAN.md | grep -A 10 "Priority Actions"
```

### Step 2: Check Agent Status
```bash
cat AGENT_STATUS_TRACKER.md | grep -A 5 "Backend\|Frontend\|Testing"
```

### Step 3: Check Recent Commits
```bash
git log --oneline --all -20 | head -20
```

### Step 4: Run Monitoring Script
```bash
./monitor_agents.sh
```

### Step 5: Check for Deviations
```bash
cat AGENT_DEVIATION_MONITOR.md | grep -A 5 "Deviation Log"
```

---

## 🚨 When Deviation Detected

1. **Stop**: Agent must stop current work
2. **Log**: Add to `AGENT_DEVIATION_MONITOR.md`
3. **Fix**: Agent must fix deviation immediately
4. **Verify**: Re-run compliance checks
5. **Resume**: Continue only after compliance verified

---

## 📊 Master Plan Priorities (Source of Truth)

### 🔴 CRITICAL (Do First)
1. Backend/Testing: Fix API Contract Test Fixture
2. Frontend: Add Missing Data-TestId Attributes (BLOCKING E2E)

### 🟠 HIGH (Do Next)
3. Testing: Set Up Test Database
4. Backend: Implement Classification Module
5. Backend: Implement Scoring Module

### 🟡 MEDIUM (Do When Possible)
6. Frontend: API Integration Verify
7. Frontend: Playwright Setup
8. Testing: Verify & Fix Golden Tests

---

## ✅ Compliance Status

**Last Check**: 2025-01-XX  
**Status**: ⏳ Pending initial check

**Agents Checked**:
- Backend: ⏳ Pending
- Frontend: ⏳ Pending
- Testing: ⏳ Pending

---

**This document is a quick reference. For detailed monitoring, see `AGENT_DEVIATION_MONITOR.md` and `MASTER_COORDINATION_PLAN.md`.**

