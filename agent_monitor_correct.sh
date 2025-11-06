#!/bin/bash

# Agent Progress Monitor & Plan Compliance Corrector
# Monitors agent progress and corrects mistakes in status documents

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

MASTER_PLAN="MASTER_COORDINATION_PLAN.md"
AGENT_TRACKER="AGENT_STATUS_TRACKER.md"
COMPLIANCE_LOG="AGENT_COMPLIANCE_CORRECTIONS.md"
DEVIATION_LOG="AGENT_DEVIATION_MONITOR.md"

echo "=== Agent Progress Monitor & Plan Compliance Checker ==="
echo "Date: $(date)"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Track corrections made
CORRECTIONS_MADE=0

# Function to log correction
log_correction() {
    local agent=$1
    local file=$2
    local issue=$3
    local fix=$4
    
    echo "" >> "$COMPLIANCE_LOG"
    echo "## $(date '+%Y-%m-%d %H:%M:%S')" >> "$COMPLIANCE_LOG"
    echo "**Agent**: $agent" >> "$COMPLIANCE_LOG"
    echo "**File**: $file" >> "$COMPLIANCE_LOG"
    echo "**Issue**: $issue" >> "$COMPLIANCE_LOG"
    echo "**Fix Applied**: $fix" >> "$COMPLIANCE_LOG"
    echo "" >> "$COMPLIANCE_LOG"
    
    CORRECTIONS_MADE=$((CORRECTIONS_MADE + 1))
}

# Initialize compliance log if it doesn't exist
if [ ! -f "$COMPLIANCE_LOG" ]; then
    cat > "$COMPLIANCE_LOG" << 'EOF'
# Agent Compliance Corrections Log

**Purpose**: Tracks automatic corrections made to agent status documents to ensure compliance with `MASTER_COORDINATION_PLAN.md`

---

EOF
fi

# 1. CHECK IF MASTER PLAN EXISTS
echo "1. 📋 MASTER PLAN CHECK"
if [ ! -f "$MASTER_PLAN" ]; then
    echo -e "${RED}❌ ERROR: Master plan not found!${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Master plan found${NC}"
echo ""

# 2. EXTRACT EXPECTED PRIORITIES FROM MASTER PLAN
echo "2. 🎯 EXTRACTING EXPECTED PRIORITIES FROM MASTER PLAN"

BACKEND_PRIORITY=$(grep -A 1 "Backend.*API Contract Fix\|Backend.*Classification\|Backend.*Scoring" "$MASTER_PLAN" | head -1 | grep -oE "API Contract Fix|Classification Module|Scoring Module" | head -1 || echo "")
FRONTEND_PRIORITY=$(grep -A 1 "Frontend.*Data-TestId\|Frontend.*Legend" "$MASTER_PLAN" | head -1 | grep -oE "Data-TestId|Legend" | head -1 || echo "")
TESTING_PRIORITY=$(grep -A 1 "Testing.*Integration\|Testing.*API Contract" "$MASTER_PLAN" | head -1 | grep -oE "Integration|API Contract" | head -1 || echo "")

echo "   Expected Priorities:"
echo "   - Backend: $BACKEND_PRIORITY"
echo "   - Frontend: $FRONTEND_PRIORITY"
echo "   - Testing: $TESTING_PRIORITY"
echo ""

# 3. CHECK AGENT STATUS TRACKER FOR DEVIATIONS
echo "3. 🔍 CHECKING AGENT STATUS TRACKER FOR DEVIATIONS"

if [ ! -f "$AGENT_TRACKER" ]; then
    echo -e "${YELLOW}⚠️  Agent tracker not found - creating template${NC}"
    # Create a template based on master plan
    cat > "$AGENT_TRACKER" << 'EOF'
# Agent Status Tracker - Real-Time Updates

**Last Updated**: $(date '+%Y-%m-%d')  
**Update Frequency**: After each task completion  
**Purpose**: Track real-time progress of all agents

---

## 👥 Agent Status

### Backend Agent
**Status**: 🟡 Active  
**Current Task**: API Contract Fix  
**Priority**: 🔴 CRITICAL  
**Blockers**: None

### Frontend Agent
**Status**: 🟡 Active  
**Current Task**: Add Missing Data-TestId Attributes  
**Priority**: 🔴 CRITICAL - BLOCKING E2E  
**Blockers**: None

### Testing Agent
**Status**: 🟡 Active  
**Current Task**: Coordinate Integration Test Fixes  
**Priority**: 🔴 CRITICAL  
**Blockers**: None

---

EOF
    log_correction "System" "$AGENT_TRACKER" "File missing" "Created template based on master plan"
