"use client"

import { useState, useEffect } from "react"
import { FilterToggle } from "@/components/ui/filter-toggle"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { policies, type Policy } from "@/lib/policy-data"

interface PolicyFiltersProps {
  onFilterChange: (filtered: Policy[]) => void
}

export function PolicyFilters({ onFilterChange }: PolicyFiltersProps) {
  const [selectedRegions, setSelectedRegions] = useState<string[]>([])
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([])
  const [selectedScopes, setSelectedScopes] = useState<number[]>([])
  const [impactThreshold, setImpactThreshold] = useState([0])
  const [confidenceThreshold, setConfidenceThreshold] = useState([0])

  useEffect(() => {
    let filtered = policies

    if (selectedRegions.length > 0) {
      filtered = filtered.filter((p) => selectedRegions.includes(p.jurisdiction))
    }
    if (selectedTypes.length > 0) {
      filtered = filtered.filter((p) => selectedTypes.includes(p.policy_type))
    }
    if (selectedStatuses.length > 0) {
      filtered = filtered.filter((p) => selectedStatuses.includes(p.status))
    }
    if (selectedScopes.length > 0) {
      filtered = filtered.filter((p) => p.scopes.some((s) => selectedScopes.includes(s)))
    }
    filtered = filtered.filter((p) => p.impact_score >= impactThreshold[0])
    filtered = filtered.filter((p) => p.confidence >= confidenceThreshold[0])

    onFilterChange(filtered)
  }, [
    selectedRegions,
    selectedTypes,
    selectedStatuses,
    selectedScopes,
    impactThreshold,
    confidenceThreshold,
    onFilterChange,
  ])

  const toggleFilter = (value: string, selected: string[], setter: (v: string[]) => void) => {
    if (selected.includes(value)) {
      setter(selected.filter((v) => v !== value))
    } else {
      setter([...selected, value])
    }
  }

  const toggleScope = (scope: number) => {
    if (selectedScopes.includes(scope)) {
      setSelectedScopes(selectedScopes.filter((s) => s !== scope))
    } else {
      setSelectedScopes([...selectedScopes, scope])
    }
  }

  return (
    <aside className="w-64 border-r border-border bg-card overflow-auto p-4">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:block focus:mb-4 focus:text-primary">
        Skip to filters
      </a>

      <div className="space-y-6">
        <div>
          <Label className="text-sm font-semibold mb-3 block">Region</Label>
          <div className="space-y-2">
            <FilterToggle
              active={selectedRegions.includes("EU")}
              onClick={() => toggleFilter("EU", selectedRegions, setSelectedRegions)}
            >
              EU
            </FilterToggle>
            <FilterToggle
              active={selectedRegions.includes("US-Federal")}
              onClick={() => toggleFilter("US-Federal", selectedRegions, setSelectedRegions)}
            >
              US-Federal
            </FilterToggle>
            <FilterToggle
              active={selectedRegions.includes("US-CA")}
              onClick={() => toggleFilter("US-CA", selectedRegions, setSelectedRegions)}
            >
              US-CA
            </FilterToggle>
            <FilterToggle
              active={selectedRegions.includes("UK")}
              onClick={() => toggleFilter("UK", selectedRegions, setSelectedRegions)}
            >
              UK
            </FilterToggle>
          </div>
        </div>

        <div>
          <Label className="text-sm font-semibold mb-3 block">Policy Type</Label>
          <div className="space-y-2">
            <FilterToggle
              active={selectedTypes.includes("Disclosure")}
              onClick={() => toggleFilter("Disclosure", selectedTypes, setSelectedTypes)}
            >
              Disclosure
            </FilterToggle>
            <FilterToggle
              active={selectedTypes.includes("Pricing")}
              onClick={() => toggleFilter("Pricing", selectedTypes, setSelectedTypes)}
            >
              Pricing
            </FilterToggle>
            <FilterToggle
              active={selectedTypes.includes("Ban")}
              onClick={() => toggleFilter("Ban", selectedTypes, setSelectedTypes)}
            >
              Ban/Phase-out
            </FilterToggle>
            <FilterToggle
              active={selectedTypes.includes("Incentive")}
              onClick={() => toggleFilter("Incentive", selectedTypes, setSelectedTypes)}
            >
              Incentive/Subsidy
            </FilterToggle>
            <FilterToggle
              active={selectedTypes.includes("Supply-chain")}
              onClick={() => toggleFilter("Supply-chain", selectedTypes, setSelectedTypes)}
            >
              Supply-chain Due Diligence
            </FilterToggle>
          </div>
        </div>

        <div>
          <Label className="text-sm font-semibold mb-3 block">Status</Label>
          <div className="space-y-2">
            <FilterToggle
              active={selectedStatuses.includes("Proposed")}
              onClick={() => toggleFilter("Proposed", selectedStatuses, setSelectedStatuses)}
            >
              Proposed
            </FilterToggle>
            <FilterToggle
              active={selectedStatuses.includes("Adopted")}
              onClick={() => toggleFilter("Adopted", selectedStatuses, setSelectedStatuses)}
            >
              Adopted
            </FilterToggle>
            <FilterToggle
              active={selectedStatuses.includes("Effective")}
              onClick={() => toggleFilter("Effective", selectedStatuses, setSelectedStatuses)}
            >
              Effective
            </FilterToggle>
          </div>
        </div>

        <div>
          <Label className="text-sm font-semibold mb-3 block">Scopes</Label>
          <div className="space-y-2">
            <FilterToggle active={selectedScopes.includes(1)} onClick={() => toggleScope(1)}>
              Scope 1
            </FilterToggle>
            <FilterToggle active={selectedScopes.includes(2)} onClick={() => toggleScope(2)}>
              Scope 2
            </FilterToggle>
            <FilterToggle active={selectedScopes.includes(3)} onClick={() => toggleScope(3)}>
              Scope 3
            </FilterToggle>
          </div>
        </div>

        <div>
          <Label className="text-sm font-semibold mb-3 block">Impact ≥ {impactThreshold[0]}</Label>
          <Slider value={impactThreshold} onValueChange={setImpactThreshold} max={100} step={5} />
        </div>

        <div>
          <Label className="text-sm font-semibold mb-3 block">Confidence ≥ {confidenceThreshold[0].toFixed(2)}</Label>
          <Slider value={confidenceThreshold} onValueChange={setConfidenceThreshold} max={1} step={0.05} />
        </div>
      </div>
    </aside>
  )
}
