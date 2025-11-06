"use client"

import { PolicyRow } from "@/components/ui/policy-row"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"
import type { PolicyListItem } from "@/lib/types"

interface PolicyListProps {
  policies: PolicyListItem[]
  selectedIndex: number
  onPolicyClick: (policy: PolicyListItem) => void
  isLoading?: boolean
  error?: Error | null
  onRetry?: () => void
}

export function PolicyList({ 
  policies, 
  selectedIndex, 
  onPolicyClick,
  isLoading = false,
  error,
  onRetry,
}: PolicyListProps) {
  if (isLoading) {
    return (
      <div className="divide-y divide-border">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} data-testid="policy-skeleton" className="px-6 py-4 space-y-3">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-full" />
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="text-center max-w-md">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <p className="text-lg font-medium text-foreground mb-2">Error loading policies</p>
          <p className="text-sm text-muted-foreground mb-4">
            {error instanceof Error ? error.message : 'An unknown error occurred'}
          </p>
          {onRetry && (
            <Button onClick={onRetry} variant="default">
              Retry
            </Button>
          )}
        </div>
      </div>
    )
  }

  if (policies.length === 0) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="text-center" data-testid="empty-state">
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
        />
      ))}
    </div>
  )
}
