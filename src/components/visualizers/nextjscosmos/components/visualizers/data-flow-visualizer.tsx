"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Play, RotateCcw, Database, Server, Monitor, ArrowRight, ArrowLeft, Loader2 } from "lucide-react"
import { Button } from "@/components/visualizers/nextjscosmos/components/ui/button"

interface DataFlowVisualizerProps {
  mode: 'server' | 'client'
}

export function DataFlowVisualizer({ mode }: DataFlowVisualizerProps) {
  const [status, setStatus] = useState<'idle' | 'fetching' | 'received' | 'streaming' | 'complete'>('idle')

  const runSimulation = async () => {
    setStatus('fetching')
    await new Promise(r => setTimeout(r, 1500))
    setStatus('received')
    await new Promise(r => setTimeout(r, 1000))
    setStatus('streaming')
    await new Promise(r => setTimeout(r, 1500))
    setStatus('complete')
  }

  return (
    <div className="flex flex-col h-full p-4 md:p-8 bg-grid-premium">
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-1">
          <h3 className="text-lg font-bold tracking-tight">
            {mode === 'server' ? 'Server-Side Fetching' : 'Client-Side Fetching'}
          </h3>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">
            {mode === 'server' ? 'Direct DB Access (No Waterfall)' : 'Background API Request'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={runSimulation} disabled={status !== 'idle'} size="sm" className="gap-2 rounded-full shadow-lg">
            <Play className="h-4 w-4 fill-current" /> Run Data Flow
          </Button>
          <Button variant="outline" size="sm" onClick={() => setStatus('idle')} className="rounded-full">
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-12">
        <div className="w-full max-w-2xl grid grid-cols-3 gap-8 items-center relative">
          
          {/* Node 1: Database/API */}
          <div className="flex flex-col items-center gap-4">
            <motion.div 
              animate={{ 
                borderColor: status === 'fetching' ? 'var(--primary)' : 'rgba(0,0,0,0.1)',
                scale: status === 'fetching' ? 1.1 : 1
              }}
              className="w-20 h-20 rounded-2xl border-2 bg-background flex items-center justify-center shadow-xl"
            >
              <Database className={status === 'fetching' ? 'text-primary' : 'text-muted-foreground'} />
            </motion.div>
            <span className="text-[10px] font-bold uppercase tracking-tighter">Database / API</span>
          </div>

          {/* Node 2: Environment (Server or Client) */}
          <div className="flex flex-col items-center gap-4">
            <motion.div 
              animate={{ 
                borderColor: status === 'received' || status === 'streaming' ? 'var(--primary)' : 'rgba(0,0,0,0.1)',
                backgroundColor: status === 'received' ? 'oklch(var(--primary) / 0.05)' : 'transparent'
              }}
              className="w-32 h-32 rounded-[2rem] border-2 bg-background flex flex-col items-center justify-center gap-2 relative shadow-2xl"
            >
              {mode === 'server' ? (
                <Server className={status === 'fetching' || status === 'received' ? 'text-primary' : 'text-muted-foreground'} />
              ) : (
                <Monitor className={status === 'fetching' || status === 'received' ? 'text-primary' : 'text-muted-foreground'} />
              )}
              <span className="text-[10px] font-black uppercase tracking-widest">
                {mode === 'server' ? 'Server' : 'Browser'}
              </span>
              
              {status === 'fetching' && (
                <motion.div className="absolute inset-0 flex items-center justify-center bg-background/50 rounded-[2rem]">
                   <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </motion.div>
              )}
            </motion.div>
            <span className="text-[10px] font-bold uppercase tracking-tighter">Execution Context</span>
          </div>

          {/* Node 3: Result (UI or Stream) */}
          <div className="flex flex-col items-center gap-4">
            <motion.div 
              animate={{ 
                opacity: status === 'complete' ? 1 : 0.2,
                scale: status === 'complete' ? 1 : 0.9,
                borderColor: status === 'complete' ? 'var(--emerald-500)' : 'rgba(0,0,0,0.1)'
              }}
              className="w-24 h-24 rounded-2xl border-2 border-emerald-500/30 bg-emerald-500/5 flex flex-col p-3 gap-2 overflow-hidden shadow-xl"
            >
               <div className="h-2 w-full bg-emerald-500/20 rounded" />
               <div className="h-2 w-1/2 bg-emerald-500/20 rounded" />
               <div className="mt-auto h-6 w-full bg-emerald-500/40 rounded" />
            </motion.div>
            <span className="text-[10px] font-bold uppercase tracking-tighter text-emerald-600">Final UI</span>
          </div>

          {/* Connection Lines & Particles */}
          <div className="absolute top-1/2 left-[15%] w-[20%] h-0.5 bg-muted" />
          <div className="absolute top-1/2 right-[15%] w-[20%] h-0.5 bg-muted" />

          {/* Particle: Data Flowing TO context */}
          {status === 'fetching' && (
            <motion.div 
              initial={{ left: '15%', top: '50%' }}
              animate={{ left: '35%' }}
              className="absolute h-2 w-2 bg-primary rounded-full"
            />
          )}

          {/* Particle: Data flowing TO Result */}
          {status === 'streaming' && (
            <motion.div 
              initial={{ left: '60%', top: '50%' }}
              animate={{ left: '80%' }}
              className="absolute h-2 w-2 bg-emerald-500 rounded-full"
            />
          )}
        </div>

        <div className="bg-background border border-border p-6 rounded-[2rem] max-w-md w-full shadow-sm text-center">
           <AnimatePresence mode="wait">
             <motion.div
               key={status}
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="text-xs text-muted-foreground leading-relaxed"
             >
               {mode === 'server' ? (
                 <>
                   {status === 'idle' && "In Server-Side fetching, the data is pulled directly from the source before the UI is built."}
                   {status === 'fetching' && "Next.js is talking directly to your Database or API from the private server network."}
                   {status === 'received' && "Data received! No API keys or secrets were exposed to the public internet."}
                   {status === 'streaming' && "The server constructs the UI with the data and streams it to the user."}
                   {status === 'complete' && "Success! The user gets pre-filled HTML with no extra round-trips required."}
                 </>
               ) : (
                 <>
                   {status === 'idle' && "In Client-Side fetching, the page shell loads first, then the browser asks for data."}
                   {status === 'fetching' && "The user's browser is making an HTTP request over the public internet."}
                   {status === 'received' && "React receives the JSON response and updates the local state (useState)."}
                   {status === 'streaming' && "React re-renders the component to show the new data."}
                   {status === 'complete' && "Interactive update complete! This is great for private data or high-frequency updates."}
                 </>
               )}
             </motion.div>
           </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
