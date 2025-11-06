# TEST EXECUTION REPORT

**Date**: 2025-01-XX  
**Environment**: Local (Backend: :8000, Frontend: :3000)

---

## Phase 1 — CORS Verification

Commands:
```bash
curl -i -X OPTIONS 'http://localhost:8000/api/policies' \
  -H 'Origin: http://localhost:3000' \
  -H 'Access-Control-Request-Method: GET' \
  -H 'Access-Control-Request-Headers: X-API-Key, Content-Type'

curl -i -X OPTIONS 'http://localhost:8000/api/saved' \
  -H 'Origin: http://localhost:3000' \
  -H 'Access-Control-Request-Method: GET' \
  -H 'Access-Control-Request-Headers: X-API-Key, Content-Type'

curl -i -X OPTIONS 'http://localhost:8000/api/digest/preview' \
  -H 'Origin: http://localhost:3000' \
  -H 'Access-Control-Request-Method: POST' \
  -H 'Access-Control-Request-Headers: X-API-Key, Content-Type'
```

Expected headers:
- `Access-Control-Allow-Origin: http://localhost:3000` (or `*`)
- `Access-Control-Allow-Methods: GET,POST,OPTIONS,PUT,PATCH,DELETE`
- `Access-Control-Allow-Headers: X-API-Key, Content-Type, Authorization`
- `Access-Control-Max-Age: 600`

Result:
- Policies: [paste response headers]
- Saved: [paste response headers]
- Digest preview: [paste response headers]

---

## Phase 2 — Contract Tests (Focused 4)

Command:
```bash
export API_KEY=... # redacted
python3 -m pytest -q \
  tests/contract/test_api_contracts.py::TestAPIContracts::test_policies_query_parameters \
  tests/contract/test_api_contracts.py::TestAPIContracts::test_saved_response_schema \
  tests/contract/test_api_contracts.py::TestAPIContracts::test_digest_preview_response_schema \
  tests/contract/test_api_contracts.py::TestAPIContracts::test_error_response_schema
```

Results:
- test_policies_query_parameters: [PASS|FAIL|SKIP]
- test_saved_response_schema: [PASS|FAIL]
- test_digest_preview_response_schema: [PASS|FAIL]
- test_error_response_schema: [PASS|FAIL]

Logs/Artifacts (attach if any FAIL):
```bash
curl -s -H "X-API-Key: $API_KEY" 'http://localhost:8000/api/saved' | jq -S > /tmp/saved.json
curl -s -H "X-API-Key: $API_KEY" 'http://localhost:8000/api/digest/preview' \
  -H 'Content-Type: application/json' -d '{}' | jq -S > /tmp/digest.json
```

Schema diffs:
- Saved groups (keys must be exactly "<=90d", "90-365d", ">365d"): [paste exact key diffs]
- Digest preview items (must include: `title`, `impact_score`, `why_it_matters`, `source_name`): [paste per-item diffs]

---

## Phase 3 — Ingest Reliability

Command:
```bash
export TEST_DATABASE_URL=postgresql://sharath@localhost:5432/policyradar_test
python3 -m pytest tests/integration/ -k "idempotency or versioning" -v --tb=short
```

Idempotency:
- First run inserted: N
- Second run inserted: 0
- Duplicates: none

Version bump:
- Change: [describe field changed]
- Version: v → v+1 [PASS|FAIL]
- PolicyChangesLog entry created: [YES|NO]
- last_updated_at changed: [YES|NO]

Notes:
- If version does not increment: pipeline must match by `(source, source_item_id)` and use `normalized_hash` for version bump; file a backend issue.

---

## Phase 4 — E2E Smoke

Setup:
```bash
# Backend
cd PolicyRadar-backend && source venv/bin/activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Frontend
cd policy-radar-frontend
npm run dev
```

Command:
```bash
cd policy-radar-frontend
npx playwright test playwright/policy-feed.spec.ts \
  playwright/policy-detail.spec.ts \
  playwright/saved-items.spec.ts \
  playwright/digest-preview.spec.ts \
  --project=chromium
```

Results:
- Feed loads and drawer opens: [PASS|FAIL]
- Save → Saved tab grouped sections visible: [PASS|FAIL]
- Digest preview loads (top 5): [PASS|FAIL]

Blockers (if any):
- Missing data-testids: [list selectors]

---

## Summary & Acceptance

- CORS: [PASS|FAIL] (attach curl headers)
- Contract (focused 4): [PASS count]/4 passed — diffs attached for failures
- Ingest: Idempotency [PASS|FAIL], Version bump + history [PASS|FAIL]
- E2E Smoke: [PASS|FAIL] (Feed → Drawer → Save → Saved groups → Digest preview)

Action items:
- Backend: Update pipeline matching logic to use `(source, source_item_id)` for updates; version bump on `normalized_hash` change; write `PolicyChangesLog`.
- Frontend: Add missing data-testids to unblock E2E.

