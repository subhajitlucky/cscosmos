'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, Info } from 'lucide-react';
import { cn } from '../../utils/cn';
import { type Topic, type Category } from '../../data/topics';
import HookVisualizer from '../../components/visualizers/HookVisualizer';
import FiberVisualizer from '../../components/visualizers/FiberVisualizer';
import Editor from 'react-simple-code-editor';
// @ts-expect-error: prismjs types are incomplete
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import { useState } from 'react';

const categoryColors: Record<Category, string> = {
  fundamentals: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
  rendering: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20',
  hooks: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
  internals: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
  performance: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
  patterns: 'text-pink-500 bg-pink-500/10 border-pink-500/20',
  concurrent: 'text-rose-500 bg-rose-500/10 border-rose-500/20',
};

export const TopicWrapper = ({ 
  topic, 
  code, 
  setCode,
  onExecute,
  visualizer
}: { 
  topic: Topic, 
  code: string, 
  setCode: (s: string) => void,
  onExecute?: () => void,
  visualizer?: (isExecuting: boolean) => React.ReactNode
}) => {
  const [isExecuting, setIsExecuting] = useState(false);

  const handleExecute = () => {
    setIsExecuting(true);
    if (onExecute) onExecute();
    setTimeout(() => setIsExecuting(false), 2000);
  };

  return (
    <div className="pt-24 pb-12 px-6 max-w-6xl mx-auto min-h-screen">
      <Link href="/reactcosmos/learn" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-12 transition-colors text-[13px] font-medium">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Pathway
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
          <div className="flex items-center gap-3 mb-6">
             <span className={cn("px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border", categoryColors[topic.category])}>
                {topic.category}
             </span>
             <span className="text-muted-foreground text-xs font-medium uppercase tracking-widest">{topic.difficulty}</span>
          </div>
          <h1 className="text-4xl font-bold mb-6 tracking-tight">{topic.title}</h1>
          <p className="text-[15px] text-muted-foreground mb-10 leading-relaxed">{topic.summary}</p>
          <div className="bg-muted rounded-xl p-6 border border-border mb-10">
            <h3 className="flex items-center gap-2 text-foreground font-bold mb-4 uppercase text-[10px] tracking-widest">
              <Info className="w-3.5 h-3.5" /> Mental Model
            </h3>
            <p className="text-muted-foreground italic text-[14px]">"{topic.mentalModel}"</p>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
          <div className="rounded-xl overflow-hidden border border-border bg-card shadow-xl transition-premium">
            <div className="bg-muted px-4 py-2.5 border-b border-border flex justify-between items-center text-[11px] font-mono">
              <span className="text-muted-foreground">component.jsx</span>
              <button 
                onClick={handleExecute}
                className={cn(
                  "flex items-center gap-1.5 transition-premium font-bold uppercase tracking-widest",
                  isExecuting ? "text-emerald-500" : "text-react hover:opacity-80"
                )}
              >
                <Play className={cn("w-3 h-3 fill-current", isExecuting && "animate-pulse")} /> 
                {isExecuting ? 'Running...' : 'Execute'}
              </button>
            </div>
            <div className="p-4 editor-container">
               <Editor 
                value={code} 
                onValueChange={setCode} 
                highlight={c => highlight(c, languages.js)} 
                padding={10} 
                style={{ fontFamily: 'var(--font-mono)', fontSize: 13, backgroundColor: 'transparent' }} 
              />
            </div>
          </div>
          <div className="h-[400px]">
            {visualizer ? visualizer(isExecuting) : (
              <>
                {topic.visualizerType === 'hooks' && (
                  <HookVisualizer hooks={[
                    { type: 'useState', memoizedState: isExecuting ? 'Updated' : 'Initial', next: true },
                    { type: 'useEffect', memoizedState: isExecuting ? 'Syncing...' : 'Idle', next: false }
                  ]} />
                )}
                {topic.visualizerType === 'fiber' && (
                  <FiberVisualizer tree={{ 
                    id: '1', 
                    name: topic.title, 
                    type: 'component', 
                    status: isExecuting ? 'updating' : 'idle',
                    children: [
                      { id: '2', name: 'Child', type: 'component', status: isExecuting ? 'updating' : 'idle' }
                    ]
                  }} />
                )}
                {topic.visualizerType === 'render' && (
                  <div className="p-10 bg-muted rounded-xl border border-border h-full flex items-center justify-center text-center">
                      <div>
                        <div className={cn(
                          "w-12 h-12 bg-background rounded-full border border-border flex items-center justify-center mx-auto mb-6 shadow-sm transition-all duration-500",
                          isExecuting && "border-react shadow-[0_0_20px_rgba(0,216,255,0.3)] scale-110"
                        )}>
                          <Play className={cn("w-5 h-5 text-react fill-current", isExecuting && "animate-pulse")} />
                        </div>
                        <div className="text-foreground font-bold mb-2 uppercase tracking-[0.2em] text-[10px]">
                          {isExecuting ? 'Engine Active' : 'Simulation Engine'}
                        </div>
                        <div className="text-muted-foreground text-xs italic max-w-[200px] leading-relaxed">
                          {isExecuting ? 'Reconciling virtual DOM and committing changes...' : 'Execute code to initialize the render cycle visualization.'}
                        </div>
                      </div>
                  </div>
                )}
                {['props', 'state'].includes(topic.visualizerType) && (
                  <div className="p-10 bg-muted rounded-xl border border-border h-full flex items-center justify-center text-center">
                      <div>
                        <div className={cn(
                          "w-12 h-12 bg-background rounded-full border border-border flex items-center justify-center mx-auto mb-6 shadow-sm transition-all duration-500",
                          isExecuting && "border-react shadow-[0_0_20px_rgba(0,216,255,0.3)] scale-110"
                        )}>
                          <div className={cn("w-2 h-2 bg-react rounded-full", isExecuting && "animate-ping")} />
                        </div>
                        <div className="text-foreground font-bold mb-2 uppercase tracking-[0.2em] text-[10px]">
                          {topic.visualizerType} Visualizer
                        </div>
                        <div className="text-muted-foreground text-xs italic max-w-[200px] leading-relaxed">
                          {isExecuting ? `Tracking ${topic.visualizerType} flow...` : `Execute to visualize ${topic.visualizerType} changes.`}
                        </div>
                      </div>
                  </div>
                )}
              </>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