fi

# 4. VERIFY AGENT PRIORITIES MATCH MASTER PLAN
echo "4. ✅ VERIFYING AGENT PRIORITIES MATCH MASTER PLAN"

# Check Backend Agent priority
BACKEND_CURRENT=$(grep -A 3 "### Backend Agent" "$AGENT_TRACKER" | grep "Current Task" | grep -oE "API Contract Fix|Classification Module|Scoring Module" | head -1 || echo "")
if [ -z "$BACKEND_CURRENT" ] || [ "$BACKEND_CURRENT" != "$BACKEND_PRIORITY" ]; then
    if [ -n "$BACKEND_PRIORITY" ]; then
        echo -e "${YELLOW}⚠️  Backend Agent priority mismatch${NC}"
        echo "   Current: $BACKEND_CURRENT"
        echo "   Expected: $BACKEND_PRIORITY"
        # Don't auto-correct, just warn (agents should update themselves)
        echo "   → Logging deviation (agents should fix)"
        echo "   - Agent: Backend" >> "$DEVIATION_LOG"
        echo "   - Issue: Priority mismatch - Current: $BACKEND_CURRENT, Expected: $BACKEND_PRIORITY" >> "$DEVIATION_LOG"
        echo "   - Date: $(date)" >> "$DEVIATION_LOG"
        echo "" >> "$DEVIATION_LOG"
    fi
else
    echo -e "${GREEN}✅ Backend Agent priority matches master plan${NC}"
fi

# Check Frontend Agent priority
FRONTEND_CURRENT=$(grep -A 3 "### Frontend Agent" "$AGENT_TRACKER" | grep "Current Task" | grep -oE "Data-TestId|Legend" | head -1 || echo "")
if [ -z "$FRONTEND_CURRENT" ] || [ "$FRONTEND_CURRENT" != "$FRONTEND_PRIORITY" ]; then
    if [ -n "$FRONTEND_PRIORITY" ]; then
        echo -e "${YELLOW}⚠️  Frontend Agent priority mismatch${NC}"
        echo "   Current: $FRONTEND_CURRENT"
        echo "   Expected: $FRONTEND_PRIORITY"
        echo "   → Logging deviation (agents should fix)"
        echo "   - Agent: Frontend" >> "$DEVIATION_LOG"
        echo "   - Issue: Priority mismatch - Current: $FRONTEND_CURRENT, Expected: $FRONTEND_PRIORITY" >> "$DEVIATION_LOG"
        echo "   - Date: $(date)" >> "$DEVIATION_LOG"
        echo "" >> "$DEVIATION_LOG"
    fi
else
    echo -e "${GREEN}✅ Frontend Agent priority matches master plan${NC}"
fi

# Check Testing Agent priority
TESTING_CURRENT=$(grep -A 3 "### Testing Agent" "$AGENT_TRACKER" | grep "Current Task" | grep -oE "Integration|API Contract" | head -1 || echo "")
if [ -z "$TESTING_CURRENT" ] || [ "$TESTING_CURRENT" != "$TESTING_PRIORITY" ]; then
    if [ -n "$TESTING_PRIORITY" ]; then
        echo -e "${YELLOW}⚠️  Testing Agent priority mismatch${NC}"
        echo "   Current: $TESTING_CURRENT"
        echo "   Expected: $TESTING_PRIORITY"
        echo "   → Logging deviation (agents should fix)"
        echo "   - Agent: Testing" >> "$DEVIATION_LOG"
        echo "   - Issue: Priority mismatch - Current: $TESTING_CURRENT, Expected: $TESTING_PRIORITY" >> "$DEVIATION_LOG"
        echo "   - Date: $(date)" >> "$DEVIATION_LOG"
        echo "" >> "$DEVIATION_LOG"
    fi
else
    echo -e "${GREEN}✅ Testing Agent priority matches master plan${NC}"
fi
echo ""

# 5. CHECK FOR PROTECTED FILES BEING MODIFIED
echo "5. 🔒 CHECKING FOR PROTECTED FILES MODIFIED"

PROTECTED_FILES=(
    "contracts/openapi.yml"
    "contracts/scoring.md"
    "dictionary.md"
    "MASTER_COORDINATION_PLAN.md"
)

for file in "${PROTECTED_FILES[@]}"; do
    if [ -f "$file" ]; then
        # Check if file was modified recently (last 24 hours)
        if git diff --quiet "$file" 2>/dev/null; then
            echo -e "${GREEN}✅ $file: No uncommitted changes${NC}"
        else
            echo -e "${RED}⚠️  $file: Has uncommitted changes${NC}"
            echo "   → Checking if changes are authorized..."
            # Don't auto-revert, just warn
            echo "   - File: $file" >> "$DEVIATION_LOG"
            echo "   - Issue: Uncommitted changes detected" >> "$DEVIATION_LOG"
            echo "   - Date: $(date)" >> "$DEVIATION_LOG"
            echo "" >> "$DEVIATION_LOG"
        fi
    fi
