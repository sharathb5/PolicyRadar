#!/bin/bash

# Agent Monitoring Script
# Runs compliance checks and progress tracking

echo "=== Agent Monitoring Report ==="
echo "Date: $(date)"
echo ""

cd "/Users/sharath/Policy Radar"

# 1. SECRETS CHECK
echo "1. 🔐 SECRETS CHECK"
SECRETS=$(grep -r -E "api[_-]?key|secret|password|token|api_key|API_KEY" \
  --exclude-dir=node_modules \
  --exclude-dir=venv \
  --exclude-dir=.git \
  --exclude-dir=.next \
  --exclude="*.md" \
  --exclude="*.json" \
  --exclude="*.env" \
  --exclude="*.env.local" \
  --exclude="*.example" \
  PolicyRadar-backend/ policy-radar-frontend/ tests/ 2>/dev/null | \
  grep -v ".env" | grep -v "example" | grep -v "test" | grep -v "fixture" | grep -v "NEXT_PUBLIC_API_KEY")

if [ -z "$SECRETS" ]; then
  echo "✅ No hardcoded secrets found"
else
  echo "⚠️  VIOLATION: Hardcoded secrets found!"
  echo "$SECRETS"

fi
echo ""

# 2. FIELD NAMES CHECK
echo "2. 📝 FIELD NAMES CHECK (must be snake_case)"
FIELD_NAMES=$(grep -r -E "impactScore|policyType|effectiveDate|sourceName|lastUpdated|whatMight" \
  --include="*.py" \
  --include="*.ts" \
  --include="*.tsx" \
  PolicyRadar-backend/app/api/ policy-radar-frontend/lib/services/ policy-radar-frontend/lib/types.ts 2>/dev/null | \
  grep -v "test" | grep -v "comment" | grep -v "//" | grep -v "#")

if [ -z "$FIELD_NAMES" ]; then
  echo "✅ Field names comply (snake_case)"
else
  echo "⚠️  VIOLATION: camelCase found (should be snake_case)!"
  echo "$FIELD_NAMES"
fi
echo ""

# 3. ENUM VALUES CHECK
echo "3. 🏷️  ENUM VALUES CHECK (must match dictionary.md)"
ENUM_VALUES=$(grep -r -E "US_Federal|USFederal|Supply_chain|SupplyChain|US_CA|USCA" \
  --include="*.py" \
  --include="*.ts" \
  --include="*.tsx" \
  PolicyRadar-backend/ policy-radar-frontend/ 2>/dev/null | \
  grep -v "test" | grep -v "comment" | grep -v "//" | grep -v "#" | grep -v "US-Federal" | grep -v "Supply-chain")

if [ -z "$ENUM_VALUES" ]; then
  echo "✅ Enum values comply (with hyphens)"
else
  echo "⚠️  VIOLATION: Wrong enum values found (should use hyphens)!"
  echo "$ENUM_VALUES"
fi
echo ""

# 4. CONTRACT TESTS
echo "4. 📋 CONTRACT TESTS"
export API_KEY=1bb26b00a037526ce34654e867a89738d9e3eec1bc1f108127ccaaa4d8cf247d
CONTRACT_RESULTS=$(cd PolicyRadar-backend && source venv/bin/activate 2>/dev/null && \
  cd .. && pytest tests/contract/ -v --tb=no -q 2>&1 | tail -5)

echo "$CONTRACT_RESULTS"
echo ""

# 5. TEST PROGRESS
echo "5. 📊 TEST PROGRESS"
PROGRESS=$(cd PolicyRadar-backend && source venv/bin/activate 2>/dev/null && \
  cd .. && pytest tests/contract/ tests/unit/ tests/integration/ -v --tb=no -q 2>&1 | \
  grep -E "passed|failed|skipped" | tail -1)

if [ -z "$PROGRESS" ]; then
  echo "⚠️  Could not get test progress"
else
  echo "$PROGRESS"
  
  # Extract numbers
  PASSED=$(echo "$PROGRESS" | grep -oE "[0-9]+ passed" | grep -oE "[0-9]+" || echo "0")
  TOTAL=$(echo "$PROGRESS" | grep -oE "[0-9]+ in" | grep -oE "[0-9]+" || echo "96")
  
  echo "   Current: ~$PASSED tests passing (target: 96)"
fi
echo ""

# 6. AGENT STATUS
echo "6. 👥 AGENT STATUS"
if [ -f "AGENT_STATUS_TRACKER.md" ]; then
  echo "✅ Status tracker exists"
  echo "   Check AGENT_STATUS_TRACKER.md for detailed status"
else
  echo "⚠️  Status tracker not found"
fi
echo ""

# 7. RECENT COMMITS
echo "7. 📝 RECENT COMMITS (last 5)"
git log --oneline --all -5 2>/dev/null | head -5
echo ""

# 8. DEVIATION CHECK
echo "8. 🔍 DEVIATION CHECK (vs MASTER_COORDINATION_PLAN.md)"
if [ -f "MASTER_COORDINATION_PLAN.md" ]; then
  echo "✅ Master plan exists - checking agent alignment"
  
  # Check if agents are following priorities from master plan
  echo "   📋 Checking agent priorities..."
  echo "   - Backend: Should be working on API Contract Fix (Priority 1)"
  echo "   - Frontend: Should be working on Data-TestId Fix (Priority 1)"
  echo "   - Testing: Should be working on API Contract Fix (Priority 1)"
  
  # Check recent commits to see what agents are working on
  RECENT_WORK=$(git log --oneline --all -10 2>/dev/null | head -10)
  if [ ! -z "$RECENT_WORK" ]; then
    echo "   📝 Recent commits:"
    echo "$RECENT_WORK" | head -5 | sed 's/^/      /'
  fi
else
  echo "⚠️  Master plan not found!"
fi
echo ""

# 9. PLAN COMPLIANCE CHECK
echo "9. ✅ PLAN COMPLIANCE"
echo "   📖 Source of Truth: MASTER_COORDINATION_PLAN.md"
echo "   🔍 Review agent status vs master plan:"
echo "      - Check AGENT_STATUS_TRACKER.md"
echo "      - Verify priorities match master plan"
echo "      - Ensure no deviations from original requirements"
echo "   ⚠️  If deviations found, update AGENT_DEVIATION_MONITOR.md"
echo ""

echo "=== Monitoring Complete ==="
echo ""
echo "📊 Next Steps:"
echo "   1. Review violations (if any) - fix immediately"
echo "   2. Check AGENT_STATUS_TRACKER.md for agent status"
echo "   3. Verify agents are aligned with MASTER_COORDINATION_PLAN.md"
echo "   4. Log any deviations in AGENT_DEVIATION_MONITOR.md"
echo "   5. Update MASTER_COORDINATION_PLAN.md with progress"
echo "   6. Run tests after fixing any violations"
echo ""
echo "🚀 REMINDER: Push code incrementally!"
echo "   - Push after each feature completion"
echo "   - Push after each fix"
echo "   - Push at end of day (even if incomplete)"
echo "   - See INCREMENTAL_PUSH_REMINDER.md for details"
echo ""
echo "⚠️  DEVIATION ALERT: If any agent deviates from MASTER_COORDINATION_PLAN.md,"
echo "    log it in AGENT_DEVIATION_MONITOR.md and notify the agent immediately."
echo ""

