# Agent Monitoring System - Compliance & Progress Tracking

**Last Updated**: 2025-01-XX  
**Status**: 🟢 Active Monitoring  
**Purpose**: Track agent progress and ensure compliance with contracts, guardrails, and rules

---

## 🎯 Monitoring Objectives

### Progress Monitoring
- ✅ Track test coverage progress (28% → 100%)
- ✅ Track agent task completion
- ✅ Verify tests passing after each change
- ✅ Identify blockers and dependencies

### Compliance Monitoring
- ✅ **Secrets**: No hardcoded API keys, passwords, tokens
- ✅ **Field Names**: Must match `/dictionary.md` exactly (snake_case)
- ✅ **Enum Values**: Must match `/dictionary.md` exactly (e.g., `US-Federal` with hyphen)
- ✅ **Visual Changes**: No unauthorized styling/layout changes
- ✅ **Contract Compliance**: API responses match OpenAPI spec
- ✅ **Structure Compliance**: File structure matches plan

---

## 🔍 Automated Compliance Checks

### 1. Secrets Check (CRITICAL)

**Command**:
```bash
cd "/Users/sharath/Policy Radar"
grep -r -E "api[_-]?key|secret|password|token|api_key|API_KEY" \
  --exclude-dir=node_modules \
  --exclude-dir=venv \
  --exclude-dir=.git \
  --exclude="*.md" \
  --exclude="*.json" \
  --exclude="*.env" \
  --exclude="*.env.local" \
  --exclude="*.example" \
  PolicyRadar-backend/ policy-radar-frontend/ tests/ | \
  grep -v ".env" | \
  grep -v "example" | \
  grep -v "test" | \
  grep -v "fixture"
```

**Expected Result**: Should return NOTHING (or only acceptable test/fixture values)

**Violation**: Any hardcoded secrets found
**Action**: Block commit, require fix before proceeding

---

### 2. Field Names Compliance (CRITICAL)

**Command**:
```bash
cd "/Users/sharath/Policy Radar"

# Check API responses for field names
grep -r -E "impactScore|policyType|effectiveDate|sourceName" \
  --include="*.py" \
  --include="*.ts" \
  --include="*.tsx" \
  PolicyRadar-backend/app/api/ policy-radar-frontend/lib/ | \
  grep -v "test" | \
  grep -v "comment"

# Should use snake_case: impact_score, policy_type, effective_date, source_name
```

**Expected Result**: Should return NOTHING (must use snake_case)

**Violation**: camelCase found in API responses
**Action**: Block commit, require fix to match dictionary.md

---

### 3. Enum Values Compliance (CRITICAL)

**Command**:
```bash
cd "/Users/sharath/Policy Radar"

# Check for wrong enum values
grep -r -E "US_Federal|USFederal|Supply_chain|SupplyChain|US_CA|USCA" \
  --include="*.py" \
  --include="*.ts" \
  --include="*.tsx" \
  PolicyRadar-backend/ policy-radar-frontend/ | \
  grep -v "test" | \
  grep -v "comment"

# Should use: US-Federal, Supply-chain, US-CA (with hyphens)
```

**Expected Result**: Should return NOTHING (must match dictionary.md exactly)

**Violation**: Wrong enum values found
**Action**: Block commit, require fix to match dictionary.md

---

### 4. Visual Changes Check (HIGH)

**Command**:
```bash
cd "/Users/sharath/Policy Radar"

# Check for unauthorized styling changes
# Compare component files with baseline (if available)
# Check for new CSS/styling additions that weren't authorized

# Manual check: Review git diff for frontend components
git diff --name-only policy-radar-frontend/components/ | \
  grep -E "\.(css|tsx|ts)$"
```

**Expected Result**: Only authorized changes
**Violation**: Unauthorized visual changes detected
**Action**: Alert Frontend Agent, require approval

---

### 5. Contract Compliance (CRITICAL)

**Command**:
```bash
cd "/Users/sharath/Policy Radar"
export API_KEY=1bb26b00a037526ce34654e867a89738d9e3eec1bc1f108127ccaaa4d8cf247d

# Run contract tests
pytest tests/contract/ -v --tb=short

# Should all pass
```

**Expected Result**: All contract tests pass (27+/35)
**Violation**: Contract tests failing
**Action**: Block progress, require fix

---

### 6. Test Progress Check (HIGH)

**Command**:
```bash
cd "/Users/sharath/Policy Radar"
export API_KEY=1bb26b00a037526ce34654e867a89738d9e3eec1bc1f108127ccaaa4d8cf247d

# Get current test status
pytest tests/contract/ tests/unit/ tests/integration/ -v --tb=no -q | \
  grep -E "passed|failed|skipped" | \
  tail -5
```

