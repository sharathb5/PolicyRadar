# Monitoring System Summary

**Last Updated**: 2025-01-XX  
**Status**: ✅ ACTIVE  
**Purpose**: Track agent progress and ensure compliance with `MASTER_COORDINATION_PLAN.md`

---

## 📋 Monitoring System Overview

The monitoring system ensures all agents stay aligned with the master plan and don't deviate from original requirements.

### Key Documents

1. **`MASTER_COORDINATION_PLAN.md`** - Source of truth for all agent priorities and tasks
2. **`AGENT_DEVIATION_MONITOR.md`** - Tracks all deviations from the plan
3. **`PLAN_COMPLIANCE_CHECK.md`** - Quick reference for compliance checks
4. **`monitor_agents.sh`** - Automated monitoring script

---

## 🔍 What Gets Monitored

### 1. Secrets Compliance
- **Rule**: NO hardcoded secrets in code
- **Check**: Scans codebase for hardcoded API keys, passwords, tokens
- **Action**: Log violation in `AGENT_DEVIATION_MONITOR.md`

### 2. Field Names Compliance
- **Rule**: All field names must be `snake_case` (per `/dictionary.md`)
- **Check**: Scans for camelCase field names (`impactScore`, `policyType`, etc.)
- **Action**: Log violation and require fix

### 3. Enum Values Compliance
- **Rule**: All enum values must match `/dictionary.md` exactly
- **Check**: Scans for wrong enum formats (`US_Federal` vs `US-Federal`)
- **Action**: Log violation and require fix

### 4. API Contract Compliance
- **Rule**: All API responses must match `/contracts/openapi.yml`
- **Check**: Runs contract tests
- **Action**: Log failures and require fix

### 5. Visual Design Compliance
- **Rule**: NO visual redesign - layout/tokens unchanged
- **Check**: Reviews CSS/styling file changes
- **Action**: Flag any visual redesign attempts

### 6. Test Coverage Compliance
- **Rule**: Tests written alongside code (test-first development)
- **Check**: Runs test coverage report
- **Action**: Flag missing tests or coverage drops

### 7. Plan Compliance
- **Rule**: Agents must follow priorities from `MASTER_COORDINATION_PLAN.md`
- **Check**: Reviews recent commits and agent status
- **Action**: Flag deviations from planned priorities

---

## 🚀 How to Use Monitoring

### Run Monitoring Script

```bash
cd "/Users/sharath/Policy Radar"
./monitor_agents.sh
```

### Check Agent Compliance

```bash
# Quick check
cat PLAN_COMPLIANCE_CHECK.md

# Detailed monitoring
cat AGENT_DEVIATION_MONITOR.md

# Agent status
cat AGENT_STATUS_TRACKER.md
```

### Review Master Plan

```bash
cat MASTER_COORDINATION_PLAN.md | grep -A 10 "Priority Actions"
```

---

## 📊 Monitoring Workflow

### On Each Commit
1. Agent commits code
2. Monitoring script runs automatically (or manually)
3. Checks compliance (secrets, field names, enums, contracts)
4. Logs any violations in `AGENT_DEVIATION_MONITOR.md`
5. Flags deviations from master plan

### Daily Review
1. Review `AGENT_STATUS_TRACKER.md` for agent progress
2. Compare with `MASTER_COORDINATION_PLAN.md` priorities
3. Check `AGENT_DEVIATION_MONITOR.md` for violations
4. Verify agents are on track
5. Flag any deviations

### When Deviation Detected
1. **Log**: Add to `AGENT_DEVIATION_MONITOR.md`
2. **Notify**: Flag in `AGENT_STATUS_TRACKER.md`
3. **Require Fix**: Agent must fix before continuing
4. **Verify**: Re-run checks after fix
5. **Resolve**: Mark as fixed when verified

---

## 🚨 Alert Levels

### 🔴 CRITICAL (Fix Immediately)
- Hardcoded secrets found
- API contract mismatch
- Scoring algorithm changed
- Visual redesign detected

### 🟠 HIGH (Fix Soon)
- Field name violations (camelCase instead of snake_case)
- Enum value violations (wrong format)
- Missing tests for new code
- Test failures after changes

### 🟡 MEDIUM (Fix When Possible)
- Minor contract deviations
- Test coverage drops
- Documentation out of sync

---

## ✅ Compliance Checklist

All agents must comply with:

- [ ] **NO hardcoded secrets** - All secrets in `.env` files
- [ ] **Field names are snake_case** - Per `/dictionary.md`
- [ ] **Enum values match dictionary** - Exact format required
- [ ] **API contracts match OpenAPI** - No deviations
- [ ] **Scoring matches contracts** - No algorithm changes
- [ ] **NO visual redesign** - Layout/tokens unchanged
- [ ] **Tests written alongside code** - Test-first development
- [ ] **Priorities match master plan** - No unauthorized tasks
- [ ] **Commits are small** - Focused changes only

---

## 📝 Monitoring Output

When you run `monitor_agents.sh`, you'll see:

1. **Secrets Check** - Any hardcoded secrets found
2. **Field Names Check** - Any camelCase violations
3. **Enum Values Check** - Any wrong enum formats
4. **Contract Tests** - Test results
5. **Test Progress** - Current test coverage
6. **Agent Status** - Status tracker existence
7. **Recent Commits** - Last 5 commits
8. **Deviation Check** - Agent alignment with master plan
9. **Plan Compliance** - Compliance summary

---

## 🔄 Continuous Monitoring

The monitoring system runs continuously:

- **On Each Commit**: Automated checks run
- **Daily**: Manual review of agent progress
- **Weekly**: Full compliance audit

All violations are logged in `AGENT_DEVIATION_MONITOR.md` and must be fixed before agents continue.

---

## 📚 Related Documents

- `MASTER_COORDINATION_PLAN.md` - Source of truth for priorities
- `AGENT_DEVIATION_MONITOR.md` - Deviation tracking
- `PLAN_COMPLIANCE_CHECK.md` - Quick compliance reference
- `AGENT_STATUS_TRACKER.md` - Agent progress tracking
- `COMPLIANCE_STATUS.md` - Overall compliance status

---

**The monitoring system ensures all agents stay aligned with the master plan and original requirements.**

