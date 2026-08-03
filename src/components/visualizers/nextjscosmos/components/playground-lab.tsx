"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { RoutingVisualizer } from "./visualizers/routing-visualizer"
import { StreamingVisualizer } from "./visualizers/streaming-visualizer"
import { RSCVisualizer } from "./visualizers/rsc-visualizer"
import { SSRVisualizer } from "./visualizers/ssr-visualizer"
import { SSGVisualizer } from "./visualizers/ssg-visualizer"
import { ServerActionVisualizer } from "./visualizers/server-action-visualizer"
import { OptimisticVisualizer } from "./visualizers/optimistic-visualizer"
import { PPRVisualizer } from "./visualizers/ppr-visualizer"
import { Settings2, Info, PlayCircle, Code, Terminal, Activity, Heart, Sparkles, Database, Layers } from "lucide-react"

type Scenario = 'ssr' | 'ssg' | 'routing' | 'streaming' | 'rsc' | 'actions' | 'optimistic' | 'ppr'

export function PlaygroundLab() {
  const [scenario, setScenario] = useState<Scenario>('ssr')
  const [latency, setLatency] = useState(42)

  const scenarios = [
    { id: 'ssr', label: 'Dynamic SSR', icon: Activity, cat: 'Rendering' },
    { id: 'ssg', label: 'Static SSG', icon: Database, cat: 'Rendering' },
    { id: 'routing', label: 'Router Tree', icon: Terminal, cat: 'Structure' },
    { id: 'streaming', label: 'Streaming', icon: PlayCircle, cat: 'Performance' },
    { id: 'ppr', label: 'PPR (Hybrid)', icon: Sparkles, cat: 'Performance' },
    { id: 'rsc', label: 'RSC Boundary', icon: Code, cat: 'Architecture' },
    { id: 'actions', label: 'Server Actions', icon: Layers, cat: 'Interactions' },
    { id: 'optimistic', label: 'Optimistic UI', icon: Heart, cat: 'Interactions' },
  ]

  const getSourceCode = () => {
    switch(scenario) {
      case 'ssr': return `// app/page.tsx\nexport const dynamic = 'force-dynamic'\n\nexport default async function Page() {\n  const data = await fetch('...')\n  return <DataView data={data} />\n}`
      case 'ssg': return `// app/blog/page.tsx\nexport default async function Page() {\n  // Cached by default in Next.js\n  const posts = await fetch('...')\n  return <BlogList posts={posts} />\n}`
      case 'routing': return `// File Structure:\n// app/\n//   dashboard/\n//     layout.tsx  (Shared UI)\n//     page.tsx    (/dashboard)\n//     settings/\n//       page.tsx  (/dashboard/settings)`
      case 'streaming': return `// app/dashboard/page.tsx\nimport { Suspense } from 'react'\n\nexport default function Page() {\n  return (\n    <Suspense fallback={<Skeleton />}>\n      <SlowComponent />\n    </Suspense>\n  )\n}`
      case 'rsc': return `// app/server-component.tsx (Default)\nexport default async function Server() {\n  return <div>Rendered on Server</div>\n}\n\n// app/client-component.tsx\n'use client'\nexport function Client() {\n  return <button>Interactive</button>\n}`
      case 'actions': return `'use server'\n\nexport async function updateData(formData: FormData) {\n  const name = formData.get('name')\n  await db.user.update({ name })\n  revalidatePath('/')\n}`
      case 'optimistic': return `// app/like-button.tsx\n'use client'\nimport { useOptimistic } from 'react'\n\nconst [optimisticLikes, addOptimisticLike] = useOptimistic(\n  likes,\n  (state, newLike) => state + 1\n)`
      case 'ppr': return `// next.config.ts\nexperimental: { ppr: true }\n\n// app/page.tsx\n<Suspense fallback={<Loading />}>\n  <DynamicHole />\n</Suspense>`
      default: return `// Interactive Behavior Lab\n// Scenario: ${scenario}`
    }
  }

  return (
    <div className="flex flex-col lg:flex-row h-full min-h-[800px] lg:min-h-0">
      {/* Configuration Sidebar */}
      <div className="w-full lg:w-80 border-r border-border bg-muted/30 flex flex-col shrink-0">
        <div className="p-6 border-b border-border bg-background/50">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest">
              <Settings2 className="h-4 w-4" />
              Scenarios
            </div>
            <span className="text-[10px] font-black bg-primary/10 text-primary px-2 py-0.5 rounded-full">v16.1</span>
          </div>
          
          <div className="grid grid-cols-1 gap-1.5 overflow-y-auto max-h-[400px] lg:max-h-none pr-2 custom-scrollbar">
            {scenarios.map((s) => (
              <button 
                key={s.id}
                onClick={() => setScenario(s.id as Scenario)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all group ${
                  scenario === s.id 
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' 
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <div className="flex items-center gap-3">
                  <s.icon className="h-4 w-4" />
                  {s.label}
                </div>
                <span className={`text-[8px] font-bold uppercase tracking-tighter opacity-50 group-hover:opacity-100 ${scenario === s.id ? 'text-primary-foreground' : 'text-muted-foreground'}`}>
                   {s.cat}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 flex-1 bg-grid-premium">
           <div className="flex items-center gap-2 mb-6 text-muted-foreground font-bold text-xs uppercase tracking-widest">
            <Info className="h-4 w-4" />
            Lab Context
          </div>
          <div className="space-y-6">
             <div className="text-sm">
                <p className="font-bold mb-2 text-primary">Objective</p>
                <p className="text-muted-foreground leading-relaxed text-xs">
                   {scenario === 'ssr' && "Analyze the request-time generation flow where the server computes fresh HTML for every user."}
                   {scenario === 'ssg' && "Observe build-time pre-rendering and how global CDN delivery achieves near-zero latency."}
                   {scenario === 'routing' && "Explore the App Router's hierarchical structure and special file segment matching."}
                   {scenario === 'streaming' && "Watch the progressive delivery of UI components as heavy data promises resolve."}
                   {scenario === 'rsc' && "Inspect the execution boundary between secure Server environments and browser hydration."}
                   {scenario === 'actions' && "Visualize direct RPC calls from Client to Server without the need for manual API routes."}
                   {scenario === 'optimistic' && "Compare the 'Instant UI' (client state) with the 'Real Truth' (server persistence)."}
                   {scenario === 'ppr' && "Experience the future of Next.js: instant static shells with dynamic streaming holes."}
                </p>
             </div>
             
             <div className="pt-6 border-t border-border">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Environment</span>
                  <div className="flex gap-1">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                </div>
                <div className="space-y-4">
                   <div className="bg-zinc-950 rounded-xl p-4 font-mono text-[10px] text-zinc-500 space-y-1 overflow-hidden border border-white/5">
                      <p><span className="text-emerald-500/50">RUN</span> Mounting {scenario}...</p>
                      <p><span className="text-blue-500/50">LOG</span> {scenario === 'ssr' ? 'Cache: BYPASS' : 'Cache: ENABLED'}</p>
                      <p><span className="text-zinc-700">SYS</span> Memory: 124mb</p>
                   </div>
                   <div className="space-y-2">
                      <div className="flex justify-between items-center text-[10px] font-bold uppercase text-muted-foreground">
                         <span>Simulate Latency</span>
                         <span className="text-primary">{latency}ms</span>
                      </div>
                      <input 
                        type="range" 
                        min="20" 
                        max="2000" 
                        value={latency} 
                        onChange={(e) => setLatency(parseInt(e.target.value))}
                        className="w-full h-1 bg-muted rounded-lg appearance-none cursor-pointer accent-primary" 
                      />
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
      
      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col bg-background min-w-0">
        <Tabs defaultValue="visualizer" className="flex-1 flex flex-col">
          <div className="h-20 border-b border-border flex items-center justify-between px-4 md:px-8 bg-background/50 backdrop-blur-sm sticky top-0 z-10">
            <TabsList className="bg-muted/50 p-1 rounded-xl">
              <TabsTrigger value="visualizer" className="rounded-lg px-4 md:px-6 font-bold data-[state=active]:bg-background data-[state=active]:shadow-sm text-xs md:text-sm">Visualizer</TabsTrigger>
              <TabsTrigger value="code" className="rounded-lg px-4 md:px-6 font-bold data-[state=active]:bg-background data-[state=active]:shadow-sm text-xs md:text-sm">Source</TabsTrigger>
            </TabsList>
            <div className="hidden sm:flex items-center gap-3">
               <span className="text-xs font-mono text-muted-foreground">RTT: {latency}ms</span>
               <div className="h-4 w-px bg-border" />
               <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded">LIVE RUNTIME</span>
            </div>
          </div>
          
          <div className="flex-1 relative overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div 
                key={scenario}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="h-full"
              >
                <TabsContent value="visualizer" className="m-0 h-full">
                  <div className="h-full overflow-y-auto custom-scrollbar">
                    {scenario === 'ssr' && <SSRVisualizer />}
                    {scenario === 'ssg' && <SSGVisualizer />}
                    {scenario === 'routing' && <RoutingVisualizer />}
                    {scenario === 'streaming' && <StreamingVisualizer />}
                    {scenario === 'rsc' && <RSCVisualizer mode="concept" />}
                    {scenario === 'actions' && <ServerActionVisualizer />}
                    {scenario === 'optimistic' && <OptimisticVisualizer />}
                    {scenario === 'ppr' && <PPRVisualizer />}
                  </div>
                </TabsContent>
                <TabsContent value="code" className="m-0 h-full bg-zinc-950">
                   <div className="p-6 md:p-12 overflow-auto h-full">
                      <div className="flex items-center justify-between mb-6">
                         <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-500/20" />
                            <div className="w-3 h-3 rounded-full bg-amber-500/20" />
                            <div className="w-3 h-3 rounded-full bg-emerald-500/20" />
                         </div>
                         <span className="text-[10px] font-mono text-zinc-600">app/blueprint.tsx</span>
                      </div>
                      <pre className="text-xs md:text-sm text-zinc-400 font-mono leading-relaxed">
                        {getSourceCode()}
                      </pre>
                   </div>
                </TabsContent>
              </motion.div>
            </AnimatePresence>
          </div>
        </Tabs>
      </div>
    </div>
  )
}