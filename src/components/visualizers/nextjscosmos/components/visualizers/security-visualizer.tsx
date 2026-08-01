"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ShieldCheck, ShieldAlert, Lock, ArrowRight, Server, Monitor, FileKey, XCircle } from "lucide-react"
import { Button } from "@/components/visualizers/nextjscosmos/components/ui/button"

export function SecurityVisualizer() {
  const [attemptExport, setAttemptExport] = useState(false)

  const simulateLeak = () => {
    setAttemptExport(true)
    setTimeout(() => setAttemptExport(false), 3000)
  }

  return (
    <div className="flex flex-col h-full p-4 md:p-8 bg-grid-premium">
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-1">
          <h3 className="text-lg font-bold tracking-tight">Zero-Leak Simulation</h3>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Enforcing Server-Only Boundaries</p>
        </div>
        <Button 
          variant="destructive" 
          size="sm" 
          onClick={simulateLeak}
          disabled={attemptExport}
          className="rounded-full px-6 cursor-pointer"
        >
          <FileKey className="h-4 w-4" /> Try Importing Secret
        </Button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-12">
        <div className="w-full max-w-2xl grid grid-cols-2 gap-0 relative border-4 border-dashed border-primary/20 rounded-[3rem] overflow-hidden bg-card/50 backdrop-blur-sm">
          
          {/* Server Territory */}
          <div className="p-12 flex flex-col items-center gap-6 relative">
            <div className="p-4 bg-primary/10 rounded-2xl text-primary relative">
              <Server className="h-10 w-10" />
              <div className="absolute -top-2 -right-2 h-6 w-6 bg-primary rounded-full flex items-center justify-center border-2 border-background">
                 <ShieldCheck className="h-3 w-3 text-white" />
              </div>
            </div>
            
            <motion.div 
              animate={attemptExport ? { x: [0, 50, 0] } : {}}
              transition={{ duration: 0.5 }}
              className="p-4 rounded-xl bg-background dark:bg-zinc-900 border-2 border-primary/30 flex items-center gap-3 shadow-xl z-10"
            >
               <FileKey className="h-5 w-5 text-amber-500" />
               <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase text-primary">DB_PASSWORD</span>
                  <span className="text-[8px] font-mono text-muted-foreground">"********"</span>
               </div>
            </motion.div>
            
            <div className="p-2 px-3 bg-primary text-primary-foreground text-[8px] font-black uppercase tracking-widest rounded-lg shadow-lg shadow-primary/20">
               'server-only' active
            </div>
          </div>

          {/* Client Territory */}
          <div className="p-12 flex flex-col items-center gap-6 border-l-2 border-primary/20 bg-muted/10 dark:bg-white/5">
            <div className="p-4 bg-blue-500/10 rounded-2xl text-blue-500">
              <Monitor className="h-10 w-10" />
            </div>
            <div className="text-center">
              <p className="font-black uppercase tracking-widest text-blue-500 text-sm mb-1">Client Bundle</p>
              <p className="text-[10px] text-muted-foreground italic">Publicly viewable</p>
            </div>
          </div>

          {/* Security Guard Overlay */}
          <AnimatePresence>
            {attemptExport && (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-full px-8"
              >
                 <div className="bg-red-600 text-white p-6 rounded-[2rem] shadow-2xl flex flex-col items-center gap-4 border-4 border-white/20">
                    <XCircle className="h-12 w-12" />
                    <div className="text-center">
                       <h4 className="font-black uppercase tracking-tight">Leak Blocked!</h4>
                       <div className="mt-4 bg-black/60 rounded-xl p-3 font-mono text-[8px] text-left border border-white/10 w-full overflow-hidden">
                          <p className="text-red-300">Error: This module cannot be imported from a Client Component.</p>
                          <p className="opacity-50 mt-1">at db-secret.ts (src/lib/db-secret.ts:1:1)</p>
                          <p className="opacity-50">at Page (src/app/client-page.tsx:4:1)</p>
                       </div>
                    </div>
                 </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="max-w-md w-full bg-card border border-border p-6 rounded-[2rem] shadow-sm text-center">
           <p className="text-xs text-muted-foreground leading-relaxed italic">
             <strong>Safe by Default:</strong> By using the <code>server-only</code> package, you ensure that 
             internal logic or sensitive keys can <span className="text-primary font-bold mx-1">never</span> 
             be accidentally imported into a Client Component.
           </p>
        </div>
      </div>
    </div>
  )
}
