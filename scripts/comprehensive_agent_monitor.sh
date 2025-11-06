#!/bin/bash

# Comprehensive Agent Progress Monitor
# Tracks agent progress, verifies compliance, and ensures adherence to master plan

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

MASTER_PLAN="MASTER_COORDINATION_PLAN.md"
AGENT_TRACKER="AGENT_STATUS_TRACKER.md"
COMPLIANCE_LOG="AGENT_COMPLIANCE_CORRECTIONS.md"
DEVIATION_LOG="AGENT_DEVIATION_MONITOR.md"
PROGRESS_LOG="AGENT_PROGRESS_LOG.md"
MONITORING_REPORT="MONITORING_REPORT.md"

echo "=== Comprehensive Agent Progress Monitor ==="
echo "Date: $(date '+%Y-%m-%d %H:%M:%S')"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Initialize logs if they don't exist
if [ ! -f "$PROGRESS_LOG" ]; then
    cat > "$PROGRESS_LOG" << 'EOF'
# Agent Progress Log

**Purpose**: Track real-time agent progress and task completion

---

EOF
fi

if [ ! -f "$MONITORING_REPORT" ]; then
    cat > "$MONITORING_REPORT" << 'EOF'
# Agent Monitoring Report

**Last Updated**: $(date '+%Y-%m-%d %H:%M:%S')
**Status**: 🔴 ACTIVE MONITORING

---

EOF
fi

VIOLATIONS_FOUND=0
DEVIATIONS_FOUND=0
CORRECTIONS_MADE=0

# Function to log violation
log_violation() {
    local agent=$1
    local type=$2
    local details=$3
    
    echo "" >> "$DEVIATION_LOG"
    echo "## $(date '+%Y-%m-%d %H:%M:%S')" >> "$DEVIATION_LOG"
    echo "**Agent**: $agent" >> "$DEVIATION_LOG"
    echo "**Type**: $type" >> "$DEVIATION_LOG"
    echo "**Details**: $details" >> "$DEVIATION_LOG"
    echo "" >> "$DEVIATION_LOG"
    
    VIOLATIONS_FOUND=$((VIOLATIONS_FOUND + 1))
}

# Function to log progress
log_progress() {
    local agent=$1
    local task=$2
    local status=$3
    
    echo "" >> "$PROGRESS_LOG"
    echo "## $(date '+%Y-%m-%d %H:%M:%S')" >> "$PROGRESS_LOG"
    echo "**Agent**: $agent" >> "$PROGRESS_LOG"
    echo "**Task**: $task" >> "$PROGRESS_LOG"
    echo "**Status**: $status" >> "$PROGRESS_LOG"
    echo "" >> "$PROGRESS_LOG"
}

# 1. CHECK MASTER PLAN EXISTS
echo "1. 📋 MASTER PLAN CHECK"
if [ ! -f "$MASTER_PLAN" ]; then
    echo -e "${RED}❌ ERROR: Master plan not found!${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Master plan found${NC}"
echo ""

# 2. CHECK RECENT GIT ACTIVITY (Agent Progress)
echo "2. 📝 RECENT GIT ACTIVITY (Agent Progress)"
RECENT_COMMITS=$(git log --oneline --all --since="24 hours ago" 2>/dev/null | head -20)
if [ -n "$RECENT_COMMITS" ]; then
    echo "   Recent commits (last 24 hours):"
    echo "$RECENT_COMMITS" | sed 's/^/      /' | head -10
    
    # Analyze commit messages for agent activity
    BACKEND_COMMITS=$(echo "$RECENT_COMMITS" | grep -iE "backend|pipeline|classification|scoring|api|integration" | wc -l | tr -d ' ')
    FRONTEND_COMMITS=$(echo "$RECENT_COMMITS" | grep -iE "frontend|testid|legend|share|save|ui|e2e" | wc -l | tr -d ' ')
    TESTING_COMMITS=$(echo "$RECENT_COMMITS" | grep -iE "test|integration|contract|golden|playwright|smoke" | wc -l | tr -d ' ')
    
    echo ""
    echo "   Commit analysis:"
    echo "   - Backend-related: $BACKEND_COMMITS commits"
    echo "   - Frontend-related: $FRONTEND_COMMITS commits"
    echo "   - Testing-related: $TESTING_COMMITS commits"
