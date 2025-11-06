"""
Contract tests: Validate field names match dictionary.md
"""
import pytest
import yaml
import json
from pathlib import Path


@pytest.mark.contract
class TestFieldNames:
    """Test that all field names match dictionary.md conventions"""

    @pytest.fixture
    def dictionary(self):
        """Load dictionary.md (we'll parse it manually)"""
        dict_file = Path(__file__).parent.parent.parent / "dictionary.md"
        with open(dict_file, "r") as f:
            return f.read()

    @pytest.fixture
    def openapi_spec(self, contracts_dir):
        """Load OpenAPI spec"""
        spec_file = contracts_dir / "openapi.yml"
        with open(spec_file, "r") as f:
            return yaml.safe_load(f)

    def test_jurisdiction_enum_matches_dictionary(self, openapi_spec, dictionary):
        """Verify jurisdiction enum values match dictionary.md"""
        expected = ["EU", "US-Federal", "US-CA", "UK", "OTHER"]
        
        # Find jurisdiction enum in OpenAPI spec
        schema = openapi_spec["components"]["schemas"]["PolicyListItem"]
        enum_values = schema["properties"]["jurisdiction"]["enum"]
        
        assert set(enum_values) == set(expected), \
            f"Jurisdiction enum mismatch. Expected: {expected}, Got: {enum_values}"

    def test_policy_type_enum_matches_dictionary(self, openapi_spec, dictionary):
        """Verify policy_type enum values match dictionary.md"""
        expected = ["Disclosure", "Pricing", "Ban", "Incentive", "Supply-chain"]
        
        schema = openapi_spec["components"]["schemas"]["PolicyListItem"]
        enum_values = schema["properties"]["policy_type"]["enum"]
        
        assert set(enum_values) == set(expected), \
            f"Policy type enum mismatch. Expected: {expected}, Got: {enum_values}"

    def test_status_enum_matches_dictionary(self, openapi_spec, dictionary):
        """Verify status enum values match dictionary.md"""
        expected = ["Proposed", "Adopted", "Effective"]
        
        schema = openapi_spec["components"]["schemas"]["PolicyListItem"]
        enum_values = schema["properties"]["status"]["enum"]
        
        assert set(enum_values) == set(expected), \
            f"Status enum mismatch. Expected: {expected}, Got: {enum_values}"

    def test_scopes_enum_matches_dictionary(self, openapi_spec, dictionary):
        """Verify scopes enum values match dictionary.md"""
        expected = [1, 2, 3]
        
        schema = openapi_spec["components"]["schemas"]["PolicyListItem"]
        items_enum = schema["properties"]["scopes"]["items"]["enum"]
        
        assert set(items_enum) == set(expected), \
            f"Scopes enum mismatch. Expected: {expected}, Got: {items_enum}"

    def test_policy_list_item_field_names_match_dictionary(self, openapi_spec, dictionary):
        """Verify PolicyListItem field names match dictionary.md"""
        expected_fields = {
            "id", "title", "jurisdiction", "policy_type", "status", "scopes",
            "impact_score", "confidence", "effective_date", "last_updated_at",
            "source_name_official", "source_name_secondary", "what_might_change"
        }
        
        schema = openapi_spec["components"]["schemas"]["PolicyListItem"]
        actual_fields = set(schema["properties"].keys())
        
        assert actual_fields == expected_fields, \
            f"PolicyListItem field mismatch. Expected: {expected_fields}, Got: {actual_fields}"

    def test_policy_detail_field_names_match_dictionary(self, openapi_spec, dictionary):
        """Verify PolicyDetail includes all required fields from dictionary.md"""
        expected_additional_fields = {
            "summary", "impact_factors", "mandatory", "sectors", "version", "history"
        }
        
        schema = openapi_spec["components"]["schemas"]["PolicyDetail"]
        all_properties = set()
        
        # PolicyDetail uses allOf, so we need to merge properties
        for schema_ref in schema.get("allOf", []):
            if "properties" in schema_ref:
                all_properties.update(schema_ref["properties"].keys())
        
        assert expected_additional_fields.issubset(all_properties), \
            f"PolicyDetail missing fields. Expected: {expected_additional_fields}, Got: {all_properties}"

    def test_impact_factors_structure_matches_dictionary(self, openapi_spec, dictionary):
        """Verify impact_factors object structure matches dictionary.md"""
        expected_factor_fields = {
            "mandatory", "time_proximity", "scope_coverage",
            "sector_breadth", "disclosure_complexity"
        }
        
        schema = openapi_spec["components"]["schemas"]["PolicyDetail"]
        # Find impact_factors in allOf
        impact_factors_props = None
        for schema_ref in schema.get("allOf", []):
            if "properties" in schema_ref:
                if "impact_factors" in schema_ref["properties"]:
                    impact_factors_props = schema_ref["properties"]["impact_factors"]["properties"]
        
        assert impact_factors_props is not None, "impact_factors not found in PolicyDetail schema"
        actual_fields = set(impact_factors_props.keys())
        
        assert actual_fields == expected_factor_fields, \
            f"Impact factors field mismatch. Expected: {expected_factor_fields}, Got: {actual_fields}"

    def test_route_paths_match_dictionary(self, openapi_spec, dictionary):
        """Verify route paths match dictionary.md"""
        expected_routes = {
            "/healthz",
            "/policies",
            "/policies/{id}",
            "/saved/{policy_id}",
            "/saved",
            "/digest/preview"
        }
        
        actual_routes = set(openapi_spec["paths"].keys())
        
        assert actual_routes == expected_routes, \
            f"Route paths mismatch. Expected: {expected_routes}, Got: {actual_routes}"

    def test_query_parameter_names_match_dictionary(self, openapi_spec, dictionary):
        """Verify query parameter names for /policies match dictionary.md"""
        expected_params = {
            "q", "region", "policy_type", "status", "scopes",
            "impact_min", "confidence_min", "effective_before", "effective_after",
            "sort", "order", "page", "page_size"
        }
        
        policies_path = openapi_spec["paths"]["/policies"]["get"]
        actual_params = {param["name"] for param in policies_path.get("parameters", [])}
        
        assert actual_params == expected_params, \
            f"Query parameters mismatch. Expected: {expected_params}, Got: {actual_params}"

    def test_sort_enum_matches_dictionary(self, openapi_spec, dictionary):
        """Verify sort parameter enum matches dictionary.md"""
        expected = ["impact", "effective", "updated"]
        
        policies_path = openapi_spec["paths"]["/policies"]["get"]
        sort_param = next((p for p in policies_path.get("parameters", []) if p["name"] == "sort"), None)
        
        assert sort_param is not None, "sort parameter not found"
        enum_values = sort_param["schema"]["enum"]
        
        assert set(enum_values) == set(expected), \
            f"Sort enum mismatch. Expected: {expected}, Got: {enum_values}"

    def test_order_enum_matches_dictionary(self, openapi_spec, dictionary):
        """Verify order parameter enum matches dictionary.md"""
        expected = ["asc", "desc"]
        
        policies_path = openapi_spec["paths"]["/policies"]["get"]
        order_param = next((p for p in policies_path.get("parameters", []) if p["name"] == "order"), None)
        
        assert order_param is not None, "order parameter not found"
        enum_values = order_param["schema"]["enum"]
        
        assert set(enum_values) == set(expected), \
            f"Order enum mismatch. Expected: {expected}, Got: {enum_values}"

