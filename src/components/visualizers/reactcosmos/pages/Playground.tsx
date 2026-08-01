'use client';
import { useState } from 'react';
import Editor from 'react-simple-code-editor';
// @ts-expect-error: prismjs types are incomplete
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import { Play, RotateCcw, Share2, Terminal, Layers, Box, Cpu } from 'lucide-react';
import HookVisualizer from '../components/visualizers/HookVisualizer';
import FiberVisualizer from '../components/visualizers/FiberVisualizer';
import { cn } from '../utils/cn';

const DEFAULT_CODE = `function Counter() {
  const [count, setCount] = React.useState(0);
  
  return (
    <div className="p-4 rounded-lg border border-border bg-card">
      <h1 className="text-xl font-bold mb-4">Count: {count}</h1>
      <button 
        onClick={() => setCount(c => c + 1)}
        className="px-4 py-2 bg-foreground text-background text-xs font-bold rounded-md hover:opacity-90 transition-premium"
      >
        Increment
      </button>
    </div>
  );
}`;

const Playground = () => {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [logs, setLogs] = useState<string[]>(['Fiber root initialized.', 'Initial render complete.']);
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'fiber' | 'hooks'>('preview');

  const runSimulation = () => {
    setIsRunning(true);
    const time = new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setLogs(prev => [`[${time}] Re-rendering <Counter /> ...`, ...prev]);
    setTimeout(() => {
      setLogs(prev => [`[${time}] Commit phase: DOM updated.`, ...prev]);
      setIsRunning(false);
    }, 1000);
  };

  return (
    <div className="pt-14 h-screen flex flex-col bg-background transition-colors duration-500 overflow-hidden">
      <div className="border-b border-border bg-card/50 backdrop-blur-md z-10">
        <div className="max-w-6xl mx-auto h-12 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
                <Box className="w-3 h-3 text-react" /> The Lab
            </div>
            <div className="h-4 w-px bg-border" />
            <span className="text-[12px] text-foreground font-mono bg-muted px-2 py-0.5 rounded border border-border">Counter.jsx</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-muted rounded-md text-muted-foreground transition-premium"><Share2 className="w-4 h-4" /></button>
            <button className="p-2 hover:bg-muted rounded-md text-muted-foreground transition-premium" onClick={() => setCode(DEFAULT_CODE)}><RotateCcw className="w-4 h-4" /></button>
            <div className="w-px h-4 bg-border mx-1" />
            <button 
                onClick={runSimulation}
                disabled={isRunning}
                className="flex items-center gap-2 px-4 py-1.5 bg-foreground text-background font-bold text-[11px] rounded-md transition-premium disabled:opacity-50"
            >
                <Play className="w-3 h-3 fill-current" /> {isRunning ? 'Syncing...' : 'Run Simulation'}
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-10 overflow-hidden">
        <div className="flex-1 flex gap-6 max-w-6xl w-full h-full overflow-hidden">
          <div className="w-[45%] flex flex-col bg-card border border-border rounded-2xl overflow-hidden shadow-2xl shadow-black/5 transition-premium">
             <div className="flex-1 overflow-auto p-6 editor-container">
                <Editor
                  value={code}
                  onValueChange={code => setCode(code)}
                  highlight={code => highlight(code, languages.js)}
                  padding={10}
                  className="focus:outline-none"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 13,
                    backgroundColor: 'transparent',
                  }}
                />
             </div>
             
             <div className="h-36 border-t border-border p-4 bg-muted/20 font-mono text-[11px]">
                <div className="flex items-center gap-2 uppercase mb-3 text-muted-foreground font-bold tracking-widest text-[9px]">
                  <Terminal className="w-3.5 h-3.5" /> Simulation Logs
                </div>
                <div className="space-y-1.5 overflow-auto h-[calc(100%-25px)]">
                  {logs.map((log, i) => (
                    <div key={i} className={cn("flex gap-3", i === 0 ? "text-foreground font-medium" : "text-muted-foreground opacity-50")}>
                      <span className="opacity-20 select-none">[{logs.length - i}]</span> {log}
                    </div>
                  ))}
                </div>
             </div>
          </div>

          <div className="flex-1 flex flex-col bg-card border border-border rounded-2xl overflow-hidden shadow-2xl shadow-black/5 transition-premium">
             <div className="h-11 border-b border-border flex px-6 gap-6 bg-muted/5">
                {[
                  { id: 'preview', label: 'Reality', icon: Box },
                  { id: 'fiber', label: 'Topology', icon: Layers },
                  { id: 'hooks', label: 'State Sync', icon: Cpu },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as 'preview' | 'fiber' | 'hooks')}
                    className={cn(
                      "flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest border-b-2 transition-premium h-full",
                      activeTab === tab.id 
                        ? "border-react text-foreground" 
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <tab.icon className={cn("w-3.5 h-3.5", activeTab === tab.id ? "text-react" : "")} />
                    {tab.label}
                  </button>
                ))}
             </div>

             <div className="flex-1 p-8 overflow-auto relative bg-zinc-50/30 dark:bg-black/40">
                <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05] pointer-events-none bg-[radial-gradient(#00d8ff_1px,transparent_1px)] [background-size:32px_32px]" />
                
                <div className="h-full relative z-10">
                  {activeTab === 'preview' && (
                    <div className="h-full rounded-2xl border border-border border-dashed bg-zinc-50/50 dark:bg-zinc-900/20 flex flex-col items-center justify-center p-12 text-center transition-premium backdrop-blur-[2px]">
                        <div className={cn(
                          "w-20 h-20 rounded-3xl border border-border bg-card flex items-center justify-center mb-8 transition-all duration-700 shadow-2xl shadow-black/20",
                          isRunning && "scale-110 border-react shadow-[0_0_50px_rgba(0,216,255,0.15)] dark:shadow-[0_0_60px_rgba(0,216,255,0.2)]"
                        )}>
                          <Box className={cn("w-10 h-10 text-muted-foreground transition-colors duration-500", isRunning && "text-react")} />
                        </div>
                        <h3 className="text-[14px] font-bold mb-3 tracking-tight uppercase tracking-[0.1em]">Physical Manifestation</h3>
                        <p className="text-[11px] text-muted-foreground max-w-[240px] leading-relaxed font-medium opacity-80">
                          The synchronized output of the Virtual Void simulation engine.
                        </p>
                    </div>
                  )}

                  {activeTab === 'fiber' && (
                    <FiberVisualizer tree={{
                        id: '1', 
                        name: '<Counter />', 
                        type: 'component', 
                        status: isRunning ? 'updating' : 'idle',
                        children: [{ id: '2', name: 'div', type: 'dom', status: 'idle' }]
                    }} />
                  )}

                  {activeTab === 'hooks' && (
                    <HookVisualizer hooks={[
                        { type: 'useState', memoizedState: isRunning ? '...' : 0, next: false }
                    ]} />
                  )}
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Playground;
