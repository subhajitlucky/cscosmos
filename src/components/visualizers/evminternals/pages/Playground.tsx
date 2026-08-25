import React, { useState } from 'react';
import { useEVM } from '../hooks/useEVM';
import StackVisualizer from '../components/visualizers/StackVisualizer';
import MemoryVisualizer from '../components/visualizers/MemoryVisualizer';
import StorageVisualizer from '../components/visualizers/StorageVisualizer';
import OpcodeVisualizer from '../components/visualizers/OpcodeVisualizer';
import GasMeter from '../components/visualizers/GasMeter';
import { SkipForward, RotateCcw, ArrowLeft, Terminal, AlertCircle, Info, BrainCircuit, Sparkles } from 'lucide-react';

const DEFAULT_BYTECODE = '604260005260206000f3'; // PUSH1 42 PUSH1 00 MSTORE PUSH1 20 PUSH1 00 RETURN

const Playground: React.FC = () => {
  const [bytecode, setBytecode] = useState(DEFAULT_BYTECODE);
  const { engine, state, agentResponse, step, undo, reset } = useEVM(DEFAULT_BYTECODE);

  const handleReset = () => {
    reset(bytecode);
  };

  const examples = [
    { name: 'Simple Add', code: '6002600301' },
    { name: 'Memory', code: '604260005260206000f3' },
    { name: 'Storage', code: '60ff600055' },
    { name: 'Jump', code: '600a60015760006000fd5b6042600052' },
    { name: 'Loop', code: '5b600101600056' }, // JUMPDEST, ADD 1, JUMP to 0
  ];

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold mb-1.5 text-neutral-900 dark:text-white">EVM Playground</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Write bytecode and step through execution in real-time.</p>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-hide bg-white dark:bg-neutral-900/50 px-2 py-1 rounded-lg border border-neutral-200 dark:border-neutral-800 transition-colors">
          <span className="text-[10px] font-semibold text-neutral-400 dark:text-neutral-500 uppercase px-1.5 shrink-0">Examples:</span>
          {examples.map((ex) => (
            <button
              key={ex.name}
              onClick={() => {
                setBytecode(ex.code);
                reset(ex.code);
              }}
              className="px-2.5 py-1 rounded bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-[10px] font-medium text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:border-neutral-300 dark:hover:border-evm-accent/50 transition-all whitespace-nowrap"
            >
              {ex.name}
            </button>
          ))}
        </div>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 transition-colors">
        <div className="flex items-center gap-3 flex-1 min-w-[250px]">
          <div className="relative flex-1">
            <Terminal size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500" />
            <input
              type="text"
              value={bytecode}
              onChange={(e) => setBytecode(e.target.value)}
              placeholder="Enter Bytecode (hex)..."
              className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-md py-2 pl-9 pr-3 font-mono text-xs focus:outline-none focus:border-evm-accent/50 text-neutral-900 dark:text-neutral-100 transition-colors"
            />
          </div>
          <button
            onClick={handleReset}
            className="p-2 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
            title="Reload Code"
          >
            <RotateCcw size={16} />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={undo}
            disabled={!engine || engine.history.length === 0}
            className="px-3 py-2 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1.5 transition-all text-xs font-medium"
          >
            <ArrowLeft size={14} /> Undo
          </button>
          <button
            onClick={step}
            disabled={!state || (state.status !== 'idle' && state.status !== 'running')}
            className="px-5 py-2 rounded-md bg-evm-accent text-neutral-950 font-semibold hover:bg-evm-accent/90 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1.5 transition-all text-xs shadow-sm"
          >
            <SkipForward size={14} /> Step
          </button>
        </div>
      </div>

      {state?.error && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs flex items-start gap-2.5 animate-in fade-in slide-in-from-top-2">
          <AlertCircle size={14} className="mt-0.5 shrink-0" />
          <div>
            <div className="font-bold uppercase text-[10px] mb-1">Execution Error</div>
            <p>{state.error}</p>
          </div>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
        {/* Column 1: Code & Status */}
        <div className="xl:col-span-3 flex flex-col gap-4">
          {/* Smart Assistant Panel */}
          <div className="p-4 rounded-lg bg-blue-500/10 dark:bg-blue-500/15 border border-blue-500/20 dark:border-blue-500/30 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
              <BrainCircuit size={32} className="text-blue-500" />
            </div>
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-2.5 flex items-center gap-1.5">
              <Sparkles size={12} /> Smart Assistant
            </h3>
            <div className="space-y-2.5 relative z-10">
              <div className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed font-medium italic">
                "{agentResponse?.thought}"
              </div>
              {agentResponse?.suggestion && (
                <div className="text-[10px] bg-evm-accent/10 dark:bg-evm-accent/20 text-evm-accent p-2 rounded border border-evm-accent/20 dark:border-evm-accent/30">
                  <span className="font-bold">Tip:</span> {agentResponse.suggestion}
                </div>
              )}
              {agentResponse?.warning && (
                <div className="text-[10px] bg-red-500/10 dark:bg-red-500/20 text-red-600 dark:text-red-400 p-2 rounded border border-red-500/20 dark:border-red-500/30">
                  <span className="font-bold">Warning:</span> {agentResponse.warning}
                </div>
              )}
            </div>
          </div>

          <div className="h-[350px] xl:h-[420px]">
            <OpcodeVisualizer code={state?.code || new Uint8Array(0)} pc={state?.pc || 0} />
          </div>
          <GasMeter
            totalUsed={state?.gasDetails?.totalUsed || 0}
            lastCost={state?.gasDetails?.lastCost || 0}
            remaining={state?.gas || 0}
            refund={state?.gasDetails?.refund || 0}
          />
          <div className="p-3.5 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 transition-colors">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-2.5 flex items-center gap-1.5">
              <Info size={10} /> Status
            </h3>
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className={`text-base font-bold uppercase tracking-tight ${
                  state?.status === 'halted' ? 'text-green-600 dark:text-green-400' :
                  state?.status === 'error' || state?.status === 'reverted' ? 'text-red-600 dark:text-red-400' :
                  state?.status === 'running' ? 'text-blue-600 dark:text-blue-400' : 'text-neutral-400 dark:text-neutral-500'
                }`}>
                  {state?.status || 'IDLE'}
                </span>
                <span className="text-[10px] text-neutral-400 dark:text-neutral-600 font-mono">PC: {state?.pc || 0}</span>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-neutral-400 dark:text-neutral-500 uppercase font-semibold">Stack Depth</div>
                <div className="font-mono text-sm text-neutral-900 dark:text-white">{state?.stack.length || 0} / 1024</div>
              </div>
            </div>
          </div>
        </div>

        {/* Column 2: Stack & Storage */}
        <div className="xl:col-span-3 flex flex-col gap-4">
          <div className="h-[350px] xl:h-[450px]">
            <StackVisualizer stack={state?.stack || []} />
          </div>
          <div className="h-[220px] xl:h-[260px]">
            <StorageVisualizer storage={state?.storage || {}} />
          </div>
        </div>

        {/* Column 3: Memory */}
        <div className="xl:col-span-6 h-[600px] xl:h-[750px]">
          <MemoryVisualizer memory={state?.memory || new Uint8Array(0)} />
        </div>
      </div>

      {/* Quick Guide - Always Visible Below */}
      <div className="mt-8 p-6 rounded-xl bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800">
        <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-5">How to Use the Playground</h3>

        <div className="space-y-6">
          {/* What to Do */}
          <div>
            <h4 className="text-sm font-bold text-neutral-800 dark:text-neutral-200 mb-2 flex items-center gap-2">
              <span className="w-5 h-5 rounded bg-evm-accent text-neutral-950 text-xs flex items-center justify-center">1</span>
              What to Do
            </h4>
            <ol className="text-sm text-neutral-600 dark:text-neutral-400 space-y-1 ml-7 list-decimal">
              <li>Click an <strong>Example</strong> above (like "Simple Add" or "Memory")</li>
              <li>Click <strong>Step</strong> to run one instruction at a time</li>
              <li>Watch how values move between Stack, Memory, and Storage</li>
              <li>Click <strong>Undo</strong> to go back and try again</li>
            </ol>
          </div>

          {/* What to Observe */}
          <div>
            <h4 className="text-sm font-bold text-neutral-800 dark:text-neutral-200 mb-2 flex items-center gap-2">
              <span className="w-5 h-5 rounded bg-blue-500 text-white text-xs flex items-center justify-center">2</span>
              What to Observe
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ml-7">
              <div className="flex items-start gap-2">
                <span className="text-evm-accent mt-0.5">→</span>
                <p className="text-sm text-neutral-600 dark:text-neutral-400"><strong>PC (Program Counter):</strong> Shows which instruction runs next</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-evm-accent mt-0.5">→</span>
                <p className="text-sm text-neutral-600 dark:text-neutral-400"><strong>Stack:</strong> Values pushed/popped like a stack of plates</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-evm-accent mt-0.5">→</span>
                <p className="text-sm text-neutral-600 dark:text-neutral-400"><strong>Memory:</strong> Data stored temporarily at byte offsets</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-evm-accent mt-0.5">→</span>
                <p className="text-sm text-neutral-600 dark:text-neutral-400"><strong>Gas:</strong> Computational cost (storage = expensive!)</p>
              </div>
            </div>
          </div>

          {/* What to Learn */}
          <div>
            <h4 className="text-sm font-bold text-neutral-800 dark:text-neutral-200 mb-2 flex items-center gap-2">
              <span className="w-5 h-5 rounded bg-green-500 text-white text-xs flex items-center justify-center">3</span>
              What to Learn
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 ml-7">
              <div className="p-3 rounded-lg bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
                <span className="text-xs font-bold text-evm-accent">6002600301</span>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">Simple math: Push 5, push 4, multiply = 20, push 3, add = 23</p>
              </div>
              <div className="p-3 rounded-lg bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
                <span className="text-xs font-bold text-evm-accent">604260005260206000f3</span>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">Store value 42 at memory position 0, then return 32 bytes from position 0</p>
              </div>
              <div className="p-3 rounded-lg bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
                <span className="text-xs font-bold text-evm-accent">60ff600055</span>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">Write 255 to storage slot 0. This persists on blockchain (costs ~20k gas!)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Playground;
