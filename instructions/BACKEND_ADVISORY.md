# ⚠️ CRITICAL: Backend Agent Advisory

## 🔴 HIGH PRIORITY WARNINGS

### 1. NO HARDCODED VALUES

**CRITICAL**: Do NOT hardcode any of the following in your code:

#### ❌ FORBIDDEN:
- API keys, passwords, tokens, credentials
- Database connection strings
- API endpoint URLs (except for examples in OpenAPI spec)
- Secret keys, encryption keys
- Any configuration that should be in `.env` files

#### ✅ CORRECT APPROACH:
- Use environment variables via `.env` files
- Load via Pydantic Settings (from `app.config`)
- Provide `.env.example` with placeholder values
- Document required env vars in README

#### Example - WRONG:
```python
DATABASE_URL = "postgresql://user:password@localhost/db"
API_KEY = "sk-1234567890"
```

#### Example - CORRECT:
```python
# app/config.py
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    database_url: str
    api_token: str
    
    class Config:
        env_file = ".env"

# .env.example
DATABASE_URL=postgresql://user:password@localhost/db
API_TOKEN=your-api-token-here
```

---

### 2. FIELD NAME COMPLIANCE - EXACT MATCH REQUIRED

**CRITICAL**: ALL field names must match `/dictionary.md` and `/contracts/openapi.yml` EXACTLY.

#### ❌ FORBIDDEN:
- Changing field names (e.g., `impactScore` instead of `impact_score`)
- Using different enum values (e.g., `US_Federal` instead of `US-Federal`)
- Adding fields not in the OpenAPI spec
- Removing required fields from the spec

#### ✅ CORRECT APPROACH:
1. **ALWAYS** reference `/dictionary.md` before creating any field
2. **ALWAYS** reference `/contracts/openapi.yml` before creating API schemas
3. Use `snake_case` for all field names (matching OpenAPI spec)
4. Use exact enum values from dictionary.md

#### Field Name Checklist:

**Response Fields** (must match dictionary.md):
- ✅ `id` (integer)
- ✅ `title` (string)
- ✅ `jurisdiction` (enum: EU, US-Federal, US-CA, UK, OTHER)
- ✅ `policy_type` (enum: Disclosure, Pricing, Ban, Incentive, Supply-chain)
- ✅ `status` (enum: Proposed, Adopted, Effective)
- ✅ `scopes` (array of integers: 1, 2, 3)
- ✅ `impact_score` (integer 0-100)
- ✅ `confidence` (float 0-1)
- ✅ `effective_date` (date YYYY-MM-DD)
- ✅ `last_updated_at` (date YYYY-MM-DD)
- ✅ `source_name_official` (string)
- ✅ `source_name_secondary` (string, nullable)
- ✅ `what_might_change` (string)
- ✅ `summary` (string) - in detail view
- ✅ `impact_factors` (object) - in detail view
- ✅ `mandatory` (boolean) - in detail view
- ✅ `sectors` (array of strings, nullable) - in detail view
- ✅ `version` (integer) - in detail view
- ✅ `history` (array) - in detail view

#### Enum Values (must match EXACTLY):

**Jurisdiction:**
- ✅ `EU`
- ✅ `US-Federal` (with hyphen!)
- ✅ `US-CA` (with hyphen!)
- ✅ `UK`
- ✅ `OTHER`

**Policy Type:**
- ✅ `Disclosure`
- ✅ `Pricing`
- ✅ `Ban`
- ✅ `Incentive`
- ✅ `Supply-chain` (with hyphen!)

**Status:**
- ✅ `Proposed`
- ✅ `Adopted`
- ✅ `Effective`

**Sort Options:**
- ✅ `impact`
- ✅ `effective`
- ✅ `updated`

#### Example - WRONG:
```python
class PolicyResponse(BaseModel):
    policyId: int  # ❌ WRONG - should be 'id'
    policyType: str  # ❌ WRONG - should be 'policy_type'
    impactScore: int  # ❌ WRONG - should be 'impact_score'
    jurisdiction: Literal["EU", "US_Federal"]  # ❌ WRONG - should be 'US-Federal'
```

#### Example - CORRECT:
```python
from enum import Enum

class Jurisdiction(str, Enum):
    EU = "EU"
    US_FEDERAL = "US-Federal"  # Note: enum key can differ, value must match
    US_CA = "US-CA"
    UK = "UK"
    OTHER = "OTHER"

class PolicyListItem(BaseModel):
    id: int  # ✅ Matches dictionary.md
    title: str
    jurisdiction: Jurisdiction  # ✅ Uses exact enum values
    policy_type: str  # ✅ snake_case matches dictionary.md
    status: str
    scopes: List[int]
    impact_score: int  # ✅ snake_case
    confidence: float
    effective_date: date  # ✅ snake_case
    last_updated_at: date  # ✅ snake_case
    source_name_official: str  # ✅ snake_case
    source_name_secondary: Optional[str]
    what_might_change: str
    
    class Config:
        # Use alias to convert to camelCase if needed for JSON
        # But schema should match OpenAPI (snake_case)
        pass
```

---

## Validation Checklist

Before committing ANY code, verify:

- [ ] No hardcoded secrets (API keys, passwords, tokens)
- [ ] All secrets in `.env.example` with placeholders
- [ ] All field names match `/dictionary.md` exactly
- [ ] All enum values match `/dictionary.md` exactly
- [ ] All API responses match `/contracts/openapi.yml` schemas
- [ ] All route paths match `/dictionary.md` exactly
- [ ] Query parameter names match OpenAPI spec exactly
- [ ] Date formats are `YYYY-MM-DD` (not ISO format strings)
- [ ] Response uses `snake_case` for all fields

---

## How to Verify

1. **Before creating any Pydantic model**:
   - Open `/dictionary.md`
   - Open `/contracts/openapi.yml`
   - Verify field names match exactly

2. **Before implementing any endpoint**:
   - Check OpenAPI spec for exact route path
   - Check OpenAPI spec for query parameter names
   - Check dictionary.md for enum values

3. **Before committing**:
   - Run: `grep -r "api.*key\|secret\|password\|token" . --exclude-dir=node_modules --exclude-dir=.git`
   - Verify no hardcoded secrets
   - Check that all field names in models match dictionary.md

---

## Common Mistakes to Avoid

1. ❌ Using camelCase in response models → ✅ Use snake_case
2. ❌ Using `US_Federal` instead of `US-Federal` → ✅ Use hyphen in enum values
3. ❌ Hardcoding `localhost:8000` → ✅ Use env var `API_URL`
4. ❌ Using different date format → ✅ Use `YYYY-MM-DD`
5. ❌ Adding fields not in OpenAPI → ✅ Only use fields from spec
6. ❌ Removing required fields → ✅ Include all required fields

---

## Questions?

If you're unsure about:
- Field naming → Check `/dictionary.md`
- API structure → Check `/contracts/openapi.yml`
- Enum values → Check `/dictionary.md`
- Environment setup → Check `.env.example` pattern

**When in doubt, reference the contracts first!**

---

**Remember**: The frontend expects exact field names. Any mismatch will break the integration! 🚨

