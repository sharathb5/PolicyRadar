# Quick Status Dashboard — Frontend Integration

## Environment
- NEXT_PUBLIC_API_BASE_URL: configured (example: `http://localhost:8000/api`)
- NEXT_PUBLIC_API_URL: supported fallback
- NEXT_PUBLIC_API_KEY: configured
- NEXT_PUBLIC_USE_FIXTURES: false (proxy/API mode)

## Dev Proxy
- next.config.js rewrites: `/api/:path* -> http://localhost:8000/api/:path*`
- Recommendation: set `NEXT_PUBLIC_API_BASE_URL=/api` for same-origin requests

## API Headers
- Requests include `X-API-Key` when `NEXT_PUBLIC_API_KEY` is set

## Endpoints — Verification Checklist
- [ ] GET /api/policies → 200 OK
- [ ] GET /api/saved → 200 OK
- [ ] POST /api/digest/preview → 200 OK
- [ ] All contain CORS headers from backend (Access-Control-Allow-Origin, etc.)

## UI States
- Policies: loading → data/empty → error toast on failure
- Saved: grouped by effective window; Refresh button refetches
- Digest preview: loading/error states handled

## Screenshots (to attach)
- [ ] Console: no CORS errors
- [ ] Network tab: /api/policies 200
- [ ] Network tab: /api/saved 200
- [ ] Network tab: /api/digest/preview 200

## Notes
- Fixtures mode is available: set `NEXT_PUBLIC_USE_FIXTURES=true` if backend is offline
- In API mode, no fixture fallback is used