**Expected Result**: Tests passing count increasing
**Violation**: Tests regressing
**Action**: Alert agent, require fix before proceeding

---

## 📊 Progress Monitoring Dashboard

### Test Coverage Progress

**Current**: 27/96 tests (28%)  
**Target**: 96/96 tests (100%)  
**Gap**: 69 tests remaining

**Breakdown**:
- Contract Tests: 27/35 (77%) - Need +8
- Golden Tests: 0/23 (0%) - Need +23
- Integration Tests: 0/16 (0%) - Need +16
- E2E Tests: 0/30 (0%) - Need +30

### Agent Task Progress

**Backend Agent**:
- [ ] API Contract Fix: ⏳ In Progress
- [ ] Classification Module: ⏳ Pending
- [ ] Scoring Module: ⏳ Pending

**Testing Agent**:
- [ ] API Contract Fix: ⏳ In Progress
- [ ] Test DB Setup: ⏳ Pending
- [ ] Playwright Setup: ⏳ Pending
- [ ] Smoke Flow Test: ⏳ Pending

**Frontend Agent**:
- [ ] API Integration Verify: ⏳ Pending
- [ ] Playwright Setup: ⏳ Pending

---

## 🚨 Violation Detection & Response

### Critical Violations (Block Immediately)

1. **Hardcoded Secrets**
   - **Detection**: Automated check
   - **Response**: Block commit, alert agent immediately
   - **Fix Required**: Move to `.env` file

2. **Field Name Mismatches**
   - **Detection**: Automated check + contract tests
   - **Response**: Block commit, require fix
   - **Fix Required**: Update to match dictionary.md

3. **Enum Value Mismatches**
   - **Detection**: Automated check + contract tests
   - **Response**: Block commit, require fix
   - **Fix Required**: Update to match dictionary.md

### High Priority Violations (Alert & Track)

4. **Visual Changes**
   - **Detection**: Manual review + git diff
   - **Response**: Alert Frontend Agent, require approval
   - **Fix Required**: Revert or get approval

5. **Contract Test Failures**
   - **Detection**: Automated test run
   - **Response**: Block progress, require fix
   - **Fix Required**: Fix failing tests

### Medium Priority Issues (Track)

6. **Test Regression**
   - **Detection**: Automated test run
   - **Response**: Alert agent, track in status
   - **Fix Required**: Fix tests before completing task

---

## 📋 Daily Monitoring Checklist