else
    echo "   ⚠️  No commits in last 24 hours"
    echo "   → Agents may not be actively working"
fi
echo ""

# 3. CHECK TEST PROGRESS
echo "3. 🧪 TEST PROGRESS CHECK"
if [ -d "PolicyRadar-backend" ] && [ -f "PolicyRadar-backend/venv/bin/activate" ]; then
    echo "   Running test status check..."
    TEST_STATUS=$(cd PolicyRadar-backend && source venv/bin/activate 2>/dev/null && \
        cd .. && export TEST_DATABASE_URL=postgresql://sharath@localhost:5432/policyradar_test 2>/dev/null && \
        pytest tests/ -v --tb=no -q 2>&1 | tail -3 || echo "Tests not runnable")
    
    if echo "$TEST_STATUS" | grep -q "passed\|failed"; then
        echo "   $TEST_STATUS"
        
        # Extract numbers
        PASSED=$(echo "$TEST_STATUS" | grep -oE "[0-9]+ passed" | grep -oE "[0-9]+" || echo "0")
        FAILED=$(echo "$TEST_STATUS" | grep -oE "[0-9]+ failed" | grep -oE "[0-9]+" || echo "0")
        TOTAL=$(echo "$TEST_STATUS" | grep -oE "[0-9]+ in" | grep -oE "[0-9]+" || echo "96")
        
        if [ "$PASSED" != "0" ] && [ "$TOTAL" != "0" ]; then
            PERCENTAGE=$((PASSED * 100 / TOTAL))
            echo "   Coverage: $PERCENTAGE% ($PASSED/$TOTAL tests)"
            
            # Check if progress matches master plan
            MASTER_COVERAGE=$(grep -oE "[0-9]+/[0-9]+" "$MASTER_PLAN" | head -1 || echo "")
            if [ -n "$MASTER_COVERAGE" ] && [ "$PASSED/$TOTAL" != "$MASTER_COVERAGE" ]; then
                echo -e "${YELLOW}⚠️  Coverage mismatch - Master plan shows different numbers${NC}"
                echo "   Master plan: $MASTER_COVERAGE"
                echo "   Actual: $PASSED/$TOTAL"
                log_violation "All" "Progress Mismatch" "Test coverage doesn't match master plan. Master: $MASTER_COVERAGE, Actual: $PASSED/$TOTAL"
            fi
        fi
    else
        echo "   ⚠️  Could not run tests (check environment)"
    fi
else
    echo "   ⚠️  Backend environment not found"
fi
echo ""

