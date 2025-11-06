"""
Pytest configuration and shared fixtures
"""
import pytest
import json
import sys
from pathlib import Path
from datetime import datetime, date
from typing import Dict, Any

# Add backend to Python path for imports
backend_dir = Path(__file__).parent.parent / "PolicyRadar-backend"
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

# Test data directories
TESTS_DIR = Path(__file__).parent
FIXTURES_DIR = TESTS_DIR / "fixtures"
GOLDEN_DIR = FIXTURES_DIR / "golden"
CONTRACTS_DIR = Path(__file__).parent.parent / "contracts"


@pytest.fixture
def fixtures_dir() -> Path:
    """Return path to fixtures directory"""
    return FIXTURES_DIR


@pytest.fixture
def golden_dir() -> Path:
    """Return path to golden test fixtures directory"""
    return GOLDEN_DIR


@pytest.fixture
def contracts_dir() -> Path:
    """Return path to contracts directory"""
    return CONTRACTS_DIR


@pytest.fixture
def seed_policies():
    """Load seed policies from contracts/fixtures"""
    seed_file = CONTRACTS_DIR / "fixtures" / "seed_policies.json"
    with open(seed_file, "r") as f:
        return json.load(f)


@pytest.fixture
def frozen_datetime(monkeypatch):
    """Freeze datetime to a fixed point for deterministic tests"""
    frozen = datetime(2025, 10, 15, 12, 0, 0)
    frozen_date = date(2025, 10, 15)
    
    class FrozenDateTime:
        @classmethod
        def now(cls):
            return frozen
        
        @classmethod
        def today(cls):
            return frozen_date
        
        @classmethod
        def utcnow(cls):
            return frozen
    
    # Monkey patch both datetime and date modules
    monkeypatch.setattr("datetime.datetime", FrozenDateTime)
    
    # Patch date.today() in app.core.scoring module where it's imported
    # The scoring module uses: from datetime import date
    # So we need to patch the date class in that module's namespace
    try:
        from app.core import scoring
        original_date_class = scoring.date
        
        # Create a mock date class that preserves fromisoformat but freezes today()
        class MockDate:
            @staticmethod
            def today():
                return frozen_date
            
            @staticmethod
            def fromisoformat(date_string):
                return original_date_class.fromisoformat(date_string)
        
        monkeypatch.setattr(scoring, 'date', MockDate)
    except ImportError:
        # If module not available, just patch datetime.date
        pass
    
    return frozen


@pytest.fixture
def test_database_url():
    """Return test database URL (use environment variable or default)"""
    import os
    return os.getenv("TEST_DATABASE_URL", "postgresql://test:test@localhost:5432/policyradar_test")


def load_golden_cases(filename: str) -> list:
    """Helper to load golden test cases from JSON file"""
    golden_file = GOLDEN_DIR / filename
    if not golden_file.exists():
        return []
    with open(golden_file, "r") as f:
        return json.load(f)


def save_golden_cases(filename: str, cases: list):
    """Helper to save golden test cases to JSON file"""
    golden_file = GOLDEN_DIR / filename
    golden_file.parent.mkdir(parents=True, exist_ok=True)
    with open(golden_file, "w") as f:
        json.dump(cases, f, indent=2, default=str)

