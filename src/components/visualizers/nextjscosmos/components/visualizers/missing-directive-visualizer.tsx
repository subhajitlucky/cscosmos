"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { AlertCircle, Plus, Terminal, Code, XCircle, CheckCircle2, ShieldAlert } from "lucide-react"
import { Button } from "@/components/visualizers/nextjscosmos/components/ui/button"

export function MissingDirectiveVisualizer() {
  const [hasDirective, setHasDirective] = useState(false)
  const [status, setStatus] = useState<'idle' | 'error' | 'fixed'>('idle')

  const triggerError = () => {
    setStatus('error')
  }

  const addDirective = () => {
    setHasDirective(true)
    setStatus('fixed')
  }

  return (
    <div className="flex flex-col h-full p-4 md:p-8 bg-grid-premium text-foreground">
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-1">
          <h3 className="text-lg font-bold tracking-tight">Directive Enforcement Simulation</h3>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Server-side hook violation</p>
        </div>
        <Button 
          onClick={addDirective} 
          disabled={hasDirective}
          size="sm" 
          className="rounded-full shadow-lg gap-2 bg-emerald-600 hover:bg-emerald-700"
        >
          <Plus className="h-4 w-4" /> Add 'use client'
        </Button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-8">
        <div className="w-full max-w-2xl bg-zinc-950 rounded-3xl border border-white/10 shadow-2xl overflow-hidden font-mono text-[11px] relative">
           <div className="bg-zinc-900 px-4 py-2 border-b border-white/5 flex items-center justify-between">
              <span className="text-[9px] font-black uppercase text-zinc-500">app/counter.tsx</span>
              {status === 'fixed' && <CheckCircle2 className="h-3 w-3 text-emerald-500" />}
           </div>
           <div className="p-8 space-y-1 text-zinc-400">
              <AnimatePresence mode="wait">
                {hasDirective && (
                  <motion.p initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="text-emerald-400">'use client'</motion.p>
                )}
              </AnimatePresence>
              <p><span className="text-purple-400">import</span> {"{ useState }"} <span className="text-purple-400">from</span> <span className="text-emerald-400">'react'</span></p>
              <p className="pt-4"><span className="text-purple-400">export default function</span> <span className="text-blue-400">Counter</span>() {"{"}</p>
              <motion.p 
                animate={status === 'error' ? { backgroundColor: 'rgba(239, 68, 68, 0.2)', x: [0, -5, 5, -5, 0] } : {}}
                className="ml-4 p-1 rounded"
              >
                <span className="text-purple-400">const</span> [count, setCount] = <span className="text-yellow-400">useState</span>(<span className="text-amber-500">0</span>)
              </motion.p>
              <p className="ml-4 text-zinc-600">...</p>
              <p>{"}"}</p>
           </div>

           <AnimatePresence>
             {status === 'error' && (
               <motion.div 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 className="absolute bottom-4 left-4 right-4 bg-red-600 text-white p-4 rounded-xl flex items-center gap-4 shadow-2xl border border-white/20"
               >
                  <XCircle className="h-8 w-8 shrink-0" />
                  <div className="text-left">
                     <p className="font-bold text-[10px] uppercase">Build Failed</p>
                     <p className="text-[9px] opacity-90 leading-tight">Error: useState only works in Client Components. Add "use client" to the top of the file.</p>
                  </div>
               </motion.div>
             )}
           </AnimatePresence>
        </div>

        <div className="flex gap-4">
           {status === 'idle' && (
             <Button onClick={triggerError} variant="destructive" className="rounded-full shadow-xl">
                Compile Project
             </Button>
           )}
           {status === 'fixed' && (
             <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-2 text-emerald-600 font-bold bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/20">
                <CheckCircle2 className="h-4 w-4" /> COMPILATION SUCCESSFUL
             </motion.div>
           )}
        </div>

        <div className="max-w-md w-full bg-background border border-border p-6 rounded-[2rem] shadow-sm text-center">
           <p className="text-xs text-muted-foreground leading-relaxed">
             <strong>The Rule:</strong> Every component in the App Router is a Server Component by default. 
             Browser features like <code>useState</code> require an explicit boundary using the directive.
           </p>
        </div>
      </div>
    </div>
  )
}
