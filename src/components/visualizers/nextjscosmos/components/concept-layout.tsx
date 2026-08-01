"use client"

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { BookOpen, Code, Lightbulb, HelpCircle, AlertCircle, ArrowLeft, CheckCircle2, Play, Sparkles } from "lucide-react"
import { RoutingVisualizer } from "./visualizers/routing-visualizer"
import { RenderingVisualizer } from "./visualizers/rendering-visualizer"
import { StreamingVisualizer } from "./visualizers/streaming-visualizer"
import { RSCVisualizer } from "./visualizers/rsc-visualizer"
import { HydrationVisualizer } from "./visualizers/hydration-visualizer"
import { SSRVisualizer } from "./visualizers/ssr-visualizer"
import { SSGVisualizer } from "./visualizers/ssg-visualizer"
import { DataFlowVisualizer } from "./visualizers/data-flow-visualizer"
import { BoundaryVisualizer } from "./visualizers/boundary-visualizer"
import { LayoutTemplateVisualizer } from "./visualizers/layout-template-visualizer"
import { ErrorVisualizer } from "./visualizers/error-visualizer"
import { ParallelRoutesVisualizer } from "./visualizers/parallel-routes-visualizer"
import { MiddlewareVisualizer } from "./visualizers/middleware-visualizer"
import { RouteHandlerVisualizer } from "./visualizers/route-handler-visualizer"
import { MetadataVisualizer } from "./visualizers/metadata-visualizer"
import { NotFoundVisualizer } from "./visualizers/not-found-visualizer"
import { InterceptingVisualizer } from "./visualizers/intercepting-visualizer"
import { ISRVisualizer } from "./visualizers/isr-visualizer"
import { CachingVisualizer } from "./visualizers/caching-visualizer"
import { AdvancedCachingVisualizer } from "./visualizers/advanced-caching-visualizer"
import { ImageVisualizer } from "./visualizers/image-visualizer"
import { DeploymentVisualizer } from "./visualizers/deployment-visualizer"
import { FetchOptionsVisualizer } from "./visualizers/fetch-options-visualizer"
import { ServerActionVisualizer } from "./visualizers/server-action-visualizer"
import { FormHandlingVisualizer } from "./visualizers/form-handling-visualizer"
import { OptimisticVisualizer } from "./visualizers/optimistic-visualizer"
import { PPRVisualizer } from "./visualizers/ppr-visualizer"
import { SecurityVisualizer } from "./visualizers/security-visualizer"
import { HydrationErrorVisualizer } from "./visualizers/hydration-error-visualizer"
import { MissingDirectiveVisualizer } from "./visualizers/missing-directive-visualizer"
import { SerializationErrorVisualizer } from "./visualizers/serialization-error-visualizer"
import { BailoutVisualizer } from "./visualizers/bailout-visualizer"
import { ParamsErrorVisualizer } from "./visualizers/params-error-visualizer"
import { ConceptNavigation } from "./concept-navigation"
import { Button } from "./ui/button"
import { useProgress } from "../lib/progress-store"
import Link from "next/link"
import { cn } from "../lib/utils"
import { useEffect, useState } from "react"
import ReactCodeEditor from "./ReactCodeEditor"

interface ConceptLayoutProps {
  slug: string
  title: string
  category: string
  description: string
  mentalModel: string
  whyExists: string
  codeExample: string
  visualizerType: 'routing' | 'rendering' | 'streaming' | 'rsc' | 'hydration' | 'ssr' | 'ssg' | 'data-flow' | 'boundary' | 'layout-template' | 'error' | 'parallel' | 'middleware' | 'route-handler' | 'caching' | 'advanced-caching' | 'image' | 'deployment' | 'server-action' | 'form-handling' | 'optimistic' | 'ppr' | 'security' | 'not-found' | 'intercepting' | 'isr' | 'fetch-options' | 'metadata' | 'hydration-error' | 'missing-directive' | 'serialization-error' | 'bailout-error' | 'params-error'
  visualizerProps?: any
  misconception?: string
  isErrorPage?: boolean
}