# 4. CHECK AGENT PRIORITIES (Match Master Plan)
echo "4. 🎯 AGENT PRIORITIES CHECK"
if [ -f "$AGENT_TRACKER" ]; then
    # Extract priorities from master plan
    BACKEND_PRIORITY=$(grep -A 1 "Backend.*API Contract\|Backend.*Classification\|Backend.*Scoring\|Backend.*Pipeline" "$MASTER_PLAN" | head -1 | grep -oE "API Contract Fix|Classification Module|Scoring Module|Pipeline.*Logic" | head -1 || echo "Pipeline Matching Logic")
    FRONTEND_PRIORITY=$(grep -A 1 "Frontend.*Data-TestId\|Frontend.*Legend\|Frontend.*Share\|Frontend.*Save" "$MASTER_PLAN" | head -1 | grep -oE "Data-TestId|Legend|Share|Save" | head -1 || echo "Test IDs")
    TESTING_PRIORITY=$(grep -A 1 "Testing.*Integration\|Testing.*API Contract\|Testing.*Verify" "$MASTER_PLAN" | head -1 | grep -oE "Integration|API Contract|Verify" | head -1 || echo "Verify Fixes")
    
    # Check agent tracker
    BACKEND_CURRENT=$(grep -A 3 "### Backend Agent" "$AGENT_TRACKER" | grep "Current Task\|Priority" | grep -oE "API Contract|Classification|Scoring|Pipeline" | head -1 || echo "")
    FRONTEND_CURRENT=$(grep -A 3 "### Frontend Agent" "$AGENT_TRACKER" | grep "Current Task\|Priority" | grep -oE "Data-TestId|Legend|Share|Save|Test ID" | head -1 || echo "")
    TESTING_CURRENT=$(grep -A 3 "### Testing Agent" "$AGENT_TRACKER" | grep "Current Task\|Priority" | grep -oE "Integration|API Contract|Verify" | head -1 || echo "")
    
    echo "   Expected Priorities:"
    echo "   - Backend: $BACKEND_PRIORITY"
    echo "   - Frontend: $FRONTEND_PRIORITY"
    echo "   - Testing: $TESTING_PRIORITY"
    echo ""
    echo "   Current Status (from tracker):"
    echo "   - Backend: $BACKEND_CURRENT"
    echo "   - Frontend: $FRONTEND_CURRENT"
    echo "   - Testing: $TESTING_CURRENT"
    echo ""
    
    # Check for deviations
    if [ -n "$BACKEND_PRIORITY" ] && [ -n "$BACKEND_CURRENT" ] && [ "$BACKEND_CURRENT" != "$BACKEND_PRIORITY" ]; then
        echo -e "${YELLOW}⚠️  Backend Agent priority mismatch${NC}"
        echo "   Expected: $BACKEND_PRIORITY"
        echo "   Current: $BACKEND_CURRENT"
        log_violation "Backend" "Priority Deviation" "Expected: $BACKEND_PRIORITY, Current: $BACKEND_CURRENT"
    else
        echo -e "${GREEN}✅ Backend Agent on correct priority${NC}"
    fi
    
    if [ -n "$FRONTEND_PRIORITY" ] && [ -n "$FRONTEND_CURRENT" ] && [ "$FRONTEND_CURRENT" != "$FRONTEND_PRIORITY" ]; then
        echo -e "${YELLOW}⚠️  Frontend Agent priority mismatch${NC}"
        echo "   Expected: $FRONTEND_PRIORITY"
        echo "   Current: $FRONTEND_CURRENT"
        log_violation "Frontend" "Priority Deviation" "Expected: $FRONTEND_PRIORITY, Current: $FRONTEND_CURRENT"
    else
        echo -e "${GREEN}✅ Frontend Agent on correct priority${NC}"
    fi
    
    if [ -n "$TESTING_PRIORITY" ] && [ -n "$TESTING_CURRENT" ] && [ "$TESTING_CURRENT" != "$TESTING_PRIORITY" ]; then
        echo -e "${YELLOW}⚠️  Testing Agent priority mismatch${NC}"
        echo "   Expected: $TESTING_PRIORITY"
        echo "   Current: $TESTING_CURRENT"
        log_violation "Testing" "Priority Deviation" "Expected: $TESTING_PRIORITY, Current: $TESTING_CURRENT"
    else
        echo -e "${GREEN}✅ Testing Agent on correct priority${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  Agent tracker not found${NC}"
fi
echo ""

# 5. CHECK COMPLIANCE (Secrets, Field Names, Enums)
echo "5. 🔒 COMPLIANCE CHECK"

# Run existing monitor script
if [ -f "monitor_agents.sh" ]; then
    echo "   Running compliance checks..."
    COMPLIANCE_OUTPUT=$(bash monitor_agents.sh 2>/dev/null | grep -E "VIOLATION|✅|⚠️" || echo "")
    
    if echo "$COMPLIANCE_OUTPUT" | grep -qi "VIOLATION"; then
        echo -e "${RED}⚠️  Compliance violations detected!${NC}"
        echo "$COMPLIANCE_OUTPUT" | grep "VIOLATION" | head -5 | sed 's/^/      /'
        log_violation "All" "Compliance Violation" "See monitor_agents.sh output for details"
    else
        echo -e "${GREEN}✅ No compliance violations detected${NC}"
    fi
else
    echo "   ⚠️  monitor_agents.sh not found"
fi
echo ""

# 6. CHECK PROTECTED FILES
echo "6. 🔒 PROTECTED FILES CHECK"
PROTECTED_FILES=(
    "contracts/openapi.yml"
    "contracts/scoring.md"
    "dictionary.md"
    "MASTER_COORDINATION_PLAN.md"
)

