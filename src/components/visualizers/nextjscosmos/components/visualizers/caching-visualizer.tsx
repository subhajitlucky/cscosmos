"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Play, RotateCcw, Database, HardDrive, RefreshCw, Zap, Clock, ShieldCheck, Loader2 } from "lucide-react"
import { Button } from "@/components/visualizers/nextjscosmos/components/ui/button"

export function CachingVisualizer() {
  const [status, setStatus] = useState<'empty' | 'fetching' | 'cached' | 'revalidating'>('empty')
  const [hits, setHits] = useState(0)

  const fetchRequest = async () => {
    if (status === 'cached') {
      setHits(h => h + 1)
      return
    }
    setStatus('fetching')
    await new Promise(r => setTimeout(r, 1500))
    setStatus('cached')
    setHits(1)
  }

  const revalidate = async () => {
    setStatus('revalidating')
    await new Promise(r => setTimeout(r, 1200))
    setStatus('cached')
    setHits(1)
  }

  return (
    <div className="flex flex-col h-full p-4 md:p-8 bg-grid-premium">
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-1">
          <h3 className="text-lg font-bold tracking-tight">Data Cache Simulation</h3>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Server-Side Persistence Lifecycle</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={fetchRequest} disabled={status === 'fetching' || status === 'revalidating'} size="sm" className="rounded-full shadow-lg">
            {status === 'cached' ? <><Zap className="h-4 w-4 mr-2" /> Request (Hit)</> : <><Play className="h-4 w-4 mr-2" /> Request (Miss)</>}
          </Button>
          <Button variant="outline" size="sm" onClick={revalidate} disabled={status !== 'cached'} className="rounded-full">
            <RefreshCw className="h-4 w-4 mr-2" /> Revalidate
          </Button>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-12">
        <div className="w-full max-w-2xl grid grid-cols-3 gap-8 items-center relative">
          
          {/* Data Source */}
          <div className="flex flex-col items-center gap-4">
            <div className="w-20 h-20 rounded-2xl border-2 bg-background flex items-center justify-center shadow-xl">
              <Database className="text-muted-foreground" />
            </div>
            <span className="text-[10px] font-black uppercase text-center">Data Source<br/>(API/DB)</span>
          </div>

          {/* Cache Layer */}
          <div className="flex flex-col items-center gap-4 relative">
            <motion.div 
              animate={{ 
                borderColor: status === 'cached' ? 'var(--emerald-500)' : 'rgba(0,0,0,0.1)',
                backgroundColor: status === 'cached' ? 'oklch(var(--emerald-500) / 0.05)' : 'transparent',
                scale: status === 'fetching' ? [1, 1.05, 1] : 1
              }}
              transition={{ repeat: status === 'fetching' ? Infinity : 0 }}
              className="w-32 h-32 rounded-[2.5rem] border-4 border-dashed bg-background flex flex-col items-center justify-center gap-2 shadow-2xl relative"
            >
              <HardDrive className={status === 'cached' ? 'text-emerald-500' : 'text-muted-foreground/30'} />
              <span className={`text-[10px] font-black uppercase ${status === 'cached' ? 'text-emerald-600' : 'text-muted-foreground/40'}`}>
                {status === 'cached' ? 'CACHE HIT' : 'DATA CACHE'}
              </span>
              {status === 'cached' && (
                <div className="absolute -top-2 -right-2 h-8 w-8 bg-emerald-500 rounded-full flex items-center justify-center text-white border-2 border-background animate-in zoom-in">
                   <ShieldCheck className="h-4 w-4" />
                </div>
              )}
            </motion.div>
            <div className="flex flex-col items-center">
               <span className="text-[10px] font-bold uppercase tracking-tighter">Next.js Layer</span>
               {hits > 0 && <span className="text-[9px] font-mono text-emerald-600 font-bold">{hits} Successful Hits</span>}
            </div>
          </div>

          {/* User UI */}
          <div className="flex flex-col items-center gap-4">
            <motion.div 
              animate={{ 
                opacity: status === 'cached' ? 1 : 0.3,
                y: status === 'fetching' ? [0, -5, 0] : 0
              }}
              className="w-24 h-24 rounded-2xl border-2 bg-background p-3 flex flex-col gap-2 shadow-xl overflow-hidden"
            >
               <div className={`h-2 w-full rounded ${status === 'cached' ? 'bg-emerald-200' : 'bg-muted'}`} />
               <div className={`h-2 w-3/4 rounded ${status === 'cached' ? 'bg-emerald-200' : 'bg-muted'}`} />
               <div className={`mt-auto h-8 w-full rounded flex items-center justify-center ${status === 'cached' ? 'bg-emerald-500/20' : 'bg-muted'}`}>
                  {status === 'fetching' && <Loader2 className="h-3 w-3 animate-spin text-primary" />}
               </div>
            </motion.div>
            <span className="text-[10px] font-black uppercase">Resulting UI</span>
          </div>

          {/* Path Particles */}
          <AnimatePresence>
            {status === 'fetching' && (
              <motion.div 
                initial={{ left: '15%', top: '50%' }}
                animate={{ left: '40%' }}
                className="absolute h-2 w-2 bg-primary rounded-full"
              />
            )}
            {status === 'revalidating' && (
              <motion.div 
                initial={{ left: '15%', top: '50%' }}
                animate={{ left: '40%' }}
                className="absolute h-2 w-2 bg-amber-500 rounded-full"
              />
            )}
          </AnimatePresence>
        </div>

        <div className="max-w-md w-full bg-background border border-border p-6 rounded-[2rem] shadow-sm text-center">
           <p className="text-xs text-muted-foreground leading-relaxed">
             {status === 'empty' && "Click 'Request' to fetch data for the first time."}
             {status === 'fetching' && "Cache Miss! Next.js is fetching from the source and will store the result."}
             {status === 'cached' && "Cache Hit! Subsequent requests are near-instant because they come from the Server-Side Data Cache."}
             {status === 'revalidating' && "Revalidating... Next.js is refreshing the stale cache with fresh data from the source."}
           </p>
        </div>
      </div>
    </div>
  )
}
