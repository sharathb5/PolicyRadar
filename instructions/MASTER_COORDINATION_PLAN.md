# Master Coordination Plan - Policy Radar

**Last Updated**: 2025-01-XX  
**Status**: 🟡 In Progress (28% complete)  
**Goal**: All agents working in parallel to achieve 100% test coverage  
**⚠️ SOURCE OF TRUTH**: This document is the authoritative source. All agents must comply.
**📋 Monitoring**: See `AGENT_DEVIATION_MONITOR.md` and `PLAN_COMPLIANCE_CHECK.md` for compliance tracking.

---

## 🎯 Overall Status Dashboard

### Test Coverage Progress
| Category | Target | Current | Status | Agent |
|----------|--------|---------|--------|-------|
| Contract Tests | 27 | 24 | 🟢 89% | Testing |
| Golden Tests | 23 | 6 | 🟡 26% | Backend |
| Integration Tests | 16 | 0 | ⏳ Ready | Testing |
| E2E Tests | 30 | 0 | 🔴 0% | Frontend |
| **Total** | **96** | **30** | 🟡 **31%** | All |

### Agent Status
| Agent | Current Task | Priority | Status | Blocked By |
|-------|--------------|----------|--------|------------|
| Backend | API Contract Fix | 🔴 CRITICAL | 🟡 In Progress | None |
| Backend | Classification Module | 🟠 HIGH | ⏳ Pending | API Fix |
| Backend | Scoring Module | 🟠 HIGH | ⏳ Pending | Classification |
| Frontend | Add Missing Data-TestId Attributes | 🔴 CRITICAL | 🔴 BLOCKING | None |
| Frontend | API Integration Verify | 🟠 HIGH | ⏳ Pending | Data-TestId Fix |
| Frontend | Playwright Setup | 🟡 MEDIUM | ⏳ Pending | None |
| Testing | Test DB Setup | 🟠 HIGH | ⏳ Pending | None |
| Testing | API Contract Fix | 🔴 CRITICAL | 🟡 In Progress | None |
| Testing | Smoke Flow Test | 🔴 CRITICAL | ⏳ Pending | Frontend |

---

## 📋 Current State Summary

### ✅ Completed
- **Database Setup**: ✅ Complete (12 policies seeded)
- **Backend Server**: ✅ Running (localhost:8000)
- **Frontend Server**: ✅ Running (localhost:3000)
- **Contract Tests**: ✅ 27/27 passing (OpenAPI + Field Names)
- **Infrastructure**: ✅ All test files created

### ⚠️ In Progress
- **API Contract Tests**: 1/8 passing (fixture needs fix)
- **Test Database**: Not yet created for integration tests

### ⏳ Pending
- **Golden Tests**: 6/23 (need classification module + time fix)
- **Integration Tests**: 0/16 (ready to run - test database set up)
- **E2E Tests**: 0/30 (8 tests failing - missing data-testid attributes) 🔴 **BLOCKING**
- **Smoke Flow**: 2/10 passing, 8/10 failing (missing data-testid) 🔴 **BLOCKING**

---

## 🎯 Priority Actions (All Agents)

### 🔴 CRITICAL (Do First)
1. **Backend Agent**: Fix API Contract Test Fixture
   - File: `tests/contract/test_api_contracts.py`
   - Add API key to test client headers
   - **Test Command**: `pytest tests/contract/test_api_contracts.py -v`
   - **Expected**: 8/8 passing
   - **Status**: 🟡 In Progress

2. **Testing Agent**: Fix API Contract Test Fixture (Same as above)
   - **Status**: 🟡 In Progress

### 🔴 CRITICAL (URGENT - BLOCKING E2E TESTS)
1. **Frontend Agent**: Add Missing Data-TestId Attributes
   - **Issue**: 8 E2E tests failing due to missing test IDs
   - **Files**: `policy-filters.tsx`, `policy-row.tsx`, `filter-toggle.tsx`
   - **Action**: Add all missing `data-testid` attributes
   - **Reference**: `FRONTEND_DATA_TESTID_FIX.md` for detailed guide
   - **Expected**: 10/10 tests passing (currently 2/10)
   - **Status**: 🔴 **URGENT - BLOCKING E2E TESTS**

### 🟠 HIGH (Do Next)
3. **Testing Agent**: Set Up Test Database
   - Create: `policyradar_test`
   - Run migrations on test database
   - Update: `tests/conftest.py`
   - **Test Command**: `pytest tests/integration/ -v`
   - **Expected**: 16/16 passing
   - **Status**: ⏳ Pending

