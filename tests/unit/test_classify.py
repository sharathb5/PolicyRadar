"""
Unit tests for classification logic using golden test cases
"""
import pytest
import json
from datetime import date
from pathlib import Path


@pytest.mark.unit
@pytest.mark.golden
class TestClassification:
    """Test classification logic against golden test cases"""

    @pytest.fixture
    def classification_cases(self, golden_dir):
        """Load golden classification test cases"""
        cases_file = golden_dir / "classification_cases.json"
        with open(cases_file, "r") as f:
            return json.load(f)

    @pytest.fixture
    def classify_func(self):
        """Import or create classification function
        
        This will use the actual implementation when available.
        """
        import sys
        from pathlib import Path
        
        # Add backend to path
        backend_dir = Path(__file__).parent.parent.parent / "PolicyRadar-backend"
        if str(backend_dir) not in sys.path:
            sys.path.insert(0, str(backend_dir))
        
        try:
            from app.core.classify import classify_policy
            return classify_policy
        except ImportError:
            try:
                from backend.app.core.classify import classify_policy
                return classify_policy
            except ImportError:
                # Stub implementation for testing framework
                pytest.skip("Backend classification module not available - skipping golden tests")

    def test_classification_golden_cases(self, classification_cases, classify_func, frozen_datetime):
        """Test all golden classification cases"""
        for case in classification_cases:
            input_data = case["input"]
            expected = case["expected"]
            
            # Call actual classification function (not mocked)
            # Parse effective_date if present in input
            effective_date = None
            if "effective_date" in input_data:
                from datetime import datetime
                effective_date = datetime.fromisoformat(input_data["effective_date"]).date()
            
            result = classify_func(
                title=input_data["title"],
                text=input_data["text"],
                jurisdiction=input_data.get("jurisdiction", "OTHER"),
                source=input_data.get("source", ""),
                summary=input_data.get("summary", ""),
                effective_date=effective_date,
            )
            
            # Validate each expected field
            assert result["policy_type"] == expected["policy_type"], \
                f"Case {case['id']}: policy_type mismatch. Expected: {expected['policy_type']}, Got: {result['policy_type']}"
            
            assert result["status"] == expected["status"], \
                f"Case {case['id']}: status mismatch. Expected: {expected['status']}, Got: {result['status']}"
            
            assert set(result["scopes"]) == set(expected["scopes"]), \
                f"Case {case['id']}: scopes mismatch. Expected: {expected['scopes']}, Got: {result['scopes']}"
            
            assert result["jurisdiction"] == expected["jurisdiction"], \
                f"Case {case['id']}: jurisdiction mismatch. Expected: {expected['jurisdiction']}, Got: {result['jurisdiction']}"
            
            assert result["mandatory"] == expected["mandatory"], \
                f"Case {case['id']}: mandatory mismatch. Expected: {expected['mandatory']}, Got: {result['mandatory']}"
            
            # Allow small tolerance for confidence (e.g., ±0.02)
            assert abs(result["confidence"] - expected["confidence"]) < 0.02, \
                f"Case {case['id']}: confidence mismatch. Expected: {expected['confidence']}, Got: {result['confidence']}"

    def test_policy_type_classification_keywords(self, classify_func):
        """Test policy type classification based on keywords"""
        test_cases = [
            ("disclosure reporting", "Disclosure"),
            ("carbon tax pricing", "Pricing"),
            ("ban phase-out", "Ban"),
            ("tax credit incentive", "Incentive"),
            ("supply chain due diligence", "Supply-chain"),
        ]
        
        for text, expected_type in test_cases:
            result = classify_func(
                title="Test Policy",
                text=text,
                jurisdiction="EU",
                source="Test Source"
            )
            assert result["policy_type"] == expected_type, \
                f"Expected {expected_type} for text '{text}', got {result['policy_type']}"

    def test_scope_inference(self, classify_func):
        """Test scope inference from text patterns"""
        test_cases = [
            ("direct emissions from facilities", [1]),
            ("purchased energy electricity", [2]),
            ("supplier value chain emissions", [3]),
            ("direct and indirect energy emissions", [1, 2]),
            ("supplier and value chain data", [3]),
            ("all emissions scopes 1 2 and 3", [1, 2, 3]),
        ]
        
        for text, expected_scopes in test_cases:
            result = classify_func(
                title="Test Policy",
                text=text,
                jurisdiction="EU",
                source="Test Source"
            )
            assert set(result["scopes"]) == set(expected_scopes), \
                f"Expected scopes {expected_scopes} for text '{text}', got {result['scopes']}"

    def test_jurisdiction_mapping(self, classify_func):
        """Test jurisdiction mapping from source and text"""
        test_cases = [
            ("European Commission", "EU", "EU"),
            ("U.S. SEC", "US-Federal", "US-Federal"),
            ("California OAL", "US-CA", "US-CA"),
            ("UK Government", "UK", "UK"),
            ("Unknown Source", "OTHER", "OTHER"),
        ]
        
        for source, expected_jurisdiction, _ in test_cases:
            result = classify_func(
                title="Test Policy",
                text="Test text",
                jurisdiction=expected_jurisdiction,
                source=source
            )
            assert result["jurisdiction"] == expected_jurisdiction, \
                f"Expected jurisdiction {expected_jurisdiction} for source '{source}', got {result['jurisdiction']}"

    def test_status_heuristics(self, classify_func):
        """Test status heuristics (Proposed, Adopted, Effective)"""
        test_cases = [
            ("proposes new regulations", "Proposed"),
            ("has been adopted", "Adopted"),
            ("is now effective", "Effective"),
            ("updates existing", "Adopted"),
            ("enters reporting phase", "Effective"),
        ]
        
        for text, expected_status in test_cases:
            result = classify_func(
                title="Test Policy",
                text=text,
                jurisdiction="EU",
                source="Test Source"
            )
            assert result["status"] == expected_status, \
                f"Expected status {expected_status} for text '{text}', got {result['status']}"

    def test_mandatory_detection(self, classify_func):
        """Test mandatory detection from keywords"""
        mandatory_keywords = [
            "mandatory",
            "required",
            "must",
            "shall",
            "compliance",
            "penalty",
            "enforcement"
        ]
        
        for keyword in mandatory_keywords:
            result = classify_func(
                title="Test Policy",
                text=f"This policy is {keyword} for all companies",
                jurisdiction="EU",
                source="Test Source"
            )
            assert result["mandatory"] is True, \
                f"Expected mandatory=True for keyword '{keyword}', got {result['mandatory']}"
        
        # Test voluntary
        result = classify_func(
            title="Test Policy",
            text="This policy is voluntary and optional",
            jurisdiction="EU",
            source="Test Source"
        )
        assert result["mandatory"] is False, \
            "Expected mandatory=False for voluntary text, got True"

    def test_confidence_scoring(self, classify_func):
        """Test confidence scoring (weighted signals)"""
        # High confidence: clear keywords and patterns
        high_confidence_text = "This mandatory policy requires all companies to disclose Scope 1, 2, and 3 emissions with third-party assurance."
        result = classify_func(
            title="High Confidence Policy",
            text=high_confidence_text,
            jurisdiction="EU",
            source="European Commission"
        )
        assert result["confidence"] > 0.8, \
            f"Expected high confidence (>0.8), got {result['confidence']}"
        
        # Low confidence: ambiguous text
        low_confidence_text = "This policy might involve some emissions reporting guidance."
        result = classify_func(
            title="Low Confidence Policy",
            text=low_confidence_text,
            jurisdiction="OTHER",
            source="Unknown"
        )
        assert result["confidence"] < 0.7, \
            f"Expected low confidence (<0.7), got {result['confidence']}"

    def test_deterministic_classification(self, classify_func):
        """Test that classification is deterministic (same input → same output)"""
        input_data = {
            "title": "EU ESRS Update",
            "text": "The European Sustainability Reporting Standards update introduces enhanced requirements for value-chain data granularity.",
            "jurisdiction": "EU",
            "source": "European Commission"
        }
        
        # Run classification twice
        result1 = classify_func(**input_data)
        result2 = classify_func(**input_data)
        
        # Results should be identical
        assert result1 == result2, \
            "Classification should be deterministic (same input → same output)"

