"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Lock, Unlock, ArrowRight, Server, Monitor, FileCode, AlertTriangle } from "lucide-react"
import { Button } from "@/components/visualizers/nextjscosmos/components/ui/button"

export function BoundaryVisualizer() {
  const [activeSide, setActiveSide] = useState<'server' | 'client' | null>(null)
  const [attemptImport, setAttemptImport] = useState(false)

  const simulateIllegalImport = () => {
    setAttemptImport(true)
    setTimeout(() => setAttemptImport(false), 2000)
  }

  return (
    <div className="flex flex-col h-full p-4 md:p-8 bg-grid-premium">
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-1">
          <h3 className="text-lg font-bold tracking-tight">The "One-Way Mirror" Gate</h3>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Architectural Boundary Rules</p>
        </div>
        <Button 
          variant="destructive" 
          size="sm" 
          onClick={simulateIllegalImport}
          disabled={attemptImport}
          className="rounded-full gap-2 shadow-lg"
        >
          <AlertTriangle className="h-4 w-4" /> Try Illegal Import
        </Button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-12">
        <div className="w-full max-w-2xl grid grid-cols-2 gap-0 relative border-4 border-dashed border-primary/10 rounded-[3rem] overflow-hidden bg-background/50">
          
          {/* Server Territory */}
          <motion.div 
            onHoverStart={() => setActiveSide('server')}
            onHoverEnd={() => setActiveSide(null)}
            className={`p-12 flex flex-col items-center gap-6 transition-colors duration-500 ${
              activeSide === 'server' ? 'bg-primary/5' : ''
            }`}
          >
            <div className="p-4 bg-primary/10 rounded-2xl text-primary">
              <Server className="h-10 w-10" />
            </div>
            <div className="text-center">
              <p className="font-black uppercase tracking-widest text-primary text-sm mb-1">Server</p>
              <p className="text-[10px] text-muted-foreground">Secure & Private</p>
            </div>
            
            <div className="w-full space-y-2 mt-4">
               <div className="h-8 bg-background border border-primary/20 rounded-lg flex items-center px-3 gap-2">
                  <FileCode className="h-3 w-3 text-primary" />
                  <span className="text-[10px] font-mono">page.tsx</span>
               </div>
               <motion.div 
                 animate={attemptImport ? { x: [0, -10, 10, -10, 0] } : {}}
                 className="h-8 bg-background border border-primary/20 rounded-lg flex items-center px-3 gap-2"
               >
                  <FileCode className="h-3 w-3 text-primary" />
                  <span className="text-[10px] font-mono">db-secret.ts</span>
               </motion.div>
            </div>
          </motion.div>

          {/* Client Territory */}
          <motion.div 
            onHoverStart={() => setActiveSide('client')}
            onHoverEnd={() => setActiveSide(null)}
            className={`p-12 flex flex-col items-center gap-6 border-l-2 border-primary/20 transition-colors duration-500 ${
              activeSide === 'client' ? 'bg-blue-500/5' : ''
            }`}
          >
            <div className="p-4 bg-blue-500/10 rounded-2xl text-blue-500">
              <Monitor className="h-10 w-10" />
            </div>
            <div className="text-center">
              <p className="font-black uppercase tracking-widest text-blue-500 text-sm mb-1">Client</p>
              <p className="text-[10px] text-muted-foreground">Public & Interactive</p>
            </div>

            <div className="w-full space-y-2 mt-4">
               <div className="h-8 bg-background border border-blue-500/20 rounded-lg flex items-center px-3 gap-2">
                  <FileCode className="h-3 w-3 text-blue-500" />
                  <span className="text-[10px] font-mono">button.tsx</span>
               </div>
               <div className="h-8 bg-background border border-blue-500/20 rounded-lg flex items-center px-3 gap-2">
                  <FileCode className="h-3 w-3 text-blue-500" />
                  <span className="text-[10px] font-mono">chart.tsx</span>
               </div>
            </div>
          </motion.div>

          {/* Boundary Line Indicator */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-full flex flex-col items-center justify-between py-8 pointer-events-none">
             <div className="h-8 w-8 bg-background border-2 border-primary/20 rounded-full flex items-center justify-center shadow-xl">
                <Lock className="h-3 w-3 text-primary" />
             </div>
             <div className="h-8 w-8 bg-background border-2 border-primary/20 rounded-full flex items-center justify-center shadow-xl">
                <Unlock className="h-3 w-3 text-emerald-500" />
             </div>
          </div>

          {/* Illegal Import Warning Overlay */}
          <AnimatePresence>
            {attemptImport && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-red-500/90 backdrop-blur-md z-20 flex flex-col items-center justify-center p-8 text-white text-center"
              >
                 <motion.div
                   animate={{ scale: [1, 1.2, 1] }}
                   transition={{ repeat: Infinity, duration: 0.5 }}
                 >
                   <AlertTriangle className="h-16 w-16 mb-4" />
                 </motion.div>
                 <h4 className="text-xl font-black uppercase mb-2">Build Error!</h4>
                 <p className="text-sm font-medium leading-relaxed">
                   "You're attempting to import a Server-only module into a Client Component. This is a security violation and will break the build."
                 </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="max-w-md w-full bg-background border border-border p-6 rounded-[2rem] shadow-sm text-center">
           <p className="text-xs text-muted-foreground leading-relaxed">
             {activeSide === 'server' && "Server Components can IMPORT Client Components. The boundary acts as an export point."}
             {activeSide === 'client' && "Client Components CANNOT import Server Components. This protects your secrets and reduces bundle size."}
             {!activeSide && !attemptImport && "Hover over a side or try an 'Illegal Import' to see the boundary rules in action."}
           </p>
        </div>
      </div>
    </div>
  )
}
