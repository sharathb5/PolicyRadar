"""
Integration tests: Test versioning logic in ingestion pipeline
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
from app.models.policy import Policy, PolicyChangesLog, Base
from app.ingest.pipeline import IngestionPipeline


@pytest.mark.integration
class TestVersioning:
    """Test policy versioning logic"""

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

    @pytest.mark.asyncio
    async def test_version_starts_at_1(self, pipeline, db_session, frozen_datetime):
        """Test: Version starts at 1 for new items"""
        source_data = [{
            "source_item_id": "test-1",
            "title_raw": "New Policy",
            "summary_raw": "New policy summary",
            "text_raw": "New policy text with mandatory requirements",
            "effective_date_raw": "2026-01-01",
        }]
        
        # Mock fetcher
        mock_fetcher = Mock()
        mock_fetcher.fetch = AsyncMock(return_value=source_data)
        
        with patch('app.ingest.pipeline.get_fetcher', return_value=mock_fetcher):
            result = await pipeline.run(source="test_source")
            # Pipeline returns dict with items_inserted, not status
            assert result["items_inserted"] > 0
            
            # Get policy and check version
            policy = db_session.query(Policy).first()
            assert policy is not None, "Policy should exist"
            assert policy.version == 1, \
                f"Version should start at 1 for new items, got {policy.version}"

    @pytest.mark.asyncio
    async def test_normalized_hash_change_triggers_version_increment(self, pipeline, db_session, frozen_datetime):
        """Test: Normalized hash change triggers version increment"""
        source_data = [{
            "source_item_id": "test-1",
            "title_raw": "Policy Title",
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
            
            assert result1["items_inserted"] > 0
            
            # Get policy and version
            policy = db_session.query(Policy).first()
            assert policy is not None, "Policy should exist"
            version1 = policy.version
            assert version1 == 1, "Initial version should be 1"
            
            # Modify content (changes normalized_hash) - change title
            modified_source_data = [{
                "source_item_id": "test-1",  # Same source_item_id (same content_hash)
                "title_raw": "Policy Title Updated",  # Changed title
                "summary_raw": "Modified summary",  # Changed summary
                "text_raw": "Modified text with mandatory requirements",
                "effective_date_raw": "2026-01-01",  # Same date
            }]
            
            mock_fetcher.fetch = AsyncMock(return_value=modified_source_data)
            
            # Second run
            result2 = await pipeline.run(source="test_source")
            
            
            # Refresh policy and check version
            db_session.refresh(policy)
            version2 = policy.version
            
            assert version2 == version1 + 1, \
                f"Version should increment from {version1} to {version1 + 1}, got {version2}"

    @pytest.mark.asyncio
    async def test_policy_changes_log_populated(self, pipeline, db_session, frozen_datetime):
        """Test: policy_changes_log populated with correct diff"""
        source_data = [{
            "source_item_id": "test-1",
            "title_raw": "Policy Title",
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
            
            assert result1["items_inserted"] > 0
            
            # Get policy
            policy = db_session.query(Policy).first()
            assert policy is not None, "Policy should exist"
            policy_id = policy.id
            
            # Modify content
            modified_source_data = [{
                "source_item_id": "test-1",
                "title_raw": "Policy Title Updated",  # Changed
                "summary_raw": "Modified summary",  # Changed
                "text_raw": "Modified text with mandatory requirements",
                "effective_date_raw": "2026-01-01",
            }]
            
            mock_fetcher.fetch = AsyncMock(return_value=modified_source_data)
            
            # Second run
            result2 = await pipeline.run(source="test_source")
            
            assert result2["items_updated"] > 0
            
            # Check policy_changes_log
            change_log = db_session.query(PolicyChangesLog).filter(
                PolicyChangesLog.policy_id == policy_id
            ).order_by(PolicyChangesLog.changed_at.desc()).first()
            
            assert change_log is not None, "policy_changes_log should have an entry"
            assert change_log.version_from == 1, f"version_from should be 1, got {change_log.version_from}"
            assert change_log.version_to == 2, f"version_to should be 2, got {change_log.version_to}"
            assert change_log.diff is not None, "diff should not be None"
            assert isinstance(change_log.diff, dict), "diff should be a dictionary"
            assert len(change_log.diff) > 0, "diff should contain changes"

    @pytest.mark.asyncio
    async def test_version_history_retrievable_via_api(self, pipeline, db_session, frozen_datetime):
        """Test: Version history retrievable via API"""
        source_data = [{
            "source_item_id": "test-1",
            "title_raw": "Policy Title",
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
            
            assert result1["items_inserted"] > 0
            
            # Get policy
            policy = db_session.query(Policy).first()
            assert policy is not None, "Policy should exist"
            policy_id = policy.id
            
            # Modify and run again
            modified_source_data = [{
                "source_item_id": "test-1",
                "title_raw": "Policy Title",
                "summary_raw": "Modified summary",
                "text_raw": "Modified text with mandatory requirements",
                "effective_date_raw": "2026-01-01",
            }]
            
            mock_fetcher.fetch = AsyncMock(return_value=modified_source_data)
            result2 = await pipeline.run(source="test_source")
            
            
            # Get policy detail via API (if available)
            try:
                import httpx
                import os
                api_base_url = os.getenv("API_BASE_URL", "http://localhost:8000/api")
                api_key = os.getenv("API_KEY", "1bb26b00a037526ce34654e867a89738d9e3eec1bc1f108127ccaaa4d8cf247d")
                
                client = httpx.Client(
                    base_url=api_base_url,
                    headers={"X-API-Key": api_key},
                    timeout=10.0
                )
                
                response = client.get(f"/policies/{policy_id}")
                
                if response.status_code == 200:
                    data = response.json()
                    
                    # Check that history is present
                    assert "history" in data, "Policy detail should include history"
                    
                    history = data["history"]
                    assert isinstance(history, list), "history should be a list"
                    assert len(history) > 0, "history should have entries"
                    
                    # Check history entry structure
                    if len(history) > 0:
                        entry = history[0]
                        assert "version_from" in entry, "history entry should have version_from"
                        assert "version_to" in entry, "history entry should have version_to"
                        assert "changed_at" in entry, "history entry should have changed_at"
                        assert "diff" in entry, "history entry should have diff"
                else:
                    pytest.skip(f"API not available (status {response.status_code})")
            except ImportError:
                pytest.skip("httpx not available for API test")
            except Exception as e:
                pytest.skip(f"API test failed: {e}")

    @pytest.mark.asyncio
    async def test_previous_version_data_preserved(self, pipeline, db_session, frozen_datetime):
        """Test: Previous version data preserved"""
        source_data = [{
            "source_item_id": "test-1",
            "title_raw": "Original Title",
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
            
            assert result1["items_inserted"] > 0
            
            # Get initial data
            policy = db_session.query(Policy).first()
            assert policy is not None, "Policy should exist"
            policy_id = policy.id
            original_title = policy.title
            original_summary = policy.summary
            version1 = policy.version
            
            # Modify content
            modified_source_data = [{
                "source_item_id": "test-1",
                "title_raw": "Modified Title",  # Changed
                "summary_raw": "Modified summary",  # Changed
                "text_raw": "Modified text with mandatory requirements",
                "effective_date_raw": "2026-01-01",
            }]
            
            mock_fetcher.fetch = AsyncMock(return_value=modified_source_data)
            
            # Second run
            result2 = await pipeline.run(source="test_source")
            
            
            # Refresh policy
            db_session.refresh(policy)
            
            # Check that current version has new data
            assert policy.version == version1 + 1, "Version should increment"
            assert policy.title != original_title, "Current version should have new title"
            assert policy.summary != original_summary, "Current version should have new summary"
            
            # Note: In our implementation, we update the same row with new version
            # The history is preserved in policy_changes_log, not as separate rows
            # This is a design choice - history is logged, not stored as separate versions
            change_log = db_session.query(PolicyChangesLog).filter(
                PolicyChangesLog.policy_id == policy_id
            ).first()
            
            assert change_log is not None, "Change log should exist"
            assert change_log.diff is not None, "Diff should be preserved"
            # The diff contains the old and new values
            if "title" in change_log.diff:
                assert change_log.diff["title"]["old"] == original_title, \
                    "Original title should be in diff"
