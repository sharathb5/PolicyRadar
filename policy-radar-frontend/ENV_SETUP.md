# Environment Variables Setup

Create a `.env.local` file in the `policy-radar-frontend` directory with the following variables:

```env
# API Base URL (without trailing slash)
# Example: http://localhost:8000/api or https://api.policyradar.example.com
NEXT_PUBLIC_API_URL=http://localhost:8000/api

# API Key for authentication
# This will be sent as X-API-Key header
NEXT_PUBLIC_API_KEY=

# Feature flag: Use fixture data instead of real API
# Set to "true" to use fixtures from /contracts/fixtures/seed_policies.json
# Set to "false" or omit to use real API
NEXT_PUBLIC_USE_FIXTURES=true
```

## Usage

1. **Development with Fixtures (Default)**:
   - Set `NEXT_PUBLIC_USE_FIXTURES=true`
   - No API key needed
   - Uses fixture data from `/contracts/fixtures/seed_policies.json`

2. **Development with Real API**:
   - Set `NEXT_PUBLIC_USE_FIXTURES=false`
   - Set `NEXT_PUBLIC_API_URL` to your API base URL
   - Set `NEXT_PUBLIC_API_KEY` to your API key

3. **Production**:
   - Set `NEXT_PUBLIC_USE_FIXTURES=false`
   - Set `NEXT_PUBLIC_API_URL` to production API URL
   - Set `NEXT_PUBLIC_API_KEY` to production API key

