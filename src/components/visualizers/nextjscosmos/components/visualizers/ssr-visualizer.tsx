"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { User, Server, Globe, ArrowRight, Play, RotateCcw, Clock } from "lucide-react"
import { Button } from "@/components/visualizers/nextjscosmos/components/ui/button"

export function SSRVisualizer() {
  const [status, setStatus] = useState<'idle' | 'requesting' | 'rendering' | 'streaming' | 'complete'>('idle')

  const startSimulation = async () => {
    setStatus('requesting')
    await new Promise(r => setTimeout(r, 1000))
    setStatus('rendering')
    await new Promise(r => setTimeout(r, 1500))
    setStatus('streaming')
    await new Promise(r => setTimeout(r, 1200))
    setStatus('complete')
  }

  return (
    <div className="flex flex-col h-full p-4 md:p-8 bg-grid-premium">
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-1">
          <h3 className="text-lg font-bold tracking-tight">SSR: Request-Time Rendering</h3>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Every request generates a fresh response</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={startSimulation} disabled={status !== 'idle'} size="sm" className="gap-2 rounded-full shadow-lg">
            <Play className="h-4 w-4 fill-current" /> Run Request
          </Button>
          <Button variant="outline" size="sm" onClick={() => setStatus('idle')} className="rounded-full">
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-12">
        <div className="w-full max-w-3xl grid grid-cols-3 gap-4 items-center relative">
          
          {/* User Side */}
          <div className="flex flex-col items-center gap-4">
            <motion.div 
              animate={{ 
                scale: status === 'requesting' ? 1.1 : 1,
                borderColor: status === 'requesting' ? 'var(--primary)' : 'rgba(0,0,0,0.1)'
              }}
              className="w-20 h-20 rounded-2xl border-2 bg-background flex items-center justify-center shadow-xl"
            >
              <User className={status === 'requesting' ? 'text-primary' : 'text-muted-foreground'} />
            </motion.div>
            <span className="text-[10px] font-bold uppercase tracking-tighter">User Request</span>
          </div>

          {/* Path 1: Request to Server */}
          <div className="relative flex items-center justify-center">
             <div className="w-full h-0.5 bg-muted" />
             {status === 'requesting' && (
               <motion.div 
                 initial={{ left: 0 }}
                 animate={{ left: '100%' }}
                 className="absolute h-3 w-3 bg-primary rounded-full shadow-[0_0_15px_rgba(var(--primary),0.5)]"
               />
             )}
          </div>

          {/* Server Side */}
          <div className="flex flex-col items-center gap-4">
            <motion.div 
              animate={{ 
                backgroundColor: status === 'rendering' ? 'oklch(var(--primary) / 0.1)' : 'transparent',
                borderColor: status === 'rendering' ? 'var(--primary)' : 'rgba(0,0,0,0.1)'
              }}
              className="w-32 h-32 rounded-[2rem] border-2 bg-background flex flex-col items-center justify-center gap-2 relative shadow-2xl overflow-hidden"
            >
              <Server className={status === 'rendering' ? 'text-primary animate-pulse' : 'text-muted-foreground'} />
              <AnimatePresence>
                {status === 'rendering' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center"
                  >
                    <div className="flex gap-1">
                      <div className="h-1 w-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="h-1 w-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="h-1 w-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                    <span className="text-[8px] font-black text-primary mt-2">GENERATING...</span>
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="absolute top-2 right-2">
                 <Clock className="h-3 w-3 text-muted-foreground/30" />
              </div>
            </motion.div>
            <span className="text-[10px] font-bold uppercase tracking-tighter text-center">Compute (At Edge)</span>
          </div>

          {/* Path 2: Response to Client */}
          <div className="col-start-2 row-start-2 relative flex items-center justify-center mt-[-40px]">
             <div className="w-full h-0.5 bg-muted" />
             {status === 'streaming' && (
               <motion.div 
                 initial={{ right: 0 }}
                 animate={{ right: '100%' }}
                 className="absolute h-3 w-3 bg-emerald-500 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)]"
               />
             )}
          </div>

          {/* Final UI Result */}
          <div className="col-start-1 row-start-2 flex flex-col items-center gap-4 mt-[-40px]">
            <motion.div 
              animate={{ 
                opacity: status === 'complete' ? 1 : 0.2,
                scale: status === 'complete' ? 1 : 0.9
              }}
              className="w-24 h-24 rounded-2xl border-2 border-emerald-500/30 bg-emerald-500/5 flex flex-col p-3 gap-2 overflow-hidden shadow-xl"
            >
               <div className="h-2 w-full bg-emerald-500/20 rounded" />
               <div className="h-2 w-3/4 bg-emerald-500/20 rounded" />
               <div className="mt-auto h-6 w-full bg-emerald-500/40 rounded flex items-center justify-center">
                  <span className="text-[8px] font-bold text-emerald-700">LIVE DATA</span>
               </div>
            </motion.div>
            <span className="text-[10px] font-bold uppercase tracking-tighter text-emerald-600">Fresh HTML</span>
          </div>

        </div>

        <div className="bg-background border border-border p-4 rounded-2xl max-w-md w-full shadow-sm">
           <AnimatePresence mode="wait">
             <motion.div
               key={status}
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="text-xs text-center text-muted-foreground leading-relaxed"
             >
               {status === 'idle' && "Click 'Run Request' to see what happens when a user visits an SSR page."}
               {status === 'requesting' && "The user's browser sends a request to the Next.js server."}
               {status === 'rendering' && "Next.js executes your Server Components and fetches the latest data for this specific user."}
               {status === 'streaming' && "The server streams the generated HTML back to the browser immediately."}
               {status === 'complete' && "The user sees fresh content. If they refresh, this whole process happens again."}
             </motion.div>
           </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
