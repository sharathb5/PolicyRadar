"use client"

import type React from "react"

import { cn } from "@/lib/utils"
import { Button } from "./button"

interface FilterToggleProps {
  children: React.ReactNode
  active?: boolean
  onClick?: () => void
  'data-testid'?: string
}

export function FilterToggle({ children, active, onClick, ...props }: FilterToggleProps) {
  return (
    <Button
      variant={active ? "default" : "ghost"}
      size="sm"
      className={cn("w-full justify-start text-xs font-normal", active && "bg-primary text-primary-foreground")}
      onClick={onClick}
      {...props}
    >
      {children}
    </Button>
  )
}
