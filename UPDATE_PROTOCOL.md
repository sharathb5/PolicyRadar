# Update Protocol - Keeping Plans Current

**Purpose**: Ensure all coordination documents stay up-to-date as agents make progress

---

## 🔄 Update Frequency

### Real-Time Updates (Immediately)
- When completing a task
- When encountering a blocker
- When discovering an issue

### Daily Updates
- Status tracker
- Progress metrics
- Milestone completion

### Weekly Reviews
- Overall progress assessment
- Priority reassignment
- Next week planning

---

## 📝 What to Update

### When Starting a Task
1. ✅ Update `AGENT_STATUS_TRACKER.md`:
   - Change status to "🟡 Active"
   - Update "Current Task"
   - Set "Started" date
   
2. ✅ Update `MASTER_COORDINATION_PLAN.md`:
   - Update agent status in dashboard
   - Update "Current Task" column

3. ✅ Update `QUICK_STATUS_DASHBOARD.md`:
   - Update agent status
   - Update priority indicators

### When Completing a Task
1. ✅ Update `AGENT_STATUS_TRACKER.md`:
   - Change status to "✅ Complete"
   - Check off completed items
   - Update "Next Task"
   - Update progress metrics
   
2. ✅ Update `MASTER_COORDINATION_PLAN.md`:
   - Update progress dashboard
   - Update test coverage numbers
   - Update "Expected Progress After Each Task"
   - Move to next priority

3. ✅ Update `QUICK_STATUS_DASHBOARD.md`:
   - Update progress bar
   - Update test coverage
   - Update milestones

4. ✅ Update agent prompt files:
   - Update "Last Updated" date
   - Update "Current Status"
   - Update "Overall Progress"
   - Update "Next Milestone"

### When Blocked
1. ✅ Update `AGENT_STATUS_TRACKER.md`:
   - Change status to "🔴 Blocked"
   - Document blocker in "Blockers" section
   - Update "Blocked By" column

2. ✅ Update `MASTER_COORDINATION_PLAN.md`:
   - Update "Blocked By" column
   - Document blocker in "Blockers & Issues"
   - Notify dependent agents

### When Progress Changes
1. ✅ Run tests to get current numbers
2. ✅ Update all progress metrics:
   - Test coverage percentages
   - Test counts (X/Y passing)
   - Overall progress percentage
   - Milestone status

---

## 🔍 Update Checklist

### After Each Task
- [ ] Run relevant tests
- [ ] Verify tests pass
- [ ] Update `AGENT_STATUS_TRACKER.md`
- [ ] Update `MASTER_COORDINATION_PLAN.md`
- [ ] Update `QUICK_STATUS_DASHBOARD.md`
- [ ] Update agent prompt files
- [ ] Update "Last Updated" dates
- [ ] Check if other agents can proceed
- [ ] Notify dependent agents if blocked

### Daily
- [ ] Review all status documents
- [ ] Update progress metrics
- [ ] Check for blockers
- [ ] Reassign priorities if needed
- [ ] Update milestone status

### Weekly
- [ ] Assess overall progress
- [ ] Review test coverage trends
- [ ] Identify bottlenecks
- [ ] Plan next week priorities
- [ ] Update success criteria if needed

---

## 📊 Progress Update Commands

### Get Current Test Status
```bash
cd "/Users/sharath/Policy Radar"
export API_KEY=1bb26b00a037526ce34654e867a89738d9e3eec1bc1f108127ccaaa4d8cf247d

# Contract tests
pytest tests/contract/ -v --tb=no -q | grep -E "passed|failed"

# Integration tests (after DB setup)
export TEST_DATABASE_URL=postgresql://sharath@localhost:5432/policyradar_test
pytest tests/integration/ -v --tb=no -q | grep -E "passed|failed"

# Golden tests (after modules implemented)
pytest tests/unit/ -v --tb=no -q | grep -E "passed|failed"

# E2E tests (after Playwright setup)
cd policy-radar-frontend
npx playwright test --reporter=list
```

### Calculate Progress
```
Total Tests: 96
Contract: 35
Golden: 23
Integration: 16
E2E: 30

Current Passing: X
Current Percentage: (X/96) * 100%
```

---

## 🎯 Key Metrics to Track

### Test Coverage
- Contract Tests: X/35
- Golden Tests: X/23
- Integration Tests: X/16
- E2E Tests: X/30
- **Total**: X/96 (Y%)

### Agent Status
- Backend: 🟢 Active / 🟡 In Progress / ⏳ Waiting / 🔴 Blocked
- Frontend: 🟢 Active / 🟡 In Progress / ⏳ Waiting / 🔴 Blocked
- Testing: 🟢 Active / 🟡 In Progress / ⏳ Waiting / 🔴 Blocked

### Milestone Progress
- Milestone 1: ✅ Complete / 🟡 In Progress / ⏳ Pending
- Milestone 2: ✅ Complete / 🟡 In Progress / ⏳ Pending
- Milestone 3: ✅ Complete / 🟡 In Progress / ⏳ Pending
- Milestone 4: ✅ Complete / 🟡 In Progress / ⏳ Pending
- Milestone 5: ✅ Complete / 🟡 In Progress / ⏳ Pending

---

## 📋 Template Updates

### Status Tracker Template
```markdown
### [Agent Name]
**Status**: [Status]
**Current Task**: [Task]
**Started**: [Date]
**Priority**: [Priority]

**Progress**:
- [ ] Item 1
- [ ] Item 2
- [ ] Item 3

**Next Task**: [Task]

**Blockers**: [None / Blocker description]

**Last Update**: [Date]
```

### Progress Update Template
```markdown
### [Date]
- ✅ Completed: [Task] ([Agent])
- 🟡 In Progress: [Task] ([Agent])
- ⏳ Started: [Task] ([Agent])
- 🔴 Blocked: [Task] ([Agent]) - [Blocker]
- 📊 Progress: X/96 tests (Y%)
```

---

## 🔗 Document Cross-References

All documents should reference each other:

1. **QUICK_STATUS_DASHBOARD.md** → Links to all detailed docs
2. **MASTER_COORDINATION_PLAN.md** → Links to agent prompts and status tracker
3. **AGENT_STATUS_TRACKER.md** → Links to master plan
4. **Agent Prompts** → Link to master plan, status tracker, quick dashboard

---

## ⚠️ Important Reminders

### Always Update
- ✅ Status after task completion
- ✅ Progress metrics after tests run
- ✅ Blockers immediately when discovered
- ✅ Dates when making updates

### Keep Synchronized
- ✅ All documents show same status
- ✅ Progress numbers match across docs
- ✅ Priority indicators consistent
- ✅ Agent assignments aligned

### Verify Before Commit
- ✅ Run tests to get accurate numbers
- ✅ Check all status documents updated
- ✅ Ensure no conflicting information
- ✅ Links work correctly

---

## 🎯 Success Metrics

### Update Quality
- ✅ All status docs updated within 1 hour of task completion
- ✅ Progress metrics accurate (within 1%)
- ✅ No conflicting information
- ✅ All links working

### Coordination Quality
- ✅ Agents aware of each other's progress
- ✅ Dependencies clearly tracked
- ✅ Blockers immediately documented
- ✅ Priorities clearly communicated

---

**Remember: Updated documents = Better coordination = Faster progress!** 📝✅