for file in "${PROTECTED_FILES[@]}"; do
    if [ -f "$file" ]; then
        # Check for uncommitted changes
        if ! git diff --quiet "$file" 2>/dev/null; then
            echo -e "${RED}⚠️  $file: Has uncommitted changes${NC}"
            log_violation "All" "Protected File Modified" "$file has uncommitted changes"
        else
            # Check recent commits
            RECENT_MOD=$(git log --oneline --since="24 hours ago" -- "$file" 2>/dev/null | head -1)
            if [ -n "$RECENT_MOD" ]; then
                echo -e "${YELLOW}⚠️  $file: Modified in last 24 hours${NC}"
                echo "      $RECENT_MOD"
            else
                echo -e "${GREEN}✅ $file: No recent changes${NC}"
            fi
        fi
    fi
done
echo ""

# 7. CHECK FILE MODIFICATIONS (Agent Activity)
echo "7. 📁 RECENT FILE MODIFICATIONS"

# Backend files
BACKEND_FILES=$(find PolicyRadar-backend/app -name "*.py" -newermt "24 hours ago" 2>/dev/null | head -5)
if [ -n "$BACKEND_FILES" ]; then
    echo "   Backend files modified (last 24h):"
    echo "$BACKEND_FILES" | sed 's/^/      /'
    log_progress "Backend" "Code changes detected" "Active"
else
    echo "   ⚠️  No Backend files modified recently"
    log_progress "Backend" "No recent activity" "Inactive"
fi

# Frontend files
FRONTEND_FILES=$(find policy-radar-frontend/components -name "*.tsx" -newermt "24 hours ago" 2>/dev/null | head -5)
if [ -n "$FRONTEND_FILES" ]; then
    echo "   Frontend files modified (last 24h):"
    echo "$FRONTEND_FILES" | sed 's/^/      /'
    log_progress "Frontend" "Code changes detected" "Active"
else
    echo "   ⚠️  No Frontend files modified recently"
    log_progress "Frontend" "No recent activity" "Inactive"
fi

# Test files
TEST_FILES=$(find tests -name "*.py" -newermt "24 hours ago" 2>/dev/null | head -5)
if [ -n "$TEST_FILES" ]; then
    echo "   Test files modified (last 24h):"
    echo "$TEST_FILES" | sed 's/^/      /'
    log_progress "Testing" "Test changes detected" "Active"
else
    echo "   ⚠️  No Test files modified recently"
    log_progress "Testing" "No recent activity" "Inactive"
fi
echo ""

# 8. CHECK CODE PUSHES (Incremental Push Compliance)
echo "8. 📤 CODE PUSH COMPLIANCE"
RECENT_PUSHES=$(git log --all --remotes --since="24 hours ago" --oneline 2>/dev/null | head -10)
if [ -n "$RECENT_PUSHES" ]; then
    PUSH_COUNT=$(echo "$RECENT_PUSHES" | wc -l | tr -d ' ')
    echo -e "${GREEN}✅ Agents pushing code: $PUSH_COUNT pushes in last 24h${NC}"
    echo "$RECENT_PUSHES" | head -5 | sed 's/^/      /'
else
    echo -e "${YELLOW}⚠️  No code pushes in last 24 hours${NC}"
    echo "   → Agents may not be pushing incrementally"
    log_violation "All" "Incremental Push Missing" "No code pushes in last 24 hours - agents should push incrementally"
fi
echo ""

# 9. CHECK TASK COMPLETION STATUS
echo "9. ✅ TASK COMPLETION STATUS"

# Check for task completion indicators
if [ -f "$AGENT_TRACKER" ]; then
    # Check for completed tasks
    COMPLETED_TASKS=$(grep -iE "✅|complete|done|finished" "$AGENT_TRACKER" | wc -l | tr -d ' ')
    IN_PROGRESS=$(grep -iE "🟡|in progress|active" "$AGENT_TRACKER" | wc -l | tr -d ' ')
    BLOCKED=$(grep -iE "🔴|blocked" "$AGENT_TRACKER" | wc -l | tr -d ' ')
    
    echo "   Status from agent tracker:"
    echo "   - Completed tasks: $COMPLETED_TASKS"
    echo "   - In progress: $IN_PROGRESS"
    echo "   - Blocked: $BLOCKED"
    
    if [ "$BLOCKED" -gt "0" ]; then
        echo -e "${YELLOW}⚠️  Some tasks are blocked - review blockers${NC}"
    fi