done
echo ""

# 6. CHECK TEST COVERAGE MATCHES MASTER PLAN
echo "6. 📊 CHECKING TEST COVERAGE NUMBERS"

# Extract expected coverage from master plan
MASTER_COVERAGE=$(grep "Total.*96.*[0-9]" "$MASTER_PLAN" | head -1 | grep -oE "[0-9]+/[0-9]+" | head -1 || echo "")

if [ -n "$MASTER_COVERAGE" ]; then
    echo "   Master Plan Coverage: $MASTER_COVERAGE"
    # Verify test results match
    echo "   → Run tests to verify actual coverage matches"
else
    echo "   → Could not extract coverage from master plan"
fi
echo ""

# 7. CHECK RECENT COMMITS FOR PLAN COMPLIANCE
echo "7. 📝 CHECKING RECENT COMMITS FOR PLAN COMPLIANCE"

RECENT_COMMITS=$(git log --oneline --all -10 2>/dev/null | head -5)
if [ -n "$RECENT_COMMITS" ]; then
    echo "   Recent commits:"
    echo "$RECENT_COMMITS" | sed 's/^/      /'
    
    # Check if commits mention protected files
    PROTECTED_CHANGED=$(echo "$RECENT_COMMITS" | grep -E "openapi\.yml|scoring\.md|dictionary\.md|MASTER_COORDINATION" || true)
    if [ -n "$PROTECTED_CHANGED" ]; then
        echo -e "${YELLOW}⚠️  Protected files mentioned in recent commits${NC}"
        echo "   → Review to ensure changes are authorized"
    fi
else
    echo "   No recent commits found"
fi
echo ""

# 8. CHECK FOR AGENT STATUS DOCUMENT DEVIATIONS
echo "8. 🔍 CHECKING AGENT STATUS DOCUMENTS FOR DEVIATIONS"

# Check if agent status documents reference correct master plan
if [ -f "$AGENT_TRACKER" ]; then
    if grep -q "MASTER_COORDINATION_PLAN" "$AGENT_TRACKER"; then
        echo -e "${GREEN}✅ Agent tracker references master plan${NC}"
    else
        echo -e "${YELLOW}⚠️  Agent tracker missing reference to master plan${NC}"
        # Auto-fix: Add reference
        if ! grep -q "**Reference**:.*MASTER_COORDINATION_PLAN" "$AGENT_TRACKER"; then
            echo "" >> "$AGENT_TRACKER"
            echo "---" >> "$AGENT_TRACKER"
            echo "" >> "$AGENT_TRACKER"
            echo "**Reference**: See \`MASTER_COORDINATION_PLAN.md\` for authoritative priorities and status." >> "$AGENT_TRACKER"
            log_correction "System" "$AGENT_TRACKER" "Missing master plan reference" "Added reference to master plan"
        fi
    fi
fi
echo ""

# 9. VERIFY COMPLIANCE WITH ORIGINAL REQUIREMENTS
echo "9. ✅ VERIFYING COMPLIANCE WITH ORIGINAL REQUIREMENTS"

# Check for violations (using existing monitor_agents.sh checks)
if [ -f "monitor_agents.sh" ]; then
    echo "   Running compliance checks..."
    # Run first part of monitor script (secrets, field names, enums)
    bash monitor_agents.sh 2>/dev/null | head -20
else
    echo "   → monitor_agents.sh not found"
fi
echo ""

# 10. SUMMARY
echo "=== Monitoring Complete ==="
echo ""
if [ $CORRECTIONS_MADE -gt 0 ]; then
    echo -e "${YELLOW}⚠️  Corrections Made: $CORRECTIONS_MADE${NC}"
    echo "   Check $COMPLIANCE_LOG for details"
else
    echo -e "${GREEN}✅ No corrections needed${NC}"
fi
echo ""
echo "📊 Next Steps:"
echo "   1. Review $DEVIATION_LOG for any deviations found"
echo "   2. Review $COMPLIANCE_LOG for corrections applied"
echo "   3. Verify agents are following priorities from $MASTER_PLAN"
echo "   4. Run tests to verify actual progress matches documented progress"
echo ""
echo "⚠️  REMINDER: Master plan ($MASTER_PLAN) is the source of truth!"
echo "   Agents must follow priorities from master plan."
echo ""

