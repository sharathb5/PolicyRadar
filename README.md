# Policy Radar

Climate Policy Monitoring and Tracking Platform

## Overview

Policy Radar is a platform for monitoring and tracking climate policies across jurisdictions. It provides policy ingestion, classification, scoring, and retrieval capabilities through a REST API and web interface.

## Project Structure

```
Policy Radar/
├── contracts/              # API contracts and specifications
│   ├── openapi.yml        # OpenAPI 3.0 specification
│   ├── scoring.md         # Impact scoring algorithm specification
│   ├── fixtures/          # Seed data and fixtures
│   └── tests/             # Contract validation tests
├── policy-radar-frontend/ # Next.js frontend application
├── PolicyRadar-backend/   # Python backend application (to be implemented)
├── tests/                 # Test suite
│   ├── unit/              # Unit tests
│   ├── integration/       # Integration tests
│   ├── contract/          # Contract tests
│   ├── e2e/               # E2E test utilities
│   └── fixtures/          # Test data fixtures
│       └── golden/        # Golden test cases
├── playwright/            # Playwright E2E tests
└── .github/workflows/     # CI/CD workflows
```

## Quick Start

### Prerequisites

- Python 3.9+
- Node.js 20+
- PostgreSQL 15+ (for backend)
- pnpm (for frontend)

### Backend Setup

```bash
# Install dependencies
pip install -e ".[dev]"

# Set up database
export DATABASE_URL=postgresql://user:password@localhost:5432/policyradar

# Run migrations (when available)
# alembic upgrade head

# Start backend server
uvicorn backend.app.main:app --reload
```

### Frontend Setup

```bash
cd policy-radar-frontend

# Install dependencies
pnpm install

# Run development server
pnpm dev
```

Visit http://localhost:3000

## Testing

### Running Tests

#### Backend Tests

```bash
# Run all tests
pytest

# Run specific test type
pytest tests/unit/              # Unit tests
pytest tests/integration/      # Integration tests
pytest tests/contract/         # Contract tests

# Run with coverage
pytest --cov=backend --cov-report=html
```

#### Frontend Tests

```bash
cd policy-radar-frontend

# Run linter
pnpm lint

# Run type check
pnpm type-check

# Run E2E tests
pnpm test:e2e
```

#### Contract Tests

```bash
# Validate OpenAPI spec
pytest tests/contract/test_openapi_validation.py

# Validate field names
pytest tests/contract/test_field_names.py

# Test API contracts (requires running API)
export API_BASE_URL=http://localhost:8000/api
export API_KEY=test-key
pytest tests/contract/test_api_contracts.py
```

### Test Coverage

- **Backend**: Minimum 80% coverage required
- **Frontend**: Minimum 70% coverage required (if tests configured)

View coverage reports:
```bash
# After running tests with coverage
open htmlcov/index.html  # macOS
```

## API Documentation

API documentation is available via OpenAPI specification at `/contracts/openapi.yml`.

Key endpoints:
- `GET /api/policies` - List policies with filtering and pagination
- `GET /api/policies/{id}` - Get policy details
- `POST /api/saved/{policy_id}` - Toggle saved status
- `GET /api/saved` - Get saved policies grouped by effective window
- `POST /api/digest/preview` - Generate digest preview

## Quality Gates

### Linting

- **Backend**: Ruff, Black, MyPy
- **Frontend**: ESLint with TypeScript rules

```bash
# Backend
ruff check backend/
black --check backend/
mypy backend/

# Frontend
cd policy-radar-frontend
pnpm lint
```

### Type Checking

- **Backend**: MyPy strict mode
- **Frontend**: TypeScript strict mode

```bash
# Backend
mypy backend/

# Frontend
cd policy-radar-frontend
pnpm type-check
```

### Coverage

Coverage reports are generated in CI and available locally:
```bash
pytest --cov=backend --cov-report=html
open htmlcov/index.html
```

## CI/CD

Tests run automatically on:
- Pull requests to `main` or `develop`
- Pushes to `main` or `develop`

CI pipeline includes:
1. Backend tests (unit, integration, contract)
2. Frontend lint and type checks
3. E2E tests (Playwright)
4. Performance tests

See `.github/workflows/test.yml` for configuration.

## Documentation

- **Testing**: See [tests/README.md](tests/README.md) for detailed testing documentation
- **API Contracts**: See [contracts/openapi.yml](contracts/openapi.yml)
- **Scoring Algorithm**: See [contracts/scoring.md](contracts/scoring.md)
- **Naming Conventions**: See [dictionary.md](dictionary.md)

## Contributing

1. Create a feature branch
2. Write tests for new functionality
3. Ensure all tests pass
4. Ensure linting and type checks pass
5. Ensure coverage meets thresholds
6. Submit pull request

## License

[License information]

