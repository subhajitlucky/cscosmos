"use client"

import { commonErrors } from "@/components/visualizers/nextjscosmos/lib/errors-data"
import { AlertTriangle, ChevronRight, ZapOff, ShieldAlert, Bug, XCircle } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function ErrorsPage() {
  return (
    <div className="min-h-screen bg-background pb-32">
      <div className="py-24 border-b bg-red-500/5 bg-grid-premium relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-5">
           <Bug className="h-64 w-64 text-red-600" />
        </div>
        <div className="container-custom relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-600 text-[10px] font-bold uppercase tracking-widest mb-6">
            The Event Horizon
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
            Common <span className="text-red-600">Pitfalls.</span>
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Next.js is powerful, but easy to break. We've mapped the most common "Black Holes" 
            so you can diagnose and fix them instantly.
          </p>
        </div>
      </div>

      <div className="container-custom py-20">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {commonErrors.map((error, idx) => (
            <motion.div
              key={error.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Link
                href={`/nextjscosmos/errors/${error.slug}`}
                className="group flex flex-col p-8 rounded-[2.5rem] border border-border bg-card hover:border-red-500/30 transition-all shadow-xl shadow-black/5 h-full"
              >
                <div className="flex items-center justify-between mb-6">
                   <div className="h-12 w-12 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-600 group-hover:scale-110 transition-transform">
                      <ZapOff className="h-6 w-6" />
                   </div>
                   <ChevronRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </div>
                <div className="space-y-2">
                   <span className="text-[10px] font-black uppercase text-red-600/60 tracking-wider">{error.category}</span>
                   <h3 className="text-2xl font-bold tracking-tight">{error.name}</h3>
                   <p className="text-sm text-muted-foreground leading-relaxed">
                      {error.description}
                   </p>
                </div>
                <div className="mt-8 pt-6 border-t border-border flex items-center gap-3 text-xs font-bold text-red-600">
                   <ShieldAlert className="h-4 w-4" />
                   VIEW DIAGNOSTIC
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