4. **Backend Agent**: Implement Classification Module
   - File: `app/core/classify.py`
   - Match: `/contracts/scoring.md`
   - **Test Command**: `pytest tests/unit/test_classify.py -v`
   - **Expected**: 7/7 passing
   - **Status**: ⏳ Pending (blocks golden tests)

5. **Backend Agent**: Implement Scoring Module
   - File: `app/core/scoring.py`
   - Match: `/contracts/scoring.md`
   - **Test Command**: `pytest tests/unit/test_scoring.py -v`
   - **Expected**: 16/16 passing
   - **Status**: ⏳ Pending (blocks golden tests)

6. **Frontend Agent**: Verify All API Integrations
   - Test each endpoint in browser
   - Verify API key passed correctly
   - Check error handling
   - **Status**: ⏳ Pending

### 🟡 MEDIUM (Do After HIGH)
7. **Frontend Agent**: Test Feed Page Integration
8. **Frontend Agent**: Test Drawer Integration
9. **Frontend Agent**: Test Save/Unsave Integration
10. **Frontend Agent**: Test Digest Preview Integration
11. **Frontend Agent**: Set Up Playwright
12. **Testing Agent**: Set Up Playwright
13. **Testing Agent**: Run Smoke Flow Test

---

## 📊 Agent Assignments

### Backend Agent
**Focus**: Fix backend issues and implement missing modules

**Current Task**: Fix API Contract Test Fixture
- [ ] Update `tests/contract/test_api_contracts.py`
- [ ] Add API key to test client headers
- [ ] Run test: `pytest tests/contract/test_api_contracts.py -v`
- [ ] Verify: 8/8 passing

**Next Tasks**:
1. Implement Classification Module (`app/core/classify.py`)
2. Implement Scoring Module (`app/core/scoring.py`)
3. Ensure all modules match `/contracts/scoring.md`

**Key Commands**:
```bash
cd PolicyRadar-backend
source venv/bin/activate
export API_KEY=1bb26b00a037526ce34654e867a89738d9e3eec1bc1f108127ccaaa4d8cf247d
pytest tests/contract/test_api_contracts.py -v
pytest tests/unit/test_classify.py -v
pytest tests/unit/test_scoring.py -v
```

**See**: `BACKEND_AGENT_PROMPT.md` for detailed instructions

---

### Frontend Agent
**Focus**: Ensure frontend integration works with backend API

**Current Task**: Verify All API Integrations
- [ ] Check backend is running: `curl http://localhost:8000/api/healthz`
- [ ] Test each API endpoint in browser
- [ ] Verify API key passed correctly
- [ ] Test error handling

**Next Tasks**:
1. Test Feed Page Integration (filters, sort, pagination)
2. Test Drawer Integration (policy detail)
3. Test Save/Unsave Integration
4. Test Digest Preview Integration
5. Set Up Playwright for E2E Tests

**Key Commands**:
```bash
cd policy-radar-frontend
npm run type-check
npm run lint
# Start servers first:
# Terminal 1: Backend (PolicyRadar-backend)
# Terminal 2: Frontend (policy-radar-frontend)
# Terminal 3: Playwright tests
npx playwright test
```

**See**: `FRONTEND_AGENT_PROMPT.md` for detailed instructions

---

### Testing Agent
**Focus**: Set up test infrastructure and run all test suites

**Current Task**: Fix API Contract Test Fixture (Same as Backend)
- [ ] Update `tests/contract/test_api_contracts.py`
- [ ] Add API key to test client headers
- [ ] Run test: `pytest tests/contract/test_api_contracts.py -v`
- [ ] Verify: 8/8 passing

**Next Tasks**:
1. Set Up Test Database (`policyradar_test`)
2. Verify Golden Tests (check backend modules exist)
3. Set Up Playwright for E2E Tests
4. Run Smoke Flow Test (manual or automated)

**Key Commands**:
```bash
cd "/Users/sharath/Policy Radar"
export API_KEY=1bb26b00a037526ce34654e867a89738d9e3eec1bc1f108127ccaaa4d8cf247d
export TEST_DATABASE_URL=postgresql://sharath@localhost:5432/policyradar_test
pytest tests/contract/ -v
pytest tests/integration/ -v
pytest tests/unit/ -v
cd policy-radar-frontend && npx playwright test
```

**See**: `TESTING_AGENT_PROMPT.md` for detailed instructions

---

## 🔄 Coordination Rules

### Parallel Work Allowed
- ✅ Backend: API Contract Fix + Testing: API Contract Fix (same task)
- ✅ Testing: Test DB Setup + Frontend: API Integration Verify
- ✅ Frontend: Playwright Setup + Testing: Playwright Setup

