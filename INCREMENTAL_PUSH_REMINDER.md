# Incremental Push Reminder - For All Agents

**🚨 IMPORTANT**: Push code frequently and incrementally!

---

## 🎯 When to Push Code

### ✅ Always Push When:

1. **Feature Completed** ✅
   - Feature implemented
   - Tests passing
   - Compliance check passed
   - **Push immediately!**

2. **Bug Fixed** ✅
   - Bug identified and fixed
   - Tests passing
   - Verified working
   - **Push immediately!**

3. **Tests Updated** ✅
   - New tests written
   - Tests passing
   - Coverage improved
   - **Push immediately!**

4. **Compliance Issue Fixed** ✅
   - Violation fixed
   - Compliance check passes
   - **Push immediately!**

5. **Good Stopping Point** ✅
   - Natural break in work
   - Logical completion point
   - Before switching tasks
   - **Push before switching!**

6. **End of Day** ✅
   - Even if incomplete
   - Push work in progress
   - Use `wip:` prefix in commit message
   - **Push before ending work!**

7. **Blocked** ✅
   - Encountered blocker
   - Can't proceed further
   - Push current state
   - Use `wip:` prefix and note blocker
   - **Push before switching tasks!**

---

## 🚀 Push Command

### Standard Push (Feature/Fix Complete)

```bash
# 1. Check what changed
git status

# 2. Add changes
git add .

# 3. Commit with descriptive message
git commit -m "feat: [feature name] - [brief description]"

# Examples:
# git commit -m "feat: fix API contract test fixture - add API key to headers"
# git commit -m "feat: implement classification module - policy type classification"
# git commit -m "test: add integration tests for idempotency - test database setup"

# 4. Push to remote
git push origin main
```

### Work in Progress Push (Incomplete)

```bash
# When work is incomplete but want to save progress
git add .
git commit -m "wip: [what you're working on] - [current state]"

# Examples:
# git commit -m "wip: classification module - implementing policy type logic"
# git commit -m "wip: API contract fix - debugging test fixture"
# git commit -m "wip: test database setup - blocked by migration issue"

git push origin main
```

### Bug Fix Push

```bash
git add .
git commit -m "fix: [bug description] - [what was fixed]"

# Examples:
# git commit -m "fix: enum value mismatch - changed US_CA to US-CA"
# git commit -m "fix: field name compliance - changed impactScore to impact_score"

git push origin main
```

---

## 📋 Commit Message Format

### Standard Format

```
[type]: [short description] - [detailed description]

Types:
- feat: New feature
- fix: Bug fix
- test: Test updates
- docs: Documentation
- refactor: Code refactoring
- wip: Work in progress
```

### Examples

```
feat: API contract test fixture - add API key to test client headers
fix: field names compliance - change camelCase to snake_case
test: golden tests for classification - add 7 test cases
wip: classification module - implementing jurisdiction mapping
```

---

## 🔍 Pre-Push Checklist

Before pushing, always:

1. **Run Compliance Check**
   ```bash
   ./monitor_agents.sh
   ```
   - ✅ No hardcoded secrets
   - ✅ Field names comply
   - ✅ Enum values comply

2. **Run Tests**
   ```bash
   # For backend changes
   pytest tests/ -v

   # For frontend changes
   npm run type-check
   npm run lint
   ```

3. **Verify Changes**
   - ✅ All changes committed
   - ✅ Tests passing
   - ✅ No violations

4. **Update Status** (if needed)
   - Update `AGENT_STATUS_TRACKER.md`
   - Update progress metrics

5. **Push**
   ```bash
   git push origin main
   ```

---

## ⚠️ Important Reminders

### Do NOT:
- ❌ Wait until end of day to push
- ❌ Push only when everything is perfect
- ❌ Work on multiple features without pushing
- ❌ Let code sit uncommitted for days

### Do:
- ✅ Push after each feature completion
- ✅ Push even if incomplete (use `wip:`)
- ✅ Push before switching tasks
- ✅ Push before end of day
- ✅ Push when blocked

---

## 📊 Benefits of Incremental Pushes

### For You (Agent)
- ✅ Backup your work (saved remotely)
- ✅ Track progress (commit history)
- ✅ Easy to revert if needed
- ✅ Can switch tasks safely

### For Team
- ✅ Others can see your progress
- ✅ Early feedback possible
- ✅ Easier code review
- ✅ Better coordination

### For Project
- ✅ Less risk of losing work
- ✅ Better progress tracking
- ✅ Easier debugging (git blame)
- ✅ Cleaner git history

---

## 🎯 Push Frequency Guidelines

### Minimum Frequency
- **After each feature**: ✅ Required
- **After each fix**: ✅ Required
- **At end of day**: ✅ Required
- **When blocked**: ✅ Required

### Recommended Frequency
- **Every 1-2 hours**: During active development
- **After each test suite update**: ✅
- **After compliance fixes**: ✅
- **Before lunch break**: ✅
- **Before end of day**: ✅

---

## 📝 Examples by Agent

### Backend Agent Examples

```bash
# After fixing API contract fixture
git commit -m "feat: API contract test fixture - add API key to headers"
git push

# After implementing classification module
git commit -m "feat: classification module - implement policy type classification"
git push

# During work (incomplete)
git commit -m "wip: classification module - implementing jurisdiction mapping"
git push
```

### Frontend Agent Examples

```bash
# After verifying API integration
git commit -m "feat: API integration verification - test all endpoints"
git push

# After fixing field names
git commit -m "fix: field names compliance - update API client to use snake_case"
git push

# During work (incomplete)
git commit -m "wip: feed page integration - testing filters"
git push
```

### Testing Agent Examples

```bash
# After setting up test database
git commit -m "test: test database setup - configure policyradar_test database"
git push

# After fixing test fixture
git commit -m "test: API contract test fixture - add API key support"
git push

# During work (incomplete)
git commit -m "wip: integration tests - setting up test database"
git push
```

---

## 🚨 Critical Rule

**If you complete a feature and tests pass → PUSH IMMEDIATELY**

**Don't wait. Don't accumulate changes. Push as you go!**

---

**Remember: Frequent pushes = Better coordination = Faster progress!** 🚀✅

