"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Play, RotateCcw, Database, HardDrive, Zap, Clock, FileCode, Settings } from "lucide-react"
import { Button } from "@/components/visualizers/nextjscosmos/components/ui/button"

type FetchOption = 'force-cache' | 'no-store' | 'revalidate'

export function FetchOptionsVisualizer() {
  const [option, setOption] = useState<FetchOption>('force-cache')
  const [status, setStatus] = useState<'idle' | 'executing' | 'result'>('idle')

  const runFetch = async () => {
    setStatus('executing')
    await new Promise(r => setTimeout(r, 1500))
    setStatus('result')
  }

  return (
    <div className="flex flex-col h-full p-4 md:p-8 bg-grid-premium">
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-1">
          <h3 className="text-lg font-bold tracking-tight">fetch() Option Lab</h3>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Granular Cache Control</p>
        </div>
        <div className="flex bg-muted/50 p-1 rounded-xl border border-border">
          {['force-cache', 'no-store', 'revalidate'].map((opt) => (
            <button 
              key={opt}
              onClick={() => { setOption(opt as FetchOption); setStatus('idle'); }}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${option === opt ? 'bg-background shadow-sm text-primary' : 'text-muted-foreground'}`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-8">
        {/* Code Snippet Display */}
        <div className="w-full max-w-md bg-zinc-950 rounded-2xl p-4 border border-white/5 font-mono text-[11px] shadow-2xl">
           <div className="flex items-center gap-2 mb-3 opacity-50">
              <div className="h-2 w-2 rounded-full bg-red-500" />
              <div className="h-2 w-2 rounded-full bg-amber-500" />
              <div className="h-2 w-2 rounded-full bg-emerald-500" />
           </div>
           <p className="text-blue-400">fetch<span className="text-white">(</span><span className="text-emerald-400">'/api/data'</span><span className="text-white">, {"{"}</span></p>
           <p className="ml-4">
              {option === 'force-cache' && <span className="text-purple-400">cache: <span className="text-emerald-400">'force-cache'</span></span>}
              {option === 'no-store' && <span className="text-purple-400">cache: <span className="text-emerald-400">'no-store'</span></span>}
              {option === 'revalidate' && <span className="text-purple-400">next: <span className="text-white">{"{"}</span> revalidate: <span className="text-amber-400">60</span> <span className="text-white">{"}"}</span></span>}
           </p>
           <p className="text-white">{"})"}</p>
        </div>

        <div className="w-full max-w-2xl grid grid-cols-3 gap-8 items-center relative py-12">
           {/* Component */}
           <div className="flex flex-col items-center gap-4">
              <div className="w-20 h-20 rounded-2xl border-2 bg-background flex items-center justify-center shadow-xl relative">
                 <FileCode className="text-primary" />
                 {status === 'executing' && (
                   <motion.div 
                     layoutId="instruction"
                     initial={{ scale: 0.5, opacity: 0 }}
                     animate={{ scale: 1, opacity: 1, x: 50 }}
                     className="absolute h-4 w-4 bg-primary rounded-full z-10"
                   />
                 )}
              </div>
              <span className="text-[9px] font-black uppercase text-muted-foreground">Server Component</span>
           </div>

           {/* Fetcher Logic */}
           <div className="flex flex-col items-center gap-4">
              <motion.div 
                animate={{ 
                  borderColor: status === 'executing' ? 'var(--primary)' : 'rgba(0,0,0,0.1)',
                  rotate: status === 'executing' ? 360 : 0
                }}
                transition={{ duration: 1.5, repeat: status === 'executing' ? Infinity : 0 }}
                className="w-24 h-24 rounded-full border-4 border-dashed bg-background flex items-center justify-center shadow-2xl"
              >
                 <Settings className={status === 'executing' ? 'text-primary' : 'text-muted-foreground/20'} />
              </motion.div>
              <span className="text-[9px] font-black uppercase text-center">Next.js<br/>Cache Resolver</span>
           </div>

           {/* Result Node */}
           <div className="flex flex-col items-center gap-4">
              <motion.div 
                animate={{ 
                  opacity: status === 'result' ? 1 : 0.2,
                  scale: status === 'result' ? 1 : 0.9,
                  borderColor: status === 'result' ? 'var(--emerald-500)' : 'rgba(0,0,0,0.1)'
                }}
                className="w-24 h-24 rounded-2xl border-2 bg-background flex flex-col items-center justify-center gap-2 shadow-xl"
              >
                 {option === 'force-cache' && <HardDrive className="text-emerald-500" />}
                 {option === 'no-store' && <Zap className="text-amber-500" />}
                 {option === 'revalidate' && <Clock className="text-blue-500" />}
                 <span className="text-[8px] font-black uppercase">
                    {option === 'force-cache' && 'Static Hit'}
                    {option === 'no-store' && 'Live Fetch'}
                    {option === 'revalidate' && 'Stale Check'}
                 </span>
              </motion.div>
              <span className="text-[9px] font-black uppercase">Behavior</span>
           </div>

           <div className="absolute top-1/2 left-[20%] w-[15%] h-0.5 bg-muted" />
           <div className="absolute top-1/2 right-[20%] w-[15%] h-0.5 bg-muted" />
        </div>

        <div className="max-w-md w-full flex flex-col items-center gap-6">
           <Button onClick={runFetch} disabled={status === 'executing'} className="rounded-full px-10 shadow-xl">
              Execute Fetch
           </Button>
           
           <div className="bg-background border border-border p-4 rounded-2xl text-center min-h-[60px] flex items-center">
              <AnimatePresence mode="wait">
                <motion.p 
                  key={option + status}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs text-muted-foreground leading-relaxed"
                >
                  {status === 'idle' && (
                    option === 'force-cache' ? "Next.js will look for a cached response. If not found, it fetches and stores it forever." :
                    option === 'no-store' ? "Next.js will skip the cache entirely and fetch fresh data on every single request." :
                    "Next.js will serve from cache, but trigger a background refresh if the data is older than 60 seconds."
                  )}
                  {status === 'executing' && "Applying your cache instructions to the network request..."}
                  {status === 'result' && "Behavior applied! This control gives you granular power over your application's performance."}
                </motion.p>
              </AnimatePresence>
           </div>
        </div>
      </div>
    </div>
  )
}
