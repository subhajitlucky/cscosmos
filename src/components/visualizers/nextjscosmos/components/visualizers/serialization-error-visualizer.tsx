"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { XCircle, Box, ArrowRight, ZapOff, Ghost, Database, Monitor } from "lucide-react"
import { Button } from "@/components/visualizers/nextjscosmos/components/ui/button"

export function SerializationErrorVisualizer() {
  const [status, setStatus] = useState<'idle' | 'leaking' | 'shattered'>('idle')

  const triggerLeak = async () => {
    setStatus('leaking')
    await new Promise(r => setTimeout(r, 1500))
    setStatus('shattered')
  }

  return (
    <div className="flex flex-col h-full p-4 md:p-8 bg-grid-premium">
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-1">
          <h3 className="text-lg font-bold tracking-tight text-red-600">Serialization Firewall</h3>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Unserializable Props Leak</p>
        </div>
        <Button onClick={triggerLeak} disabled={status !== 'idle'} size="sm" variant="destructive" className="rounded-full shadow-lg gap-2">
          <Ghost className="h-4 w-4" /> Leak Function
        </Button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-12">
        <div className="w-full max-w-2xl grid grid-cols-2 gap-0 relative border-4 border-dashed border-primary/10 rounded-[3rem] overflow-hidden bg-background/50 h-[300px]">
          
          {/* Server Territory */}
          <div className="p-12 flex flex-col items-center justify-center gap-6 bg-primary/5">
            <ServerTerritory status={status} />
          </div>

          {/* Client Territory */}
          <div className="p-12 flex flex-col items-center justify-center gap-6 border-l-2 border-primary/20 bg-blue-500/5">
            <Monitor className="h-12 w-12 text-blue-500 opacity-20" />
          </div>

          {/* Traveling Data Packet */}
          <AnimatePresence>
            {status === 'leaking' && (
              <motion.div 
                initial={{ left: '20%', top: '50%', x: '-50%', y: '-50%' }}
                animate={{ left: '50%' }}
                className="absolute z-30 p-4 bg-background border-2 border-red-500 rounded-2xl shadow-2xl flex flex-col items-center gap-2"
              >
                 <div className="flex items-center gap-2 text-red-600 font-bold text-[10px] uppercase">
                    <ZapOff className="h-3 w-3" /> Function Packet
                 </div>
                 <div className="h-1.5 w-16 bg-red-100 rounded-full overflow-hidden">
                    <motion.div className="h-full bg-red-500" animate={{ x: [-64, 64] }} transition={{ repeat: Infinity, duration: 0.5 }} />
                 </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Shatter Effect */}
          <AnimatePresence>
            {status === 'shattered' && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 z-40 bg-red-600/95 backdrop-blur-md flex flex-col items-center justify-center p-12 text-white"
              >
                 <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 0.2 }}>
                    <XCircle className="h-20 w-20 mb-6" />
                 </motion.div>
                 <h4 className="text-2xl font-black uppercase mb-4 tracking-tighter">Serialization Failed!</h4>
                 <div className="bg-black/20 rounded-2xl p-6 font-mono text-[9px] text-left border border-white/10 w-full max-w-sm">
                    <p className="text-red-200">Error: Functions cannot be passed directly to Client Components.</p>
                    <p className="opacity-60 mt-2 italic">// props.onComplete is a [Function]</p>
                    <p className="opacity-60 mt-4">👉 Solution: Only pass objects, strings, numbers, or Server Actions.</p>
                 </div>
                 <Button onClick={() => setStatus('idle')} variant="outline" className="mt-8 text-white border-white/20 hover:bg-white/10">
                    Reset Boundary
                 </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="max-w-md w-full bg-background border border-border p-6 rounded-[2rem] shadow-sm text-center">
           <p className="text-xs text-muted-foreground leading-relaxed">
             <strong>The Limit:</strong> Data crossing the wire from Server to Client must be 
             <span className="text-red-600 font-bold mx-1">serializable</span> (JSON-compatible). 
             Classes, Functions, and Symbols cannot be stringified, so they "shatter" at the boundary.
           </p>
        </div>
      </div>
    </div>
  )
}

function ServerTerritory({ status }: { status: string }) {
  return (
    <div className="flex flex-col items-center gap-4">
       <div className="p-4 rounded-2xl bg-primary/10 text-primary">
          <Database className="h-10 w-10" />
       </div>
       <div className="space-y-2 w-32">
          <div className="h-2 w-full bg-primary/20 rounded" />
          <div className="h-2 w-2/3 bg-primary/20 rounded" />
       </div>
    </div>
  )
}
