# Frontend Integration Updates

## Scope
- Mount Code_frontend at `/v0` alongside existing app
- Wire to contracts/fixtures without visual changes
- Add/align required `data-testid` selectors
- Prepare proxy/env for API smoke
- Add Implications section in drawer (likely_affects)

## Routing
- Added `app/v0/page.tsx` to render the same Feed/Saved UI as `/`
- Cutover prep: client-side redirect in `app/page.tsx` guarded by `NEXT_PUBLIC_NEW_UI` (not flipped)

## Data Layer
- Reused `lib/api-client.ts` with `NEXT_PUBLIC_API_URL` and `X-API-Key`
- Fixtures mode via `NEXT_PUBLIC_USE_FIXTURES=true` using `public/fixtures/seed_policies.json` (no-store)
- Endpoints implemented per `/contracts/openapi.yml`:
  - GET `/policies`, GET `/policies/{id}`
  - POST `/saved/{policy_id}`
  - GET `/saved` with keys `<=90d`, `90-365d`, `>365d`
  - POST `/digest/preview` returning `{ top5, generated_at }`

## Test IDs (no style changes)
- Filters: `filter-region`, `filter-region-*`, `filter-policy-type-*`, `filter-status-*`, `filter-scope-*`, `impact-min-slider`, `clear-all-filters`
- Sorting: `sort-select`, `order-select`
- Drawer: `policy-drawer`, `policy-title`, `policy-summary`, `policy-impact-factors`, `effective-in-days`, `save-policy-button`, `drawer-close`
- Saved: `tab-saved`, `saved-digest`, `saved-section-<=90d`, `saved-section-90-365d`, `saved-section->365d`, plus hidden markers `saved-section-near-term|mid-term|long-term`
- Digest: `digest-preview`, `digest-item`, `why-it-matters`, `source-name`, `copy-link` (shows toast)
- Legend: `legend-button`, `legend-content`

## Playwright
- Updated `playwright/policy-feed.spec.ts` to drag `impact-min-slider` instead of `selectOption`

## Dev Proxy & Env
- `next.config.js` rewrites: `/api/:path* -> http://localhost:8000/api/:path*`
- `.env.local` for testing:
  - `NEXT_PUBLIC_API_URL=/api`
  - `NEXT_PUBLIC_USE_FIXTURES=true` (fixtures phase), then `false` for API phase
  - Optional: `NEXT_PUBLIC_API_KEY=...`

## Drawer: Implications (likely_affects)
- `components/policy-drawer.tsx`: renders section “Implications” with `data-testid="likely-affects"` when `likely_affects` is a non-empty string[]
- `lib/types.ts`: added optional `likely_affects?: string[]` to `PolicyDetail`

## Changelog & Status
- Appended `FRONTEND_CHANGELOG.md` with all changes and demo steps
- `TEST_FEEDBACK.md` set to:
  - status: SUBMITTED
  - scope: FE
  - retest: /v0 fixtures smoke, then API smoke.

## Demo (Fixtures → API)
1) Visit `/v0`
2) Feed: use filters; adjust `sort-select`/`order-select`.
3) Open drawer; verify summary, impact, citations, `effective-in-days`; click `save-policy-button`.
4) Saved: verify groups and section markers.
5) Digest: verify `digest-preview` items; click `copy-link` to show toast.
6) Switch to API (`NEXT_PUBLIC_USE_FIXTURES=false`); repeat smoke; verify same-origin `/api/...` calls.

