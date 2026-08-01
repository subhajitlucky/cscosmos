"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Play, RotateCcw, Layout, FileCode, ArrowRight, RefreshCcw, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/visualizers/nextjscosmos/components/ui/button"

export function LayoutTemplateVisualizer() {
  const [activeTab, setActiveTab] = useState<'page1' | 'page2'>('page1')
  const [layoutCount, setLayoutCount] = useState(0)
  const [templateCount, setTemplateCount] = useState(0)

  const navigate = (page: 'page1' | 'page2') => {
    setActiveTab(page)
    // Template always resets, Layout stays
    // In our simulation, we manually reset templateCount to show the logic
    setTemplateCount(0) 
  }

  return (
    <div className="flex flex-col h-full p-4 md:p-8 bg-grid-premium">
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-1">
          <h3 className="text-lg font-bold tracking-tight">Layout vs Template</h3>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">State preservation during navigation</p>
        </div>
        <div className="flex bg-muted/50 p-1 rounded-xl border border-border">
          <button 
            onClick={() => navigate('page1')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'page1' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground'}`}
          >
            Page 1
          </button>
          <button 
            onClick={() => navigate('page2')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'page2' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground'}`}
          >
            Page 2
          </button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        
        {/* Layout Side */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-[10px] font-black uppercase tracking-tighter w-fit border border-emerald-500/20">
             Persistent Boundary (Layout)
          </div>
          <div className="relative p-6 rounded-[2rem] border-2 border-emerald-500/30 bg-background shadow-xl flex flex-col items-center gap-6 overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500/20" />
             <div className="text-center">
                <p className="text-[10px] text-muted-foreground font-bold uppercase mb-2">Internal State</p>
                <span className="text-4xl font-black text-emerald-600">{layoutCount}</span>
             </div>
             <Button 
               variant="outline" 
               size="sm" 
               onClick={() => setLayoutCount(c => c + 1)}
               className="rounded-full border-emerald-500/20 hover:bg-emerald-500/5 text-emerald-700"
             >
               Increment State
             </Button>
             <div className="mt-4 p-3 bg-emerald-500/5 rounded-xl border border-emerald-500/10 text-[10px] text-emerald-800/70 font-medium text-center italic">
                "I stay mounted. My state survives navigation."
             </div>
          </div>
        </div>

        {/* Template Side */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 text-[10px] font-black uppercase tracking-tighter w-fit border border-amber-500/20">
             Resetting Boundary (Template)
          </div>
          <motion.div 
            key={activeTab}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative p-6 rounded-[2rem] border-2 border-amber-500/30 bg-background shadow-xl flex flex-col items-center gap-6 overflow-hidden"
          >
             <div className="absolute top-0 left-0 w-full h-1 bg-amber-500/20" />
             <div className="text-center">
                <p className="text-[10px] text-muted-foreground font-bold uppercase mb-2">Internal State</p>
                <span className="text-4xl font-black text-amber-600">{templateCount}</span>
             </div>
             <Button 
               variant="outline" 
               size="sm" 
               onClick={() => setTemplateCount(c => c + 1)}
               className="rounded-full border-amber-500/20 hover:bg-amber-500/5 text-amber-700"
             >
               Increment State
             </Button>
             <div className="mt-4 p-3 bg-amber-500/5 rounded-xl border border-amber-500/10 text-[10px] text-amber-800/70 font-medium text-center italic">
                <RefreshCcw className="h-3 w-3 inline mr-1 animate-spin" />
                "I unmount and remount on every navigation."
             </div>
          </motion.div>
        </div>

      </div>

      <div className="mt-8 p-4 bg-primary/5 border border-primary/10 rounded-2xl">
         <p className="text-xs text-center text-muted-foreground leading-relaxed">
            <strong>Simulation:</strong> Increment both counters, then switch tabs. Notice how the 
            <span className="text-emerald-600 font-bold mx-1">Layout</span> preserves its number, while the 
            <span className="text-amber-600 font-bold mx-1">Template</span> resets to zero.
         </p>
      </div>
    </div>
  )
}
