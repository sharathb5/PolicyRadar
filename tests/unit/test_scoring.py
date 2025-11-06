"""
Unit tests for impact scoring algorithm using golden test cases
"""
import pytest
import json
from datetime import date, datetime
from pathlib import Path


@pytest.mark.unit
@pytest.mark.golden
class TestScoring:
    """Test impact scoring algorithm against golden test cases"""

    @pytest.fixture
    def scoring_cases(self, golden_dir):
        """Load golden scoring test cases"""
        cases_file = golden_dir / "scoring_cases.json"
        with open(cases_file, "r") as f:
            return json.load(f)

    @pytest.fixture
    def score_func(self):
        """Import or create scoring function
        
        This will use the actual implementation when available.
        """
        import sys
        from pathlib import Path
        
        # Add backend to path
        backend_dir = Path(__file__).parent.parent.parent / "PolicyRadar-backend"
        if str(backend_dir) not in sys.path:
            sys.path.insert(0, str(backend_dir))
        
        try:
            from app.core.scoring import calculate_impact_score
            return calculate_impact_score
        except ImportError:
            try:
                from backend.app.core.scoring import calculate_impact_score
                return calculate_impact_score
            except ImportError:
                # Stub implementation for testing framework
                pytest.skip("Backend scoring module not available - skipping golden tests")

    def test_scoring_golden_cases(self, scoring_cases, score_func, frozen_datetime):
        """Test all golden scoring cases against scoring.md examples"""
        for case in scoring_cases:
            input_data = case["input"]
            expected = case["expected"]
            
            # Parse dates
            effective_date = date.fromisoformat(input_data["effective_date"])
            reference_date = date.fromisoformat(input_data["reference_date"])
            
            # Call actual scoring function (not mocked)
            # Note: function signature is: calculate_impact_score(mandatory, effective_date, scopes, sectors, title, summary, text)
            combined_text = f"{input_data.get('title', '')} {input_data.get('summary', '')} {input_data.get('text', '')}"
            
            # Extract disclosure_complexity from input if present (for testing)
            title = input_data.get("title", "Test Policy")
            summary = input_data.get("summary", "")
            text = input_data.get("text", combined_text)
            
            # If disclosure_complexity is provided as a string, inject keywords
            disclosure_complexity = input_data.get("disclosure_complexity")
            if disclosure_complexity == "high":
                text += " supplier-level granular itemized data with assurance and audit"
            elif disclosure_complexity == "moderate":
                text += " data with assurance and third-party verification"
            elif disclosure_complexity == "basic":
                text += " disclosure and reporting of data"
            
            result = score_func(
                mandatory=input_data["mandatory"],
                effective_date=effective_date,
                scopes=input_data["scopes"],
                sectors=input_data.get("sectors", []),
                title=title,
                summary=summary,
                text=text
            )
            
            # Function returns (impact_score, impact_factors_dict)
            # Convert to expected format
            impact_score, impact_factors_dict = result
            result = {
                "impact_score": impact_score,
                "impact_factors": impact_factors_dict
            }
            
            # Validate impact score
            assert result["impact_score"] == expected["impact_score"], \
                f"Case {case['id']}: impact_score mismatch. Expected: {expected['impact_score']}, Got: {result['impact_score']}"
            
            # Validate impact factors structure
            assert "impact_factors" in result, \
                f"Case {case['id']}: impact_factors missing from result"
            
            impact_factors = result["impact_factors"]
            expected_factors = expected["impact_factors"]
            
            assert impact_factors["mandatory"] == expected_factors["mandatory"], \
                f"Case {case['id']}: mandatory factor mismatch. Expected: {expected_factors['mandatory']}, Got: {impact_factors['mandatory']}"
            
            assert impact_factors["time_proximity"] == expected_factors["time_proximity"], \
                f"Case {case['id']}: time_proximity factor mismatch. Expected: {expected_factors['time_proximity']}, Got: {impact_factors['time_proximity']}"
            
            assert impact_factors["scope_coverage"] == expected_factors["scope_coverage"], \
                f"Case {case['id']}: scope_coverage factor mismatch. Expected: {expected_factors['scope_coverage']}, Got: {impact_factors['scope_coverage']}"
            
            assert impact_factors["sector_breadth"] == expected_factors["sector_breadth"], \
                f"Case {case['id']}: sector_breadth factor mismatch. Expected: {expected_factors['sector_breadth']}, Got: {impact_factors['sector_breadth']}"
            
            assert impact_factors["disclosure_complexity"] == expected_factors["disclosure_complexity"], \
                f"Case {case['id']}: disclosure_complexity factor mismatch. Expected: {expected_factors['disclosure_complexity']}, Got: {impact_factors['disclosure_complexity']}"

    def test_mandatory_factor(self, score_func, frozen_datetime):
        """Test mandatory vs voluntary factor (0-20 points)"""
        effective_date = date(2026, 1, 1)
        
        # Mandatory: +20
        impact_score, impact_factors = score_func(
            mandatory=True,
            effective_date=effective_date,
            scopes=[1],
            sectors=["energy"],
            title="Test Policy",
            summary="Test summary",
            text=""
        )
        assert impact_factors["mandatory"] == 20, \
            "Mandatory policies should get +20 points"
        
        # Voluntary: +10
        impact_score, impact_factors = score_func(
            mandatory=False,
            effective_date=effective_date,
            scopes=[1],
            sectors=["energy"],
            title="Test Policy",
            summary="Test summary",
            text=""
        )
        assert impact_factors["mandatory"] == 10, \
            "Voluntary policies should get +10 points"

    def test_time_proximity_factor(self, score_func, frozen_datetime):
        """Test time proximity factor (0-20 points)"""
        # ≤12 months (365 days): +20
        effective_date = date(2026, 10, 15)  # Exactly 365 days
        impact_score, impact_factors = score_func(
            mandatory=True,
            effective_date=effective_date,
            scopes=[1],
            sectors=["energy"],
            title="Test Policy",
            summary="",
            text=""
        )
        assert impact_factors["time_proximity"] == 20, \
            "≤12 months should get +20 points"
        
        # 12-24 months (366-730 days): +10
        effective_date = date(2026, 10, 16)  # 366 days
        impact_score, impact_factors = score_func(
            mandatory=True,
            effective_date=effective_date,
            scopes=[1],
            sectors=["energy"],
            title="Test Policy",
            summary="",
            text=""
        )
        assert impact_factors["time_proximity"] == 10, \
            "12-24 months should get +10 points"
        
        # >24 months (>730 days): +0
        effective_date = date(2027, 10, 16)  # 731 days
        impact_score, impact_factors = score_func(
            mandatory=True,
            effective_date=effective_date,
            scopes=[1],
            sectors=["energy"],
            title="Test Policy",
            summary="",
            text=""
        )
        assert impact_factors["time_proximity"] == 0, \
            ">24 months should get +0 points"

    def test_scope_coverage_factor(self, score_func, frozen_datetime):
        """Test scope coverage factor (0-20 points, capped)"""
        effective_date = date(2026, 1, 1)
        
        # Scope 1: +7
        impact_score, impact_factors = score_func(
            mandatory=True,
            effective_date=effective_date,
            scopes=[1],
            sectors=["energy"],
            title="Test Policy",
            summary="",
            text=""
        )
        assert impact_factors["scope_coverage"] == 7, \
            "Scope 1 should get +7 points"
        
        # Scopes 1, 2: +14 (7+7)
        impact_score, impact_factors = score_func(
            mandatory=True,
            effective_date=effective_date,
            scopes=[1, 2],
            sectors=["energy"],
            title="Test Policy",
            summary="",
            text=""
        )
        assert impact_factors["scope_coverage"] == 14, \
            "Scopes 1, 2 should get +14 points"
        
        # Scopes 1, 2, 3: +20 (7+7+7=21, capped at 20)
        impact_score, impact_factors = score_func(
            mandatory=True,
            effective_date=effective_date,
            scopes=[1, 2, 3],
            sectors=["energy"],
            title="Test Policy",
            summary="",
            text=""
        )
        assert impact_factors["scope_coverage"] == 20, \
            "All 3 scopes should get +20 points (capped)"

    def test_sector_breadth_factor(self, score_func, frozen_datetime):
        """Test sector breadth factor (0-20 points)"""
        reference_date = date(2025, 10, 15)
        effective_date = date(2026, 1, 1)
        
        # Narrow (1-2 sectors): +5
        impact_score, impact_factors = score_func(
            mandatory=True,
            effective_date=effective_date,
            scopes=[1],
            sectors=["energy"],
            title="Test Policy",
            summary="",
            text=""
        )
        assert impact_factors["sector_breadth"] == 5, \
            "1-2 sectors should get +5 points"
        
        # Medium (3-5 sectors): +12
        impact_score, impact_factors = score_func(
            mandatory=True,
            effective_date=effective_date,
            scopes=[1],
            sectors=["manufacturing", "energy", "transportation"],
            title="Test Policy",
            summary="",
            text=""
        )
        assert impact_factors["sector_breadth"] == 12, \
            "3-5 sectors should get +12 points"
        
        # Cross-sector (6+ sectors): +20
        impact_score, impact_factors = score_func(
            mandatory=True,
            effective_date=effective_date,
            scopes=[1],
            sectors=["manufacturing", "energy", "transportation", "agriculture", "construction", "services"],
            title="Test Policy",
            summary="",
            text=""
        )
        assert impact_factors["sector_breadth"] == 20, \
            "6+ sectors should get +20 points"

    def test_disclosure_complexity_factor(self, score_func, frozen_datetime):
        """Test disclosure complexity factor (0-20 points)"""
        reference_date = date(2025, 10, 15)
        effective_date = date(2026, 1, 1)
        
        # None: 0
        impact_score, impact_factors = score_func(
            mandatory=True,
            effective_date=effective_date,
            scopes=[1],
            sectors=["energy"],
            title="Test Policy",
            summary="",
            text=""
        )
        assert impact_factors["disclosure_complexity"] == 0, \
            "No complexity should get 0 points"
        
        # Basic: +7
        impact_score, impact_factors = score_func(
            mandatory=True,
            effective_date=effective_date,
            scopes=[1],
            sectors=["energy"],
            title="Test Policy",
            summary="",
            text="disclosure and reporting of data"
        )
        assert impact_factors["disclosure_complexity"] == 7, \
            "Basic disclosure should get +7 points"
        
        # Moderate: +14
        impact_score, impact_factors = score_func(
            mandatory=True,
            effective_date=effective_date,
            scopes=[1],
            sectors=["energy"],
            title="Test Policy",
            summary="",
            text="data with assurance and third-party verification"
        )
        assert impact_factors["disclosure_complexity"] == 14, \
            "Moderate disclosure should get +14 points"
        
        # High: +20
        impact_score, impact_factors = score_func(
            mandatory=True,
            effective_date=effective_date,
            scopes=[1],
            sectors=["energy"],
            title="Test Policy",
            summary="",
            text="supplier-level granular itemized data with assurance and audit"
        )
        assert impact_factors["disclosure_complexity"] == 20, \
            "High disclosure should get +20 points"

    def test_total_score_capping(self, score_func, frozen_datetime):
        """Test that total score is capped at 100"""
        reference_date = date(2025, 10, 15)
        effective_date = date(2026, 1, 1)
        
        # Create a case that would exceed 100 if not capped
        impact_score, impact_factors = score_func(
            mandatory=True,
            effective_date=effective_date,
            scopes=[1, 2, 3],
            sectors=["manufacturing", "energy", "transportation", "agriculture", "construction", "services", "retail"],
            title="Test Policy",
            summary="",
            text="supplier-level granular itemized data with assurance and audit"
        )
        
        assert impact_score <= 100, \
            f"Impact score should be capped at 100, got {impact_score}"
        
        # Verify sum of factors equals what was capped
        total_factors = sum(impact_factors.values())
        assert total_factors >= 100, \
            f"Sum of factors ({total_factors}) should be >= 100 to test capping"

    def test_impact_factors_json_structure(self, score_func, frozen_datetime):
        """Test that impact_factors has correct JSON structure"""
        reference_date = date(2025, 10, 15)
        effective_date = date(2026, 1, 1)
        
        impact_score, impact_factors = score_func(
            mandatory=True,
            effective_date=effective_date,
            scopes=[1, 2],
            sectors=["manufacturing"],
            title="Test Policy",
            summary="",
            text="data with assurance and third-party verification"
        )
        
        assert impact_factors is not None, "impact_factors missing from result"
        required_keys = ["mandatory", "time_proximity", "scope_coverage", "sector_breadth", "disclosure_complexity"]
        
        for key in required_keys:
            assert key in impact_factors, f"Required key '{key}' missing from impact_factors"
            assert isinstance(impact_factors[key], int), f"impact_factors['{key}'] should be integer"
            assert 0 <= impact_factors[key] <= 20, f"impact_factors['{key}'] should be 0-20"

    def test_deterministic_scoring(self, score_func, frozen_datetime):
        """Test that scoring is deterministic (same input → same output)"""
        reference_date = date(2025, 10, 15)
        effective_date = date(2026, 1, 1)
        
        # Run scoring twice with same inputs
        impact_score1, impact_factors1 = score_func(
            mandatory=True,
            effective_date=effective_date,
            scopes=[1, 2, 3],
            sectors=["manufacturing", "energy"],
            title="Test Policy",
            summary="",
            text="data with assurance and third-party verification"
        )
        
        impact_score2, impact_factors2 = score_func(
            mandatory=True,
            effective_date=effective_date,
            scopes=[1, 2, 3],
            sectors=["manufacturing", "energy"],
            title="Test Policy",
            summary="",
            text="data with assurance and third-party verification"
        )
        
        # Results should be identical
        assert impact_score1 == impact_score2, \
            "Scoring should be deterministic (same input → same output)"
        assert impact_factors1 == impact_factors2, \
            "Impact factors should be deterministic (same input → same output)"

