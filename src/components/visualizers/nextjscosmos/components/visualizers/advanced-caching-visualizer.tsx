"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Play, RotateCcw, Database, HardDrive, Cpu, Zap, ArrowRight, CheckCircle2, Loader2, MemoryStick } from "lucide-react"
import { Button } from "@/components/visualizers/nextjscosmos/components/ui/button"

export function AdvancedCachingVisualizer() {
  const [status, setStatus] = useState<'idle' | 'fetching' | 'memoized' | 'cached'>('idle')
  const [requestCount, setRequestCount] = useState(0)

  const runRequest = async () => {
    setRequestCount(prev => prev + 1)
    setStatus('fetching')
    
    // 1. First fetch hits the Source
    await new Promise(r => setTimeout(r, 1200))
    setStatus('cached')
    
    // 2. Simulate a duplicate fetch in the SAME request
    await new Promise(r => setTimeout(r, 800))
    setStatus('memoized')
  }

  return (
    <div className="flex flex-col h-full p-4 md:p-8 bg-grid-premium">
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-1">
          <h3 className="text-lg font-bold tracking-tight">The 4-Layer Cache Logic</h3>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Memoization vs. Persistence</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={runRequest} disabled={status === 'fetching'} size="sm" className="rounded-full shadow-lg gap-2">
            <Play className="h-4 w-4" /> Simulate Request
          </Button>
          <Button variant="outline" size="sm" onClick={() => { setStatus('idle'); setRequestCount(0); }} className="rounded-full">
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-12">
        <div className="w-full max-w-2xl grid grid-cols-1 md:grid-cols-3 gap-8 items-center relative">
          
          {/* Layer 1: The Source */}
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-2 px-2 py-0.5 rounded bg-muted text-[8px] font-black uppercase text-muted-foreground">Level 0: Source</div>
            <div className="w-20 h-20 rounded-2xl border-2 bg-background flex items-center justify-center shadow-xl relative">
              <Database className={status === 'fetching' ? 'text-primary animate-pulse' : 'text-muted-foreground/40'} />
              {status === 'fetching' && <motion.div layoutId="data" className="absolute h-3 w-3 bg-primary rounded-full z-10" animate={{ x: 60 }} />}
            </div>
            <span className="text-[10px] font-black uppercase">Database / API</span>
          </div>

          {/* Layer 2: Persistent Data Cache */}
          <div className="flex flex-col items-center gap-4 relative">
            <div className="flex items-center gap-2 px-2 py-0.5 rounded bg-emerald-500/10 text-[8px] font-black uppercase text-emerald-600 border border-emerald-500/20">Level 1: Data Cache</div>
            <motion.div 
              animate={{ 
                borderColor: status === 'cached' || status === 'memoized' ? 'var(--emerald-500)' : 'rgba(0,0,0,0.1)',
                backgroundColor: status === 'cached' || status === 'memoized' ? 'oklch(var(--emerald-500) / 0.05)' : 'transparent'
              }}
              className="w-28 h-28 rounded-full border-4 border-dashed bg-background flex flex-col items-center justify-center gap-2 shadow-2xl relative"
            >
              <HardDrive className={status === 'cached' || status === 'memoized' ? 'text-emerald-500' : 'text-muted-foreground/20'} />
              <span className="text-[8px] font-black uppercase text-center text-muted-foreground/60 px-2 leading-tight">Persistent Storage (Shared)</span>
              {(status === 'cached' || status === 'memoized') && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-2 -right-2 h-6 w-6 bg-emerald-500 rounded-full flex items-center justify-center text-white border-2 border-background">
                   <CheckCircle2 className="h-3 w-3" />
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* Layer 3: Request Memoization */}
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-2 px-2 py-0.5 rounded bg-blue-500/10 text-[8px] font-black uppercase text-blue-600 border border-blue-500/20">Level 2: Memoization</div>
            <motion.div 
              animate={{ 
                borderColor: status === 'memoized' ? 'var(--blue-500)' : 'rgba(0,0,0,0.1)',
                backgroundColor: status === 'memoized' ? 'oklch(var(--blue-500) / 0.05)' : 'transparent'
              }}
              className="w-24 h-24 rounded-3xl border-2 bg-background flex flex-col items-center justify-center gap-2 shadow-xl relative"
            >
              <MemoryStick className={status === 'memoized' ? 'text-blue-500' : 'text-muted-foreground/20'} />
              <span className="text-[8px] font-black uppercase text-center text-muted-foreground/60 px-2 leading-tight">In-Memory (Per Request)</span>
              {status === 'memoized' && (
                <div className="absolute inset-0 bg-blue-500/5 animate-pulse rounded-3xl" />
              )}
            </motion.div>
          </div>

          {/* Connectors */}
          <div className="absolute top-1/2 left-[15%] w-[15%] h-px bg-muted hidden md:block" />
          <div className="absolute top-1/2 right-[15%] w-[15%] h-px bg-muted hidden md:block" />
        </div>

        <div className="w-full max-w-md space-y-4">
           <div className="bg-background border border-border p-6 rounded-[2rem] shadow-sm text-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={status}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs text-muted-foreground leading-relaxed"
                >
                  {status === 'idle' && "Run a simulation to see how Next.js deduplicates multiple fetch calls in a single request."}
                  {status === 'fetching' && "The very first fetch misses all caches and hits the Database directly."}
                  {status === 'cached' && "The result is stored in the Data Cache. It will be available for ALL future users."}
                  {status === 'memoized' && "Magic! A second fetch for the same data within this request is served instantly from RAM. No network call needed."}
                </motion.div>
              </AnimatePresence>
           </div>

           <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-muted/30 border border-border flex items-center gap-3">
                 <div className={`h-2 w-2 rounded-full ${status === 'cached' ? 'bg-emerald-500' : 'bg-muted'}`} />
                 <span className="text-[10px] font-bold text-muted-foreground uppercase">Data Cache</span>
              </div>
              <div className="p-3 rounded-xl bg-muted/30 border border-border flex items-center gap-3">
                 <div className={`h-2 w-2 rounded-full ${status === 'memoized' ? 'bg-blue-500' : 'bg-muted'}`} />
                 <span className="text-[10px] font-bold text-muted-foreground uppercase">Memoization</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  )
}
