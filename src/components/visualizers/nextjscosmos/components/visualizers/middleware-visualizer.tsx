"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Play, ShieldCheck, ShieldAlert, ArrowRight, Server, Globe, Lock, Unlock } from "lucide-react"
import { Button } from "@/components/visualizers/nextjscosmos/components/ui/button"

export function MiddlewareVisualizer() {
  const [status, setStatus] = useState<'idle' | 'intercepting' | 'allowed' | 'redirected'>('idle')

  const simulateRequest = async (auth: boolean) => {
    setStatus('intercepting')
    await new Promise(r => setTimeout(r, 1500))
    setStatus(auth ? 'allowed' : 'redirected')
  }

  return (
    <div className="flex flex-col h-full p-4 md:p-8 bg-grid-premium">
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-1">
          <h3 className="text-lg font-bold tracking-tight">Edge Middleware Simulation</h3>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Gatekeeping at the Edge</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => simulateRequest(true)} disabled={status === 'intercepting'} size="sm" className="rounded-full bg-emerald-600 hover:bg-emerald-700">
            Auth Valid
          </Button>
          <Button onClick={() => simulateRequest(false)} disabled={status === 'intercepting'} size="sm" variant="destructive" className="rounded-full">
            No Auth
          </Button>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-12">
        <div className="w-full max-w-2xl grid grid-cols-3 gap-0 items-center relative">
          
          {/* User Request */}
          <div className="flex flex-col items-center gap-4">
            <div className="w-20 h-20 rounded-2xl border-2 bg-background flex items-center justify-center shadow-xl">
              <Globe className="text-muted-foreground" />
            </div>
            <span className="text-[10px] font-bold uppercase">Public Request</span>
          </div>

          {/* Middleware Barrier */}
          <div className="flex flex-col items-center gap-4 relative">
            <motion.div 
              animate={{ 
                borderColor: status === 'intercepting' ? 'var(--primary)' : 'rgba(0,0,0,0.1)',
                backgroundColor: status === 'intercepting' ? 'oklch(var(--primary) / 0.05)' : 'transparent'
              }}
              className="w-24 h-40 rounded-[2rem] border-4 border-dashed bg-background flex flex-col items-center justify-center gap-4 shadow-2xl relative"
            >
              <div className="absolute -top-3 px-2 bg-background text-[8px] font-black text-primary uppercase tracking-widest border border-primary/20 rounded">
                THE EDGE
              </div>
              <AnimatePresence mode="wait">
                {status === 'intercepting' ? (
                  <motion.div key="lock" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                    <Lock className="h-8 w-8 text-primary animate-pulse" />
                  </motion.div>
                ) : status === 'allowed' ? (
                  <motion.div key="check" initial={{ scale: 0 }} animate={{ scale: 1 }}>
                    <ShieldCheck className="h-8 w-8 text-emerald-500" />
                  </motion.div>
                ) : status === 'redirected' ? (
                  <motion.div key="alert" initial={{ scale: 0 }} animate={{ scale: 1 }}>
                    <ShieldAlert className="h-8 w-8 text-red-500" />
                  </motion.div>
                ) : (
                  <div className="h-8 w-8 rounded-full border-2 border-muted" />
                )}
              </AnimatePresence>
              <span className="text-[9px] font-black text-center px-2">MIDDLEWARE.TS</span>
            </motion.div>
          </div>

          {/* Destination (Server) */}
          <div className="flex flex-col items-center gap-4">
            <motion.div 
              animate={{ 
                opacity: status === 'allowed' ? 1 : 0.3,
                scale: status === 'allowed' ? 1 : 0.9
              }}
              className="w-20 h-20 rounded-2xl border-2 bg-background flex items-center justify-center shadow-xl"
            >
              <Server className={status === 'allowed' ? 'text-primary' : 'text-muted-foreground'} />
            </motion.div>
            <span className="text-[10px] font-bold uppercase">Internal Server</span>
          </div>

          {/* Connection Lines & Particles */}
          <div className="absolute top-1/2 left-[20%] w-[15%] h-0.5 bg-muted" />
          <div className="absolute top-1/2 right-[20%] w-[15%] h-0.5 bg-muted" />

          {/* Animated Request Particle */}
          {status === 'intercepting' && (
            <motion.div 
              initial={{ left: '20%', top: '50%' }}
              animate={{ left: '45%' }}
              className="absolute h-2 w-2 bg-primary rounded-full shadow-[0_0_10px_rgba(var(--primary),0.5)]"
            />
          )}

          {/* Result Particle: Allowed */}
          {status === 'allowed' && (
            <motion.div 
              initial={{ left: '55%', top: '50%' }}
              animate={{ left: '80%' }}
              className="absolute h-2 w-2 bg-emerald-500 rounded-full"
            />
          )}

          {/* Result Particle: Redirected */}
          <AnimatePresence>
            {status === 'redirected' && (
              <motion.div 
                initial={{ left: '50%', top: '50%', opacity: 1 }}
                animate={{ left: '50%', top: '80%', opacity: 0 }}
                className="absolute flex flex-col items-center gap-1"
              >
                 <div className="h-2 w-2 bg-red-500 rounded-full" />
                 <span className="text-[8px] font-bold text-red-500 whitespace-nowrap">REDIRECT TO /LOGIN</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="max-w-md w-full bg-background border border-border p-6 rounded-[2rem] shadow-sm text-center">
           <p className="text-xs text-muted-foreground leading-relaxed">
             {status === 'idle' && "Click a button to simulate a user request passing through Middleware."}
             {status === 'intercepting' && "Middleware is inspecting the request (cookies, headers, paths) before it hits the server."}
             {status === 'allowed' && "Authentication valid! The request is forwarded to the server to render the page."}
             {status === 'redirected' && "Authentication failed! Middleware intercepts the request and forces a redirect to /login."}
           </p>
        </div>
      </div>
    </div>
  )
}