### Sequential Work Required
- ⚠️ Backend: Classification → Scoring (do in order)
- ⚠️ Frontend: API Integration → Feed Page → Drawer → Save/Unsave → Digest
- ⚠️ Testing: API Contract Fix → Test DB → Golden Tests → Playwright → Smoke Flow

### Dependencies
- **Golden Tests** depend on: Backend Classification + Scoring modules
- **Integration Tests** depend on: Test Database setup
- **E2E Tests** depend on: Playwright setup + Both servers running
- **Smoke Flow** depends on: E2E Tests passing

---

## 📈 Progress Tracking

### Expected Progress After Each Task

**After API Contract Fix** (Backend + Testing):
- Contract Tests: 27 → 35 (35/35 passing)
- Total: 27 → 35 (28% → 36%)

**After Test DB Setup** (Testing):
- Integration Tests: 0 → 16 (16/16 passing)
- Total: 35 → 51 (36% → 53%)

**After Classification Module** (Backend):
- Golden Tests: 0 → 7 (7/23 passing)
- Total: 51 → 58 (53% → 60%)

**After Scoring Module** (Backend):
- Golden Tests: 7 → 23 (23/23 passing)
- Total: 58 → 74 (60% → 77%)

**After Playwright Setup** (Frontend + Testing):
- E2E Tests: 0 → 30 (30/30 passing)
- Total: 74 → 96 (77% → 100%) ✅

**After Smoke Flow** (Testing):
- Smoke Flow: ⏳ → ✅ PASSING
- **Ready for Production** ✅

---

## 🚨 Critical Reminders (All Agents)

### Test-While-Developing
- ✅ Run tests AFTER every change
- ✅ Write tests FIRST (or alongside code)
- ✅ Verify progress immediately
- ✅ Don't move to next task until current tests pass

### Compliance Checks (MONITORED)
- ✅ **NO hardcoded secrets** (all in `.env` files) - 🔴 MONITORED
- ✅ **Field names**: `snake_case` (match `/dictionary.md`) - 🔴 MONITORED
- ✅ **Enum values**: Exact match (e.g., `US-Federal` with hyphen) - 🔴 MONITORED
- ✅ **Visual**: NO styling changes (Frontend Agent) - 🟠 MONITORED

### Progress Verification (MONITORED)
- ✅ Run tests after every change - 🔍 MONITORED
- ✅ Check coverage after each task - 🔍 MONITORED
- ✅ Update status in this document - 🔍 MONITORED
- ✅ Report blockers immediately - 🔍 MONITORED
- ✅ **PUSH CODE incrementally** - 🔍 MONITORED (after features, fixes, stopping points)

### Monitoring Active
**All agent work is monitored for compliance and progress!**
- 🔍 Compliance checks run automatically
- 🔍 Progress tracked in real-time
- 🔍 Violations logged and require immediate fix
- 🔍 See `MONITORING_SYSTEM.md` for details
- 🔍 Run `./monitor_agents.sh` to check compliance

---

## 📝 Status Update Protocol

### When Starting a Task
1. Update "Current Task" in this document
2. Update status to "🟡 In Progress"
3. Run compliance check: `./monitor_agents.sh`
4. Start working on task
5. Test immediately after each change

### When Completing a Task
1. Run compliance check: `./monitor_agents.sh` (verify no violations)
2. Run all relevant tests
3. Verify tests pass
4. **🚀 PUSH CODE**: Commit and push incremental changes
   ```bash
   git add .
   git commit -m "feat: [description of what was completed]"
   git push origin main
   ```
5. Update status to "✅ Complete"
6. Update "Current Task" to next priority
7. Update progress metrics
8. Notify other agents if they can proceed

### When Completing a Feature (Good Stopping Point)
**🚨 IMPORTANT: Push code incrementally!**
- ✅ After completing a feature
- ✅ After fixing a bug
- ✅ After tests pass
- ✅ After compliance check passes

**Push Command**:
```bash
# Always push when you reach a good stopping point
git add .
git commit -m "feat: [feature name] - [brief description]"
git push origin main
```

**Good Stopping Points**:
- ✅ Feature implemented and tests passing
- ✅ Bug fixed and verified
- ✅ Test suite updated and passing
- ✅ Compliance issue fixed
- ✅ At end of day (even if incomplete)

### When Blocked
1. Update status to "🔴 Blocked"
2. Document blocker in "Blocked By" column
3. **🚀 PUSH CODE**: Push current work (even if incomplete)
   ```bash
   git add .
   git commit -m "wip: [description] - blocked by [reason]"
   git push origin main
   ```
