"use client"

import { useState } from "react"
import { Search, User, X, HelpCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { LegendDialog } from "@/components/legend-dialog"
import type { PolicyFilters } from "@/lib/types"

interface PolicyHeaderProps {
  searchQuery?: string
  onSearchChange?: (query: string) => void
  filters?: PolicyFilters
  onFilterChange?: (filters: Partial<PolicyFilters>) => void
  onSortChange?: (sort: 'impact' | 'effective' | 'updated', order: 'asc' | 'desc') => void
}

export function PolicyHeader({ 
  searchQuery = "", 
  onSearchChange,
  filters,
  onFilterChange,
  onSortChange,
}: PolicyHeaderProps) {
  const [isLegendOpen, setIsLegendOpen] = useState(false)
  const activeFilters: string[] = []
  
  if (filters) {
    if (filters.region && filters.region.length > 0) {
      activeFilters.push(...filters.region.map(r => `region:${r}`))
    }
    if (filters.policy_type && filters.policy_type.length > 0) {
      activeFilters.push(...filters.policy_type.map(t => `type:${t}`))
    }
    if (filters.status && filters.status.length > 0) {
      activeFilters.push(...filters.status.map(s => `status:${s}`))
    }
    if (filters.scopes && filters.scopes.length > 0) {
      activeFilters.push(...filters.scopes.map(s => `scope:${s}`))
    }
  }

  const handleRemoveFilter = (filterKey: string) => {
    if (!onFilterChange || !filters) return
    
    const [type, value] = filterKey.split(':')
    
    if (type === 'region') {
      const newRegions = filters.region?.filter(r => r !== value) || []
      onFilterChange({ region: newRegions.length > 0 ? newRegions : undefined })
    } else if (type === 'type') {
      const newTypes = filters.policy_type?.filter(t => t !== value) || []
      onFilterChange({ policy_type: newTypes.length > 0 ? newTypes : undefined })
    } else if (type === 'status') {
      const newStatuses = filters.status?.filter(s => s !== value) || []
      onFilterChange({ status: newStatuses.length > 0 ? newStatuses : undefined })
    } else if (type === 'scope') {
      const newScopes = filters.scopes?.filter(s => s !== parseInt(value)) || []
      onFilterChange({ scopes: newScopes.length > 0 ? newScopes : undefined })
    }
  }

  const currentSort = filters?.sort || 'impact'
  const currentOrder = filters?.order || 'desc'

  const handleSortChange = (value: string) => {
    if (onSortChange) {
      const [sort, order] = value.split('-') as ['impact' | 'effective' | 'updated', 'asc' | 'desc']
      onSortChange(sort, order)
    } else if (onFilterChange) {
      const [sort, order] = value.split('-') as ['impact' | 'effective' | 'updated', 'asc' | 'desc']
      onFilterChange({ sort, order })
    }
  }

  return (
    <header className="border-b border-border bg-card">
      <div className="flex flex-col gap-2 px-6 py-3">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold text-foreground">Policy Radar</h1>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => setIsLegendOpen(true)}
              aria-label="Open help legend"
              title="Help - Number Key"
              data-testid="legend-button"
            >
              <HelpCircle className="h-4 w-4 text-muted-foreground" />
              <span className="sr-only">Open help legend</span>
            </Button>
          </div>

          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search policies..." 
              className="pl-9" 
              value={searchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <Select
              data-testid="sort-select"
              value={`${currentSort}-${currentOrder}`}
              onValueChange={handleSortChange}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="impact-desc">Impact ↓</SelectItem>
                <SelectItem value="impact-asc">Impact ↑</SelectItem>
                <SelectItem value="effective-desc">Effective ↓</SelectItem>
                <SelectItem value="effective-asc">Effective ↑</SelectItem>
                <SelectItem value="updated-desc">Updated ↓</SelectItem>
                <SelectItem value="updated-asc">Updated ↑</SelectItem>
              </SelectContent>
            </Select>

            <Select
              data-testid="order-select"
              value={currentOrder}
              onValueChange={(value) => {
                if (onSortChange) {
                  onSortChange(currentSort, value as 'asc' | 'desc')
                } else if (onFilterChange) {
                  onFilterChange({ order: value as 'asc' | 'desc' })
                }
              }}
            >
              <SelectTrigger className="w-[100px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">Desc</SelectItem>
                <SelectItem value="asc">Asc</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
                <span className="sr-only">User menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Sign out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {activeFilters.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            {activeFilters.map((filter) => {
              const [type, value] = filter.split(':')
              const displayValue = type === 'scope' ? `Scope ${value}` : value
              return (
                <Badge
                  key={filter}
                  data-testid={`active-filter-${value}`}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {displayValue}
                  <button
                    onClick={() => handleRemoveFilter(filter)}
                    className="ml-1 hover:bg-muted rounded-full p-0.5"
                    aria-label={`Remove ${displayValue} filter`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )
            })}
          </div>
        )}
      </div>

      {/* Legend Dialog */}
      <LegendDialog open={isLegendOpen} onOpenChange={setIsLegendOpen} />
    </header>
  )
}
