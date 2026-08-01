"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Play, Globe, Image as ImageIcon, X, Maximize2, MousePointer2, RefreshCw, LayoutTemplate } from "lucide-react"
import { Button } from "@/components/visualizers/nextjscosmos/components/ui/button"

export function InterceptingVisualizer() {
  const [view, setView] = useState<'feed' | 'modal' | 'full'>('feed')

  return (
    <div className="flex flex-col h-full p-4 md:p-8 bg-grid-premium">
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-1">
          <h3 className="text-lg font-bold tracking-tight">Modal vs. Full Page Logic</h3>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">URL-aware UI Interception</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setView('feed')} 
            className="rounded-full"
          >
            <RefreshCw className="h-3 w-3 mr-2" /> Reset
          </Button>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-8">
        {/* Browser Mockup */}
        <div className="w-full max-w-2xl border-4 border-primary/10 rounded-[2.5rem] bg-background shadow-2xl overflow-hidden flex flex-col min-h-[400px]">
           
           {/* Address Bar */}
           <div className="bg-muted/30 p-3 border-b flex items-center gap-3">
              <div className="flex gap-1.5">
                 <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                 <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                 <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              </div>
              <div className="flex-1 bg-background rounded-full px-4 py-1 flex items-center gap-2 border">
                 <Globe className="h-3 w-3 text-muted-foreground" />
                 <span className="text-[10px] font-mono">
                    example.com{view === 'feed' ? '/photos' : `/photos/123`}
                 </span>
              </div>
           </div>

           {/* Web Content */}
           <div className="flex-1 p-6 relative">
              {view === 'full' ? (
                /* Full Page View (Deep Link / Refresh) */
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  className="h-full flex flex-col items-center gap-6"
                >
                   <div className="w-full h-48 bg-primary/5 rounded-3xl flex items-center justify-center border-2 border-primary/10">
                      <ImageIcon className="h-20 w-20 text-primary/20" />
                   </div>
                   <div className="space-y-4 w-full">
                      <div className="h-6 w-1/3 bg-muted rounded-lg" />
                      <div className="h-4 w-full bg-muted rounded" />
                      <div className="h-4 w-3/4 bg-muted rounded" />
                   </div>
                   <div className="mt-auto p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl w-full text-center">
                      <p className="text-[10px] text-amber-700 font-bold uppercase">Full Page Context (Refresh)</p>
                   </div>
                </motion.div>
              ) : (
                /* Feed View */
                <div className="h-full flex flex-col gap-6">
                   <div className="h-6 w-1/4 bg-muted rounded-lg" />
                   <div className="grid grid-cols-3 gap-4">
                      {[1,2,3,4,5,6].map(i => (
                        <motion.div 
                          key={i}
                          whileHover={{ scale: 1.05 }}
                          onClick={() => setView('modal')}
                          className="aspect-square bg-muted/50 rounded-2xl border-2 border-border cursor-pointer flex items-center justify-center group relative overflow-hidden"
                        >
                           <ImageIcon className="h-6 w-6 text-muted-foreground/30" />
                           {i === 1 && (
                             <div className="absolute inset-0 bg-primary/5 flex flex-col items-center justify-center gap-2">
                                <MousePointer2 className="h-4 w-4 text-primary animate-bounce" />
                                <span className="text-[8px] font-black text-primary">CLICK ME</span>
                             </div>
                           )}
                        </motion.div>
                      ))}
                   </div>
                </div>
              )}

              {/* Modal Overlay (Intercepted Route) */}
              <AnimatePresence>
                {view === 'modal' && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-8 z-20"
                  >
                     <motion.div 
                       initial={{ scale: 0.9, y: 20 }}
                       animate={{ scale: 1, y: 0 }}
                       className="bg-background rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden border border-white/10"
                     >
                        <div className="p-4 border-b flex items-center justify-between">
                           <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Intercepted Modal</span>
                           <button onClick={() => setView('feed')} className="p-1 hover:bg-muted rounded-full">
                              <X className="h-4 w-4" />
                           </button>
                        </div>
                        <div className="p-6 flex flex-col items-center gap-4">
                           <div className="w-full aspect-video bg-primary/10 rounded-2xl flex items-center justify-center">
                              <ImageIcon className="h-12 w-12 text-primary/40" />
                           </div>
                           <div className="space-y-2 w-full">
                              <div className="h-3 w-1/2 bg-muted rounded" />
                              <div className="h-2 w-full bg-muted rounded" />
                           </div>
                           <Button 
                             size="sm" 
                             variant="outline" 
                             onClick={() => setView('full')}
                             className="w-full rounded-xl gap-2 text-[10px] font-bold uppercase"
                           >
                              <RefreshCw className="h-3 w-3" /> Simulate Refresh
                           </Button>
                        </div>
                     </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
           </div>
        </div>

        <div className="max-w-md w-full bg-background border border-border p-6 rounded-[2rem] shadow-sm text-center">
           <AnimatePresence mode="wait">
             <motion.p 
               key={view}
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="text-xs text-muted-foreground leading-relaxed"
             >
               {view === 'feed' && "The user is browsing the photo feed. Click a photo to trigger the intercepted route."}
               {view === 'modal' && "Next.js intercepted the URL! It's showing the photo in a modal (overlay) without losing the feed context behind it."}
               {view === 'full' && "After a refresh, Next.js renders the full photo page because the 'modal interception' only happens during client-side navigation."}
             </motion.p>
           </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
