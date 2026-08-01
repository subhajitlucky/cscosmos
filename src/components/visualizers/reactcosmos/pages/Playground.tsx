'use client';

import { useState } from 'react';
import { Play, RotateCcw, Share2, Terminal, Layers, Box, Cpu } from 'lucide-react';
import HookVisualizer from '../components/visualizers/HookVisualizer';
import FiberVisualizer from '../components/visualizers/FiberVisualizer';
import ReactCodeEditor from '../components/ReactCodeEditor';
import { cn } from '../utils/cn';

const DEFAULT_CODE = `function Counter() {
  const [count, setCount] = React.useState(0);
  
  return (
    <div className="p-6 rounded-xl border border-border bg-card shadow-lg max-w-sm text-center">
      <h1 className="text-2xl font-bold mb-4 text-foreground">Count: {count}</h1>
      <button 
        onClick={() => setCount(c => c + 1)}
        className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold uppercase tracking-wider rounded-lg shadow-md transition-all"
      >
        Increment State
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
    <div className="pt-20 min-h-screen flex flex-col bg-background transition-colors duration-300">
      {/* Playground Header Bar */}
      <div className="border-b border-border bg-card/60 backdrop-blur-md sticky top-16 z-20">
        <div className="max-w-[1700px] mx-auto h-14 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs font-black text-foreground uppercase tracking-[0.2em]">
                <Box className="w-4 h-4 text-cyan-400" /> React 19 Interactive Lab
            </div>
            <div className="h-4 w-px bg-border" />
            <span className="text-xs text-foreground font-mono bg-muted px-2.5 py-1 rounded border border-border">Counter.jsx</span>
          </div>
          <div className="flex items-center gap-3">
            <button 
              className="p-2 hover:bg-muted rounded-md text-muted-foreground transition-colors"
              onClick={() => setCode(DEFAULT_CODE)}
              title="Reset Code"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <div className="w-px h-4 bg-border mx-1" />
            <button 
              onClick={runSimulation}
              disabled={isRunning}
              className="flex items-center gap-2 px-5 py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs uppercase tracking-widest rounded-lg shadow-md transition-all disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 fill-current" /> {isRunning ? 'Syncing Engine...' : 'Run Simulation'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Spacious Workbench Grid */}
      <div className="flex-1 max-w-[1700px] w-full mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left: High-Contrast Live Editor & Console */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold uppercase tracking-widest text-foreground">
              Component Code Workbench
            </h3>
          </div>
          <ReactCodeEditor code={code} onChange={setCode} />

          <div className="rounded-xl border border-border p-4 bg-card font-mono text-xs shadow-md">
            <div className="flex items-center gap-2 uppercase mb-3 text-muted-foreground font-bold tracking-widest text-[10px]">
              <Terminal className="w-4 h-4 text-cyan-400" /> Simulation Logs
            </div>
            <div className="space-y-1.5 max-h-36 overflow-auto">
              {logs.map((log, i) => (
                <div key={i} className={cn("flex gap-3", i === 0 ? "text-foreground font-semibold" : "text-muted-foreground opacity-60")}>
                  <span className="opacity-30 select-none">[{logs.length - i}]</span> {log}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Visualizer & Simulation Output */}
        <div className="flex flex-col bg-card border border-border rounded-2xl overflow-hidden shadow-xl min-h-[520px]">
          <div className="h-12 border-b border-border flex px-6 gap-6 bg-muted/40">
            {[
              { id: 'preview', label: 'Reality Output', icon: Box },
              { id: 'fiber', label: 'Fiber Topology', icon: Layers },
              { id: 'hooks', label: 'Hook State Sync', icon: Cpu },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'preview' | 'fiber' | 'hooks')}
                className={cn(
                  "flex items-center gap-2 text-xs font-bold uppercase tracking-widest border-b-2 transition-all h-full",
                  activeTab === tab.id 
                    ? "border-cyan-400 text-foreground font-black" 
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                <tab.icon className={cn("w-4 h-4", activeTab === tab.id ? "text-cyan-400" : "")} />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex-1 p-8 overflow-auto relative">
            <div className="h-full relative z-10 flex items-center justify-center">
              {activeTab === 'preview' && (
                <div className="w-full h-full rounded-2xl border border-border border-dashed bg-muted/20 flex flex-col items-center justify-center p-8 text-center backdrop-blur-sm">
                    <div className={cn(
                      "w-20 h-20 rounded-3xl border border-border bg-card flex items-center justify-center mb-6 transition-all duration-700 shadow-xl",
                      isRunning && "scale-110 border-cyan-400 shadow-[0_0_50px_rgba(0,216,255,0.2)]"
                    )}>
                      <Box className={cn("w-10 h-10 text-muted-foreground transition-colors duration-500", isRunning && "text-cyan-400")} />
                    </div>
                    <h3 className="text-base font-bold mb-2 tracking-tight uppercase tracking-[0.1em] text-foreground">
                      {isRunning ? 'Reconciling State Updates' : 'Simulation Ready'}
                    </h3>
                    <p className="text-xs text-muted-foreground max-w-xs leading-relaxed font-medium">
                      {isRunning ? 'Diffing Virtual DOM tree and committing DOM mutation...' : 'Click "Run Simulation" to observe Virtual DOM & Fiber reconciliation.'}
                    </p>
                </div>
              )}

              {activeTab === 'fiber' && (
                <FiberVisualizer tree={{
                    id: '1', 
                    name: '<Counter />', 
                    type: 'component', 
                    status: isRunning ? 'updating' : 'idle',
                    children: [{ id: '2', name: 'div.container', type: 'dom', status: 'idle' }]
                }} />
              )}

              {activeTab === 'hooks' && (
                <HookVisualizer hooks={[
                    { type: 'useState', memoizedState: isRunning ? 'Updating...' : 0, next: false }
                ]} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Playground;