### Morning Check
- [ ] Run compliance checks (secrets, field names, enum values)
- [ ] Run contract tests (verify compliance)
- [ ] Check agent status tracker (see who's working on what)
- [ ] Review overnight changes (git log)
- [ ] Check for blockers

### Mid-Day Check
- [ ] Run test suite (verify progress)
- [ ] Check for violations (automated checks)
- [ ] Update progress metrics
- [ ] Verify agents on task (check status tracker)

### End of Day Check
- [ ] Run full test suite (get coverage numbers)
- [ ] Update all status documents
- [ ] Document any violations found
- [ ] Plan next day priorities

---

## 🔄 Automated Monitoring Script

Create `monitor_agents.sh`:

```bash
#!/bin/bash

echo "=== Agent Monitoring Report ==="
echo "Date: $(date)"
echo ""

echo "1. SECRETS CHECK"
grep -r -E "api[_-]?key|secret|password|token" \
  --exclude-dir=node_modules --exclude-dir=venv --exclude-dir=.git \
  --exclude="*.md" --exclude="*.json" --exclude="*.env" \
  PolicyRadar-backend/ policy-radar-frontend/ tests/ 2>/dev/null | \
  grep -v ".env" | grep -v "example" | grep -v "test" | grep -v "fixture"
if [ $? -eq 0 ]; then
  echo "⚠️  VIOLATION: Hardcoded secrets found!"
else
  echo "✅ No hardcoded secrets found"
fi
echo ""

echo "2. FIELD NAMES CHECK"
grep -r -E "impactScore|policyType|effectiveDate" \
  --include="*.py" --include="*.ts" --include="*.tsx" \
  PolicyRadar-backend/app/api/ policy-radar-frontend/lib/ 2>/dev/null | \
  grep -v "test" | grep -v "comment"
if [ $? -eq 0 ]; then
  echo "⚠️  VIOLATION: camelCase found (should be snake_case)!"
else
  echo "✅ Field names comply (snake_case)"
fi
echo ""

echo "3. ENUM VALUES CHECK"
grep -r -E "US_Federal|USFederal|Supply_chain" \
  --include="*.py" --include="*.ts" --include="*.tsx" \
  PolicyRadar-backend/ policy-radar-frontend/ 2>/dev/null | \
  grep -v "test" | grep -v "comment"
if [ $? -eq 0 ]; then
  echo "⚠️  VIOLATION: Wrong enum values found!"
else
  echo "✅ Enum values comply"
fi
echo ""

echo "4. CONTRACT TESTS"
export API_KEY=1bb26b00a037526ce34654e867a89738d9e3eec1bc1f108127ccaaa4d8cf247d
cd "/Users/sharath/Policy Radar"
pytest tests/contract/ -v --tb=no -q 2>&1 | tail -3
echo ""

echo "5. TEST PROGRESS"
pytest tests/contract/ tests/unit/ tests/integration/ -v --tb=no -q 2>&1 | \
  grep -E "passed|failed|skipped" | tail -1
echo ""

echo "=== Monitoring Complete ==="
```

---

## 📝 Violation Logging

### Log Format

When violations are detected, log them in `COMPLIANCE_STATUS.md`:

```markdown
### Violation Log

#### [Date] - [Time]
- **Priority**: 🔴 CRITICAL / 🟠 HIGH / 🟡 MEDIUM
- **Agent**: Backend / Frontend / Testing
- **Type**: Secrets / Field Names / Enum Values / Visual / Contract
- **File**: `path/to/file.py` or `path/to/file.ts`
- **Issue**: Detailed description
- **Expected**: What should be
- **Actual**: What was found
- **Fix Required**: Specific action needed
- **Status**: ❌ Not Fixed / 🟡 In Progress / ✅ Fixed
```

---

## 🎯 Agent Task Verification

### Verify Agents Are On Task

**Check Status Documents**:
1. `AGENT_STATUS_TRACKER.md` - See current tasks
2. `MASTER_COORDINATION_PLAN.md` - See assigned tasks
3. `CURRENT_STATUS_AND_ACTIONS.md` - See priorities

**Verify Against Actual Work**:
1. Check git commits (are they working on assigned tasks?)
2. Check test results (are tests passing after their changes?)
3. Run compliance checks (are they violating rules?)

**If Agent Off Task**:
1. Alert agent immediately
2. Redirect to assigned task
3. Document in violation log if needed

---

## 📊 Progress Tracking Metrics

### Daily Metrics to Track

1. **Test Coverage**: X/96 tests (Y%)
2. **Tasks Completed**: X/Y tasks
3. **Violations Found**: X violations (Y fixed, Z pending)
4. **Tests Passing**: X/Y passing
5. **Blockers**: X blockers (list them)

### Update Frequency

- **Real-Time**: Violations (immediately)
- **Every Change**: Test results (after each commit)
- **Daily**: Progress metrics (end of day)
- **Weekly**: Full assessment (end of week)

---

## 🚨 Escalation Process

### Violation Severity

**🔴 CRITICAL** (Block Immediately):
- Hardcoded secrets
- Field name mismatches
- Enum value mismatches
- Contract test failures

**🟠 HIGH** (Alert & Track):
- Visual changes (unauthorized)
- Test regressions
- Off-task work

**🟡 MEDIUM** (Track & Remind):
- Minor compliance issues
- Slow progress

### Response Process

1. **Detect** → Run automated checks
2. **Log** → Document in violation log
3. **Alert** → Notify agent immediately
4. **Block** → Prevent further work if critical
5. **Fix** → Require fix before proceeding
6. **Verify** → Confirm fix before unblocking

---

## 📋 Monitoring Checklist

### Before Each Agent Commit
- [ ] Run secrets check
- [ ] Run field names check
- [ ] Run enum values check
- [ ] Run contract tests
- [ ] Verify on assigned task

### After Each Agent Commit
- [ ] Verify tests still pass
- [ ] Check for new violations
- [ ] Update progress metrics
- [ ] Update status tracker

### Daily
- [ ] Run full compliance check
- [ ] Run full test suite
- [ ] Update all status documents
- [ ] Review agent progress
- [ ] Check for blockers

---

## 🔗 Integration with Coordination Plan

This monitoring system integrates with:
- `MASTER_COORDINATION_PLAN.md` - Main coordination hub
- `AGENT_STATUS_TRACKER.md` - Real-time status
- `COMPLIANCE_STATUS.md` - Violation tracking
- `CURRENT_STATUS_AND_ACTIONS.md` - Task assignments

**All violations and progress updates should flow into these documents.**

---

**Monitoring Active** 🟢  
**Check daily for compliance and progress!** 📊✅

