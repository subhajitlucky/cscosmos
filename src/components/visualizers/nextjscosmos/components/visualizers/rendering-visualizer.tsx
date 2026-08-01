"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Server, User, Globe, Clock, Zap, ArrowRight, Database, Play } from "lucide-react"
import { Button } from "@/components/visualizers/nextjscosmos/components/ui/button"

type RenderingMode = 'SSR' | 'SSG' | 'ISR' | 'HYDRATION'

interface RenderingVisualizerProps {
  initialMode?: RenderingMode
  title?: string
  description?: string
  steps?: string[]
}

export function RenderingVisualizer({ 
  initialMode = 'SSR', 
  title = "Strategy Simulation",
  steps: customSteps
}: RenderingVisualizerProps) {
  const [mode, setMode] = useState<RenderingMode>(initialMode)
  const [step, setStep] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  const defaultSteps = [
    "System Idle",
    "Request Initiated",
    "Processing Stream",
    "Optimizing Bundle",
    "Active Runtime"
  ]

  const steps = customSteps || defaultSteps

  const startAnimation = () => {
    setIsAnimating(true)
    setStep(1)
  }

  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => {
        if (step < steps.length - 1) {
          setStep(step + 1)
        } else {
          setIsAnimating(false)
        }
      }, 1200)
      return () => clearTimeout(timer)
    }
  }, [step, isAnimating, steps.length])

  return (
    <div className="flex flex-col h-full bg-grid-premium min-h-[600px] md:min-h-0">
      <div className="p-4 md:p-8 border-b bg-background/50 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
           <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
           <span className="text-xs font-bold uppercase tracking-widest">{title}</span>
        </div>
        <div className="flex bg-muted/50 p-1 rounded-xl border border-border w-full sm:w-auto overflow-x-auto">
          <button 
            onClick={() => { setMode('SSR'); setStep(0); setIsAnimating(false); }}
            className={`flex-1 sm:flex-none px-3 md:px-4 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${mode === 'SSR' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground'}`}
          >
            SSR
          </button>
          <button 
            onClick={() => { setMode('SSG'); setStep(0); setIsAnimating(false); }}
            className={`flex-1 sm:flex-none px-3 md:px-4 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${mode === 'SSG' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground'}`}
          >
            SSG
          </button>
          <button 
            onClick={() => { setMode('ISR'); setStep(0); setIsAnimating(false); }}
            className={`flex-1 sm:flex-none px-3 md:px-4 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${mode === 'ISR' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground'}`}
          >
            ISR
          </button>
        </div>
      </div>

      <div className="flex-1 p-6 md:p-12 flex flex-col items-center justify-center">
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 items-center relative">
          
          {/* Server Node */}
          <div className="flex flex-col items-center gap-4 md:gap-6">
            <motion.div 
              animate={{ 
                borderColor: step >= 2 && step < steps.length - 1 ? 'var(--primary)' : 'rgba(0,0,0,0.1)',
                backgroundColor: step >= 2 && step < steps.length - 1 ? 'oklch(var(--primary) / 0.05)' : 'transparent'
              }}
              className="w-24 h-24 md:w-32 md:h-32 rounded-[1.5rem] md:rounded-[2rem] border-2 flex flex-col items-center justify-center gap-2 relative shadow-2xl bg-background"
            >
              <Server className={`h-8 w-8 md:h-10 md:w-10 ${step >= 2 && step < steps.length - 1 ? 'text-primary' : 'text-muted-foreground'}`} />
              <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest">Compute</span>
              {(mode === 'SSG' || mode === 'ISR') && (
                <div className="absolute -top-2 -right-2 md:-top-3 md:-right-3 h-6 w-6 md:h-8 md:w-8 bg-amber-500 rounded-lg md:rounded-xl flex items-center justify-center text-white shadow-lg">
                  <Clock className="h-3 w-3 md:h-4 md:w-4" />
                </div>
              )}
            </motion.div>
            <div className="text-center">
              <p className="font-bold text-sm md:text-base">Next.js Server</p>
              <p className="text-[8px] md:text-[10px] text-muted-foreground uppercase tracking-wider">Edge Runtime</p>
            </div>
          </div>

          {/* Transfer Path */}
          <div className="flex flex-col items-center gap-4 py-4 md:py-10 relative">
            <div className="w-px h-12 md:w-full md:h-px bg-linear-to-b md:bg-linear-to-r from-transparent via-border to-transparent" />
            <AnimatePresence>
              {isAnimating && (
                <motion.div
                  initial={typeof window !== 'undefined' && window.innerWidth < 768 ? { top: "0%", opacity: 0 } : { left: "0%", opacity: 0 }}
                  animate={typeof window !== 'undefined' && window.innerWidth < 768 ? { top: "100%", opacity: 1 } : { left: "100%", opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 md:top-1/2 md:-translate-y-1/2 flex flex-col items-center gap-2"
                >
                   <div className="h-3 w-3 rounded-full bg-primary shadow-[0_0_15px_rgba(0,0,0,0.3)] dark:shadow-[0_0_15px_rgba(255,255,255,0.3)]" />
                   <span className="text-[8px] font-mono whitespace-nowrap bg-background border border-border px-2 py-0.5 rounded text-muted-foreground">
                     {mode === 'SSG' || mode === 'ISR' ? 'STATIC HTML' : 'DYNAMIC HTML'}
                   </span>
                </motion.div>
              )}
            </AnimatePresence>
            <div className="text-center space-y-2 mt-2 md:mt-4 min-h-[1.5rem]">
              <span className="text-[8px] md:text-[10px] font-mono text-muted-foreground uppercase tracking-[0.2em]">
                 {steps[step]}
              </span>
            </div>
          </div>

          {/* Client Node */}
          <div className="flex flex-col items-center gap-4 md:gap-6">
            <motion.div 
              animate={{ 
                borderColor: step === steps.length - 1 ? 'var(--primary)' : 'rgba(0,0,0,0.1)',
                backgroundColor: step === steps.length - 1 ? 'oklch(var(--primary) / 0.05)' : 'transparent'
              }}
              className="w-24 h-24 md:w-32 md:h-32 rounded-[1.5rem] md:rounded-[2rem] border-2 flex flex-col items-center justify-center gap-2 relative shadow-2xl bg-background"
            >
              <Globe className={`h-8 w-8 md:h-10 md:w-10 ${step === steps.length - 1 ? 'text-primary' : 'text-muted-foreground'}`} />
              <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest">Browser</span>
              {mode === 'HYDRATION' && step === steps.length - 1 && (
                <motion.div 
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity }}
                  className="absolute -top-2 -right-2 md:-top-3 md:-right-3 h-6 w-6 md:h-8 md:w-8 bg-emerald-500 rounded-lg md:rounded-xl flex items-center justify-center text-white shadow-lg"
                >
                  <Zap className="h-3 w-3 md:h-4 md:w-4" />
                </motion.div>
              )}
            </motion.div>
            <div className="text-center">
              <p className="font-bold text-sm md:text-base">Client Runtime</p>
              <p className="text-[8px] md:text-[10px] text-muted-foreground uppercase tracking-wider">V8 Engine</p>
            </div>
          </div>

        </div>

        {step === 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-10 md:mt-16"
          >
            <Button onClick={startAnimation} size="lg" className="rounded-full px-8 md:px-10 h-12 md:h-14 text-sm md:text-base gap-3 shadow-xl">
              <Play className="h-4 w-4 md:h-5 md:w-5 fill-current" /> Run architecture flow
            </Button>
          </motion.div>
        )}
      </div>

      <div className="p-6 md:p-8 border-t bg-muted/10">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row gap-4 md:gap-6">
           <div className="h-10 w-10 md:h-12 md:w-12 rounded-lg md:rounded-xl bg-primary/5 flex items-center justify-center shrink-0 border border-primary/10">
              <Database className="h-5 w-5 md:h-6 md:w-6 text-primary" />
           </div>
           <div>
              <p className="text-xs md:text-sm font-bold mb-1">Architectural Implication</p>
              <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                 {mode === 'SSR' && "Every request computes a fresh response. Ideal for personalized data, but requires higher server capacity."}
                 {mode === 'SSG' && "Generated once at build-time. Near-instant delivery from global CDNs with zero compute overhead per user."}
                 {mode === 'ISR' && "Static content that regenerates in the background. Combines CDN speed with the ability to update data without a full rebuild."}
                 {mode === 'HYDRATION' && "React takes the static HTML and makes it interactive by attaching event listeners and setting up state."}
              </p>
           </div>
        </div>
      </div>
    </div>
  )
}
