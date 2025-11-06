"use client"

import type React from "react"

import { cn } from "@/lib/utils"
import { Button } from "./button"

interface FilterToggleProps {
  children: React.ReactNode
  active?: boolean
  onClick?: () => void
}

export function FilterToggle({ children, active, onClick }: FilterToggleProps) {
  return (
    <Button
      variant={active ? "default" : "ghost"}
      size="sm"
      className={cn("w-full justify-start text-xs font-normal", active && "bg-primary text-primary-foreground")}
      onClick={onClick}
    >
      {children}
    </Button>
  )
}
