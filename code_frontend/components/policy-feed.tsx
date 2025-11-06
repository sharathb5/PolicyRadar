"use client"

import { useState, useEffect, useCallback } from "react"
import { PolicyHeader } from "./policy-header"
import { PolicyFilters } from "./policy-filters"
import { PolicyList } from "./policy-list"
import { PolicyDrawer } from "./policy-drawer"
import { policies, type Policy } from "@/lib/policy-data"
import { useSavedPolicies } from "@/lib/use-saved-policies"

interface PolicyFeedProps {
  onNavigateToDigest?: () => void
}

export function PolicyFeed({ onNavigateToDigest }: PolicyFeedProps) {
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null)
  const [filteredPolicies, setFilteredPolicies] = useState<Policy[]>(policies)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const { savedPolicies, toggleSavePolicy, isSaved } = useSavedPolicies()

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault()
        setSelectedIndex((prev) => Math.min(prev + 1, filteredPolicies.length - 1))
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        setSelectedIndex((prev) => Math.max(prev - 1, 0))
      } else if (e.key === "ArrowRight" && selectedIndex >= 0) {
        e.preventDefault()
        setSelectedPolicy(filteredPolicies[selectedIndex])
      } else if (e.key === "Escape") {
        e.preventDefault()
        setSelectedPolicy(null)
      } else if (e.key === "s" && selectedPolicy) {
        e.preventDefault()
        // Save action
        console.log("Saved:", selectedPolicy.title)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [selectedIndex, filteredPolicies, selectedPolicy])

  const handlePolicyClick = useCallback((policy: Policy) => {
    setSelectedPolicy(policy)
  }, [])

  const handleSavePolicy = (policyId: string) => {
    toggleSavePolicy(policyId)
  }

  return (
    <div className="flex h-screen flex-col">
      <PolicyHeader onNavigateToDigest={onNavigateToDigest} />

      <div className="flex flex-1 overflow-hidden">
        <PolicyFilters onFilterChange={setFilteredPolicies} />

        <main className="flex-1 overflow-auto">
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-primary focus:text-primary-foreground"
          >
            Skip to main content
          </a>

          <div id="main-content">
            <PolicyList
              policies={filteredPolicies}
              selectedIndex={selectedIndex}
              onPolicyClick={handlePolicyClick}
              onSavePolicy={handleSavePolicy}
              isSavedMap={Object.fromEntries(filteredPolicies.map((p) => [p.id, isSaved(p.id)]))}
            />
          </div>
        </main>

        <PolicyDrawer
          policy={selectedPolicy}
          onClose={() => setSelectedPolicy(null)}
          onSave={handleSavePolicy}
          isSaved={selectedPolicy ? isSaved(selectedPolicy.id) : false}
        />
      </div>
    </div>
  )
}
