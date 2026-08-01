"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Play, RotateCcw, Box, Zap, Layout, Loader2, Sparkles } from "lucide-react"
import { Button } from "@/components/visualizers/nextjscosmos/components/ui/button"

export function PPRVisualizer() {
  const [stages, setStages] = useState({
    shell: false,
    holes: false,
  })
  const [isSimulating, setIsSimulating] = useState(false)

  const runSimulation = async () => {
    setIsSimulating(true)
    setStages({ shell: false, holes: false })
    
    // 1. Static shell is INSTANT
    await new Promise(r => setTimeout(r, 600))
    setStages(s => ({ ...s, shell: true }))
    
    // 2. Dynamic holes stream in later
    await new Promise(r => setTimeout(r, 2000))
    setStages(s => ({ ...s, holes: true }))
    setIsSimulating(false)
  }

  return (
    <div className="flex flex-col h-full p-4 md:p-8 bg-grid-premium">
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-1">
          <h3 className="text-lg font-bold tracking-tight">PPR: Static + Dynamic</h3>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Partial Prerendering Simulation</p>
        </div>
        <Button 
          onClick={runSimulation}
          disabled={isSimulating}
          size="sm" 
          className="rounded-full shadow-lg bg-emerald-600 hover:bg-emerald-700 gap-2"
        >
          <Sparkles className="h-4 w-4" /> Run Page Load
        </Button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="w-full max-w-2xl border-4 border-primary/10 rounded-[3rem] bg-background/50 p-6 shadow-2xl relative overflow-hidden">
          
          <div className="flex flex-col gap-6 h-[300px]">
             {/* Persistent Header (Always static) */}
             <div className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center gap-2">
                   <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Layout className="h-4 w-4 text-primary" />
                   </div>
                   <span className="font-bold text-sm">Store Cosmos</span>
                </div>
                <div className="flex gap-4">
                   <div className="h-2 w-12 bg-muted rounded" />
                   <div className="h-2 w-12 bg-muted rounded" />
                </div>
             </div>

             <div className="flex-1 grid grid-cols-3 gap-6">
                {/* Static Content (Instantly visible) */}
                <div className="col-span-2 space-y-4">
                   <AnimatePresence>
                     {stages.shell && (
                       <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                          <div className="h-8 w-3/4 bg-primary/10 rounded-lg" />
                          <div className="grid grid-cols-2 gap-4">
                             <div className="h-24 bg-muted/50 rounded-2xl" />
                             <div className="h-24 bg-muted/50 rounded-2xl" />
                          </div>
                       </motion.div>
                     )}
                   </AnimatePresence>
                </div>

                {/* Dynamic Hole (Streams in later) */}
                <div className="relative rounded-[2rem] border-2 border-dashed border-primary/20 bg-background/50 p-4 flex flex-col items-center justify-center">
                   <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-background border border-primary/20 px-2 py-0.5 rounded text-[8px] font-black uppercase text-primary">
                      Dynamic Slot
                   </div>
                   
                   <AnimatePresence mode="wait">
                     {stages.holes ? (
                       <motion.div 
                         key="content"
                         initial={{ scale: 0.8, opacity: 0 }}
                         animate={{ scale: 1, opacity: 1 }}
                         className="flex flex-col items-center gap-3 w-full"
                       >
                          <div className="h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600 border border-emerald-500/20">
                             <Zap className="h-6 w-6 fill-current" />
                          </div>
                          <div className="h-2 w-full bg-emerald-500/10 rounded" />
                          <div className="h-2 w-2/3 bg-emerald-500/10 rounded" />
                       </motion.div>
                     ) : stages.shell ? (
                       <motion.div key="loader" className="flex flex-col items-center gap-2">
                          <Loader2 className="h-6 w-6 animate-spin text-primary/40" />
                          <span className="text-[8px] font-bold text-primary/40 uppercase">Streaming...</span>
                       </motion.div>
                     ) : null}
                   </AnimatePresence>
                </div>
             </div>
          </div>

          <AnimatePresence>
            {!stages.shell && isSimulating && (
              <motion.div 
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex items-center justify-center"
              >
                 <div className="flex flex-col items-center gap-4">
                    <Box className="h-12 w-12 text-primary animate-bounce" />
                    <p className="text-sm font-bold uppercase tracking-widest text-primary animate-pulse">Requesting Page Shell...</p>
                 </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-8 p-4 bg-primary/5 border border-primary/10 rounded-2xl max-w-md w-full text-center">
           <p className="text-xs text-muted-foreground leading-relaxed">
             <strong>The Architecture:</strong> PPR allows the server to send the 
             <span className="text-primary font-bold mx-1">pre-rendered shell</span> 
             instantly, while the <span className="text-emerald-600 font-bold mx-1">dynamic holes</span> 
             are streamed into the same HTTP request as they resolve.
           </p>
        </div>
      </div>
    </div>
  )
}
