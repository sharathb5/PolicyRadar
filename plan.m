// Policy Radar - Consolidated Status Update (auto-generated)
// Timestamp: 2025-11-02

CurrentCoverage := 0.344;  // 34.4% (33/96)

ContractTests := <|
  "OpenAPIValidation" -> <|"Passed"->7,"Total"->7|>,
  "FieldNames" -> <|"Passed"->11,"Total"->11|>,
  "APIContracts" -> <|"Passed"->1,"Failed"->1,"Total"->8|>
|>;

IntegrationTests := <|
  "Passed"->1, "Skipped"->15, "Failed"->0, "Total"->16,
  "Blockers"->{"Import path mismatches","Module name mismatches","PYTHONPATH not set"}
|>;

GoldenTests := <|"Passed"->7, "Total"->23, "Status"->"Pending backend modules"|>;

E2ETests := <|"Passed"->2, "Total"->30, "Status"->"Playwright setup pending"|>;

BackendStatus := <|
  "Server"->"Running",
  "Healthz"->"Passing",
  "DB"->"Connected",
  "SeededPolicies"->12,
  "APIKeyAuth"->"Configured"
|>;

PriorityActions := {
  "Enable CORS for localhost:3000/3001 (DONE)",
  "Fix 4 API contract mismatches (arrays, saved keys, digest shape, unified errors)",
  "Idempotent ingest by source_item_id with versioning + change log (IN PROGRESS)",
  "Run integration tests after fixes (target 16/16)",
  "Run golden tests after modules (target 23/23)",
  "Set up Playwright and run E2E smoke"
};

Milestones := {
  "After API contract fixes" -> 0.36,
  "After integration tests" -> 0.51,
  "After backend modules" -> 0.77,
  "After E2E" -> 1.00
};

StatusSummary[] := <|
  "Coverage"->CurrentCoverage,
  "Contracts"->ContractTests,
  "Integration"->IntegrationTests,
  "Golden"->GoldenTests,
  "E2E"->E2ETests,
  "Backend"->BackendStatus,
  "Next"->PriorityActions,
  "Milestones"->Milestones
|>;

StatusSummary[]
