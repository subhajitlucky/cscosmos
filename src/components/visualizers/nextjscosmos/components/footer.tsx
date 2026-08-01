"use client"

import Link from "next/link"
import { ArrowLeft, LayoutDashboard } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/40 mt-20 py-12 transition-colors duration-300">
      <div className="max-w-[1700px] mx-auto px-4 sm:px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col gap-2 text-center md:text-left">
          <div className="flex items-center gap-3 justify-center md:justify-start">
            <div className="bg-primary text-primary-foreground p-1 rounded-md">
              <LayoutDashboard className="h-4 w-4" />
            </div>
            <span className="font-bold text-lg tracking-tight text-foreground">Next.js Cosmos</span>
            <Link 
              href="/topics"
              className="text-xs font-mono flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="h-3 w-3" /> ← CSCosmos Catalog
            </Link>
          </div>
          <p className="text-xs text-muted-foreground font-mono">
            Interactive Next.js App Router Architecture & Rendering Engine.
          </p>
        </div>

        <div className="flex items-center gap-6 text-xs font-medium text-muted-foreground">
          <Link href="/nextjscosmos/concepts" className="hover:text-primary transition-colors">
            35 Concepts
          </Link>
          <Link href="/nextjscosmos/errors" className="hover:text-primary transition-colors">
            Error Debugger
          </Link>
          <Link href="/nextjscosmos/playground" className="hover:text-primary transition-colors">
            Playground Lab
          </Link>
        </div>
      </div>
      <div className="border-t border-border/40 mt-8 pt-4 text-center text-xs text-muted-foreground font-mono">
        © {new Date().getFullYear()} CSCOSMOS — NEXT.JS ARCHITECTURE VISUALIZER.
      </div>
    </footer>
  )
}
