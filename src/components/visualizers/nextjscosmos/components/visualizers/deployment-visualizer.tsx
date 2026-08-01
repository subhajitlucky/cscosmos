"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Play, Globe, Server, Cpu, Zap, MapPin, Gauge, Shield } from "lucide-react"
import { Button } from "@/components/visualizers/nextjscosmos/components/ui/button"

export function DeploymentVisualizer() {
  const [runtime, setRuntime] = useState<'node' | 'edge'>('node')
  const [isSimulating, setIsSimulating] = useState(false)
  const [latency, setHits] = useState(0)

  const simulate = async () => {
    setIsSimulating(true)
    // Edge is 10x faster response usually
    const time = runtime === 'edge' ? 400 : 2000
    await new Promise(r => setTimeout(r, time))
    setIsSimulating(false)
    setHits(time)
  }

  return (
    <div className="flex flex-col h-full p-4 md:p-8 bg-grid-premium">
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-1">
          <h3 className="text-lg font-bold tracking-tight">Runtime Comparison</h3>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Global Edge vs. Centralized Node</p>
        </div>
        <div className="flex bg-muted/50 p-1 rounded-xl border border-border">
          <button 
            onClick={() => { setRuntime('node'); setHits(0); }}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${runtime === 'node' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground'}`}
          >
            Node.js
          </button>
          <button 
            onClick={() => { setRuntime('edge'); setHits(0); }}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${runtime === 'edge' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground'}`}
          >
            Edge
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-8">
        <div className="w-full max-w-2xl relative min-h-[300px] flex items-center justify-center">
          
          {/* User Marker */}
          <div className="absolute left-0 flex flex-col items-center gap-2">
             <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20">
                <Globe className="h-5 w-5 text-primary" />
             </div>
             <span className="text-[10px] font-bold uppercase">Visitor</span>
          </div>

          {/* Server Nodes */}
          {runtime === 'node' ? (
            <motion.div 
              key="node"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center gap-4 ml-32"
            >
               <div className="h-24 w-24 rounded-3xl bg-background border-4 border-primary/20 flex flex-col items-center justify-center shadow-2xl relative">
                  <Server className="h-10 w-10 text-primary" />
                  <span className="text-[8px] font-black uppercase mt-2 text-primary">US-EAST-1</span>
                  {isSimulating && (
                    <motion.div className="absolute inset-0 border-4 border-primary rounded-3xl animate-ping opacity-20" />
                  )}
               </div>
               <div className="text-center">
                  <p className="text-[10px] font-black uppercase">Centralized Server</p>
                  <p className="text-[8px] text-muted-foreground">Full Node.js Runtime</p>
               </div>
            </motion.div>
          ) : (
            <motion.div 
              key="edge"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="grid grid-cols-2 gap-8 ml-32"
            >
               {[1,2,3,4].map(i => (
                 <div key={i} className="flex flex-col items-center gap-2">
                    <div className="h-12 w-12 rounded-xl bg-emerald-500/10 border-2 border-emerald-500/20 flex items-center justify-center relative shadow-lg">
                       <Zap className={`h-5 w-5 text-emerald-500 ${isSimulating ? 'animate-pulse' : ''}`} />
                       {isSimulating && (
                         <motion.div className="absolute inset-0 border-2 border-emerald-500 rounded-xl animate-ping opacity-20" />
                       )}
                    </div>
                    <span className="text-[7px] font-black text-emerald-600 uppercase">POP {i}</span>
                 </div>
               ))}
            </motion.div>
          )}

          {/* Response Meter */}
          <div className="absolute right-0 top-0 p-4 rounded-2xl bg-background border border-border shadow-xl">
             <div className="flex items-center gap-2 mb-2">
                <Gauge className="h-4 w-4 text-muted-foreground" />
                <span className="text-[10px] font-bold uppercase">Latency</span>
             </div>
             <div className="text-2xl font-black tabular-nums">
                {isSimulating ? '...' : latency}{' '}
                <span className="text-xs font-medium text-muted-foreground">ms</span>
             </div>
          </div>

          {/* Action Trigger */}
          <div className="absolute bottom-0 left-0">
             <Button onClick={simulate} disabled={isSimulating} size="sm" className="rounded-full shadow-xl">
                Simulate Request
             </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 w-full max-w-md">
           <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10">
              <div className="flex items-center gap-2 mb-2">
                 <Cpu className="h-3 w-3 text-primary" />
                 <span className="text-[9px] font-black uppercase">Capability</span>
              </div>
              <p className="text-[10px] text-muted-foreground font-medium">
                 {runtime === 'node' ? 'Full access to all libraries and Node APIs.' : 'Lightweight runtime with select Web APIs.'}
              </p>
           </div>
           <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
              <div className="flex items-center gap-2 mb-2">
                 <MapPin className="h-3 w-3 text-emerald-600" />
                 <span className="text-[9px] font-black uppercase">Distance</span>
              </div>
              <p className="text-[10px] text-muted-foreground font-medium">
                 {runtime === 'node' ? 'Request travels to a single data center.' : 'Request is handled by the nearest server node.'}
              </p>
           </div>
        </div>
      </div>
    </div>
  )
}
