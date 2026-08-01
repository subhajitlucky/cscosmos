"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Play, Server, MousePointer2, Database, Send, CheckCircle2, Loader2, ShieldCheck } from "lucide-react"
import { Button } from "@/components/visualizers/nextjscosmos/components/ui/button"

export function ServerActionVisualizer() {
  const [status, setStatus] = useState<'idle' | 'calling' | 'executing' | 'complete'>('idle')

  const runAction = async () => {
    setStatus('calling')
    await new Promise(r => setTimeout(r, 800))
    setStatus('executing')
    await new Promise(r => setTimeout(r, 1500))
    setStatus('complete')
  }

  return (
    <div className="flex flex-col h-full p-4 md:p-8 bg-grid-premium">
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-1">
          <h3 className="text-lg font-bold tracking-tight">Server Action Simulation</h3>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Zero-API Data Mutations</p>
        </div>
        <Button 
          onClick={runAction} 
          disabled={status !== 'idle'}
          size="sm" 
          className="rounded-full shadow-lg gap-2"
        >
          <Send className="h-4 w-4" /> Trigger Action
        </Button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-12">
        <div className="w-full max-w-2xl grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative">
          
          {/* Client Side (Form/Button) */}
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 text-[10px] font-black uppercase tracking-tighter border border-blue-500/20">
               Client Component
            </div>
            <div className="relative w-full max-w-[240px] p-6 rounded-3xl border-2 border-blue-500/20 bg-background shadow-xl">
               <div className="space-y-3">
                  <div className="h-2 w-full bg-muted rounded" />
                  <div className="h-8 w-full bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-center px-3">
                     {status === 'calling' && <motion.div animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity }} className="h-1.5 w-1.5 rounded-full bg-blue-500" />}
                  </div>
                  <Button disabled={status !== 'idle'} size="sm" className="w-full h-8 rounded-lg text-[10px] font-bold">
                    {status === 'complete' ? 'Success!' : 'Submit Form'}
                  </Button>
               </div>
               {status === 'calling' && (
                 <motion.div 
                   layoutId="particle"
                   className="absolute top-1/2 right-[-20px] h-3 w-3 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)] z-10"
                   animate={{ x: 40, opacity: [1, 0] }}
                 />
               )}
            </div>
          </div>

          {/* Server Side (Action Logic) */}
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-tighter border border-primary/20">
               Secure Server Runtime
            </div>
            <motion.div 
              animate={{ 
                borderColor: status === 'executing' ? 'var(--primary)' : 'rgba(0,0,0,0.1)',
                backgroundColor: status === 'executing' ? 'oklch(var(--primary) / 0.05)' : 'transparent'
              }}
              className="relative w-full max-w-[240px] p-6 rounded-3xl border-2 bg-background shadow-2xl overflow-hidden"
            >
               <div className="absolute top-0 left-0 w-full h-1 bg-primary/20" />
               <div className="flex flex-col items-center gap-4">
                  <div className={`p-3 rounded-2xl transition-colors ${status === 'executing' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                     <Server className="h-8 w-8" />
                  </div>
                  <div className="text-center space-y-1">
                     <p className="text-[10px] font-bold uppercase tracking-widest">actions.ts</p>
                     <AnimatePresence mode="wait">
                       {status === 'executing' ? (
                         <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-primary font-black text-[9px]">
                            <Loader2 className="h-3 w-3 animate-spin" /> EXECUTING DB MUTATION...
                         </motion.div>
                       ) : status === 'complete' ? (
                         <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }} className="flex items-center gap-2 text-emerald-600 font-black text-[9px]">
                            <ShieldCheck className="h-3 w-3" /> VERIFIED & PERSISTED
                         </motion.div>
                       ) : (
                         <span className="text-[9px] text-muted-foreground">Waiting for RPC call...</span>
                       )}
                     </AnimatePresence>
                  </div>
               </div>
            </motion.div>
          </div>

          {/* Connection Bridge (Hidden on mobile) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:block">
             <div className="w-12 h-px bg-muted border-t border-dashed" />
          </div>
        </div>

        <div className="max-w-md w-full bg-background border border-border p-6 rounded-[2rem] shadow-sm text-center">
           <AnimatePresence mode="wait">
             <motion.p 
               key={status}
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="text-xs text-muted-foreground leading-relaxed"
             >
               {status === 'idle' && "Server Actions are functions that Next.js automatically turns into secure API endpoints for you."}
               {status === 'calling' && "The browser is calling the server function directly. Next.js handles the POST request automatically."}
               {status === 'executing' && "The code is running on your secure server. It can safely access databases and private API keys."}
               {status === 'complete' && "Done! The server has updated the data and told React to re-validate the UI cache."}
             </motion.p>
           </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
