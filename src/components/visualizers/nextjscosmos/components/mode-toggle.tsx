"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme as useCSCosmosTheme } from "@/context/useTheme"
import { Button } from "./ui/button"

export function ModeToggle() {
  const { theme, setTheme } = useCSCosmosTheme()
  const effectiveTheme = theme === 'system'
    ? (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    : theme

  return (
    <Button
      variant="ghost"
      size="icon"
      className="rounded-full h-10 w-10 border border-border/50"
      onClick={() => setTheme(effectiveTheme === "dark" ? "light" : "dark")}
    >
      {effectiveTheme === "light" ? <Moon className="h-[1.2rem] w-[1.2rem]" /> : <Sun className="h-[1.2rem] w-[1.2rem]" />}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}