export function ConceptLayout({
  slug,
  title,
  category,
  description,
  mentalModel,
  whyExists,
  codeExample,
  visualizerType,
  visualizerProps,
  misconception,
  isErrorPage = false
}: ConceptLayoutProps) {
  const { isCompleted, toggleComplete, isLoaded } = useProgress()
  const [mounted, setMounted] = useState(false)
  const [editableCode, setEditableCode] = useState(codeExample)
  const [isExecuting, setIsExecuting] = useState(false)
  const completed = isCompleted(slug)
  
  useEffect(() => {
    setMounted(true)
    setEditableCode(codeExample)
  }, [codeExample])

  const handleExecute = () => {
    setIsExecuting(true)
    setTimeout(() => setIsExecuting(false), 2000)
  }

  const activeVisualizerProps = { ...visualizerProps, isExecuting }

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Header Area */}
      <div className="border-b py-16 bg-muted/30">
        <div className="max-w-[1700px] mx-auto px-4 sm:px-6">
          <div className="max-w-5xl">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
               <div>
                  <Link 
                    href={isErrorPage ? "/nextjscosmos/errors" : "/nextjscosmos/concepts"} 
                    className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-6 group"
                  >
                    <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                    {isErrorPage ? "Back to Event Horizon" : "Back to Mastery Path"}
                  </Link>
                  <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-[0.2em] mb-4">
                    <div className="h-px w-8 bg-primary/30" />
                    {category}
                  </div>
                  <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4 leading-tight text-foreground">
                    {title}
                  </h1>
               </div>
               
               <div className="flex-shrink-0">
                  <Button 
                    variant={completed ? "default" : "outline"}
                    size="lg"
                    className={cn(
                      "rounded-full px-8 py-6 text-base font-bold transition-all duration-500",
                      completed && "bg-emerald-600 hover:bg-emerald-700 border-emerald-600 shadow-lg shadow-emerald-500/20"
                    )}
                    onClick={() => toggleComplete(slug)}
                    disabled={!isLoaded}
                  >
                    {completed ? (
                      <>
                        <CheckCircle2 className="mr-2 h-5 w-5" />
                        Mastered
                      </>
                    ) : (
                      "Mark as Mastered"
                    )}
                  </Button>
               </div>
            </div>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl">
              {description}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-[1700px] mx-auto px-4 sm:px-6 mt-8 space-y-8">
        
        {/* Row 1: Interactive Visualizer & Live Code Execution Workbench */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          {/* Visualizer Card */}
          <Card className="flex flex-col border-2 overflow-hidden shadow-xl bg-card border-border/80 min-h-[520px]">
             <CardHeader className="bg-muted/40 pb-4 border-b border-border flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2.5 text-base font-bold text-foreground">
                   <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                     <Sparkles className="h-4 w-4 text-primary" />
                   </div>
                   Interactive Simulation Engine
                </CardTitle>
                <Button
                  onClick={handleExecute}
                  className={cn(
                    "flex items-center gap-2 font-bold text-xs uppercase tracking-widest transition-all shadow-md",
                    isExecuting ? "bg-emerald-600 text-white" : "bg-primary text-primary-foreground"
                  )}
                >
                  <Play className={cn("h-3.5 w-3.5 fill-current", isExecuting && "animate-pulse")} />
                  {isExecuting ? 'Simulating Update...' : 'Execute Code'}
                </Button>
             </CardHeader>
             <CardContent className="p-4 flex-1 bg-background flex flex-col justify-center min-h-[440px]">
                <div className="flex-1 w-full flex items-center justify-center">
                  {visualizerType === 'routing' && <RoutingVisualizer {...activeVisualizerProps} />}
                  {visualizerType === 'rendering' && <RenderingVisualizer {...activeVisualizerProps} />}
                  {visualizerType === 'streaming' && <StreamingVisualizer {...activeVisualizerProps} />}
                  {visualizerType === 'rsc' && <RSCVisualizer {...activeVisualizerProps} />}
                  {visualizerType === 'hydration' && <HydrationVisualizer {...activeVisualizerProps} />}
                  {visualizerType === 'ssr' && <SSRVisualizer {...activeVisualizerProps} />}
                  {visualizerType === 'ssg' && <SSGVisualizer {...activeVisualizerProps} />}
                  {visualizerType === 'data-flow' && <DataFlowVisualizer {...activeVisualizerProps} />}
                  {visualizerType === 'boundary' && <BoundaryVisualizer {...activeVisualizerProps} />}
                  {visualizerType === 'layout-template' && <LayoutTemplateVisualizer {...activeVisualizerProps} />}
                  {visualizerType === 'error' && <ErrorVisualizer {...activeVisualizerProps} />}
                  {visualizerType === 'parallel' && <ParallelRoutesVisualizer {...activeVisualizerProps} />}
                  {visualizerType === 'middleware' && <MiddlewareVisualizer {...activeVisualizerProps} />}
                  {visualizerType === 'route-handler' && <RouteHandlerVisualizer {...activeVisualizerProps} />}
                  {visualizerType === 'metadata' && <MetadataVisualizer {...activeVisualizerProps} />}
                  {visualizerType === 'caching' && <CachingVisualizer {...activeVisualizerProps} />}
                  {visualizerType === 'advanced-caching' && <AdvancedCachingVisualizer {...activeVisualizerProps} />}
                  {visualizerType === 'image' && <ImageVisualizer {...activeVisualizerProps} />}
                  {visualizerType === 'deployment' && <DeploymentVisualizer {...activeVisualizerProps} />}
                  {visualizerType === 'fetch-options' && <FetchOptionsVisualizer {...activeVisualizerProps} />}
                  {visualizerType === 'server-action' && <ServerActionVisualizer {...activeVisualizerProps} />}
                  {visualizerType === 'form-handling' && <FormHandlingVisualizer {...activeVisualizerProps} />}
                  {visualizerType === 'optimistic' && <OptimisticVisualizer {...activeVisualizerProps} />}
                  {visualizerType === 'ppr' && <PPRVisualizer {...activeVisualizerProps} />}
                  {visualizerType === 'security' && <SecurityVisualizer {...activeVisualizerProps} />}
                  {visualizerType === 'not-found' && <NotFoundVisualizer {...activeVisualizerProps} />}
                  {visualizerType === 'intercepting' && <InterceptingVisualizer {...activeVisualizerProps} />}
                  {visualizerType === 'isr' && <ISRVisualizer {...activeVisualizerProps} />}
                  {visualizerType === 'hydration-error' && <HydrationErrorVisualizer {...activeVisualizerProps} />}
                  {visualizerType === 'missing-directive' && <MissingDirectiveVisualizer {...activeVisualizerProps} />}
                  {visualizerType === 'serialization-error' && <SerializationErrorVisualizer {...activeVisualizerProps} />}
                  {visualizerType === 'bailout-error' && <BailoutVisualizer {...activeVisualizerProps} />}
                  {visualizerType === 'params-error' && <ParamsErrorVisualizer {...activeVisualizerProps} />}
                </div>
             </CardContent>
          </Card>

          {/* Editable Live Code Implementation Card */}
          <Card className="flex flex-col border-border bg-card shadow-xl min-h-[520px]">
             <CardHeader className="bg-muted/40 pb-4 border-b border-border flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2.5 text-base font-bold text-foreground">
                   <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Code className="h-4 w-4 text-primary" />
                   </div>
                   Executable Code Workbench
                </CardTitle>
                <Button 
                  size="sm"
                  onClick={handleExecute}
                  className="bg-primary hover:bg-primary/90 font-bold text-xs uppercase tracking-wider"
                >
                  <Play className="h-3 w-3 mr-1.5 fill-current" /> Execute Code
                </Button>
             </CardHeader>
             <CardContent className="p-0 flex-1 min-h-[440px]">
                <ReactCodeEditor code={editableCode} onChange={setEditableCode} />
             </CardContent>
          </Card>

        </div>

        {/* Row 2: Mental Model & Context */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           
           {/* Mental Model */}
           <Card className="bg-muted/30 border-border hover:bg-card transition-colors">
              <CardHeader className="pb-3">
                 <CardTitle className="flex items-center gap-3 text-base font-bold text-foreground">
                    <div className="h-9 w-9 rounded-xl bg-amber-500/10 flex items-center justify-center">
                      <Lightbulb className="h-5 w-5 text-amber-600" />
                    </div>
                    Mental Model
                 </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground leading-relaxed text-sm">
                 {mentalModel}
              </CardContent>
           </Card>

           {/* Why Exists */}
           <Card className="bg-primary/5 border-primary/10 hover:bg-primary/10 transition-colors">
              <CardHeader className="pb-3">
                 <CardTitle className="flex items-center gap-3 text-base font-bold text-foreground">
                    <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center">
                      <HelpCircle className="h-5 w-5 text-primary" />
                    </div>
                    Why This Exists
                 </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground leading-relaxed text-sm">
                 {whyExists}
              </CardContent>
           </Card>

           {/* Critical Note */}
           <Card className="border-dashed border-red-500/20 bg-red-500/5">
              <CardHeader className="pb-3">
                 <CardTitle className="flex items-center gap-3 text-base font-bold text-red-600 dark:text-red-400">
                    <div className="h-9 w-9 rounded-xl bg-red-500/10 flex items-center justify-center">
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    </div>
                    Critical Note
                 </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-red-700/80 dark:text-red-400/80 leading-relaxed italic">
                 "{misconception || "Developers often confuse this pattern with traditional client React. Use the Live Code Workbench above to simulate execution."}"
              </CardContent>
           </Card>

        </div>
        
        {/* Navigation below grid */}
        <div className="pt-8">
           <ConceptNavigation currentSlug={slug} isErrorPage={isErrorPage} />
        </div>
      </div>
    </div>
  )
}