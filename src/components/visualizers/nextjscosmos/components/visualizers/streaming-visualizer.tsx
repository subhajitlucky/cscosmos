"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Play, RotateCcw, Layout, Loader2, Database } from "lucide-react"
import { Button } from "@/components/visualizers/nextjscosmos/components/ui/button"

interface StreamingVisualizerProps {
  title?: string
  shellLabel?: string
  contentLabel?: string
  sidebarLabel?: string
}

export function StreamingVisualizer({
  title = "Streaming with Suspense",
  shellLabel = "Requesting from server...",
  contentLabel = "Fetching main data...",
  sidebarLabel = "Loading nav..."
}: StreamingVisualizerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [stages, setStages] = useState({
    shell: false,
    header: false,
    content: false,
    sidebar: false,
  })

  const runSimulation = () => {
    setIsPlaying(true)
    setStages({ shell: false, header: false, content: false, sidebar: false })
    
    // 1. Initial Shell (Fast)
    setTimeout(() => setStages(s => ({ ...s, shell: true })), 500)
    
    // 2. Header (Fast)
    setTimeout(() => setStages(s => ({ ...s, header: true })), 1200)
    
    // 3. Sidebar (Medium)
    setTimeout(() => setStages(s => ({ ...s, sidebar: true })), 2500)
    
    // 4. Content (Slow - Data Fetching)
    setTimeout(() => {
      setStages(s => ({ ...s, content: true }))
      setIsPlaying(false)
    }, 4500)
  }

  return (
    <div className="flex flex-col h-full p-6">
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-1">
          <h3 className="font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground">Watch how the page "fills in" as data resolves.</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={runSimulation} disabled={isPlaying} size="sm" className="gap-2">
            <Play className="h-4 w-4" /> Run Simulation
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setStages({ shell: false, header: false, content: false, sidebar: false })}
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 flex gap-4 max-w-4xl mx-auto w-full">
        {/* Browser Shell */}
        <div className="flex-1 border-4 rounded-xl overflow-hidden bg-background shadow-2xl flex flex-col relative">
          {/* Header */}
          <div className="h-12 border-b bg-muted/20 flex items-center px-4 gap-2">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
            <div className="ml-4 h-5 w-48 bg-muted rounded-md" />
          </div>

          <div className="flex-1 flex">
            {/* Sidebar Shell */}
            <div className="w-48 border-r p-4 space-y-4">
              {stages.sidebar ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                  <div className="h-4 w-full bg-primary/10 rounded" />
                  <div className="h-4 w-3/4 bg-primary/10 rounded" />
                  <div className="h-4 w-1/2 bg-primary/10 rounded" />
                </motion.div>
              ) : stages.shell ? (
                <div className="flex items-center gap-2 text-muted-foreground/30">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-[10px]">{sidebarLabel}</span>
                </div>
              ) : null}
            </div>

            {/* Main Content */}
            <div className="flex-1 p-6 space-y-6">
              {stages.header && (
                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                   <div className="h-8 w-1/3 bg-primary/20 rounded-lg mb-2" />
                   <div className="h-4 w-full bg-muted rounded" />
                </motion.div>
              )}

              <div className="grid grid-cols-2 gap-4">
                {stages.content ? (
                  <>
                    <motion.div 
                      initial={{ scale: 0.9, opacity: 0 }} 
                      animate={{ scale: 1, opacity: 1 }}
                      className="h-32 bg-blue-500/10 border-2 border-blue-500/20 rounded-xl p-4"
                    >
                      <Database className="h-5 w-5 text-blue-500 mb-2" />
                      <div className="h-2 w-full bg-blue-500/20 rounded" />
                    </motion.div>
                    <motion.div 
                      initial={{ scale: 0.9, opacity: 0 }} 
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="h-32 bg-green-500/10 border-2 border-green-500/20 rounded-xl p-4"
                    >
                      <Database className="h-5 w-5 text-green-500 mb-2" />
                      <div className="h-2 w-full bg-green-500/20 rounded" />
                    </motion.div>
                  </>
                ) : stages.shell ? (
                  <div className="col-span-2 h-32 border-2 border-dashed rounded-xl flex items-center justify-center text-muted-foreground gap-3">
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <span>{contentLabel}</span>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
          
          <AnimatePresence>
            {!stages.shell && isPlaying && (
              <motion.div 
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-10"
              >
                <div className="flex flex-col items-center gap-4">
                  <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                  <p className="font-medium animate-pulse">{shellLabel}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}