"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { AlertCircle, Clock, CheckCircle2, Code, Terminal, ZapOff, Play, Loader2 } from "lucide-react"
import { Button } from "@/components/visualizers/nextjscosmos/components/ui/button"

export function ParamsErrorVisualizer() {
  const [isAsync, setIsAsync] = useState(false)
  const [status, setStatus] = useState<'idle' | 'running' | 'done'>('idle')

  const runSimulation = async () => {
    setStatus('running')
    await new Promise(r => setTimeout(r, 1500))
    setStatus('done')
  }

  return (
    <div className="flex flex-col h-full p-4 md:p-8 bg-grid-premium">
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-1">
          <h3 className="text-lg font-bold tracking-tight">Async Params Validator</h3>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Next.js 15+ Breaking Change</p>
        </div>
        <div className="flex bg-muted/50 p-1 rounded-xl border border-border">
          <button 
            onClick={() => { setIsAsync(false); setStatus('idle'); }}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${!isAsync ? 'bg-background shadow-sm text-red-600' : 'text-muted-foreground'}`}
          >
            Sync (Old)
          </button>
          <button 
            onClick={() => { setIsAsync(true); setStatus('idle'); }}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${isAsync ? 'bg-background shadow-sm text-emerald-600' : 'text-muted-foreground'}`}
          >
            Async (New)
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-8">
        {/* Code Comparison */}
        <div className="w-full max-w-xl bg-zinc-950 rounded-2xl p-6 border border-white/10 shadow-2xl relative">
           <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-2">
              <span className="text-[9px] font-black uppercase text-zinc-500">app/blog/[id]/page.tsx</span>
              <div className="flex gap-1.5">
                 <div className="w-2.5 h-2.5 rounded-full bg-red-500/20" />
                 <div className="w-2.5 h-2.5 rounded-full bg-amber-500/20" />
                 <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/20" />
              </div>
           </div>
           
           <div className="font-mono text-xs space-y-1">
              <p className="text-blue-400">export default <span className="text-purple-400">{isAsync ? 'async' : ''}</span> function <span className="text-emerald-400">Page</span>({"{ params }"}: Props) {"{"}</p>
              <div className="relative py-2 group">
                 {isAsync ? (
                   <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="ml-4">
                      <span className="text-purple-400">const</span> {"{ id }"} = <span className="text-primary font-black uppercase tracking-tighter mr-1 italic">await</span> params;
                   </motion.p>
                 ) : (
                   <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="ml-4">
                      <span className="text-purple-400">const</span> {"{ id }"} = params; <span className="text-red-500 text-[10px] ml-2 opacity-0 group-hover:opacity-100 transition-opacity">// ❌ ERROR</span>
                   </motion.p>
                 )}
              </div>
              <p className="ml-4 text-zinc-500">return &lt;div&gt;{"{ id }"}&lt;/div&gt;</p>
              <p className="text-blue-400">{"}"}</p>
           </div>
        </div>

        {/* Execution Result */}
        <div className="w-full max-w-md">
           <Button onClick={runSimulation} disabled={status === 'running'} className="w-full rounded-full h-12 shadow-xl gap-2">
              {status === 'running' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />} Run in Next.js Runtime
           </Button>
           
           <AnimatePresence mode="wait">
             {status === 'done' && (
               <motion.div 
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 className={`mt-6 p-6 rounded-[2rem] border-2 flex flex-col items-center text-center gap-4 ${isAsync ? 'border-emerald-500/30 bg-emerald-500/5 shadow-emerald-500/10' : 'border-red-500/30 bg-red-500/5 shadow-red-500/10'}`}
               >
                  {isAsync ? (
                    <>
                      <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                      <div className="space-y-1">
                         <h4 className="font-black uppercase text-emerald-600 tracking-tight">Runtime Verified</h4>
                         <p className="text-xs text-emerald-700/70">Params were awaited correctly. The UI is stable.</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <ZapOff className="h-10 w-10 text-red-500" />
                      <div className="space-y-1">
                         <h4 className="font-black uppercase text-red-600 tracking-tight">Sync Violation!</h4>
                         <p className="text-xs text-red-700/70">Error: Route /blog/[id] used sync params. This is forbidden in Next.js 15+.</p>
                      </div>
                    </>
                  )}
               </motion.div>
             )}
           </AnimatePresence>
        </div>

        <div className="max-w-md w-full bg-background border border-border p-6 rounded-[2rem] shadow-sm text-center">
           <p className="text-xs text-muted-foreground leading-relaxed">
             <strong>The Logic:</strong> In modern Next.js, <code>params</code> and <code>searchParams</code> are now Promises to support future optimizations. You must <code>await</code> them before accessing properties.
           </p>
        </div>
      </div>
    </div>
  )
}
