"use client"

import { Search, User, BookMarked as BookmarkOpen } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { RegionChip } from "@/components/ui/region-chip"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Legend } from "@/components/ui/legend"

interface PolicyHeaderProps {
  onNavigateToDigest?: () => void
}

export function PolicyHeader({ onNavigateToDigest }: PolicyHeaderProps) {
  return (
    <header className="border-b border-border bg-card">
      <div className="flex items-center gap-4 px-6 py-3">
        <h1 className="text-xl font-semibold text-foreground">Policy Radar</h1>

        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search policies..." className="pl-9" />
        </div>

        <Select defaultValue="14">
          <SelectTrigger className="w-[160px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="14">Last 14 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="90">Last 90 days</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex gap-2">
          <RegionChip region="US" active />
          <RegionChip region="EU" active />
        </div>

        <Legend />

        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={onNavigateToDigest} title="View your digest">
            <BookmarkOpen className="h-5 w-5" />
            <span className="sr-only">View digest</span>
          </Button>

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
      </div>
    </header>
  )
}
