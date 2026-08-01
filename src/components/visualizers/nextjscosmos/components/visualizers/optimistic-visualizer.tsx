"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Play, Heart, Cloud, Timer, CheckCircle2, Loader2, ArrowUpRight } from "lucide-react"
import { Button } from "@/components/visualizers/nextjscosmos/components/ui/button"

export function OptimisticVisualizer() {
  const [likes, setLikes] = useState(10)
  const [isSyncing, setIsSyncing] = useState(false)
  const [showReal, setShowReal] = useState(false)

  const handleLike = async () => {
    // 1. Instant UI update (Optimistic)
    setLikes(prev => prev + 1)
    setIsSyncing(true)
    
    // 2. Slow server update
    await new Promise(r => setTimeout(r, 2500))
    setIsSyncing(false)
    setShowReal(true)
    setTimeout(() => setShowReal(false), 2000)
  }

  return (
    <div className="flex flex-col h-full p-4 md:p-8 bg-grid-premium">
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-1">
          <h3 className="text-lg font-bold tracking-tight">Optimistic UI Simulation</h3>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Instant feedback vs. Server truth</p>
        </div>
        <Button 
          onClick={handleLike} 
          disabled={isSyncing}
          size="sm" 
          className="rounded-full shadow-lg bg-rose-500 hover:bg-rose-600 gap-2"
        >
          <Heart className={`h-4 w-4 ${isSyncing ? '' : 'fill-current'}`} /> Like Post
        </Button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-8">
        <div className="w-full max-w-2xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center relative">
          
          {/* User Experience (The "Lie") */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between px-2">
               <span className="text-[10px] font-black uppercase text-rose-600">The User Sees (Optimistic)</span>
               <AnimatePresence>
                 {isSyncing && (
                   <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[8px] font-bold text-muted-foreground italic flex items-center gap-1">
                      <Timer className="h-2 w-2" /> Syncing...
                   </motion.span>
                 )}
               </AnimatePresence>
            </div>
            <div className="p-8 rounded-[2.5rem] border-4 border-rose-500/20 bg-background shadow-2xl flex flex-col items-center gap-4 relative overflow-hidden">
               <motion.div 
                 key={likes}
                 initial={{ scale: 1.5, opacity: 0 }}
                 animate={{ scale: 1, opacity: 1 }}
                 className="text-6xl font-black text-rose-500"
               >
                 {likes}
               </motion.div>
               <span className="text-xs font-bold text-muted-foreground uppercase">Likes</span>
               
               {isSyncing && (
                 <motion.div 
                   className="absolute bottom-0 left-0 h-1 bg-rose-500"
                   initial={{ width: 0 }}
                   animate={{ width: "100%" }}
                   transition={{ duration: 2.5, ease: "linear" }}
                 />
               )}
            </div>
          </div>

          {/* Server Reality (The "Truth") */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 px-2">
               <span className="text-[10px] font-black uppercase text-muted-foreground">The Server Knows (Truth)</span>
            </div>
            <div className="p-8 rounded-[2.5rem] border-4 border-dashed border-primary/10 bg-muted/30 flex flex-col items-center gap-4 opacity-60">
               <div className="text-4xl font-black text-muted-foreground">
                 {isSyncing ? likes - 1 : likes}
               </div>
               <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase">
                  {isSyncing ? <Loader2 className="h-3 w-3 animate-spin" /> : <CheckCircle2 className="h-3 w-3 text-emerald-500" />}
                  {isSyncing ? "Updating DB..." : "In Sync"}
               </div>
            </div>
          </div>

          {/* Connection Arrow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:block">
             <ArrowUpRight className="h-8 w-8 text-primary/20 rotate-45" />
          </div>
        </div>

        <AnimatePresence>
          {showReal && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-3 text-emerald-700"
            >
               <CheckCircle2 className="h-5 w-5" />
               <p className="text-xs font-bold uppercase tracking-wide">Server has confirmed the update!</p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="max-w-md w-full bg-background border border-border p-6 rounded-[2rem] shadow-sm text-center">
           <p className="text-xs text-muted-foreground leading-relaxed">
             <strong>The Logic:</strong> <code>useOptimistic</code> allows you to update the UI 
             <span className="text-rose-500 font-bold mx-1">instantly</span> while the real server 
             action happens in the background. If the server fails, React automatically rolls 
             the UI back to the correct state.
           </p>
        </div>
      </div>
    </div>
  )
}
