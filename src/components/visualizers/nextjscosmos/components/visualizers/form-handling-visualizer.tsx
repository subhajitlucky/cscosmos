"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Play, Server, MousePointer2, Database, Send, CheckCircle2, Loader2, ShieldCheck, Mail, User, Terminal } from "lucide-react"
import { Button } from "@/components/visualizers/nextjscosmos/components/ui/button"

export function FormHandlingVisualizer() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'processing' | 'complete'>('idle')
  const [jsEnabled, setJsEnabled] = useState(true)

  const runSimulation = async () => {
    setStatus('submitting')
    await new Promise(r => setTimeout(r, 1000))
    setStatus('processing')
    await new Promise(r => setTimeout(r, 1500))
    setStatus('complete')
  }

  return (
    <div className="flex flex-col h-full p-4 md:p-8 bg-grid-premium">
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-1">
          <h3 className="text-lg font-bold tracking-tight">Modern Form Architecture</h3>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Progressive Enhancement & FormData</p>
        </div>
        <div className="flex bg-muted/50 p-1 rounded-xl border border-border">
          <button 
            onClick={() => setJsEnabled(true)}
            className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase transition-all ${jsEnabled ? 'bg-background shadow-sm text-primary' : 'text-muted-foreground'}`}
          >
            JS Enabled
          </button>
          <button 
            onClick={() => setJsEnabled(false)}
            className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase transition-all ${!jsEnabled ? 'bg-background shadow-sm text-primary' : 'text-muted-foreground'}`}
          >
            No JS (Native)
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-8">
        <div className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative">
          
          {/* Client Form */}
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 text-[10px] font-black uppercase tracking-tighter border border-blue-500/20">
               {jsEnabled ? 'React Form (Hydrated)' : 'HTML Form (Native)'}
            </div>
            <div className="w-full max-w-[280px] p-6 rounded-[2rem] border-2 border-border bg-background shadow-xl space-y-4">
               <div className="space-y-2">
                  <div className="flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-lg border border-border">
                     <User className="h-3.5 w-3.5 text-muted-foreground" />
                     <div className="h-2 w-20 bg-muted rounded" />
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-lg border border-border">
                     <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                     <div className="h-2 w-32 bg-muted rounded" />
                  </div>
               </div>
               <Button 
                 onClick={runSimulation} 
                 disabled={status !== 'idle'} 
                 className="w-full rounded-xl bg-primary shadow-lg shadow-primary/20 h-10 text-[11px] font-bold uppercase tracking-widest"
               >
                 {status === 'complete' ? 'Success!' : 'Submit to Action'}
               </Button>
            </div>
          </div>

          {/* Server Process */}
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-[10px] font-black uppercase tracking-tighter border border-emerald-500/20">
               Server-Side Handler
            </div>
            <motion.div 
              animate={{ 
                borderColor: status === 'processing' ? 'var(--emerald-500)' : 'rgba(0,0,0,0.1)',
                scale: status === 'processing' ? 1.02 : 1
              }}
              className="w-full max-w-[280px] p-6 rounded-[2rem] border-2 bg-background shadow-2xl flex flex-col gap-4 relative overflow-hidden"
            >
               <div className="flex items-center justify-between border-b border-border pb-3">
                  <Terminal className="h-4 w-4 text-emerald-500" />
                  <span className="text-[9px] font-mono text-muted-foreground">fn: handleContact()</span>
               </div>
               
               <div className="space-y-2">
                  <AnimatePresence mode="wait">
                    {status === 'processing' ? (
                      <motion.div key="parsing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
                         <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                            <span className="text-[10px] font-mono text-emerald-600">Parsing FormData...</span>
                         </div>
                         <div className="ml-5 space-y-1">
                            <div className="h-1 w-full bg-emerald-100 rounded" />
                            <div className="h-1 w-3/4 bg-emerald-100 rounded" />
                         </div>
                      </motion.div>
                    ) : status === 'complete' ? (
                      <motion.div key="persisted" initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="flex flex-col items-center py-2 gap-2">
                         <ShieldCheck className="h-8 w-8 text-emerald-500" />
                         <span className="text-[10px] font-black text-emerald-600 uppercase">Data Persisted</span>
                      </motion.div>
                    ) : (
                      <div className="py-4 flex flex-col items-center opacity-20">
                         <Database className="h-8 w-8" />
                         <span className="text-[9px] font-bold">Waiting for stream...</span>
                      </div>
                    )}
                  </AnimatePresence>
               </div>
            </motion.div>
          </div>

          {/* Data Packet Animation */}
          {status === 'submitting' && (
            <motion.div 
              initial={{ left: '30%', top: '50%' }}
              animate={{ left: '60%' }}
              className="absolute z-30 p-2 bg-primary text-white rounded-lg shadow-2xl flex items-center gap-2"
            >
               <Send className="h-3 w-3" />
               <span className="text-[8px] font-black uppercase">FormData</span>
            </motion.div>
          )}
        </div>

        <div className="max-w-md w-full bg-background border border-border p-6 rounded-[2rem] shadow-sm text-center">
           <AnimatePresence mode="wait">
             <motion.p 
               key={status + jsEnabled.toString()}
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="text-xs text-muted-foreground leading-relaxed"
             >
               {!jsEnabled && status === 'idle' && "Native Mode: The form will work even if the user has disabled JavaScript or it's still loading. This is Progressive Enhancement."}
               {jsEnabled && status === 'idle' && "Hydrated Mode: React will handle the submission, allowing for smooth loading states and client-side validation."}
               {status === 'submitting' && "Next.js captures the native 'FormData' object and transmits it securely to your server action."}
               {status === 'processing' && "On the server, your function receives the FormData. You can validate, authorize, and save to a DB here."}
               {status === 'complete' && "Success! The server has processed the form and can now redirect or show a success message."}
             </motion.p>
           </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
