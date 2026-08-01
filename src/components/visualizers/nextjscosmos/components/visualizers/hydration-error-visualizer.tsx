"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { AlertCircle, RefreshCcw, Server, Monitor, XCircle, ArrowRightLeft, Terminal } from "lucide-react"
import { Button } from "@/components/visualizers/nextjscosmos/components/ui/button"

export function HydrationErrorVisualizer() {
  const [status, setStatus] = useState<'idle' | 'simulating' | 'error'>('idle')

  const runSimulation = async () => {
    setStatus('simulating')
    await new Promise(r => setTimeout(r, 1500))
    setStatus('error')
  }

  return (
    <div className="flex flex-col h-full p-4 md:p-8 bg-grid-premium">
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-1">
          <h3 className="text-lg font-bold tracking-tight text-red-600">Hydration Mismatch Diagnostic</h3>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Server vs. Client Tree Conflict</p>
        </div>
        <Button 
          onClick={runSimulation} 
          disabled={status === 'simulating'}
          size="sm" 
          variant={status === 'error' ? "destructive" : "default"}
          className="rounded-full shadow-lg gap-2"
        >
          <RefreshCcw className={`h-4 w-4 ${status === 'simulating' ? 'animate-spin' : ''}`} /> 
          {status === 'error' ? 'Re-run Simulation' : 'Run Diagnostic'}
        </Button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-8">
        <div className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-8 relative">
          
          {/* Server Rendered HTML */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-tighter border border-primary/20 w-fit">
               <Server className="h-3 w-3" /> Server-side HTML
            </div>
            <div className="p-6 rounded-[2rem] border-2 border-primary/20 bg-background shadow-xl font-mono text-[11px] space-y-3">
               <p className="text-muted-foreground">&lt;div&gt;</p>
               <div className="ml-4 p-2 rounded bg-primary/5 border border-primary/10">
                  <p className="text-primary">&lt;p&gt;Generated: <span className="font-bold underline">10:00:05</span>&lt;/p&gt;</p>
               </div>
               <p className="text-muted-foreground">&lt;/div&gt;</p>
            </div>
          </div>

          {/* Client Rendered HTML */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 text-[10px] font-black uppercase tracking-tighter border border-blue-500/20 w-fit">
               <Monitor className="h-3 w-3" /> Client-side HTML
            </div>
            <div className={`p-6 rounded-[2rem] border-2 transition-colors duration-500 bg-background shadow-xl font-mono text-[11px] space-y-3 ${status === 'error' ? 'border-red-500/50 shadow-red-500/10' : 'border-blue-500/20'}`}>
               <p className="text-muted-foreground">&lt;div&gt;</p>
               <div className={`ml-4 p-2 rounded transition-all duration-500 ${status === 'error' ? 'bg-red-500/10 border-red-500/30' : 'bg-blue-500/5 border-blue-500/10'}`}>
                  <p className={status === 'error' ? 'text-red-600' : 'text-blue-600'}>
                    &lt;p&gt;Generated: <span className={`font-bold underline ${status === 'error' ? 'animate-pulse' : ''}`}>{status === 'error' ? '10:00:07' : '10:00:05'}</span>&lt;/p&gt;
                  </p>
               </div>
               <p className="text-muted-foreground">&lt;/div&gt;</p>
            </div>
          </div>

          {/* Connection / Comparison Logic */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:block">
             <div className={`p-3 rounded-2xl border-2 transition-all duration-500 ${status === 'error' ? 'bg-red-600 border-red-400 rotate-12 scale-110 shadow-2xl' : 'bg-background border-border shadow-lg'}`}>
                {status === 'error' ? <XCircle className="h-6 w-6 text-white" /> : <ArrowRightLeft className="h-6 w-6 text-muted-foreground" />}
             </div>
          </div>
        </div>

        {/* Diagnostic Terminal */}
        <AnimatePresence>
          {status === 'error' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-2xl bg-zinc-950 rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
            >
               <div className="bg-zinc-900 px-4 py-2 border-b border-white/5 flex items-center justify-between">
                  <div className="flex gap-1.5">
                     <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                     <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                     <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  </div>
                  <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest font-bold">Error Console</span>
               </div>
               <div className="p-6 font-mono text-[10px] space-y-2">
                  <p className="text-red-400">Unhandled Runtime Error: Hydration failed because the initial UI does not match what was rendered on the server.</p>
                  <p className="text-zinc-500">Warning: Text content did not match. Server: "10:00:05" Client: "10:00:07"</p>
                  <div className="mt-4 pt-4 border-t border-white/5">
                     <p className="text-emerald-400 font-bold">SOLUTION DETECTED:</p>
                     <p className="text-zinc-400">Wrap the content in a <code>useEffect</code> hook or use <code>suppressHydrationWarning</code> to acknowledge dynamic behavior.</p>
                  </div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!status.includes('error') && (
          <div className="max-w-md w-full bg-background border border-border p-6 rounded-[2rem] shadow-sm text-center">
             <p className="text-xs text-muted-foreground leading-relaxed italic">
               <strong>The Problem:</strong> When you use dynamic values (Time, Random numbers) directly in your component, the server produces one value, but by the time the client runs, the value has changed.
             </p>
          </div>
        )}
      </div>
    </div>
  )
}
