"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme as useCSCosmosTheme } from "@/context/useTheme"
import { LayoutDashboard, Moon, Sun, Trophy, Menu, BookOpen, FlaskConical, ChevronRight, AlertOctagon, ArrowLeft } from "lucide-react"
import { TopicSearch } from "./topic-search"
import { useProgress } from "../lib/progress-store"
import { masteryPath } from "../lib/concepts-data"
import { useEffect, useState } from "react"
import { Button } from "./ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "./ui/sheet"

export function Navbar() {
  const { theme, setTheme } = useCSCosmosTheme()
  const { completed, isLoaded } = useProgress()
  const [mounted, setMounted] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setMounted(true)
  }, [])

  const effectiveTheme = theme === 'system'
    ? (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    : theme

  const toggleTheme = () => {
    setTheme(effectiveTheme === 'dark' ? 'light' : 'dark')
  }

  const totalConcepts = masteryPath.reduce((acc, phase) => acc + phase.items.length, 0)
  const percentage = isLoaded ? Math.round((completed.length / totalConcepts) * 100) : 0

  return (
    <header className="sticky top-0 z-50 w-full border-b backdrop-blur-md bg-background/80 border-border">
      <div className="max-w-[1700px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 lg:gap-8">
          {/* Back to CSCosmos Catalog Button */}
          <Link 
            href="/topics" 
            className="text-xs font-semibold flex items-center gap-1.5 border border-border px-3 py-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground shrink-0"
            title="Return to CSCosmos Catalog"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>CSCosmos</span>
          </Link>

          <Link href="/nextjscosmos" className="flex items-center space-x-2.5 group shrink-0">
            <div className="bg-primary text-primary-foreground p-1.5 rounded-lg group-hover:scale-105 transition-transform">
              <LayoutDashboard className="h-4 w-4" />
            </div>
            <span className="font-bold text-xl tracking-tight text-foreground">
              Cosmos<span className="text-primary">.</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold">
            <Link
              href="/nextjscosmos/concepts"
              className={`transition-colors hover:text-primary flex items-center gap-2 ${
                pathname.includes('/concepts') ? 'text-primary font-bold' : 'text-muted-foreground'
              }`}
            >
              Concepts
              {mounted && percentage > 0 && (
                <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
                  <Trophy className="h-2.5 w-2.5" />
                  {percentage}%
                </span>
              )}
            </Link>
            <Link
              href="/nextjscosmos/errors"
              className={`transition-colors hover:text-primary ${
                pathname.includes('/errors') ? 'text-primary font-bold' : 'text-muted-foreground'
              }`}
            >
              Errors
            </Link>
            <Link
              href="/nextjscosmos/playground"
              className={`transition-colors hover:text-primary ${
                pathname.includes('/playground') ? 'text-primary font-bold' : 'text-muted-foreground'
              }`}
            >
              Playground
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <div className="hidden sm:block">
            <TopicSearch />
          </div>

          <button
            onClick={toggleTheme}
            className="p-2 border border-border rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label="Toggle Theme"
          >
            {effectiveTheme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </button>
          
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-4 w-4" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] p-0">
              <div className="sr-only">
                <SheetTitle>Next.js Cosmos Navigation</SheetTitle>
                <SheetDescription>Explore Next.js App Router topics</SheetDescription>
              </div>
              <div className="flex flex-col h-full bg-card">
                <div className="p-6 border-b border-border">
                  <Link href="/nextjscosmos" onClick={() => setIsOpen(false)} className="flex items-center space-x-2 mb-2">
                    <LayoutDashboard className="h-5 w-5 text-primary" />
                    <span className="font-bold text-lg">Next.js Cosmos</span>
                  </Link>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">
                    App Router Architecture Engine
                  </p>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  <Link
                    href="/topics"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 p-3 rounded-xl bg-muted/50 text-xs font-bold text-muted-foreground"
                  >
                    <ArrowLeft className="h-4 w-4" /> Return to CSCosmos Catalog
                  </Link>

                  <div className="space-y-1">
                    <Link
                      href="/nextjscosmos/concepts"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-between p-3 rounded-xl hover:bg-muted transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <BookOpen className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-bold text-sm">Concepts</p>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">35 App Router Modules</p>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </Link>

                    <Link
                      href="/nextjscosmos/errors"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-between p-3 rounded-xl hover:bg-muted transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <AlertOctagon className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-bold text-sm">Errors</p>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Common Pitfalls</p>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </Link>

                    <Link
                      href="/nextjscosmos/playground"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-between p-3 rounded-xl hover:bg-muted transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <FlaskConical className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-bold text-sm">Playground</p>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Interactive Workbench</p>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </Link>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
