# Frontend Migration Changelog

- Mount Code_frontend under `/v0` without visual changes
  - Added `app/v0/page.tsx` rendering the same UI structure as `/` (Feed/Saved tabs).

- Data layer wired to contracts and fixtures
  - Reused existing API client (`lib/api-client.ts`) honoring `NEXT_PUBLIC_API_URL` and `X-API-Key`.
  - Fixtures mode via `NEXT_PUBLIC_USE_FIXTURES=true` loads `public/fixtures/seed_policies.json`.
  - Endpoints implemented per `/contracts/openapi.yml`:
    - GET `/policies` (filters, sort, pagination)
    - GET `/policies/{id}`
    - POST `/saved/{policy_id}` (toggle)
    - GET `/saved` (keys "<=90d", "90-365d", ">365d")
    - POST `/digest/preview` ({ top5, generated_at })

- Test IDs (no visual changes)
  - Filters: `filter-region`, `filter-region-*`, `filter-policy-type-*`, `filter-status-*`, `filter-scope-*`, `impact-min-slider`, `clear-all-filters`.
  - Sorting: `sort-select`, `order-select`.
  - Drawer: `policy-drawer`, `policy-title`, `policy-summary`, `policy-impact-factors`, `save-policy-button`, `drawer-close`.
  - Saved tab: `saved-digest`, plus sections `saved-section-<=90d`, `saved-section-90-365d`, `saved-section->365d`.
  - Digest preview: `digest-preview-button`, `digest-preview`, `digest-item`, `why-it-matters`, `source-name`.
  - Added per request: `tab-saved`, `saved-digest`, `saved-section-near-term`, `saved-section-mid-term`, `saved-section-long-term`, `copy-link` (with toast), `legend-button`, `legend-content`, `effective-in-days`, `clear-all-filters`.

- Tests
  - Updated Playwright `policy-feed.spec.ts` to drag the `impact-min-slider` instead of `selectOption`.

- Dev proxy & Env
  - `next.config.js` rewrites `/api/:path* -> http://127.0.0.1:8000/api/:path*` (no CORS in dev).
  - `.env.local` settings:
    - `NEXT_PUBLIC_API_URL=/api`
    - `NEXT_PUBLIC_USE_FIXTURES=true` (fixtures phase), set to `false` for API phase
    - Optional: `NEXT_PUBLIC_API_KEY=...`

- Cutover prep
  - Feature flag: `NEXT_PUBLIC_NEW_UI=true` will redirect `/` to `/v0` (not flipped by default).

## Demo steps (/v0)

Fixtures phase (NEXT_PUBLIC_USE_FIXTURES=true):
1. Navigate to `/v0`.
2. Feed tab: apply filters (region, type, status, scopes), change sort/order via `sort-select`/`order-select`.
3. Open a policy drawer from the list; verify summary/impact/citations/history; click `save-policy-button`.
4. Switch to Saved tab (`saved-digest`): verify groups `saved-section-<=90d`, `saved-section-90-365d`, `saved-section->365d` list items.
5. In Digest preview: verify `digest-preview` shows items with `digest-item`, `why-it-matters`, `source-name`; click `digest-preview-button` to refresh.

API proxy phase (NEXT_PUBLIC_USE_FIXTURES=false):
1. Same steps as fixtures; ensure network calls hit same-origin `/api/...` (rewrites in effect).

Acceptance
- `/v0` runs with fixtures and API proxy; test IDs in place; no visual changes.
- Drawer shows `likely_affects` when present (data-testid `likely-affects`).

