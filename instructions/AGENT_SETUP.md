# Agent Setup Guide

This document provides a quick reference for agents to get started with their workstreams.

## Handoff Artifacts (Ready)

All required handoff artifacts have been created and are available:

1. **`/contracts/openapi.yml`** - Complete API specification
   - All endpoints defined with request/response schemas
   - Query parameters, filters, sorting documented
   - Security requirements (X-API-Key header)
   - Ready for backend implementation and contract testing

2. **`/contracts/scoring.md`** - Impact scoring algorithm specification
   - Complete scoring formula with 5 factors
   - Examples and test cases
   - Classification rules for factor detection
   - Ready for backend implementation and golden tests

3. **`/contracts/fixtures/seed_policies.json`** - Seed data for development
   - 12 policies matching UI expectations
   - All fields populated including impact_factors
   - Covers all jurisdictions, policy types, statuses
   - Ready for backend seeding and frontend fallback

4. **`/dictionary.md`** - Shared naming conventions
   - All route paths
   - All field names
   - All enum values
   - Query parameter names
   - Date formats
   - Ready for frontend/backend alignment

## Repository Structure

```
Policy Radar/
├── contracts/
│   ├── openapi.yml              ✅ Complete API spec
│   ├── scoring.md               ✅ Scoring algorithm
│   └── fixtures/
│       └── seed_policies.json   ✅ 12 seed policies
├── dictionary.md                 ✅ Shared conventions
├── policy-radar-frontend/        ✅ Existing UI
└── PolicyRadar-backend/          ⏳ Ready for implementation
```

## Next Steps by Workstream

### Backend Agent (Workstream A)
**Start with:**
1. Review `/contracts/openapi.yml` for all endpoints
2. Review `/contracts/scoring.md` for scoring algorithm
3. Review `/contracts/fixtures/seed_policies.json` for data shape
4. Review `/dictionary.md` for all naming conventions

**First PR: Contracts & Foundation**
- Create `/backend/` directory structure
- Set up FastAPI app
- Create database models matching OpenAPI schemas
- Create Alembic migrations
- Implement `/healthz` endpoint
- Seed database with 12 policies from fixtures

### Frontend Integration Agent (Workstream B)
**Start with:**
1. Review `/contracts/openapi.yml` for API endpoints
2. Review `/dictionary.md` for field/enum names
3. Review `/contracts/fixtures/seed_policies.json` for data shape

**First PR: API Client Setup**
- Create API client module
- Update TypeScript interfaces to match OpenAPI schemas
- Set up environment configuration
- Implement feature flag for fixtures vs real API

### Testing & Assurance Agent (Workstream C)
**Start with:**
1. Review `/contracts/openapi.yml` for contract validation
2. Review `/contracts/scoring.md` for golden test cases
3. Review `/contracts/fixtures/seed_policies.json` for test data

**First PR: Contract Tests**
- Validate OpenAPI spec syntax
- Create contract tests for all endpoints
- Validate field names match dictionary.md
- Set up CI configuration

## Key Conventions

### Field Names
- Use `snake_case` in API responses (e.g., `impact_score`, `policy_type`)
- All field names must match `dictionary.md` exactly

### Enum Values
- Jurisdiction: `EU`, `US-Federal`, `US-CA`, `UK`, `OTHER`
- Policy Type: `Disclosure`, `Pricing`, `Ban`, `Incentive`, `Supply-chain`
- Status: `Proposed`, `Adopted`, `Effective`
- Scopes: `1`, `2`, `3` (integers)
- Sort: `impact`, `effective`, `updated`
- Order: `asc`, `desc`

### Date Formats
- Date fields: `YYYY-MM-DD` (e.g., "2026-01-01")
- DateTime fields: ISO 8601 (e.g., "2025-10-15T10:30:00Z")

### Authentication
- Header: `X-API-Key`
- Value: API key string

## Important Notes

1. **No secrets in code** - All secrets must be in `.env` files
2. **Keep commits small** - Atomic commits for each feature
3. **Update OpenAPI spec** - Any API changes must update `/contracts/openapi.yml`
4. **Match dictionary.md** - All field names and enums must match exactly
5. **No visual redesign** - Frontend agent should not change UI styling

## Questions?

If you need clarification:
1. Check the relevant contract file (openapi.yml, scoring.md, dictionary.md)
2. Check the agent brief document provided to you
3. Review the fixtures for data shape examples

## Success Criteria

All agents should verify:
- ✅ Their code matches the contracts/dictionary conventions
- ✅ Their tests validate against the contracts
- ✅ Their changes don't break existing conventions
- ✅ They've updated relevant contract files if making changes

Good luck! 🚀

