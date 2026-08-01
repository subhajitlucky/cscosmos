"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Image as ImageIcon, Zap, Maximize, FileType, CheckCircle2, Download } from "lucide-react"
import { Button } from "@/components/visualizers/nextjscosmos/components/ui/button"

export function ImageVisualizer() {
  const [isOptimized, setIsOptimized] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const optimize = async () => {
    setIsProcessing(true)
    await new Promise(r => setTimeout(r, 2000))
    setIsProcessing(false)
    setIsOptimized(true)
  }

  return (
    <div className="flex flex-col h-full p-4 md:p-8 bg-grid-premium">
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-1">
          <h3 className="text-lg font-bold tracking-tight">Image Pipeline Lab</h3>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Automatic Format & Size Optimization</p>
        </div>
        <Button 
          onClick={optimize} 
          disabled={isProcessing || isOptimized}
          size="sm" 
          className="rounded-full shadow-lg gap-2"
        >
          {isOptimized ? <><CheckCircle2 className="h-4 w-4" /> Optimized</> : <><Zap className="h-4 w-4 fill-current" /> Run Optimizer</>}
        </Button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-12">
        <div className="w-full max-w-2xl grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          
          {/* Source Image */}
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 text-red-600 text-[10px] font-black uppercase tracking-tighter border border-red-500/20">
               Original Asset
            </div>
            <div className="relative w-full aspect-square max-w-[200px] rounded-2xl border-4 border-muted bg-background flex flex-col items-center justify-center gap-2 overflow-hidden">
               <ImageIcon className="h-12 w-12 text-muted-foreground/40" />
               <div className="flex flex-col items-center text-[10px] font-mono text-muted-foreground">
                  <span>RAW_PHOTO.JPG</span>
                  <span className="text-red-500 font-bold">4.2 MB</span>
               </div>
               <div className="absolute bottom-0 w-full bg-muted py-1 text-center text-[8px] font-bold">
                  3000 x 2000 px
               </div>
            </div>
          </div>

          {/* Optimized Image */}
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-[10px] font-black uppercase tracking-tighter border border-emerald-500/20">
               Next.js Edge Asset
            </div>
            <div className="relative w-full aspect-square max-w-[200px] rounded-2xl border-4 border-primary/20 bg-background flex flex-col items-center justify-center gap-2 overflow-hidden shadow-2xl">
               <AnimatePresence mode="wait">
                 {isProcessing ? (
                   <motion.div 
                     key="loader"
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     exit={{ opacity: 0 }}
                     className="flex flex-col items-center gap-2"
                   >
                      <Zap className="h-8 w-8 text-primary animate-pulse" />
                      <span className="text-[10px] font-black animate-pulse">OPTIMIZING...</span>
                   </motion.div>
                 ) : isOptimized ? (
                   <motion.div 
                     key="result"
                     initial={{ scale: 0.8, opacity: 0 }}
                     animate={{ scale: 1, opacity: 1 }}
                     className="flex flex-col items-center gap-2"
                   >
                      <div className="h-24 w-full bg-emerald-500/10 flex items-center justify-center">
                         <ImageIcon className="h-12 w-12 text-emerald-500" />
                      </div>
                      <div className="flex flex-col items-center text-[10px] font-mono text-emerald-600 font-black">
                         <span className="flex items-center gap-1"><FileType className="h-3 w-3" /> AVIF / WEBP</span>
                         <span className="text-emerald-500 text-lg">84 KB</span>
                      </div>
                   </motion.div>
                 ) : (
                   <div className="flex flex-col items-center gap-2 opacity-20">
                      <Download className="h-8 w-8" />
                      <span className="text-[10px] font-bold">Waiting for request</span>
                   </div>
                 )}
               </AnimatePresence>
               {isOptimized && (
                 <div className="absolute bottom-0 w-full bg-emerald-500 py-1 text-center text-[8px] font-bold text-white">
                    800 x 600 px (Device specific)
                 </div>
               )}
            </div>
          </div>

        </div>

        <div className="max-w-md w-full bg-background border border-border p-6 rounded-[2rem] shadow-sm text-center">
           <p className="text-xs text-muted-foreground leading-relaxed italic">
             <strong>The Magic:</strong> Next.js doesn't just serve images. It 
             <span className="text-primary font-bold mx-1">transforms</span> them on-the-fly 
             to provide the best format (AVIF/WebP) and the perfect size for the user's screen.
           </p>
        </div>
      </div>
    </div>
  )
}
