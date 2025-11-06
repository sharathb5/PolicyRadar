"use client"

import { useState, useEffect, useCallback } from "react"
import { PolicyHeader } from "./policy-header"
import { PolicyFilters } from "./policy-filters"
import { PolicyList } from "./policy-list"
import { PolicyDrawer } from "./policy-drawer"
import { usePolicies } from "@/lib/queries/policies"
import type { PolicyFilters as ApiFilters, PolicyListItem } from "@/lib/types"

export function PolicyFeed() {
  const [selectedPolicyId, setSelectedPolicyId] = useState<number | null>(null)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [filters, setFilters] = useState<ApiFilters>({
    sort: 'impact',
    order: 'desc',
    page: 1,
    page_size: 20,
  })
  const [searchQuery, setSearchQuery] = useState("")

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((prev) => ({
        ...prev,
        q: searchQuery || undefined,
        page: 1, // Reset to first page on search
      }))
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery])

  const { data, isLoading, error, refetch } = usePolicies(filters)

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!data?.items) return

      if (e.key === "ArrowDown") {
        e.preventDefault()
        setSelectedIndex((prev) => Math.min(prev + 1, data.items.length - 1))
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        setSelectedIndex((prev) => Math.max(prev - 1, 0))
      } else if (e.key === "ArrowRight" && selectedIndex >= 0) {
        e.preventDefault()
        setSelectedPolicyId(data.items[selectedIndex].id)
      } else if (e.key === "Escape") {
        e.preventDefault()
        setSelectedPolicyId(null)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [selectedIndex, data, selectedPolicyId])

  const handlePolicyClick = useCallback((policy: PolicyListItem) => {
    setSelectedPolicyId(policy.id)
  }, [])

  const handleFilterChange = useCallback((newFilters: Partial<ApiFilters>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      page: 1, // Reset to first page on filter change
    }))
  }, [])

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query)
  }, [])

  const handleSortChange = useCallback((sort: 'impact' | 'effective' | 'updated', order: 'asc' | 'desc') => {
    setFilters((prev) => ({
      ...prev,
      sort,
      order,
      page: 1,
    }))
  }, [])

  return (
    <div className="flex h-screen flex-col">
      <PolicyHeader 
        searchQuery={searchQuery} 
        onSearchChange={handleSearchChange}
        filters={filters}
        onFilterChange={handleFilterChange}
        onSortChange={handleSortChange}
      />

      <div className="flex flex-1 overflow-hidden">
        <PolicyFilters 
          filters={filters}
          onFilterChange={handleFilterChange}
        />

        <main className="flex-1 overflow-auto">
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-primary focus:text-primary-foreground"
          >
            Skip to main content
          </a>

          <div id="main-content">
            <PolicyList
              policies={data?.items || []}
              selectedIndex={selectedIndex}
              onPolicyClick={handlePolicyClick}
              isLoading={isLoading}
              error={error}
              onRetry={() => refetch()}
            />
          </div>
        </main>

        <PolicyDrawer policyId={selectedPolicyId} onClose={() => setSelectedPolicyId(null)} />
      </div>
    </div>
  )
}
