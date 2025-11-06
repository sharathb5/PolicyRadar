"use client"

import { PolicyRow } from "@/components/ui/policy-row"
import type { Policy } from "@/lib/policy-data"

interface PolicyListProps {
  policies: Policy[]
  selectedIndex: number
  onPolicyClick: (policy: Policy) => void
  onSavePolicy?: (policyId: string) => void
  isSavedMap?: Record<string, boolean>
}

export function PolicyList({ policies, selectedIndex, onPolicyClick, onSavePolicy, isSavedMap = {} }: PolicyListProps) {
  if (policies.length === 0) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="text-center">
          <p className="text-lg font-medium text-foreground">No policies found</p>
          <p className="text-sm text-muted-foreground mt-2">Try adjusting your filters</p>
        </div>
      </div>
    )
  }

  return (
    <div className="divide-y divide-border">
      {policies.map((policy, index) => (
        <PolicyRow
          key={policy.id}
          policy={policy}
          focused={index === selectedIndex}
          onClick={() => onPolicyClick(policy)}
          onSave={onSavePolicy}
          isSaved={isSavedMap[policy.id] || false}
        />
      ))}
    </div>
  )
}
