"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Play, RotateCcw, Box, HardDrive, Globe, Zap, Database } from "lucide-react"
import { Button } from "@/components/visualizers/nextjscosmos/components/ui/button"

export function SSGVisualizer() {
  const [status, setStatus] = useState<'idle' | 'building' | 'stored' | 'requesting' | 'instant'>('idle')

  const startBuild = async () => {
    setStatus('building')
    await new Promise(r => setTimeout(r, 2000))
    setStatus('stored')
  }

  const runRequest = async () => {
    setStatus('requesting')
    await new Promise(r => setTimeout(r, 800))
    setStatus('instant')
  }

  return (
    <div className="flex flex-col h-full p-4 md:p-8 bg-grid-premium">
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-1">
          <h3 className="text-lg font-bold tracking-tight">SSG: Build-Time Optimization</h3>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Generate once, serve millions of times</p>
        </div>
        <div className="flex gap-2">
          {status === 'idle' || status === 'building' ? (
            <Button onClick={startBuild} disabled={status === 'building'} size="sm" className="gap-2 rounded-full shadow-lg">
              <Box className="h-4 w-4" /> Run Build
            </Button>
          ) : (
            <Button onClick={runRequest} disabled={status === 'requesting'} size="sm" className="gap-2 rounded-full shadow-lg bg-emerald-600 hover:bg-emerald-700">
              <Zap className="h-4 w-4 fill-current" /> Instant Request
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={() => setStatus('idle')} className="rounded-full">
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-16">
        <div className="w-full max-w-2xl flex flex-col md:flex-row items-center justify-between gap-12 relative">
          
          {/* Build Environment */}
          <div className="flex flex-col items-center gap-4 relative">
            <motion.div 
              animate={{ 
                borderColor: status === 'building' ? 'var(--primary)' : 'rgba(0,0,0,0.1)',
                scale: status === 'building' ? 1.05 : 1
              }}
              className="w-24 h-24 rounded-3xl border-2 bg-background flex items-center justify-center shadow-xl relative overflow-hidden"
            >
              <Database className={status === 'building' ? 'text-primary' : 'text-muted-foreground'} />
              {status === 'building' && (
                <motion.div 
                  className="absolute inset-0 bg-primary/5"
                  animate={{ opacity: [0.2, 0.5, 0.2] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                />
              )}
            </motion.div>
            <span className="text-[10px] font-black uppercase tracking-widest text-center">Data & Components<br/>(Build Time)</span>
          </div>

          {/* Storage / CDN */}
          <div className="flex flex-col items-center gap-4 relative">
            <motion.div 
              animate={{ 
                borderColor: status === 'stored' || status === 'instant' ? 'var(--primary)' : 'rgba(0,0,0,0.1)',
                backgroundColor: status === 'stored' || status === 'instant' ? 'oklch(var(--primary) / 0.05)' : 'transparent'
              }}
              className="w-32 h-32 rounded-full border-2 bg-background flex items-center justify-center shadow-2xl relative"
            >
              <HardDrive className={status === 'stored' || status === 'instant' ? 'text-primary' : 'text-muted-foreground'} />
              <AnimatePresence>
                {(status === 'stored' || status === 'instant') && (
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 h-8 w-8 bg-primary rounded-full flex items-center justify-center text-white border-2 border-background"
                  >
                    <HardDrive className="h-4 w-4" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
            <span className="text-[10px] font-black uppercase tracking-widest text-center text-primary">Static CDN Cache<br/>(Global Storage)</span>
          </div>

          {/* User Terminal */}
          <div className="flex flex-col items-center gap-4 relative">
            <motion.div 
              animate={{ 
                scale: status === 'instant' ? 1.1 : 1,
                borderColor: status === 'instant' ? 'var(--emerald-500)' : 'rgba(0,0,0,0.1)'
              }}
              className="w-24 h-24 rounded-3xl border-2 bg-background flex items-center justify-center shadow-xl"
            >
              <Globe className={status === 'instant' ? 'text-emerald-500' : 'text-muted-foreground'} />
            </motion.div>
            <span className="text-[10px] font-black uppercase tracking-widest text-center">User Browser<br/>(Instant delivery)</span>
          </div>

          {/* Connection Arrows */}
          <div className="absolute top-1/2 left-1/4 w-[15%] h-px bg-muted hidden md:block" />
          <div className="absolute top-1/2 right-1/4 w-[15%] h-px bg-muted hidden md:block" />
          
          {/* Animation Particle 1 (Build -> Store) */}
          {status === 'building' && (
            <motion.div 
              initial={{ left: '15%', top: '50%' }}
              animate={{ left: '45%' }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="absolute h-2 w-2 bg-primary rounded-full hidden md:block"
            />
          )}

          {/* Animation Particle 2 (Store -> User) */}
          {status === 'requesting' && (
            <motion.div 
              initial={{ right: '45%', top: '50%' }}
              animate={{ right: '15%' }}
              className="absolute h-3 w-3 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)] hidden md:block"
            />
          )}
        </div>

        <div className="bg-background border border-border p-6 rounded-[2rem] max-w-md w-full shadow-sm text-center">
           <AnimatePresence mode="wait">
             <motion.div
               key={status}
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               className="text-xs text-muted-foreground leading-relaxed"
             >
               {status === 'idle' && "Start by running the Build process to pre-generate your site."}
               {status === 'building' && "Next.js is fetching all data and converting your React components into static HTML files."}
               {status === 'stored' && "Build complete! Your pages are now stored as physical files on a global CDN. Now try a request."}
               {status === 'requesting' && "User requests the page. The CDN already has the file ready!"}
               {status === 'instant' && "Instant delivery! The server didn't have to do any work—it just sent the pre-made file."}
             </motion.div>
           </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
