# Shared Naming Dictionary

This document defines shared naming conventions for routes, fields, enum values, and query parameters used across frontend and backend. Both teams must strictly follow these conventions to ensure consistency.

## API Routes

### Base Path
- `/api` - All API endpoints are prefixed with this

### Endpoints
- `GET /api/healthz` - Health check endpoint
- `GET /api/policies` - List policies with filtering and pagination
- `GET /api/policies/{id}` - Get policy detail by ID
- `POST /api/saved/{policy_id}` - Toggle saved status for a policy
- `GET /api/saved` - Get saved policies grouped by effective window
- `POST /api/digest/preview` - Generate digest preview with top 5 policies

## Query Parameters

### Policy List Endpoint (`GET /api/policies`)
- `q` - Search query string (string)
- `region[]` - Filter by jurisdiction (array of strings)
- `policy_type[]` - Filter by policy type (array of strings)
- `status[]` - Filter by status (array of strings)
- `scopes[]` - Filter by emissions scopes (array of integers)
- `impact_min` - Minimum impact score (integer, 0-100)
- `confidence_min` - Minimum confidence score (float, 0-1)
- `effective_before` - Filter by effective date before (date, YYYY-MM-DD)
- `effective_after` - Filter by effective date after (date, YYYY-MM-DD)
- `sort` - Sort field: `impact`, `effective`, or `updated` (string)
- `order` - Sort order: `asc` or `desc` (string, default: `desc`)
- `page` - Page number (integer, default: 1)
- `page_size` - Items per page (integer, default: 20, max: 100)

## Response Fields

### PolicyListItem (used in list responses)
- `id` - Policy ID (integer)
- `title` - Policy title (string)
- `jurisdiction` - Jurisdiction enum (string)
- `policy_type` - Policy type enum (string)
- `status` - Status enum (string)
- `scopes` - Emissions scopes array (array of integers)
- `impact_score` - Impact score 0-100 (integer)
- `confidence` - Confidence score 0-1 (float)
- `effective_date` - Effective date (date, YYYY-MM-DD)
- `last_updated_at` - Last updated date (date, YYYY-MM-DD)
- `source_name_official` - Official source name (string)
- `source_name_secondary` - Secondary source name (string, nullable)
- `what_might_change` - Brief description of what might change (string)

### PolicyDetail (extends PolicyListItem, used in detail responses)
All fields from PolicyListItem plus:
- `summary` - Full summary text (string)
- `impact_factors` - Impact factors breakdown (object)
  - `mandatory` - Points from mandatory/voluntary (integer)
  - `time_proximity` - Points from time proximity (integer)
  - `scope_coverage` - Points from scope coverage (integer)
  - `sector_breadth` - Points from sector breadth (integer)
  - `disclosure_complexity` - Points from disclosure complexity (integer)
- `mandatory` - Whether policy is mandatory (boolean)
- `sectors` - Affected sectors (array of strings, nullable)
- `version` - Policy version number (integer)
- `history` - Version history array (array of objects)
  - `changed_at` - Change timestamp (date-time)
  - `version_from` - Previous version (integer)
  - `version_to` - New version (integer)
  - `diff` - Change summary (object)

### SavedResponse (used in GET /api/saved)
- `<=90d` - Policies effective within 90 days (object)
  - `window` - Window label (string)
  - `count` - Number of policies (integer)
  - `policies` - Array of PolicyListItem
- `90-365d` - Policies effective 90-365 days (object, same structure)
- `>365d` - Policies effective beyond 365 days (object, same structure)

### DigestPreview (used in POST /api/digest/preview)
- `top5` - Top 5 policies array (array of objects)
  - `id` - Policy ID (integer)
  - `title` - Policy title (string)
  - `score` - Impact score (integer)
  - `why_it_matters` - Why it matters text (string)
  - `source_name` - Source name (string)
- `generated_at` - Generation timestamp (date-time)

## Enum Values

### Jurisdiction
Valid values:
- `EU`
- `US-Federal`
- `US-CA`
- `UK`
- `OTHER`

### Policy Type
Valid values:
- `Disclosure`
- `Pricing`
- `Ban`
- `Incentive`
- `Supply-chain`

### Status
Valid values:
- `Proposed`
- `Adopted`
- `Effective`

### Emissions Scopes
Valid values:
- `1` - Scope 1 (direct emissions)
- `2` - Scope 2 (indirect emissions from purchased energy)
- `3` - Scope 3 (other indirect emissions)

### Sort Options
Valid values for `sort` parameter:
- `impact` - Sort by impact_score
- `effective` - Sort by effective_date
- `updated` - Sort by last_updated_at

### Sort Order
Valid values for `order` parameter:
- `asc` - Ascending order
- `desc` - Descending order

### Effective Windows (for Saved grouping)
- `<=90d` - Policies effective within 90 days
- `90-365d` - Policies effective 90-365 days
- `>365d` - Policies effective beyond 365 days

## Date Formats

- **Date fields**: `YYYY-MM-DD` format (e.g., "2026-01-01")
- **DateTime fields**: ISO 8601 format (e.g., "2025-10-15T10:30:00Z")

## Field Name Conventions

- Use `snake_case` for all field names (e.g., `impact_score`, `policy_type`, `effective_date`)
- Use `kebab-case` for URL path segments (e.g., `/api/policies/{id}`)
- Use `camelCase` in TypeScript/JavaScript interfaces (frontend will map snake_case to camelCase or keep snake_case based on convention)
- Pluralize array field names (e.g., `scopes`, `sectors`, `policies`)

## Authentication

- Header name: `X-API-Key`
- Header value: API key string

## Error Response Format

- `error` - Error type/code (string)
- `message` - Human-readable error message (string)

## Notes

- All enum values are case-sensitive
- All field names are case-sensitive
- Date formats must be consistent (YYYY-MM-DD)
- Nullable fields can be `null` or omitted from response
- Array query parameters use bracket notation: `region[]`, `policy_type[]`, etc.

## Version History

- Initial version: 2025-01-XX
- All changes must be documented here and synchronized with OpenAPI spec

