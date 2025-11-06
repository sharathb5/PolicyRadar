"use client"

import { FilterToggle } from "@/components/ui/filter-toggle"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import type { PolicyFilters } from "@/lib/types"

interface PolicyFiltersProps {
  filters: PolicyFilters
  onFilterChange: (filters: Partial<PolicyFilters>) => void
}

export function PolicyFilters({ filters, onFilterChange }: PolicyFiltersProps) {
  const selectedRegions = filters.region || []
  const selectedTypes = filters.policy_type || []
  const selectedStatuses = filters.status || []
  const selectedScopes = filters.scopes || []
  const impactThreshold = filters.impact_min ?? 0
  const confidenceThreshold = filters.confidence_min ?? 0

  const toggleFilter = (
    value: string,
    selected: string[],
    field: 'region' | 'policy_type' | 'status'
  ) => {
    const newSelected = selected.includes(value)
      ? selected.filter((v) => v !== value)
      : [...selected, value]
    
    onFilterChange({
      [field]: newSelected.length > 0 ? (newSelected as any) : undefined,
    })
  }

  const toggleScope = (scope: number) => {
    const newScopes = selectedScopes.includes(scope)
      ? selectedScopes.filter((s) => s !== scope)
      : [...selectedScopes, scope]
    
    onFilterChange({
      scopes: newScopes.length > 0 ? newScopes : undefined,
    })
  }

  const handleImpactChange = (value: number[]) => {
    onFilterChange({
      impact_min: value[0] > 0 ? value[0] : undefined,
    })
  }

  const handleConfidenceChange = (value: number[]) => {
    onFilterChange({
      confidence_min: value[0] > 0 ? value[0] : undefined,
    })
  }

  const clearAllFilters = () => {
    onFilterChange({
      region: undefined,
      policy_type: undefined,
      status: undefined,
      scopes: undefined,
      impact_min: undefined,
      confidence_min: undefined,
      effective_before: undefined,
      effective_after: undefined,
    })
  }

  const hasActiveFilters =
    selectedRegions.length > 0 ||
    selectedTypes.length > 0 ||
    selectedStatuses.length > 0 ||
    selectedScopes.length > 0 ||
    impactThreshold > 0 ||
    confidenceThreshold > 0

  return (
    <aside className="w-64 border-r border-border bg-card overflow-auto p-4">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:block focus:mb-4 focus:text-primary">
        Skip to filters
      </a>

      <div className="space-y-6">
        {hasActiveFilters && (
          <div>
            <Button
              data-testid="clear-all-filters"
              variant="outline"
              size="sm"
              onClick={clearAllFilters}
              className="w-full"
            >
              Clear all filters
            </Button>
          </div>
        )}

        <div data-testid="filter-region">
          <Label className="text-sm font-semibold mb-3 block">Region</Label>
          <div className="space-y-2">
            <FilterToggle
              data-testid="filter-region-EU"
              active={selectedRegions.includes("EU")}
              onClick={() => toggleFilter("EU", selectedRegions, 'region')}
            >
              EU
            </FilterToggle>
            <FilterToggle
              data-testid="filter-region-US-Federal"
              active={selectedRegions.includes("US-Federal")}
              onClick={() => toggleFilter("US-Federal", selectedRegions, 'region')}
            >
              US-Federal
            </FilterToggle>
            <FilterToggle
              data-testid="filter-region-US-CA"
              active={selectedRegions.includes("US-CA")}
              onClick={() => toggleFilter("US-CA", selectedRegions, 'region')}
            >
              US-CA
            </FilterToggle>
            <FilterToggle
              data-testid="filter-region-UK"
              active={selectedRegions.includes("UK")}
              onClick={() => toggleFilter("UK", selectedRegions, 'region')}
            >
              UK
            </FilterToggle>
            <FilterToggle
              data-testid="filter-region-OTHER"
              active={selectedRegions.includes("OTHER")}
              onClick={() => toggleFilter("OTHER", selectedRegions, 'region')}
            >
              OTHER
            </FilterToggle>
          </div>
        </div>

        <div>
          <Label className="text-sm font-semibold mb-3 block">Policy Type</Label>
          <div className="space-y-2">
            <FilterToggle
              data-testid="filter-policy-type-Disclosure"
              active={selectedTypes.includes("Disclosure")}
              onClick={() => toggleFilter("Disclosure", selectedTypes, 'policy_type')}
            >
              Disclosure
            </FilterToggle>
            <FilterToggle
              data-testid="filter-policy-type-Pricing"
              active={selectedTypes.includes("Pricing")}
              onClick={() => toggleFilter("Pricing", selectedTypes, 'policy_type')}
            >
              Pricing
            </FilterToggle>
            <FilterToggle
              data-testid="filter-policy-type-Ban"
              active={selectedTypes.includes("Ban")}
              onClick={() => toggleFilter("Ban", selectedTypes, 'policy_type')}
            >
              Ban/Phase-out
            </FilterToggle>
            <FilterToggle
              data-testid="filter-policy-type-Incentive"
              active={selectedTypes.includes("Incentive")}
              onClick={() => toggleFilter("Incentive", selectedTypes, 'policy_type')}
            >
              Incentive/Subsidy
            </FilterToggle>
            <FilterToggle
              data-testid="filter-policy-type-Supply-chain"
              active={selectedTypes.includes("Supply-chain")}
              onClick={() => toggleFilter("Supply-chain", selectedTypes, 'policy_type')}
            >
              Supply-chain Due Diligence
            </FilterToggle>
          </div>
        </div>

        <div>
          <Label className="text-sm font-semibold mb-3 block">Status</Label>
          <div className="space-y-2">
            <FilterToggle
              data-testid="filter-status-Proposed"
              active={selectedStatuses.includes("Proposed")}
              onClick={() => toggleFilter("Proposed", selectedStatuses, 'status')}
            >
              Proposed
            </FilterToggle>
            <FilterToggle
              data-testid="filter-status-Adopted"
              active={selectedStatuses.includes("Adopted")}
              onClick={() => toggleFilter("Adopted", selectedStatuses, 'status')}
            >
              Adopted
            </FilterToggle>
            <FilterToggle
              data-testid="filter-status-Effective"
              active={selectedStatuses.includes("Effective")}
              onClick={() => toggleFilter("Effective", selectedStatuses, 'status')}
            >
              Effective
            </FilterToggle>
          </div>
        </div>

        <div>
          <Label className="text-sm font-semibold mb-3 block">Scopes</Label>
          <div className="space-y-2">
            <FilterToggle 
              data-testid="filter-scope-1"
              active={selectedScopes.includes(1)} 
              onClick={() => toggleScope(1)}
            >
              Scope 1
            </FilterToggle>
            <FilterToggle 
              data-testid="filter-scope-2"
              active={selectedScopes.includes(2)} 
              onClick={() => toggleScope(2)}
            >
              Scope 2
            </FilterToggle>
            <FilterToggle 
              data-testid="filter-scope-3"
              active={selectedScopes.includes(3)} 
              onClick={() => toggleScope(3)}
            >
              Scope 3
            </FilterToggle>
          </div>
        </div>

        <div>
          <Label className="text-sm font-semibold mb-3 block">Impact ≥ {impactThreshold}</Label>
          <Slider 
            data-testid="impact-min-slider"
            value={[impactThreshold]} 
            onValueChange={handleImpactChange} 
            max={100} 
            step={5} 
          />
        </div>

        <div>
          <Label className="text-sm font-semibold mb-3 block">Confidence ≥ {confidenceThreshold.toFixed(2)}</Label>
          <Slider value={[confidenceThreshold]} onValueChange={handleConfidenceChange} max={1} step={0.05} />
        </div>
      </div>
    </aside>
  )
}
