"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Play, Globe, Code, Search, Share2, FileCode, ArrowRight, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/visualizers/nextjscosmos/components/ui/button"

export function MetadataVisualizer() {
  const [status, setStatus] = useState<'idle' | 'executing' | 'injected'>('idle')

  const runSimulation = async () => {
    setStatus('executing')
    await new Promise(r => setTimeout(r, 1800))
    setStatus('injected')
  }

  return (
    <div className="flex flex-col h-full p-4 md:p-8 bg-grid-premium">
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-1">
          <h3 className="text-lg font-bold tracking-tight">Metadata Generation Lab</h3>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Automatic &lt;head&gt; Management</p>
        </div>
        <Button onClick={runSimulation} disabled={status === 'executing'} size="sm" className="rounded-full shadow-lg gap-2">
          <Play className="h-4 w-4" /> Run generateMetadata()
        </Button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-8">
        <div className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          
          {/* Server Logic */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-tighter border border-primary/20 w-fit">
               Server Execution
            </div>
            <div className="relative p-6 rounded-[2rem] border-2 border-primary/20 bg-background shadow-xl flex flex-col gap-4 overflow-hidden">
               <div className="flex items-center gap-3 border-b pb-4">
                  <FileCode className="h-5 w-5 text-primary" />
                  <span className="text-[10px] font-mono font-bold">layout.tsx | page.tsx</span>
               </div>
               <div className="space-y-2 font-mono text-[10px]">
                  <p className="text-blue-500">export const <span className="text-primary">metadata</span> = {"{"}</p>
                  <p className="ml-4 text-purple-500">title: <span className="text-emerald-600">'Cosmos Lab'</span>,</p>
                  <p className="ml-4 text-purple-500">description: <span className="text-emerald-600">'...'</span></p>
                  <p className="text-blue-500">{"}"}</p>
               </div>
               {status === 'executing' && (
                 <motion.div 
                   initial={{ width: 0 }} 
                   animate={{ width: '100%' }} 
                   className="h-1 bg-primary absolute bottom-0 left-0"
                 />
               )}
            </div>
          </div>

          {/* Browser DOM <head> */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-[10px] font-black uppercase tracking-tighter border border-emerald-500/20 w-fit">
               Document &lt;head&gt;
            </div>
            <div className="relative p-6 rounded-[2rem] border-2 border-emerald-500/20 bg-zinc-950 shadow-2xl flex flex-col gap-3 min-h-[180px]">
               <AnimatePresence mode="wait">
                 {status === 'injected' ? (
                   <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2 font-mono text-[9px]">
                      <p className="text-zinc-500">&lt;head&gt;</p>
                      <p className="ml-4 text-emerald-400">&lt;title&gt;Cosmos Lab&lt;/title&gt;</p>
                      <p className="ml-4 text-emerald-400">&lt;meta name="description" ... /&gt;</p>
                      <p className="ml-4 text-emerald-400">&lt;meta property="og:image" ... /&gt;</p>
                      <p className="text-zinc-500">&lt;/head&gt;</p>
                      <motion.div 
                        initial={{ scale: 0 }} 
                        animate={{ scale: 1 }} 
                        className="absolute top-2 right-2 h-6 w-6 bg-emerald-500 rounded-full flex items-center justify-center"
                      >
                         <CheckCircle2 className="h-3 w-3 text-white" />
                      </motion.div>
                   </motion.div>
                 ) : (
                   <div className="flex-1 flex flex-col items-center justify-center gap-3 text-zinc-700">
                      <Code className="h-8 w-8 opacity-20" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Waiting for stream...</span>
                   </div>
                 )}
               </AnimatePresence>
            </div>
          </div>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl">
           {[
             { icon: Search, label: 'SEO indexing', desc: 'Title and descriptions for Google' },
             { icon: Share2, label: 'Social Graph', desc: 'Previews for Twitter and LinkedIn' },
             { icon: Globe, label: 'Standardization', desc: 'Favicons, manifests, and more' },
           ].map((item, i) => (
             <div key={i} className="p-4 rounded-2xl bg-background border border-border flex flex-col gap-2 shadow-sm">
                <item.icon className="h-4 w-4 text-primary" />
                <p className="text-[10px] font-black uppercase">{item.label}</p>
                <p className="text-[9px] text-muted-foreground leading-tight">{item.desc}</p>
             </div>
           ))}
        </div>

        <div className="max-w-md w-full bg-background border border-border p-6 rounded-[2rem] shadow-sm text-center">
           <p className="text-xs text-muted-foreground leading-relaxed italic">
             <strong>The Process:</strong> Next.js automatically resolves your metadata (even if it's dynamic/async) and 
             <span className="text-primary font-bold mx-1">injects</span> it into the correct position in the HTML stream before it ever reaches the user.
           </p>
        </div>
      </div>
    </div>
  )
}
