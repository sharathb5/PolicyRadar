"""
Integration tests: Test idempotency of ingestion pipeline
"""
import pytest
import sys
from pathlib import Path
from datetime import datetime
from unittest.mock import AsyncMock, patch, Mock

# Add backend to Python path
backend_dir = Path(__file__).parent.parent.parent / "PolicyRadar-backend"
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models.policy import Policy, Base
from app.ingest.pipeline import IngestionPipeline


@pytest.mark.integration
class TestIdempotency:
    """Test that ingestion pipeline is idempotent"""

    @pytest.fixture
    def db_session(self, test_database_url):
        """Create database session for tests"""
        try:
            engine = create_engine(test_database_url)
            Base.metadata.create_all(engine)
            SessionLocal = sessionmaker(bind=engine)
            session = SessionLocal()
            
            try:
                yield session
            finally:
                session.rollback()
                Base.metadata.drop_all(engine)
                session.close()
        except Exception as e:
            pytest.skip(f"Database setup failed: {e}")

    @pytest.fixture
    def pipeline(self, db_session):
        """Get pipeline instance"""
        return IngestionPipeline(db=db_session)

    @pytest.fixture
    def test_source_data(self):
        """Fixed test data for deterministic tests"""
        return [
            {
                "source_item_id": "test-1",
                "title_raw": "Test Policy 1",
                "summary_raw": "This is a test policy summary",
                "text_raw": "This is a test policy text with mandatory requirements",
                "effective_date_raw": "2026-01-01",
            },
            {
                "source_item_id": "test-2",
                "title_raw": "Test Policy 2",
                "summary_raw": "Another test policy summary",
                "text_raw": "Another test policy text with disclosure requirements",
                "effective_date_raw": "2026-01-02",
            }
        ]

    @pytest.mark.asyncio
    async def test_no_duplicates_on_second_run(self, pipeline, db_session, test_source_data, frozen_datetime):
        """Test: Run pipeline twice with same source data → no duplicates"""
        # Mock fetcher to return test data
        mock_fetcher = Mock()
        mock_fetcher.fetch = AsyncMock(return_value=test_source_data)
        
        with patch('app.ingest.pipeline.get_fetcher', return_value=mock_fetcher):
            # First run
            result1 = await pipeline.run(source="test_source")
            # Pipeline returns: {"run_id": ..., "items_fetched": ..., "items_inserted": ..., ...}
            assert result1["items_inserted"] >= 0  # Check items_inserted exists
            first_count = result1["items_inserted"]
            assert first_count > 0, "First run should insert items"
            
            # Second run with same data
            result2 = await pipeline.run(source="test_source")
            # Pipeline returns dict with items_inserted, not status
            second_count = result2["items_inserted"]
            
            # Should not create duplicates
            assert second_count == 0, \
                f"Second run should create 0 new policies, got {second_count}"
            
            # Total count should be same as first run
            total_policies = db_session.query(Policy).count()
            assert total_policies == first_count, \
                f"Total policies should remain {first_count}, got {total_policies}"

    @pytest.mark.asyncio
    async def test_same_content_hash_skips_insert(self, pipeline, db_session, test_source_data, frozen_datetime):
        """Test: Same content_hash → skip insert"""
        # Create policy with specific content
        source_data = [test_source_data[0]]
        
        # Mock fetcher
        mock_fetcher = Mock()
        mock_fetcher.fetch = AsyncMock(return_value=source_data)
        
        with patch('app.ingest.pipeline.get_fetcher', return_value=mock_fetcher):
            # First run
            result1 = await pipeline.run(source="test_source")
            # Pipeline returns dict with items_inserted, not status
            assert result1["items_inserted"] > 0
            
            # Run again with identical content (same content_hash)
            result2 = await pipeline.run(source="test_source")
            assert result2["items_inserted"] == 0, \
                "Same content_hash should skip insert"
            
            # Verify only one policy exists
            policy_count = db_session.query(Policy).count()
            assert policy_count == 1, \
                f"Should have exactly 1 policy, got {policy_count}"

    @pytest.mark.asyncio
    async def test_same_normalized_hash_no_version_bump(self, pipeline, db_session, test_source_data, frozen_datetime):
        """Test: Same normalized_hash → no version bump"""
        # Create policy
        source_data = [test_source_data[0]]
        
        # Mock fetcher
        mock_fetcher = Mock()
        mock_fetcher.fetch = AsyncMock(return_value=source_data)
        
        with patch('app.ingest.pipeline.get_fetcher', return_value=mock_fetcher):
            # First run
            result1 = await pipeline.run(source="test_source")
            # Pipeline returns dict with items_inserted, not status
            assert result1["items_inserted"] > 0
            
            # Get policy and version
            policy = db_session.query(Policy).first()
            assert policy is not None, "Policy should exist"
            version1 = policy.version
            
            # Run again with same normalized content (same normalized_hash)
            result2 = await pipeline.run(source="test_source")
            # Pipeline returns dict, check items_inserted exists
            
            # Refresh policy and check version
            db_session.refresh(policy)
            version2 = policy.version
            
            assert version2 == version1, \
                f"Version should not change (was {version1}, now {version2})"

    @pytest.mark.asyncio
    async def test_different_normalized_hash_version_increment(self, pipeline, db_session, frozen_datetime):
        """Test: Different normalized_hash → version increment"""
        # Create policy with original content
        source_data = [{
            "source_item_id": "test-1",
            "title_raw": "Test Policy",
            "summary_raw": "Original summary",
            "text_raw": "Original text with mandatory requirements",
            "effective_date_raw": "2026-01-01",
        }]
        
        # Mock fetcher
        mock_fetcher = Mock()
        mock_fetcher.fetch = AsyncMock(return_value=source_data)
        
        with patch('app.ingest.pipeline.get_fetcher', return_value=mock_fetcher):
            # First run
            result1 = await pipeline.run(source="test_source")
            # Pipeline returns dict with items_inserted, not status
            assert result1["items_inserted"] > 0
            
            # Get policy and version
            policy = db_session.query(Policy).first()
            assert policy is not None, "Policy should exist"
            version1 = policy.version
            assert version1 == 1, "Initial version should be 1"
            
            # Run again with different content (different normalized_hash)
            # Change title to change normalized_hash
            modified_source_data = [{
                "source_item_id": "test-1",  # Same source_item_id
                "title_raw": "Test Policy Updated",  # Changed title
                "summary_raw": "Modified summary",  # Changed summary
                "text_raw": "Modified text with mandatory requirements",
                "effective_date_raw": "2026-01-01",  # Same date
            }]
            
            mock_fetcher.fetch = AsyncMock(return_value=modified_source_data)
            result2 = await pipeline.run(source="test_source")
            # Pipeline returns dict, check items_updated exists
            
            # Refresh policy and check version
            db_session.refresh(policy)
            version2 = policy.version
            
            assert version2 == version1 + 1, \
                f"Version should increment from {version1} to {version1 + 1}, got {version2}"

    @pytest.mark.asyncio
    async def test_policies_raw_and_normalized_counts(self, pipeline, db_session, test_source_data, frozen_datetime):
        """Test: Verify policies table has correct counts"""
        # Mock fetcher
        mock_fetcher = Mock()
        mock_fetcher.fetch = AsyncMock(return_value=test_source_data)
        
        with patch('app.ingest.pipeline.get_fetcher', return_value=mock_fetcher):
            # First run
            result1 = await pipeline.run(source="test_source")
            # Pipeline returns dict with items_inserted
            
            # Check count
            policy_count = db_session.query(Policy).count()
            assert policy_count == len(test_source_data), \
                f"Should have {len(test_source_data)} policies, got {policy_count}"
            
            # Second run (should not add duplicates)
            result2 = await pipeline.run(source="test_source")
            # Pipeline returns dict
            
            # Count should not change
            policy_count2 = db_session.query(Policy).count()
            assert policy_count2 == policy_count, \
                f"Policy count should not change, was {policy_count}, now {policy_count2}"
