"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Play, Layout, PieChart, Users, Settings, Loader2, Database } from "lucide-react"
import { Button } from "@/components/visualizers/nextjscosmos/components/ui/button"

export function ParallelRoutesVisualizer() {
  const [stages, setStages] = useState({
    main: false,
    analytics: false,
    team: false,
  })
  const [isSimulating, setIsSimulating] = useState(false)

  const runSimulation = async () => {
    setIsSimulating(true)
    setStages({ main: false, analytics: false, team: false })
    
    // 1. Analytics loads first (Fast)
    await new Promise(r => setTimeout(r, 800))
    setStages(s => ({ ...s, analytics: true }))
    
    // 2. Main content (Medium)
    await new Promise(r => setTimeout(r, 1200))
    setStages(s => ({ ...s, main: true }))
    
    // 3. Team content (Slow)
    await new Promise(r => setTimeout(r, 1500))
    setStages(s => ({ ...s, team: true }))
    setIsSimulating(false)
  }

  return (
    <div className="flex flex-col h-full p-4 md:p-8 bg-grid-premium">
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-1">
          <h3 className="text-lg font-bold tracking-tight">Parallel Routing Lab</h3>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Independent Slot Rendering</p>
        </div>
        <Button 
          onClick={runSimulation}
          disabled={isSimulating}
          size="sm" 
          className="rounded-full gap-2 shadow-lg"
        >
          <Play className="h-4 w-4 fill-current" /> Run Layout
        </Button>
      </div>

      <div className="flex-1 flex gap-4 w-full max-w-4xl mx-auto border-4 border-primary/10 rounded-[2.5rem] bg-background/50 p-4 shadow-2xl overflow-hidden">
        
        {/* Slot A: Analytics */}
        <div className="w-1/3 flex flex-col gap-4">
           <div className="flex items-center gap-2 px-2">
              <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
              <span className="text-[9px] font-black text-muted-foreground uppercase">@analytics</span>
           </div>
           <div className="flex-1 rounded-2xl border-2 border-dashed border-blue-500/20 bg-blue-500/5 p-4 overflow-hidden relative">
              <AnimatePresence mode="wait">
                {stages.analytics ? (
                  <motion.div 
                    key="content"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="h-full flex flex-col gap-3"
                  >
                     <div className="h-1/2 bg-blue-500/20 rounded-xl flex items-center justify-center">
                        <PieChart className="h-8 w-8 text-blue-600" />
                     </div>
                     <div className="space-y-2">
                        <div className="h-2 w-full bg-blue-500/10 rounded" />
                        <div className="h-2 w-3/4 bg-blue-500/10 rounded" />
                     </div>
                  </motion.div>
                ) : isSimulating && (
                  <motion.div key="loader" className="h-full flex flex-col items-center justify-center gap-2">
                     <Loader2 className="h-6 w-6 animate-spin text-blue-400" />
                     <span className="text-[8px] font-bold text-blue-400 uppercase">Streaming...</span>
                  </motion.div>
                )}
              </AnimatePresence>
           </div>
        </div>

        {/* Main Content + Team Slot */}
        <div className="flex-1 flex flex-col gap-4">
           {/* Slot B: Main Page */}
           <div className="h-2/3 flex flex-col gap-4">
              <div className="flex items-center gap-2 px-2">
                 <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                 <span className="text-[9px] font-black text-muted-foreground uppercase">children (main)</span>
              </div>
              <div className="flex-1 rounded-2xl border-2 border-primary/20 bg-primary/5 p-6 relative">
                 <AnimatePresence mode="wait">
                   {stages.main ? (
                     <motion.div 
                       key="content"
                       initial={{ opacity: 0 }}
                       animate={{ opacity: 1 }}
                       className="space-y-4"
                     >
                        <div className="h-8 w-1/2 bg-primary/10 rounded-lg" />
                        <div className="grid grid-cols-2 gap-4">
                           <div className="h-20 bg-primary/10 rounded-xl" />
                           <div className="h-20 bg-primary/10 rounded-xl" />
                        </div>
                     </motion.div>
                   ) : isSimulating && (
                     <motion.div key="loader" className="h-full flex items-center justify-center">
                        <Database className="h-8 w-8 text-primary/30 animate-pulse" />
                     </motion.div>
                   )}
                 </AnimatePresence>
              </div>
           </div>

           {/* Slot C: Team */}
           <div className="h-1/3 flex flex-col gap-4">
              <div className="flex items-center gap-2 px-2">
                 <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                 <span className="text-[9px] font-black text-muted-foreground uppercase">@team</span>
              </div>
              <div className="flex-1 rounded-2xl border-2 border-dashed border-emerald-500/20 bg-emerald-500/5 p-4 flex items-center gap-4 overflow-hidden">
                 <AnimatePresence mode="wait">
                   {stages.team ? (
                     <motion.div 
                       key="content"
                       initial={{ x: -20, opacity: 0 }}
                       animate={{ x: 0, opacity: 1 }}
                       className="flex -space-x-2"
                     >
                        {[1,2,3].map(i => (
                          <div key={i} className="h-8 w-8 rounded-full border-2 border-background bg-emerald-500/20 flex items-center justify-center">
                             <Users className="h-4 w-4 text-emerald-600" />
                          </div>
                        ))}
                     </motion.div>
                   ) : isSimulating && (
                     <motion.div key="loader" className="flex items-center gap-2">
                        <Loader2 className="h-3 w-3 animate-spin text-emerald-400" />
                        <span className="text-[8px] font-bold text-emerald-400 uppercase">Loading Team...</span>
                     </motion.div>
                   )}
                 </AnimatePresence>
              </div>
           </div>
        </div>

      </div>

      <div className="mt-8 p-4 bg-muted/30 border border-border rounded-2xl text-center">
         <p className="text-xs text-muted-foreground leading-relaxed italic">
            <strong>Key takeaway:</strong> Parallel slots render simultaneously but load at their own pace. Notice how "Analytics" can finish while "Team" is still loading.
         </p>
      </div>
    </div>
  )
}
