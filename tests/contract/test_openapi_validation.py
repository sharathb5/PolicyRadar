"""
Contract tests: Validate OpenAPI spec syntax and structure
"""
import pytest
import yaml
import json
from pathlib import Path

try:
    from openapi_spec_validator import validate_spec
    from openapi_spec_validator.exceptions import OpenAPIValidationError
except ImportError:
    try:
        from openapi_spec_validator import validate
        validate_spec = validate
    except ImportError:
        # Fallback: just validate YAML structure
        validate_spec = None
        OpenAPIValidationError = Exception


@pytest.mark.contract
class TestOpenAPIValidation:
    """Test OpenAPI spec validation"""

    def test_openapi_spec_exists(self, contracts_dir):
        """Verify OpenAPI spec file exists"""
        spec_file = contracts_dir / "openapi.yml"
        assert spec_file.exists(), "OpenAPI spec file not found"

    def test_openapi_spec_is_valid_yaml(self, contracts_dir):
        """Verify OpenAPI spec is valid YAML"""
        spec_file = contracts_dir / "openapi.yml"
        with open(spec_file, "r") as f:
            try:
                yaml.safe_load(f)
            except yaml.YAMLError as e:
                pytest.fail(f"OpenAPI spec is not valid YAML: {e}")

    def test_openapi_spec_validates(self, contracts_dir):
        """Verify OpenAPI spec validates against OpenAPI 3.0.3 schema"""
        spec_file = contracts_dir / "openapi.yml"
        with open(spec_file, "r") as f:
            spec = yaml.safe_load(f)
        
        if validate_spec is None:
            pytest.skip("openapi_spec_validator not available")
        
        try:
            validate_spec(spec)
        except Exception as e:
            pytest.fail(f"OpenAPI spec validation failed: {e}")

    def test_all_references_resolve(self, contracts_dir):
        """Verify all $ref references resolve correctly"""
        spec_file = contracts_dir / "openapi.yml"
        with open(spec_file, "r") as f:
            spec = yaml.safe_load(f)
        
        def check_refs(obj, path=""):
            """Recursively check all $ref references"""
            if isinstance(obj, dict):
                if "$ref" in obj:
                    ref_path = obj["$ref"]
                    if not ref_path.startswith("#/"):
                        pytest.fail(f"Invalid $ref at {path}: {ref_path}")
                    # Verify the reference path exists
                    parts = ref_path.lstrip("#/").split("/")
                    current = spec
                    for part in parts:
                        if part not in current:
                            pytest.fail(f"Reference does not resolve at {path}: {ref_path}")
                        current = current[part]
                else:
                    for key, value in obj.items():
                        check_refs(value, f"{path}.{key}" if path else key)
            elif isinstance(obj, list):
                for i, item in enumerate(obj):
                    check_refs(item, f"{path}[{i}]")
        
        check_refs(spec)

    def test_required_openapi_fields(self, contracts_dir):
        """Verify required OpenAPI fields are present"""
        spec_file = contracts_dir / "openapi.yml"
        with open(spec_file, "r") as f:
            spec = yaml.safe_load(f)
        
        required_fields = ["openapi", "info", "paths"]
        for field in required_fields:
            assert field in spec, f"Required field '{field}' missing from OpenAPI spec"
        
        assert "title" in spec["info"], "Required 'info.title' missing"
        assert "version" in spec["info"], "Required 'info.version' missing"

    def test_all_endpoints_have_tags(self, contracts_dir):
        """Verify all endpoints have tags"""
        spec_file = contracts_dir / "openapi.yml"
        with open(spec_file, "r") as f:
            spec = yaml.safe_load(f)
        
        for path, methods in spec.get("paths", {}).items():
            for method, operation in methods.items():
                if method in ["get", "post", "put", "patch", "delete"]:
                    assert "tags" in operation, f"Endpoint {method.upper()} {path} missing tags"
                    assert len(operation["tags"]) > 0, f"Endpoint {method.upper()} {path} has empty tags"

    def test_all_endpoints_have_responses(self, contracts_dir):
        """Verify all endpoints have response definitions"""
        spec_file = contracts_dir / "openapi.yml"
        with open(spec_file, "r") as f:
            spec = yaml.safe_load(f)
        
        for path, methods in spec.get("paths", {}).items():
            for method, operation in methods.items():
                if method in ["get", "post", "put", "patch", "delete"]:
                    assert "responses" in operation, f"Endpoint {method.upper()} {path} missing responses"
                    assert len(operation["responses"]) > 0, f"Endpoint {method.upper()} {path} has no responses"

