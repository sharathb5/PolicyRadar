# Impact Scoring Algorithm Specification

## Overview
The impact scoring algorithm assigns a score from 0-100 to each policy based on rule-based factors. The score is explainable and stored with a factor breakdown for transparency.

## Scoring Formula

Total Impact Score = Sum of all factors (capped at 100)

### Factor 1: Mandatory vs Voluntary (0-20 points)
- **Mandatory policies**: +20 points
- **Voluntary policies**: +10 points

*Rationale*: Mandatory policies have higher impact as they create compliance requirements.

### Factor 2: Time Proximity (0-20 points)
Based on days until effective date:
- **≤12 months (365 days)**: +20 points
- **12-24 months (366-730 days)**: +10 points
- **>24 months (>730 days)**: +0 points

*Rationale*: More imminent policies require immediate action and have higher impact.

### Factor 3: Scope Coverage (0-20 points)
Based on emissions scopes covered:
- **Scope 1**: +7 points
- **Scope 2**: +7 points
- **Scope 3**: +7 points
- **Maximum**: 20 points (capped even if all 3 scopes)

*Rationale*: Broader scope coverage increases impact as it affects more of a company's emissions footprint.

### Factor 4: Sector Breadth (0-20 points)
Based on number of sectors affected:
- **Narrow (1-2 sectors)**: +5 points
- **Medium (3-5 sectors)**: +12 points
- **Cross-sector (6+ sectors or general)**: +20 points

*Rationale*: Cross-sector policies affect more companies and industries.

### Factor 5: Disclosure Complexity (0-20 points)
Based on additional reporting/assurance requirements:
- **No additional complexity**: 0 points
- **Basic disclosure (data only)**: +7 points
- **Moderate (data + assurance)**: +14 points
- **High (data + assurance + granular supplier data)**: +20 points

*Rationale*: More complex disclosure requirements create higher implementation burden.

## Implementation Notes

### Total Score Calculation
```python
total_score = (
    mandatory_factor +  # 10 or 20
    time_proximity +    # 0, 10, or 20
    scope_coverage +    # 0-20 (capped)
    sector_breadth +    # 5, 12, or 20
    disclosure_complexity  # 0-20
)

# Cap at 100
impact_score = min(total_score, 100)
```

### Impact Factors JSON Structure
The `impact_factors` field stores the breakdown:
```json
{
  "mandatory": 20,
  "time_proximity": 20,
  "scope_coverage": 20,
  "sector_breadth": 20,
  "disclosure_complexity": 2
}
```

### Examples

**Example 1: High Impact Policy**
- Mandatory: +20
- Time: ≤12m: +20
- Scopes: [1, 2, 3]: +20 (capped)
- Sectors: Cross-sector: +20
- Disclosure: High: +20
- **Total: 100** (capped)

**Example 2: Medium Impact Policy**
- Mandatory: +10 (voluntary)
- Time: 12-24m: +10
- Scopes: [1, 2]: +14
- Sectors: Medium: +12
- Disclosure: Moderate: +14
- **Total: 60**

**Example 3: Low Impact Policy**
- Mandatory: +10 (voluntary)
- Time: >24m: +0
- Scopes: [1]: +7
- Sectors: Narrow: +5
- Disclosure: Basic: +7
- **Total: 29**

## Classification Rules for Factors

### Mandatory Detection
- Keywords: "mandatory", "required", "must", "shall", "compliance", "penalty", "enforcement"
- If keywords present → mandatory = true
- Otherwise → mandatory = false

### Time Proximity Calculation
```python
days_until_effective = (effective_date - today).days
if days_until_effective <= 365:
    time_proximity = 20
elif days_until_effective <= 730:
    time_proximity = 10
else:
    time_proximity = 0
```

### Scope Detection
- Look for keywords: "Scope 1", "Scope 2", "Scope 3", "direct emissions", "indirect emissions", "value chain"
- Infer from context: if mentions "supplier", "value chain" → likely includes Scope 3

### Sector Breadth Detection
- Count sector mentions in policy text
- Common sectors: energy, manufacturing, transportation, agriculture, construction, services
- If mentions 6+ sectors or "all sectors" → cross-sector

### Disclosure Complexity Detection
- Keywords for high complexity: "supplier-level", "granular", "itemized", "product-level", "assurance", "audit"
- Keywords for moderate: "assurance", "third-party", "verification"
- Keywords for basic: "disclosure", "report", "data"

## Testing Requirements

Golden test cases must validate:
1. Score calculation for each factor independently
2. Total score capping at 100
3. Impact factors JSON structure
4. Edge cases (exactly 365 days, exactly 730 days, etc.)

