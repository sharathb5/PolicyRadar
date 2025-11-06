# Agent Monitoring Checklist - Daily Operations

**Purpose**: Daily checklist for monitoring agent progress and compliance

---

## 🔄 Daily Monitoring Routine

### Morning Check (9 AM)
- [ ] Run `./monitor_agents.sh` (compliance check)
- [ ] Review overnight commits (git log)
- [ ] Check `AGENT_STATUS_TRACKER.md` for status
- [ ] Verify agents are on assigned tasks
- [ ] Document any violations found
- [ ] Update `MASTER_COORDINATION_PLAN.md` if needed

### Mid-Day Check (1 PM)
- [ ] Run `./monitor_agents.sh` (compliance check)
- [ ] Run contract tests (verify compliance)
- [ ] Check test progress (are tests passing?)
- [ ] Verify agents haven't introduced violations
- [ ] **Check for recent pushes** (agents should be pushing incrementally)
- [ ] Update progress metrics

### End of Day Check (5 PM)
- [ ] Run full compliance check (`./monitor_agents.sh`)
- [ ] Run full test suite (get coverage numbers)
- [ ] Update `AGENT_STATUS_TRACKER.md` with progress
- [ ] Update `MASTER_COORDINATION_PLAN.md` with metrics
- [ ] Document any violations in `COMPLIANCE_STATUS.md`
- [ ] Check for blockers and dependencies
- [ ] Plan next day priorities

---

## 🚨 Violation Response Protocol

### When Violation Detected

1. **Immediate Action**:
   - [ ] Stop agent work on current task
   - [ ] Document violation in `COMPLIANCE_STATUS.md`
   - [ ] Alert agent immediately
   - [ ] Require fix before proceeding

2. **Fix Process**:
   - [ ] Agent fixes violation
   - [ ] Agent runs compliance check (`./monitor_agents.sh`)
   - [ ] Verify fix (run compliance check again)
   - [ ] Unblock agent work

3. **Follow-Up**:
   - [ ] Track violation in log
   - [ ] Update status documents
   - [ ] Prevent recurrence (add to checklist if needed)

---

## 📊 Progress Verification

### Verify Agents On Task

**Check Documents**:
- [ ] `AGENT_STATUS_TRACKER.md` - Current tasks match assigned?
- [ ] `MASTER_COORDINATION_PLAN.md` - Agents working on priorities?
- [ ] `CURRENT_STATUS_AND_ACTIONS.md` - Following action plan?

**Check Actual Work**:
- [ ] Git commits match assigned tasks?
- [ ] Tests passing after their changes?
- [ ] No violations introduced?

**If Agent Off Task**:
- [ ] Alert agent immediately
- [ ] Redirect to assigned task
- [ ] Document in violation log

---

## ✅ Compliance Checks

### Pre-Commit Checks (Agents Should Run)

Before each commit, agents should:
- [ ] Run `./monitor_agents.sh`
- [ ] Verify no violations
- [ ] Run relevant tests
- [ ] Ensure tests pass

### Post-Commit Checks (Monitoring System)

After each commit:
- [ ] Run compliance checks automatically
- [ ] Verify tests still pass
- [ ] Check for new violations
- [ ] Update progress metrics

---

## 📈 Progress Tracking

### Metrics to Track Daily

1. **Test Coverage**: X/96 tests (Y%)
   - Contract: X/35
   - Golden: X/23
   - Integration: X/16
   - E2E: X/30

2. **Tasks Completed**: X/Y tasks
   - Backend: X/Y
   - Frontend: X/Y
   - Testing: X/Y

3. **Violations**: X violations
   - Found: X
   - Fixed: X
   - Pending: X

4. **Blockers**: X blockers
   - List each blocker

### Update Frequency

- **Real-Time**: Violations (immediately)
- **After Each Commit**: Test results
- **Daily**: Progress metrics (end of day)
- **Weekly**: Full assessment

---

## 🔍 What to Monitor

### Backend Agent
- ✅ Working on: API Contract Fix → Classification → Scoring
- ✅ Not violating: Secrets, field names, enum values
- ✅ Tests passing: Contract tests, golden tests
- ✅ Following: `/dictionary.md` conventions

### Frontend Agent
- ✅ Working on: API Integration Verify → Playwright Setup
- ✅ Not violating: Visual changes, field names, enum values
- ✅ Tests passing: Type checks, lint checks
- ✅ Following: No styling changes, API integration

### Testing Agent
- ✅ Working on: API Contract Fix → Test DB → Playwright → Smoke Flow
- ✅ Not violating: Secrets, field names, enum values
- ✅ Tests passing: All test suites
- ✅ Following: Test-first development

---

## 📝 Daily Report Template

### Daily Monitoring Report - [Date]

**Overall Progress**: X/96 tests (Y%)

**Agent Status**:
- Backend: [Status] - [Task]
- Frontend: [Status] - [Task]
- Testing: [Status] - [Task]

**Compliance**:
- Secrets: ✅ / ⚠️
- Field Names: ✅ / ⚠️
- Enum Values: ✅ / ⚠️
- Visual: ✅ / ⚠️
- Contracts: ✅ / ⚠️

**Violations Found**: X
- [List violations]

**Progress Today**: +X tests passing

**Blockers**: X
- [List blockers]

**Next Priorities**:
1. [Priority 1]
2. [Priority 2]
3. [Priority 3]

---

## 🎯 Success Criteria

### Daily Success
- ✅ No critical violations
- ✅ Tests progressing (count increasing)
- ✅ Agents on assigned tasks
- ✅ No blockers

### Weekly Success
- ✅ All critical tasks completed
- ✅ Test coverage >50%
- ✅ No outstanding violations
- ✅ Ready for next phase

### Final Success
- ✅ All 96 tests passing (100%)
- ✅ No violations
- ✅ Smoke flow passing
- ✅ Ready for production

---

**Check this checklist daily!** 📋✅

