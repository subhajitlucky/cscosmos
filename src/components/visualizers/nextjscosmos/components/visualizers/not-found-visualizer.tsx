"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, FileQuestion, ArrowRight, CornerDownRight, XCircle, CheckCircle2, Globe } from "lucide-react"
import { Button } from "@/components/visualizers/nextjscosmos/components/ui/button"

export function NotFoundVisualizer() {
  const [url, setUrl] = useState("/blog/invalid-post")
  const [status, setStatus] = useState<'idle' | 'searching' | 'failed' | 'complete'>('idle')

  const simulateSearch = async () => {
    setStatus('searching')
    await new Promise(r => setTimeout(r, 1000))
    // Simulate finding the nearest not-found.tsx
    setStatus('failed')
  }

  return (
    <div className="flex flex-col h-full p-4 md:p-8 bg-grid-premium">
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-1">
          <h3 className="text-lg font-bold tracking-tight">404 Resolution Logic</h3>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Finding the nearest not-found boundary</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-8">
        {/* Browser Address Bar */}
        <div className="w-full max-w-md bg-background border-2 border-border rounded-full p-1.5 flex items-center gap-3 shadow-lg">
           <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
              <Globe className="h-4 w-4 text-muted-foreground" />
           </div>
           <input 
             type="text" 
             value={url}
             onChange={(e) => setUrl(e.target.value)}
             className="flex-1 bg-transparent text-sm font-mono outline-none"
             placeholder="Enter URL..."
           />
           <Button onClick={simulateSearch} disabled={status === 'searching'} size="sm" className="rounded-full h-8">
              {status === 'searching' ? 'Searching...' : 'Go'}
           </Button>
        </div>

        <div className="w-full max-w-2xl grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* File System Tree */}
          <div className="bg-muted/30 rounded-2xl border p-6 font-mono relative overflow-hidden">
             <div className="text-[10px] font-black text-muted-foreground uppercase mb-4 pb-2 border-b">File System</div>
             <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                   <CornerDownRight className="h-3 w-3 text-muted-foreground" />
                   <span className="text-blue-500 font-bold">app/</span>
                </div>
                <div className="ml-4 space-y-2">
                   <div className="flex items-center gap-2 text-sm">
                      <CornerDownRight className="h-3 w-3 text-muted-foreground" />
                      <span className="text-blue-500 font-bold">blog/</span>
                   </div>
                   <div className="ml-4 space-y-2 border-l-2 border-primary/10 pl-4">
                      <div className={`flex items-center gap-2 text-sm p-1 rounded transition-colors ${status === 'failed' ? 'bg-primary/10 text-primary' : ''}`}>
                         <FileQuestion className="h-3 w-3" />
                         <span>not-found.tsx</span>
                         {status === 'failed' && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="ml-auto text-[8px] font-black bg-primary text-white px-1 rounded">MATCH</motion.span>}
                      </div>
                      <div className="flex items-center gap-2 text-sm opacity-40">
                         <CornerDownRight className="h-3 w-3" />
                         <span>[slug]/page.tsx</span>
                      </div>
                   </div>
                </div>
             </div>
             
             {status === 'searching' && (
               <motion.div 
                 initial={{ top: '20%' }}
                 animate={{ top: '60%' }}
                 transition={{ duration: 1 }}
                 className="absolute left-6 h-4 w-4 bg-primary rounded-full blur-sm"
               />
             )}
          </div>

          {/* Resolution Result */}
          <div className="h-full">
             <AnimatePresence mode="wait">
                {status === 'idle' && (
                  <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-full p-8 border-2 border-dashed rounded-2xl text-center gap-4">
                     <Search className="h-12 w-12 text-muted-foreground/20" />
                     <p className="text-xs text-muted-foreground">Type a URL and hit Go to see how Next.js searches for a matching route or 404 boundary.</p>
                  </motion.div>
                )}
                {status === 'failed' && (
                  <motion.div key="failed" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center h-full p-8 bg-red-500/5 border-2 border-red-500/20 rounded-2xl text-center gap-4 shadow-xl">
                     <div className="h-16 w-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
                        <XCircle className="h-8 w-8" />
                     </div>
                     <div className="space-y-1">
                        <h4 className="font-black text-red-600 uppercase text-lg tracking-tight">404 Resolved</h4>
                        <p className="text-xs text-red-700/70 font-medium">
                          No page matched <code>{url}</code>. <br/>
                          Next.js bubbled up to the nearest <code>not-found.tsx</code> in <code>app/blog/</code>.
                        </p>
                     </div>
                  </motion.div>
                )}
             </AnimatePresence>
          </div>
        </div>

        <div className="max-w-md w-full bg-background border border-border p-6 rounded-[2rem] shadow-sm text-center">
           <p className="text-xs text-muted-foreground leading-relaxed italic">
             <strong>The Logic:</strong> When a route doesn't match or <code>notFound()</code> is called, Next.js looks for the nearest <code>not-found.tsx</code> file in the directory hierarchy.
           </p>
        </div>
      </div>
    </div>
  )
}
