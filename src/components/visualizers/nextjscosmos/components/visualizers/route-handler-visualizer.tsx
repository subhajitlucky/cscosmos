"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Play, Code, Database, Terminal, FileJson, ArrowRight, Loader2 } from "lucide-react"
import { Button } from "@/components/visualizers/nextjscosmos/components/ui/button"

export function RouteHandlerVisualizer() {
  const [status, setStatus] = useState<'idle' | 'calling' | 'complete'>('idle')

  const runSimulation = async () => {
    setStatus('calling')
    await new Promise(r => setTimeout(r, 2000))
    setStatus('complete')
  }

  return (
    <div className="flex flex-col h-full p-4 md:p-8 bg-grid-premium">
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-1">
          <h3 className="text-lg font-bold tracking-tight">Route Handler Simulation</h3>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">JSON over UI Components</p>
        </div>
        <Button 
          onClick={runSimulation}
          disabled={status === 'calling'}
          size="sm" 
          className="rounded-full gap-2 shadow-lg"
        >
          <Terminal className="h-4 w-4" /> GET /api/data
        </Button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-8">
        <div className="w-full max-w-2xl flex flex-col md:flex-row items-center justify-between gap-12 relative">
          
          {/* Client (Browser/Tool) */}
          <div className="flex flex-col items-center gap-4">
            <div className="w-20 h-20 rounded-2xl border-2 bg-background flex items-center justify-center shadow-xl">
              <Terminal className="text-muted-foreground" />
            </div>
            <span className="text-[10px] font-black uppercase">Client Request</span>
          </div>

          {/* Route Handler file */}
          <div className="flex flex-col items-center gap-4 relative">
            <motion.div 
              animate={{ 
                borderColor: status === 'calling' ? 'var(--primary)' : 'rgba(0,0,0,0.1)',
                backgroundColor: status === 'calling' ? 'oklch(var(--primary) / 0.05)' : 'transparent'
              }}
              className="w-32 h-32 rounded-3xl border-2 bg-background flex flex-col items-center justify-center gap-2 shadow-2xl relative"
            >
              <FileJson className={status === 'calling' ? 'text-primary' : 'text-muted-foreground'} />
              <span className="text-[10px] font-black uppercase text-primary">route.ts</span>
              {status === 'calling' && (
                <motion.div className="absolute inset-0 flex items-center justify-center bg-background/50 rounded-3xl">
                   <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* Raw JSON Data */}
          <div className="flex flex-col items-center gap-4">
            <motion.div 
              animate={{ 
                opacity: status === 'complete' ? 1 : 0.2,
                scale: status === 'complete' ? 1 : 0.9,
                borderColor: status === 'complete' ? 'var(--emerald-500)' : 'rgba(0,0,0,0.1)'
              }}
              className="w-48 h-32 rounded-2xl border-2 border-emerald-500/30 bg-zinc-950 p-4 shadow-xl overflow-hidden font-mono"
            >
               <AnimatePresence>
                 {status === 'complete' ? (
                   <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[10px] text-emerald-400 space-y-1">
                      <p>{"{"}</p>
                      <p className="ml-2">"status": 200,</p>
                      <p className="ml-2">"data": "Success",</p>
                      <p className="ml-2">"type": "JSON"</p>
                      <p>{"}"}</p>
                   </motion.div>
                 ) : (
                   <div className="flex items-center justify-center h-full">
                      <span className="text-[10px] text-zinc-700">Waiting for data...</span>
                   </div>
                 )}
               </AnimatePresence>
            </motion.div>
            <span className="text-[10px] font-black uppercase text-emerald-600">Response (No UI)</span>
          </div>

          <div className="absolute top-1/2 left-1/4 w-[15%] h-px bg-muted hidden md:block" />
          <div className="absolute top-1/2 right-1/4 w-[15%] h-px bg-muted hidden md:block" />
        </div>

        <div className="max-w-md w-full bg-background border border-border p-6 rounded-[2rem] shadow-sm text-center">
           <p className="text-xs text-muted-foreground leading-relaxed">
             <strong>Simulation:</strong> Unlike Pages which return HTML, Route Handlers return 
             <span className="text-emerald-600 font-bold mx-1">raw data</span>. They are the 
             foundation for your custom APIs and Webhooks.
           </p>
        </div>
      </div>
    </div>
  )
}
