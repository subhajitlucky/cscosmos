"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { AlertTriangle, RefreshCcw, ShieldAlert, CheckCircle2, Play } from "lucide-react"
import { Button } from "@/components/visualizers/nextjscosmos/components/ui/button"

export function ErrorVisualizer() {
  const [status, setStatus] = useState<'healthy' | 'error'>('healthy')

  return (
    <div className="flex flex-col h-full p-4 md:p-8 bg-grid-premium">
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-1">
          <h3 className="text-lg font-bold tracking-tight">Error Boundary Simulation</h3>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Catch and recover from runtime errors</p>
        </div>
        <Button 
          variant={status === 'healthy' ? "destructive" : "default"}
          size="sm" 
          onClick={() => setStatus(status === 'healthy' ? 'error' : 'healthy')}
          className="rounded-full gap-2 shadow-lg"
        >
          {status === 'healthy' ? (
            <> <AlertTriangle className="h-4 w-4" /> Trigger Error </>
          ) : (
            <> <RefreshCcw className="h-4 w-4" /> Reset Boundary </>
          )}
        </Button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="w-full max-w-md relative p-8 rounded-[3rem] border-4 border-dashed border-primary/10 bg-background/50">
          
          <AnimatePresence mode="wait">
            {status === 'healthy' ? (
              <motion.div 
                key="healthy"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                className="flex flex-col items-center gap-6"
              >
                <div className="h-24 w-24 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 border-2 border-emerald-500/20">
                   <CheckCircle2 className="h-12 w-12" />
                </div>
                <div className="text-center space-y-2">
                   <h4 className="font-bold text-xl">System Healthy</h4>
                   <p className="text-sm text-muted-foreground leading-relaxed">
                     The component is rendering correctly. Data is flowing through the tree.
                   </p>
                </div>
                <div className="w-full h-2 bg-emerald-500/20 rounded-full overflow-hidden">
                   <motion.div 
                     animate={{ x: ["-100%", "100%"] }}
                     transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                     className="h-full w-1/3 bg-emerald-500/40"
                   />
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="error"
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex flex-col items-center gap-6"
              >
                <div className="h-24 w-24 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 border-2 border-red-500/20">
                   <ShieldAlert className="h-12 w-12" />
                </div>
                <div className="text-center space-y-2">
                   <h4 className="font-black text-xl text-red-600 uppercase tracking-tight">Boundary Triggered!</h4>
                   <p className="text-sm text-red-700/70 font-medium leading-relaxed">
                     An error was caught in <code>page.tsx</code>. 
                     The <code>error.tsx</code> fallback is now active.
                   </p>
                </div>
                <Button 
                  onClick={() => setStatus('healthy')}
                  className="bg-red-600 hover:bg-red-700 text-white rounded-xl w-full py-6"
                >
                  Try to Recover
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="absolute -top-4 -left-4 p-2 px-4 rounded-xl bg-background border-2 border-primary/20 text-[10px] font-bold uppercase tracking-widest text-primary shadow-xl">
             Next.js Shell
          </div>
        </div>
      </div>

      <div className="mt-8 p-4 bg-red-500/5 border border-red-500/10 rounded-2xl">
         <p className="text-xs text-center text-muted-foreground leading-relaxed italic">
            <strong>Key Concept:</strong> Next.js error boundaries allow specific segments to fail without crashing the entire app shell or navigation.
         </p>
      </div>
    </div>
  )
}
