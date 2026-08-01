"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MousePointer2, Zap, CloudIcon, Monitor, Play, RotateCcw } from "lucide-react"
import { Button } from "@/components/visualizers/nextjscosmos/components/ui/button"

export function HydrationVisualizer() {
  const [status, setStatus] = useState<'static' | 'loading' | 'active'>('static')

  const startHydration = () => {
    setStatus('loading')
    setTimeout(() => setStatus('active'), 2500)
  }

  return (
    <div className="flex flex-col h-full p-4 md:p-8 bg-grid-premium">
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-1">
          <h3 className="text-lg font-bold tracking-tight">Hydration Simulation</h3>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">From static HTML to interactive React</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={startHydration} disabled={status !== 'static'} size="sm" className="gap-2 rounded-full">
            <Play className="h-4 w-4" /> Start Hydration
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setStatus('static')}
            className="rounded-full"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full max-w-2xl relative">
          
          {/* Server Output */}
          <div className="flex flex-col items-center gap-4">
            <div className="p-4 bg-muted/50 rounded-2xl border-2 border-dashed border-muted-foreground/20 flex flex-col items-center gap-4 w-full">
              <CloudIcon className="h-8 w-8 text-muted-foreground" />
              <div className="text-center">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Server HTML</p>
                <p className="text-[10px] text-muted-foreground/60">Read-only Snapshot</p>
              </div>
            </div>
            
            <div className={`p-6 rounded-2xl border-2 transition-all duration-500 w-full flex flex-col items-center gap-4 ${
               status === 'static' ? 'border-amber-500/50 bg-amber-500/5' : 'border-muted grayscale opacity-30'
            }`}>
               <Button disabled className="w-full bg-amber-500/20 text-amber-600 border-amber-500/30 cursor-not-allowed">
                 Non-Interactive
               </Button>
               <p className="text-[10px] font-mono text-amber-700/60 uppercase">Event listeners: NULL</p>
            </div>
          </div>

          {/* Browser Runtime */}
          <div className="flex flex-col items-center gap-4">
            <div className="p-4 bg-primary/5 rounded-2xl border-2 border-primary/20 flex flex-col items-center gap-4 w-full">
              <Monitor className="h-8 w-8 text-primary" />
              <div className="text-center">
                <p className="text-xs font-bold uppercase tracking-widest text-primary">Browser JS</p>
                <p className="text-[10px] text-primary/60">React Runtime</p>
              </div>
            </div>

            <div className={`p-6 rounded-2xl border-2 transition-all duration-700 w-full flex flex-col items-center gap-4 ${
               status === 'active' ? 'border-emerald-500 bg-emerald-500/5 shadow-xl scale-105' : 'border-muted grayscale opacity-30'
            }`}>
               <Button className={`w-full transition-all duration-500 ${status === 'active' ? 'bg-emerald-500' : 'bg-muted text-muted-foreground'}`}>
                 {status === 'active' ? 'Interactive!' : 'Waiting...'}
               </Button>
               <AnimatePresence>
                 {status === 'active' && (
                   <motion.div 
                     initial={{ opacity: 0, scale: 0 }}
                     animate={{ opacity: 1, scale: 1 }}
                     className="flex items-center gap-2 text-emerald-600 text-[10px] font-bold uppercase"
                   >
                     <Zap className="h-3 w-3 fill-current" /> Event Listeners: ATTACHED
                   </motion.div>
                 )}
               </AnimatePresence>
            </div>
          </div>

          {/* Connection Line */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:block">
            <div className="h-px w-12 bg-border relative">
              {status === 'loading' && (
                <motion.div 
                   animate={{ left: ["0%", "100%"] }}
                   transition={{ repeat: Infinity, duration: 1 }}
                   className="absolute -top-1 h-2 w-2 rounded-full bg-primary shadow-[0_0_10px_rgba(var(--primary),0.5)]"
                />
              )}
            </div>
          </div>
        </div>

        <div className="max-w-md text-center">
          <AnimatePresence mode="wait">
            <motion.p 
              key={status}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-sm text-muted-foreground leading-relaxed italic"
            >
              {status === 'static' && "Initial HTML is visible but 'dead'. Clicking buttons does nothing yet."}
              {status === 'loading' && "React is downloading and comparing the server HTML with its component tree..."}
              {status === 'active' && "Hydration complete! React has attached event listeners and the page is now alive."}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
