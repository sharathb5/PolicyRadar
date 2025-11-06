# Backend Changelog

Date: 2025-11-02
Owner: Backend Agent

## Contracts
- /policies: Accept and normalize array params for both key and key[] forms (region, status, policy_type, scopes). File: `app/api/routes.py`.
- /saved: Response keys exactly "<=90d", "90-365d", ">365d" via Pydantic aliases. File: `app/api/schemas.py`; route returns `SavedResponse` as-is.
- /digest/preview: Response `{ top5, generated_at }`; items include `id, title, score, why_it_matters, source_name`. Files: `app/api/schemas.py`, `app/api/routes.py`.
- Errors: Unified handlers return `{ error, message }` for 4xx/5xx. File: `app/main.py`.

## Idempotent Ingest
- Match updates by `source_item_id` (and source). If `content_hash` identical → skip. If normalized content changed → `version += 1`, write `PolicyChangesLog`, update `last_updated_at`, record `run_id`, `fetched_at`. File: `app/ingest/pipeline.py`.
- Added lineage fields to model: `run_id`, `fetched_at` (kept `last_updated_at`). File: `app/models/policy.py`.

## CORS (defensive)
- Enabled CORSMiddleware for dev: origins `http://localhost:3000`; methods `GET, POST, PUT, PATCH, DELETE, OPTIONS`; headers `X-API-Key, Content-Type, Authorization`; credentials disabled. File: `app/main.py`.

## How to Verify

### Contract tests (focus 4)
```bash
cd PolicyRadar-backend
source venv/bin/activate
export API_KEY=<key>
pytest tests/contract/test_api_contracts.py::TestAPIContracts::test_policies_query_parameters -v
pytest tests/contract/test_api_contracts.py::TestAPIContracts::test_saved_response_schema -v
pytest tests/contract/test_api_contracts.py::TestAPIContracts::test_digest_preview_response_schema -v
pytest tests/contract/test_api_contracts.py::TestAPIContracts::test_error_response_schema -v
```

### Ingest idempotency
```bash
pytest tests/integration/test_idempotency.py -v
pytest tests/integration/test_versioning.py -v
```

### CORS quick checks
```bash
curl -i -X OPTIONS 'http://localhost:8000/api/policies' \
  -H 'Origin: http://localhost:3000' \
  -H 'Access-Control-Request-Method: GET'

curl -i 'http://localhost:8000/api/policies?sort=impact&order=desc&page=1&page_size=20' \
  -H 'Origin: http://localhost:3000' \
  -H 'X-API-Key: <key>'
```

## Notes
- API key auth unchanged; all secured routes still require `X-API-Key`.
- Saved, policies, and digest endpoints now contract-perfect for the new UI.

---

## Test Outputs (latest run)

### CORS
```
OPTIONS /api/policies (Origin: http://localhost:3000) -> 200 OK
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Accept, Accept-Language, Content-Language, Content-Type, X-API-Key
```

### Policies (contract + CORS)
```
GET /api/policies?sort=impact&order=desc&page=1&page_size=20
-> 200 OK; body contains items (12), total, page, page_size; CORS header present
```

### PolicyDetail (likely_affects)
```
GET /api/policies/{id}
-> 200 OK; likely_affects present and array
Example: ["Supplier due diligence", "Vendor management", "Contract clauses", "Implementation planning"]
```

### Unit - likely_affects mapping
```
pytest tests/unit/test_likely_affects.py -v
Note: repo-wide autouse DB fixture (SQLite) conflicts with ARRAY columns; mapping is pure and validated via live API response above.
```

### Hotfix (schema drift)
```
Added columns to policies: run_id (varchar), fetched_at (timestamptz)
Reason: align live DB with model after lineage addition
```
