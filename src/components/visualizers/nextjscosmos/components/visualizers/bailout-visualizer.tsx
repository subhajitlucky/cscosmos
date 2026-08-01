"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Package, XCircle, Terminal, ZapOff, Hammer, Box, Settings } from "lucide-react"
import { Button } from "@/components/visualizers/nextjscosmos/components/ui/button"

export function BailoutVisualizer() {
  const [isBuilding, setIsBuilding] = useState(false)
  const [error, setError] = useState(false)

  const runBuild = async () => {
    setIsBuilding(true)
    setError(false)
    await new Promise(r => setTimeout(r, 2000))
    setIsBuilding(false)
    setError(true)
  }

  return (
    <div className="flex flex-col h-full p-4 md:p-8 bg-grid-premium">
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-1">
          <h3 className="text-lg font-bold tracking-tight">Static Generation Bailout</h3>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Dynamic execution in static context</p>
        </div>
        <Button onClick={runBuild} disabled={isBuilding} size="sm" className="rounded-full shadow-lg gap-2">
          <Hammer className={`h-4 w-4 ${isBuilding ? 'animate-spin' : ''}`} /> Run Build
        </Button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-12">
        <div className="w-full max-w-2xl bg-muted/20 border-4 border-dashed rounded-[3rem] p-12 flex flex-col items-center justify-center relative overflow-hidden h-[300px]">
           
           <AnimatePresence mode="wait">
             {isBuilding ? (
               <motion.div key="building" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-6">
                  <Box className="h-16 w-16 text-primary animate-bounce" />
                  <div className="text-center">
                     <p className="font-bold text-sm uppercase animate-pulse">Generating Static Pages...</p>
                     <p className="text-[10px] text-muted-foreground mt-1">Found route: /dashboard (STATIC)</p>
                  </div>
               </motion.div>
             ) : error ? (
               <motion.div key="error" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center gap-6">
                  <div className="h-20 w-20 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 border-2 border-red-500/20">
                     <ZapOff className="h-10 w-10" />
                  </div>
                  <div className="text-center">
                     <h4 className="text-xl font-black text-red-600 uppercase">Build Failed!</h4>
                     <div className="mt-4 bg-zinc-950 rounded-xl p-4 font-mono text-[9px] text-left border border-white/5 w-[280px]">
                        <p className="text-red-400">Error: Dynamic function "headers" used in static Page /dashboard.</p>
                        <p className="opacity-50 mt-2">👉 Fix: Add 'export const dynamic = "force-dynamic"'</p>
                     </div>
                  </div>
               </motion.div>
             ) : (
               <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-4 text-muted-foreground/40">
                  <Package className="h-16 w-16" />
                  <p className="text-sm font-bold uppercase tracking-widest">Build Environment Idle</p>
               </motion.div>
             )}
           </AnimatePresence>

           {/* Code Floating Note */}
           <div className="absolute top-4 right-4 p-3 rounded-xl bg-background border border-border shadow-lg max-w-[120px]">
              <p className="text-[8px] font-mono leading-tight">
                <span className="text-purple-500">const</span> h = <span className="text-blue-500">headers</span>()
              </p>
              <div className="h-px bg-red-500/50 mt-1" />
              <p className="text-[7px] text-red-500 font-bold mt-1 uppercase">Illegal in STATIC</p>
           </div>
        </div>

        <div className="max-w-md w-full bg-background border border-border p-6 rounded-[2rem] shadow-sm text-center">
           <p className="text-xs text-muted-foreground leading-relaxed italic">
             <strong>The Bailout:</strong> Next.js tries to pre-render your site as static HTML. If it hits a dynamic function (like cookies or headers), the process fails unless you explicitly mark the page as dynamic.
           </p>
        </div>
      </div>
    </div>
  )
}