else
    echo "   ⚠️  Agent tracker not found"
fi
echo ""

# 10. GENERATE MONITORING REPORT
echo "10. 📊 GENERATING MONITORING REPORT"

cat > "$MONITORING_REPORT" << EOF
# Agent Monitoring Report

**Last Updated**: $(date '+%Y-%m-%d %H:%M:%S')
**Status**: 🔴 ACTIVE MONITORING

---

## 📊 Summary

- **Violations Found**: $VIOLATIONS_FOUND
- **Deviations Found**: $DEVIATIONS_FOUND
- **Corrections Made**: $CORRECTIONS_MADE

---

## ✅ Agent Status

### Backend Agent
**Priority**: $BACKEND_PRIORITY
**Current Task**: $BACKEND_CURRENT
**Status**: $(if [ "$BACKEND_CURRENT" = "$BACKEND_PRIORITY" ]; then echo "✅ On Task"; else echo "⚠️ Off Task"; fi)
**Recent Activity**: $(if [ -n "$BACKEND_FILES" ]; then echo "✅ Active"; else echo "⚠️ Inactive"; fi)

### Frontend Agent
**Priority**: $FRONTEND_PRIORITY
**Current Task**: $FRONTEND_CURRENT
**Status**: $(if [ "$FRONTEND_CURRENT" = "$FRONTEND_PRIORITY" ]; then echo "✅ On Task"; else echo "⚠️ Off Task"; fi)
**Recent Activity**: $(if [ -n "$FRONTEND_FILES" ]; then echo "✅ Active"; else echo "⚠️ Inactive"; fi)

### Testing Agent
**Priority**: $TESTING_PRIORITY
**Current Task**: $TESTING_CURRENT
**Status**: $(if [ "$TESTING_CURRENT" = "$TESTING_PRIORITY" ]; then echo "✅ On Task"; else echo "⚠️ Off Task"; fi)
**Recent Activity**: $(if [ -n "$TEST_FILES" ]; then echo "✅ Active"; else echo "⚠️ Inactive"; fi)

---

## 🔍 Compliance Status

**Secrets**: $(if echo "$COMPLIANCE_OUTPUT" | grep -qi "secrets.*VIOLATION"; then echo "❌ Violations"; else echo "✅ Clean"; fi)
**Field Names**: $(if echo "$COMPLIANCE_OUTPUT" | grep -qi "field.*VIOLATION"; then echo "❌ Violations"; else echo "✅ Clean"; fi)
**Enum Values**: $(if echo "$COMPLIANCE_OUTPUT" | grep -qi "enum.*VIOLATION"; then echo "❌ Violations"; else echo "✅ Clean"; fi)

---

## 📝 Next Steps

1. Review violations in: $DEVIATION_LOG
2. Review progress in: $PROGRESS_LOG
3. Review corrections in: $COMPLIANCE_LOG
4. Verify agents are following: $MASTER_PLAN

---

**Report Generated**: $(date '+%Y-%m-%d %H:%M:%S')
EOF

echo -e "${GREEN}✅ Monitoring report generated: $MONITORING_REPORT${NC}"
echo ""

# 11. SUMMARY
echo "=== Monitoring Complete ==="
echo ""
if [ $VIOLATIONS_FOUND -gt 0 ] || [ $DEVIATIONS_FOUND -gt 0 ]; then
    echo -e "${RED}⚠️  Issues Found:${NC}"
    echo "   - Violations: $VIOLATIONS_FOUND"
    echo "   - Deviations: $DEVIATIONS_FOUND"
    echo "   Check $DEVIATION_LOG for details"
else
    echo -e "${GREEN}✅ No issues found${NC}"
fi
echo ""
echo "📊 Next Steps:"
echo "   1. Review $MONITORING_REPORT for full status"
echo "   2. Check $DEVIATION_LOG for violations"
echo "   3. Check $PROGRESS_LOG for agent activity"
echo "   4. Verify agents are following $MASTER_PLAN"
echo "   5. Run tests to verify actual progress"
echo ""
echo "⚠️  REMINDER: Master plan ($MASTER_PLAN) is the source of truth!"
echo "   Agents must follow priorities from master plan."
echo ""