4. Notify other agents
5. Switch to unblocked task if available

### Monitoring Check
**Before committing**: Run `./monitor_agents.sh` to check compliance
**After committing**: Verify tests still pass and no violations introduced
**After pushing**: Update status documents

---

## 🔗 Reference Documents

### Agent Prompts
- **Backend Agent**: `BACKEND_AGENT_PROMPT.md`
- **Frontend Agent**: `FRONTEND_AGENT_PROMPT.md`
- **Testing Agent**: `TESTING_AGENT_PROMPT.md`

### Test Reports
- **Final Test Report**: `FINAL_TEST_REPORT.md`
- **Test Readiness**: `TEST_READINESS.md`
- **Next Steps**: `NEXT_STEPS_INTEGRATION_BACKEND.md`

### Setup & Configuration
- **Setup Complete**: `SETUP_COMPLETE.md`
- **Compliance Status**: `COMPLIANCE_STATUS.md`
- **Manual Setup Guide**: `MANUAL_SETUP_GUIDE.md`

### Contracts & Specifications
- **OpenAPI Spec**: `contracts/openapi.yml`
- **Dictionary**: `dictionary.md`
- **Scoring Algorithm**: `contracts/scoring.md`
- **Test Fixtures**: `contracts/fixtures/seed_policies.json`

---

## 🎯 Success Criteria

### Immediate (Today)
- ✅ API Contract Fix: 8/8 passing
- ✅ Test Database: Set up
- ✅ Classification Module: Implemented (7 tests passing)

### Short Term (This Week)
- ✅ Scoring Module: Implemented (16 tests passing)
- ✅ Integration Tests: 16/16 passing
- ✅ Golden Tests: 23/23 passing
- ✅ Playwright: Set up
- ✅ E2E Tests: 30/30 passing

### Final Goal
- ✅ All 96 tests passing (100%)
- ✅ >80% code coverage
- ✅ Smoke Flow: PASSING ✅
- ✅ Ready for Production ✅

---

## 📊 Current Metrics

**Last Updated**: 2025-01-XX  
**Overall Progress**: 28% (27/96 tests)

**Next Milestone**: API Contract Fix → 36% (35/96 tests)

**Target**: 100% (96/96 tests) by end of week

---

---

## 🔍 Monitoring & Compliance System

**Status**: ✅ ACTIVE  
**Purpose**: Ensure all agents stay aligned with this plan and don't deviate from original requirements

### 📋 Monitoring Documents

1. **`AGENT_DEVIATION_MONITOR.md`** - Tracks all deviations from the plan
2. **`PLAN_COMPLIANCE_CHECK.md`** - Quick reference for compliance checks
3. **`MONITORING_SYSTEM_SUMMARY.md`** - Overview of monitoring system
4. **`AGENT_PROGRESS_MONITOR.md`** - Active progress monitoring guide
5. **`monitor_agents.sh`** - Automated compliance monitoring script
6. **`agent_monitor_correct.sh`** - Automated progress monitor & document corrector ⭐ NEW

### 🔍 What Gets Monitored

- ✅ **Secrets Compliance**: NO hardcoded secrets in code
- ✅ **Field Names Compliance**: All field names must be `snake_case`
- ✅ **Enum Values Compliance**: All enum values must match `/dictionary.md`
- ✅ **API Contract Compliance**: All API responses must match `/contracts/openapi.yml`
- ✅ **Visual Design Compliance**: NO visual redesign
- ✅ **Test Coverage Compliance**: Tests written alongside code
- ✅ **Plan Compliance**: Agents follow priorities from this document

### 🚨 Deviation Detection

**When deviation detected**:
1. **Log**: Add to `AGENT_DEVIATION_MONITOR.md`
2. **Notify**: Flag in `AGENT_STATUS_TRACKER.md`
3. **Require Fix**: Agent must fix before continuing
4. **Verify**: Re-run checks after fix

**Run monitoring**:
```bash
cd "/Users/sharath/Policy Radar"

# Compliance monitoring (secrets, field names, enums)
./monitor_agents.sh

# Progress monitoring (plan compliance, document corrections)
./agent_monitor_correct.sh
```

### 📊 Monitoring Workflow

- **On Each Commit**: Automated checks run
- **Daily**: Manual review of agent progress
- **Weekly**: Full compliance audit

**All agents must comply with this plan. Deviations are logged and must be fixed immediately.**

---

**All agents: Check this document daily for updates and current priorities!** 🚀

