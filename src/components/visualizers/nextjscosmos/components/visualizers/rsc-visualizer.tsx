"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Server, Monitor, ArrowRightLeft, MousePointer2, Database, Code, ShieldCheck, Zap } from "lucide-react"

type RSCMode = 'concept' | 'boundary'

interface RSCVisualizerProps {
  mode?: RSCMode
}

export function RSCVisualizer({ mode = 'concept' }: RSCVisualizerProps) {
  const [activeSide, setActiveSide] = useState<'server' | 'client' | null>(null)

  return (
    <div className="flex flex-col h-full p-4 md:p-8 bg-grid-premium">
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-1">
          <h3 className="text-lg font-bold tracking-tight">
            {mode === 'concept' ? 'RSC Execution Model' : 'Boundary Simulation'}
          </h3>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">
            {mode === 'concept' ? 'Server vs. Client Architecture' : 'Hover to analyze environment'}
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-background border border-border shadow-sm">
           <div className={`h-2 w-2 rounded-full ${activeSide ? 'bg-emerald-500' : 'bg-muted-foreground/30'}`} />
           <span className="text-[10px] font-bold uppercase tracking-tighter">
             {activeSide ? `${activeSide} active` : 'System Idle'}
           </span>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 relative">
        {/* Connection Path */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 hidden md:block">
          <motion.div 
            animate={{ 
              rotate: activeSide === 'server' ? 0 : 180,
              scale: activeSide ? 1.1 : 1
            }}
            className="p-3 bg-background border-2 border-primary/20 rounded-2xl shadow-2xl"
          >
             <ArrowRightLeft className={`h-6 w-6 ${activeSide ? 'text-primary' : 'text-muted-foreground/30'}`} />
          </motion.div>
        </div>

        {/* Server Side */}
        <motion.div 
          onHoverStart={() => setActiveSide('server')}
          onHoverEnd={() => setActiveSide(null)}
          className={`relative border-2 rounded-[2rem] p-8 transition-all duration-500 flex flex-col items-center gap-6 overflow-hidden ${
            activeSide === 'server' ? 'border-primary bg-primary/5 shadow-2xl scale-[1.02]' : 'border-border bg-background/50 grayscale opacity-60'
          }`}
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-primary/20" />
          <div className={`p-5 rounded-3xl transition-colors ${activeSide === 'server' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
            <Server className="h-10 w-10" />
          </div>
          <div className="text-center">
            <h4 className="font-black text-xl mb-3 tracking-tight">
              {mode === 'concept' ? 'Server Environment' : 'Server Component'}
            </h4>
            <ul className="text-xs space-y-3 text-muted-foreground font-medium text-left">
              <li className="flex items-center gap-2">
                <ShieldCheck className="h-3.5 w-3.5 text-primary" /> 
                {mode === 'concept' ? 'Secure server-side execution' : 'Secure Secrets Access'}
              </li>
              <li className="flex items-center gap-2">
                <Zap className="h-3.5 w-3.5 text-primary" /> No JS sent to browser
              </li>
              <li className="flex items-center gap-2">
                <Code className="h-3.5 w-3.5 text-primary" /> Direct DB/API access
              </li>
            </ul>
          </div>
          
          <motion.div 
            animate={{ opacity: activeSide === 'server' ? 1 : 0.3 }}
            className="mt-auto w-full bg-background border border-border p-4 rounded-2xl shadow-sm"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black text-primary uppercase tracking-widest">RSC Payload</span>
              <span className="text-[9px] font-mono text-muted-foreground">0kb JS</span>
            </div>
            <div className="space-y-1.5">
              <div className="h-1.5 w-full bg-primary/10 rounded-full overflow-hidden">
                <motion.div 
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                  className="h-full w-1/3 bg-primary/30" 
                />
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Client Side */}
        <motion.div 
          onHoverStart={() => setActiveSide('client')}
          onHoverEnd={() => setActiveSide(null)}
          className={`relative border-2 rounded-[2rem] p-8 transition-all duration-500 flex flex-col items-center gap-6 overflow-hidden ${
            activeSide === 'client' ? 'border-blue-500 bg-blue-500/5 shadow-2xl scale-[1.02]' : 'border-border bg-background/50 grayscale opacity-60'
          }`}
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-blue-500/20" />
          <div className={`p-5 rounded-3xl transition-colors ${activeSide === 'client' ? 'bg-blue-500 text-white' : 'bg-muted text-muted-foreground'}`}>
            <Monitor className="h-10 w-10" />
          </div>
          <div className="text-center">
            <h4 className="font-black text-xl mb-3 tracking-tight">
              {mode === 'concept' ? 'Client Environment' : 'Client Component'}
            </h4>
            <ul className="text-xs space-y-3 text-muted-foreground font-medium text-left">
              <li className="flex items-center gap-2">
                <MousePointer2 className="h-3.5 w-3.5 text-blue-500" /> Interactive elements
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-blue-500" /> State (useState)
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-blue-500" /> Event Listeners
              </li>
            </ul>
          </div>

          <motion.div 
            animate={{ opacity: activeSide === 'client' ? 1 : 0.3 }}
            className="mt-auto w-full bg-background border border-border p-4 rounded-2xl shadow-sm"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Hydration Bundle</span>
              <span className="text-[9px] font-mono text-blue-500 font-bold">+24kb JS</span>
            </div>
            <div className="space-y-1.5">
              <div className="h-1.5 w-full bg-blue-500/10 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: activeSide === 'client' ? "100%" : "20%" }}
                  className="h-full bg-blue-500/40" 
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div 
          key={activeSide || 'none'}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="mt-8 p-6 rounded-[1.5rem] bg-muted/30 border border-border text-center relative overflow-hidden"
        >
           <div className="relative z-10">
             <p className="text-sm leading-relaxed">
                {mode === 'concept' ? (
                  <>
                    {activeSide === 'server' && <strong>The Server handles data fetching and logic before anything is sent.</strong>}
                    {activeSide === 'client' && <strong>The Client only handles user interaction and browser-specific APIs.</strong>}
                    {!activeSide && "Hover to see how responsibilities are split between Server and Client."}
                  </>
                ) : (
                  <>
                    {activeSide === 'server' && <strong>Server components cannot import Client components directly into their logic, only render them.</strong>}
                    {activeSide === 'client' && <strong>Client components are the leaf nodes of your architecture.</strong>}
                    {!activeSide && "The boundary is the 'gate' where server code stops and client code starts."}
                  </>
                )}
             </p>
           </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}