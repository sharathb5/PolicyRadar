# Auto-Update Notes for Compliance Monitoring

## What Gets Updated Automatically

When I detect violations during monitoring, I will **immediately** update:

### 1. `/COMPLIANCE_STATUS.md`
- **Violations Found** section: Add new violation with full details
- **Status**: Change from ✅ to ⚠️ when violations found
- **Affected Sections**: Update relevant compliance sections
- **Last Updated**: Timestamp when violation detected

### 2. `/.compliance-monitor.md`
- **Violation Log**: Add entry with timestamp
- **Tracking**: Keep history of all violations
- **Resolution**: Mark when fixed

### 3. Relevant Checklists
- **BACKEND_ADVISORY.md**: If backend violations found
- **Monitoring checklists**: Update status indicators

## Update Triggers

I will automatically update when I detect:

1. **Hardcoded Secrets** → 🔴 CRITICAL
   - API keys, passwords, tokens in code
   - Update: Security Compliance section + Violations Found

2. **Field Name Mismatches** → 🔴 CRITICAL
   - Field names don't match dictionary.md
   - Update: Naming Convention Compliance + Violations Found

3. **Enum Value Mismatches** → 🔴 CRITICAL
   - Enum values don't match dictionary.md
   - Update: Naming Convention Compliance + Violations Found

4. **Visual Changes** → 🟠 HIGH
   - Unauthorized styling/layout changes
   - Update: Visual Design Compliance + Violations Found

5. **Structure Deviations** → 🟡 MEDIUM
   - File structure doesn't match plan
   - Update: Structure Compliance + Violations Found

## Update Format

All updates follow this format:

```markdown
### 🔴 CRITICAL - [YYYY-MM-DD HH:MM:SS]
- **File**: `path/to/violation/file.py`
- **Type**: [Violation Category]
- **Details**: 
  - Expected: [from contracts]
  - Found: [in code]
- **Fix Required**: [Specific action]
- **Status**: ❌ Not Fixed
```

## Monitoring Frequency

I will check:
- On file creation/modification
- When agents create new code
- Periodically during development
- Before any commit/review

**Result**: Real-time violation detection and immediate updates to COMPLIANCE_STATUS.md

