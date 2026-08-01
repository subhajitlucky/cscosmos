"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Clock, RefreshCw, HardDrive, User, Server, CheckCircle2, AlertCircle, Play, RotateCcw } from "lucide-react"
import { Button } from "@/components/visualizers/nextjscosmos/components/ui/button"

export function ISRVisualizer() {
  const [status, setStatus] = useState<'stale' | 'revalidating' | 'updating' | 'fresh'>('stale')
  const [timestamp, setTimestamp] = useState("10:00:00 AM")
  const [isSimulating, setIsSimulating] = useState(false)

  const runISR = async () => {
    setIsSimulating(true)
    // 1. Initial request gets stale data
    await new Promise(r => setTimeout(r, 800))
    setStatus('revalidating')
    
    // 2. Server re-renders in background
    await new Promise(r => setTimeout(r, 2000))
    setStatus('updating')
    
    // 3. Cache updated
    await new Promise(r => setTimeout(r, 1000))
    setStatus('fresh')
    setTimestamp(new Date().toLocaleTimeString())
    setIsSimulating(false)
  }

  return (
    <div className="flex flex-col h-full p-4 md:p-8 bg-grid-premium">
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-1">
          <h3 className="text-lg font-bold tracking-tight">ISR: Stale-While-Revalidate</h3>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Background Cache Regeneration</p>
        </div>
        <Button 
          onClick={runISR} 
          disabled={isSimulating}
          size="sm" 
          className="rounded-full shadow-lg gap-2 bg-amber-600 hover:bg-amber-700"
        >
          <RefreshCw className={`h-4 w-4 ${isSimulating ? 'animate-spin' : ''}`} /> Trigger Revalidation
        </Button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-12">
        <div className="w-full max-w-2xl grid grid-cols-1 md:grid-cols-3 gap-8 items-center relative">
          
          {/* User Side */}
          <div className="flex flex-col items-center gap-4">
            <div className="w-20 h-20 rounded-2xl border-2 bg-background flex items-center justify-center shadow-xl">
              <User className="text-muted-foreground" />
            </div>
            <div className="text-center">
               <span className="text-[10px] font-black uppercase text-muted-foreground">User Sees</span>
               <div className={`mt-2 p-2 rounded-lg border-2 transition-colors ${status === 'fresh' ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-amber-500/30 bg-amber-500/5'}`}>
                  <p className="text-[9px] font-mono font-bold">Data from: {status === 'fresh' ? timestamp : '10:00:00 AM'}</p>
               </div>
            </div>
          </div>

          {/* Cache / CDN Layer */}
          <div className="flex flex-col items-center gap-4 relative">
            <motion.div 
              animate={{ 
                borderColor: status === 'fresh' ? 'var(--emerald-500)' : 'var(--amber-500)',
                scale: status === 'updating' ? [1, 1.05, 1] : 1
              }}
              className="w-32 h-32 rounded-full border-4 border-dashed bg-background flex flex-col items-center justify-center gap-2 shadow-2xl relative"
            >
              <HardDrive className={status === 'fresh' ? 'text-emerald-500' : 'text-amber-500'} />
              <div className="flex flex-col items-center">
                 <span className={`text-[10px] font-black uppercase ${status === 'fresh' ? 'text-emerald-600' : 'text-amber-600'}`}>
                   {status === 'fresh' ? 'CACHE: FRESH' : 'CACHE: STALE'}
                 </span>
              </div>
              
              {status === 'revalidating' && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute -bottom-2 px-2 py-0.5 bg-primary text-white text-[8px] font-black rounded uppercase"
                >
                  Regenerating...
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* Server (Background) */}
          <div className="flex flex-col items-center gap-4">
            <motion.div 
              animate={{ 
                opacity: status === 'revalidating' || status === 'updating' ? 1 : 0.2,
                backgroundColor: status === 'revalidating' ? 'oklch(var(--primary) / 0.05)' : 'transparent'
              }}
              className="w-24 h-24 rounded-3xl border-2 bg-background flex flex-col items-center justify-center gap-2 shadow-xl"
            >
              <Server className={status === 'revalidating' ? 'text-primary animate-pulse' : 'text-muted-foreground'} />
              <span className="text-[8px] font-black uppercase">BG Runner</span>
            </motion.div>
            <span className="text-[10px] font-bold uppercase text-muted-foreground text-center">Next.js Server<br/>(Background)</span>
          </div>

          {/* Connection Lines */}
          <div className="absolute top-1/2 left-[20%] w-[15%] h-px bg-muted hidden md:block" />
          <div className="absolute top-1/2 right-[20%] w-[15%] h-px bg-muted hidden md:block" />
          
          {/* Revalidation Flow Particle (Cache -> Server) */}
          {status === 'revalidating' && (
            <motion.div 
              initial={{ right: '45%', top: '50%' }}
              animate={{ right: '25%' }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="absolute h-2 w-2 bg-primary rounded-full hidden md:block"
            />
          )}

          {/* Update Flow Particle (Server -> Cache) */}
          {status === 'updating' && (
            <motion.div 
              initial={{ right: '25%', top: '50%' }}
              animate={{ right: '45%' }}
              className="absolute h-3 w-3 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)] hidden md:block"
            />
          )}
        </div>

        <div className="max-w-md w-full bg-background border border-border p-6 rounded-[2rem] shadow-sm text-center">
           <AnimatePresence mode="wait">
             <motion.p 
               key={status}
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -10 }}
               className="text-xs text-muted-foreground leading-relaxed"
             >
               {status === 'stale' && "A user requests a page that has passed its revalidation period. Next.js serves the stale version from cache instantly."}
               {status === 'revalidating' && "Next.js triggers a background regeneration. The current user still sees the old data while the server works."}
               {status === 'updating' && "The server has finished fetching new data and is now replacing the stale file in the global cache."}
               {status === 'fresh' && "The cache is now fresh! The NEXT user to visit this page will see the updated content."}
             </motion.p>
           </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
