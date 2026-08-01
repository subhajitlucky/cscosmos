'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { TOPICS, type Category } from '../data/topics';
import { ArrowLeft, Play, Info, AlertCircle, Sparkles } from 'lucide-react';
import HookVisualizer from '../components/visualizers/HookVisualizer';
import FiberVisualizer from '../components/visualizers/FiberVisualizer';
import ReactCodeEditor from '../components/ReactCodeEditor';
import { cn } from '../utils/cn';

const categoryColors: Record<Category, string> = {
  fundamentals: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
  rendering: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20',
  hooks: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
  internals: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
  performance: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
  patterns: 'text-pink-500 bg-pink-500/10 border-pink-500/20',
  concurrent: 'text-rose-500 bg-rose-500/10 border-rose-500/20',
};

const TopicDetail = ({ topicId }: { topicId?: string }) => {
  const topic = TOPICS.find(t => t.id === topicId) || TOPICS[0];
  const [code, setCode] = useState(topic?.codeSnippet || '');
  const [isExecuting, setIsExecuting] = useState(false);

  const handleExecute = () => {
    setIsExecuting(true);
    setTimeout(() => setIsExecuting(false), 2000);
  };

  const categoryStyle = categoryColors[topic.category as Category] || categoryColors.fundamentals;

  return (
    <div className="pt-20 pb-16 px-4 sm:px-6 lg:px-10 max-w-[1700px] mx-auto w-full min-h-screen space-y-10">
      {/* Navigation & Header */}
      <div>
        <Link href="/reactcosmos/learn" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors text-xs font-semibold uppercase tracking-wider">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Pathway
        </Link>

        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-4">
             <span className={cn("px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider border", categoryStyle)}>
                {topic.category}
             </span>
             <span className="text-muted-foreground text-xs font-semibold uppercase tracking-widest">{topic.difficulty}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-4 tracking-tight text-foreground">{topic.title}</h1>
          <p className="text-base text-muted-foreground leading-relaxed max-w-4xl">{topic.summary}</p>
        </motion.div>
      </div>

      {/* Mental Model Callout Card */}
      <div className="bg-muted/40 rounded-2xl p-6 sm:p-8 border border-border/80 shadow-sm">
        <h3 className="flex items-center gap-2 text-foreground font-bold mb-3 uppercase text-xs tracking-widest">
          <Info className="w-4 h-4 text-cyan-400" /> Mental Model
        </h3>
        <p className="text-foreground italic text-base leading-relaxed font-medium">
          "{topic.mentalModel}"
        </p>
      </div>

      {/* Full-Width Interactive Visualizer Canvas */}
      <div className="bg-card rounded-2xl border border-border/80 p-6 shadow-xl space-y-4">
        <div className="flex justify-between items-center pb-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-bold uppercase tracking-widest text-foreground">
              Interactive Engine Simulation
            </h3>
          </div>
          <button 
            onClick={handleExecute}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-widest transition-all shadow-md",
              isExecuting 
                ? "bg-emerald-500 text-white shadow-emerald-500/20" 
                : "bg-cyan-500 hover:bg-cyan-400 text-black shadow-cyan-500/20"
            )}
          >
            <Play className={cn("w-3.5 h-3.5 fill-current", isExecuting && "animate-pulse")} /> 
            {isExecuting ? 'Simulating Update...' : 'Execute Code'}
          </button>
        </div>

        <div className="min-h-[380px] sm:min-h-[460px] flex items-center justify-center">
          {topic.visualizerType === 'hooks' && (
            <HookVisualizer hooks={[
              { type: 'useState', memoizedState: isExecuting ? 1 : 0, next: true },
              { type: 'useState', memoizedState: 'React 19', next: true },
              { type: 'useEffect', memoizedState: isExecuting ? 'running' : '...', next: false }
            ]} />
          )}
          {topic.visualizerType === 'fiber' && (
            <FiberVisualizer tree={{
              id: '1',
              name: '<App />',
              type: 'component',
              status: isExecuting ? 'updating' : 'idle',
              children: [
                {
                  id: '2',
                  name: '<Header />',
                  type: 'component',
                  status: isExecuting ? 'updating' : 'idle',
                  children: [
                    { id: '3', name: 'div', type: 'dom', status: 'idle' }
                  ]
                },
                {
                  id: '4',
                  name: '<Main />',
                  type: 'component',
                  status: isExecuting ? 'updating' : 'idle',
                  children: [
                    { id: '5', name: 'section', type: 'dom', status: 'idle' }
                  ]
                }
              ]
            }} />
          )}
          {['render', 'props', 'state'].includes(topic.visualizerType) && (
            <div className="p-12 bg-muted/30 rounded-xl border border-border w-full h-[400px] flex items-center justify-center text-center">
                <div>
                  <div className={cn(
                    "w-16 h-16 bg-background rounded-2xl border border-border flex items-center justify-center mx-auto mb-6 shadow-md transition-all duration-500",
                    isExecuting && "border-cyan-400 shadow-[0_0_30px_rgba(0,216,255,0.3)] scale-110"
                  )}>
                    <Play className={cn("w-6 h-6 text-cyan-400 fill-current", isExecuting && "animate-pulse")} />
                  </div>
                  <div className="text-foreground font-bold mb-2 uppercase tracking-[0.2em] text-xs">
                    {isExecuting ? 'Simulation Active' : 'Simulation Engine'}
                  </div>
                  <div className="text-muted-foreground text-sm italic max-w-sm leading-relaxed">
                    {isExecuting ? 'Reconciling virtual DOM and committing changes to real DOM...' : 'Execute code to initialize the render cycle visualization.'}
                  </div>
                </div>
            </div>
          )}
        </div>
      </div>

      {/* Full-Width Live Code Execution Editor */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-widest text-foreground">
          Executable Code Snippet
        </h3>
        <ReactCodeEditor code={code} onChange={setCode} />
      </div>

      {/* Technical Takeaways */}
      <div className="bg-card rounded-2xl p-6 sm:p-8 border border-border/80 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-foreground font-bold uppercase text-xs tracking-widest">
          <AlertCircle className="w-4 h-4 text-amber-500" /> Technical Takeaways & Best Practices
        </div>
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {[
            "Component re-renders are triggered by state or prop changes.",
            "Reconciliation algorithm diffs the Virtual DOM to minimize actual DOM updates.",
            "Automatic batching optimizes multiple state updates into a single render cycle."
          ].map((item, i) => (
            <li key={i} className="p-4 rounded-xl bg-muted/40 border border-border text-xs text-muted-foreground leading-relaxed flex gap-3">
              <span className="text-cyan-400 font-bold font-mono select-none">0{i+1}.</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TopicDetail;
