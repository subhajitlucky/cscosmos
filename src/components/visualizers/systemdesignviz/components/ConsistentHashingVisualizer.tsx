'use client';

import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Network, Plus, RefreshCw, RotateCcw, Server, Sparkles, Trash2, Zap } from 'lucide-react';

interface NodeItem {
  id: string;
  name: string;
  angle: number;
  color: string;
}

export function ConsistentHashingVisualizer() {
  const [nodes, setNodes] = useState<NodeItem[]>([
    { id: 'srv-1', name: 'Server A', angle: 45, color: 'bg-emerald-500 text-slate-950 border-emerald-400' },
    { id: 'srv-2', name: 'Server B', angle: 135, color: 'bg-sky-500 text-slate-950 border-sky-400' },
    { id: 'srv-3', name: 'Server C', angle: 225, color: 'bg-amber-500 text-slate-950 border-amber-400' },
    { id: 'srv-4', name: 'Server D', angle: 315, color: 'bg-purple-500 text-slate-950 border-purple-400' },
  ]);

  const [vNodesEnabled, setVNodesEnabled] = useState<boolean>(false);
  const [log, setLog] = useState<string>('Consistent Hash Ring initialized with 4 physical servers.');

  const sampleKeys = [
    { key: 'user_849', angle: 70, target: 'Server B' },
    { key: 'session_91', angle: 190, target: 'Server C' },
    { key: 'cart_102', angle: 340, target: 'Server A' },
  ];

  const handleAddServer = () => {
    if (nodes.length < 6) {
      const newNode: NodeItem = {
        id: `srv-${nodes.length + 1}`,
        name: `Server ${String.fromCharCode(65 + nodes.length)}`,
        angle: 160,
        color: 'bg-rose-500 text-slate-950 border-rose-400',
      };
      setNodes((prev) => [...prev, newNode]);
      setLog(`⚡ MINIMAL MIGRATION: Added Server E at 160°. ONLY keys between 135° and 160° are remapped. 85% of cluster keys remained completely undisturbed (K/N migration ratio).`);
    }
  };

  const handleRemoveServer = () => {
    if (nodes.length > 2) {
      const removed = nodes[nodes.length - 1];
      setNodes((prev) => prev.slice(0, -1));
      setLog(`Server ${removed.name} removed. Its assigned key partition shifted clockwise to its immediate successor with zero impact on other servers.`);
    }
  };

  const handleReset = () => {
    setNodes([
      { id: 'srv-1', name: 'Server A', angle: 45, color: 'bg-emerald-500 text-slate-950 border-emerald-400' },
      { id: 'srv-2', name: 'Server B', angle: 135, color: 'bg-sky-500 text-slate-950 border-sky-400' },
      { id: 'srv-3', name: 'Server C', angle: 225, color: 'bg-amber-500 text-slate-950 border-amber-400' },
      { id: 'srv-4', name: 'Server D', angle: 315, color: 'bg-purple-500 text-slate-950 border-purple-400' },
    ]);
    setLog('Reset ring to 4 physical servers.');
  };

  return (
    <div className="rounded-3xl border border-indigo-500/30 bg-indigo-500/5 dark:bg-indigo-500/10 p-6 sm:p-8 space-y-6 shadow-xl my-8">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-indigo-500/20 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-md">
            <Network className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs uppercase font-extrabold tracking-wider text-indigo-600 dark:text-indigo-400">
              Distributed Partitioning Engine
            </div>
            <h3 className="text-xl font-bold text-foreground">
              Consistent Hashing Ring &amp; Virtual Nodes
            </h3>
          </div>
        </div>

        <button
          onClick={() => setVNodesEnabled((prev) => !prev)}
          className={`px-3 py-1 rounded-full font-mono text-xs font-bold border transition ${
            vNodesEnabled
              ? 'bg-indigo-600 text-white border-indigo-500'
              : 'bg-card border-border text-foreground'
          }`}
        >
          {vNodesEnabled ? '⚡ 150 VIRTUAL NODES ENABLED' : 'Enable Virtual Nodes'}
        </button>
      </div>

      {/* Hash Ring Canvas representation */}
      <div className="p-6 rounded-3xl bg-slate-950 text-slate-100 border border-slate-800 space-y-4 font-mono text-xs shadow-inner">
        <div className="text-slate-400 text-[11px] border-b border-slate-800 pb-2 flex items-center justify-between">
          <span>Hash Ring Range: [0x00000000 ➔ 0xFFFFFFFF] (0° ➔ 360°)</span>
          <span className="text-indigo-400 font-bold">{nodes.length} Active Nodes</span>
        </div>

        {/* Server Nodes Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {nodes.map((node) => (
            <div
              key={node.id}
              className={`p-3 rounded-2xl border ${node.color} text-center space-y-1 shadow-md`}
            >
              <div className="font-extrabold text-sm">{node.name}</div>
              <div className="text-[10px] opacity-80">Ring Position: {node.angle}°</div>
            </div>
          ))}
        </div>

        {/* Key Route Simulator */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 mt-4">
          <span className="text-slate-400 font-bold text-[11px]">Clockwise Key Routing Map:</span>
          <div className="grid sm:grid-cols-3 gap-2">
            {sampleKeys.map((k, idx) => (
              <div key={idx} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-[11px]">
                <span className="text-amber-300 font-bold">{k.key} ({k.angle}°)</span>
                <span className="text-indigo-300 font-bold flex items-center gap-1">➔ {k.target}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Log Box */}
      <div className="p-4 rounded-2xl bg-slate-950 text-slate-100 font-mono text-xs border border-slate-800 space-y-1 shadow-inner">
        <span className="text-indigo-400 font-bold">Ring Event Log:</span>
        <p className="text-slate-300 leading-relaxed">{log}</p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <button
          onClick={handleReset}
          className="px-4 py-2.5 rounded-2xl border border-border hover:bg-card text-foreground text-xs font-bold transition flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Ring</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRemoveServer}
            disabled={nodes.length <= 2}
            className="px-4 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-extrabold text-xs transition shadow-md flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Remove Server</span>
          </button>

          <button
            onClick={handleAddServer}
            disabled={nodes.length >= 6}
            className="px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-extrabold text-xs transition shadow-md flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Server E (Scale Out)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
