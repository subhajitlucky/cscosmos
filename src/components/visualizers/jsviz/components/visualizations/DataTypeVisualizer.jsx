'use client';

import React, { useState } from 'react';
import { Layers, Database, Cpu, ArrowRight, Link as LinkIcon, Info } from 'lucide-react';

const DataTypeVisualizer = ({ stack = [], heap = [] }) => {
    const [hoveredAddr, setHoveredAddr] = useState(null);

    // Group references to see which variables share which heap address
    const refMap = {};
    stack.forEach(s => {
        if (s.isRef && s.value) {
            refMap[s.value] = refMap[s.value] || [];
            refMap[s.value].push(s.name);
        }
    });

    return (
        <div className="h-full w-full flex flex-col p-3 sm:p-4 gap-3 overflow-hidden bg-white dark:bg-zinc-950">
            {/* Top Toolbar */}
            <div className="flex items-center justify-between pb-2.5 border-b border-zinc-200 dark:border-zinc-800 flex-shrink-0">
                <div className="flex items-center gap-2">
                    <Database size={15} className="text-blue-600 dark:text-blue-400" />
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
                        Memory Map (Stack vs Heap)
                    </span>
                </div>
                <span className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5 font-medium">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    Live Engine State
                </span>
            </div>

            {/* Split Screen Memory Architecture: The Stack vs The Heap */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3 min-h-[360px] overflow-hidden">
                
                {/* 1. THE CALL STACK */}
                <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl flex flex-col overflow-hidden bg-zinc-50/50 dark:bg-zinc-900/40">
                    <div className="px-3.5 py-2.5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-white dark:bg-zinc-900">
                        <div className="flex items-center gap-2">
                            <Cpu size={15} className="text-emerald-700 dark:text-brand-lime" />
                            <div>
                                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
                                    The Stack (Values)
                                </h4>
                                <span className="text-[11px] text-zinc-500 dark:text-zinc-400 block -mt-0.5">
                                    Numbers, strings &amp; booleans
                                </span>
                            </div>
                        </div>
                        <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded border border-emerald-300 dark:border-brand-lime/30 bg-emerald-50 dark:bg-brand-lime/10 text-emerald-800 dark:text-brand-lime">
                            {stack.length} variable{stack.length !== 1 ? 's' : ''}
                        </span>
                    </div>

                    <div className="flex-1 p-3 overflow-y-auto space-y-2.5">
                        {stack.map((item, idx) => {
                            const isShared = item.isRef && (refMap[item.value]?.length || 0) > 1;
                            const isHovered = hoveredAddr && hoveredAddr === item.value;

                            return (
                                <div
                                    key={idx}
                                    onMouseEnter={() => item.isRef && setHoveredAddr(item.value)}
                                    onMouseLeave={() => setHoveredAddr(null)}
                                    className={`p-3 rounded-xl border transition-all duration-150 ${
                                        item.isRef
                                            ? isHovered
                                                ? 'border-blue-500 bg-blue-100/70 dark:bg-blue-500/20 shadow-md ring-1 ring-blue-400'
                                                : 'border-blue-300 dark:border-blue-500/40 bg-blue-50/70 dark:bg-blue-500/5 hover:border-blue-500'
                                            : 'border-emerald-300 dark:border-emerald-500/40 bg-emerald-50/70 dark:bg-emerald-500/5 hover:border-emerald-500'
                                    }`}
                                >
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="font-mono text-sm font-bold text-zinc-950 dark:text-zinc-50">
                                            {item.name}
                                        </span>
                                        {item.isRef ? (
                                            <span className="text-[10px] font-mono font-bold text-blue-800 dark:text-blue-300 bg-blue-100 dark:bg-blue-500/20 border border-blue-300 dark:border-blue-500/40 px-2 py-0.5 rounded">
                                                Pointer ➜
                                            </span>
                                        ) : (
                                            <span className="text-[10px] font-mono font-bold text-emerald-800 dark:text-brand-lime bg-emerald-100 dark:bg-brand-lime/20 border border-emerald-300 dark:border-brand-lime/40 px-2 py-0.5 rounded">
                                                Value Type
                                            </span>
                                        )}
                                    </div>

                                    {item.isRef ? (
                                        <div className="space-y-1">
                                            <div className="text-xs font-mono font-semibold text-blue-900 dark:text-blue-200 flex items-center justify-between">
                                                <span>Points to Heap:</span>
                                                <span className="px-1.5 py-0.2 rounded bg-blue-100 dark:bg-blue-900/60 font-bold">{item.value}</span>
                                            </div>
                                            {isShared && (
                                                <div className="text-[11px] font-sans text-amber-800 dark:text-amber-300 font-medium pt-1 flex items-center gap-1 border-t border-blue-200 dark:border-blue-900/40">
                                                    <LinkIcon size={11} className="shrink-0" />
                                                    <span>Shares with: <strong>{refMap[item.value].filter(n => n !== item.name).join(', ')}</strong></span>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="space-y-0.5">
                                            <div className="text-xs font-mono font-bold text-emerald-900 dark:text-emerald-300">
                                                Value: {item.value}
                                            </div>
                                            <div className="text-[11px] font-sans text-zinc-500 dark:text-zinc-400">
                                                ✓ Independent copy in memory
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}

                        {stack.length === 0 && (
                            <div className="h-full min-h-[160px] flex flex-col items-center justify-center p-6 text-center text-zinc-500 dark:text-zinc-400 font-mono text-xs">
                                <Cpu size={28} className="mb-2 opacity-30 text-emerald-600 dark:text-brand-lime" />
                                <span className="font-semibold text-zinc-700 dark:text-zinc-300">Stack is empty</span>
                                <span className="text-[11px] text-zinc-500 mt-0.5">Declare a variable (let a = 10) to see it here</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* 2. THE MEMORY HEAP */}
                <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl flex flex-col overflow-hidden bg-zinc-50/50 dark:bg-zinc-900/40">
                    <div className="px-3.5 py-2.5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-white dark:bg-zinc-900">
                        <div className="flex items-center gap-2">
                            <Database size={15} className="text-blue-600 dark:text-blue-400" />
                            <div>
                                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
                                    The Heap (Objects)
                                </h4>
                                <span className="text-[11px] text-zinc-500 dark:text-zinc-400 block -mt-0.5">
                                    Objects &amp; arrays in memory
                                </span>
                            </div>
                        </div>
                        <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded border border-blue-300 dark:border-blue-500/30 bg-blue-100 dark:bg-blue-500/10 text-blue-800 dark:text-blue-400">
                            {heap.length} object{heap.length !== 1 ? 's' : ''}
                        </span>
                    </div>

                    <div className="flex-1 p-3 overflow-y-auto space-y-2.5">
                        {heap.map((item, idx) => {
                            const holders = refMap[item.addr] || [];
                            const isHovered = hoveredAddr === item.addr;

                            return (
                                <div
                                    key={idx}
                                    onMouseEnter={() => setHoveredAddr(item.addr)}
                                    onMouseLeave={() => setHoveredAddr(null)}
                                    className={`p-3 rounded-xl border transition-all duration-150 space-y-2 ${
                                        isHovered
                                            ? 'border-blue-500 bg-blue-100/70 dark:bg-blue-500/20 shadow-md ring-1 ring-blue-400'
                                            : 'border-blue-300 dark:border-blue-500/30 bg-blue-50/40 dark:bg-blue-500/5 hover:border-blue-500'
                                    }`}
                                >
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="font-mono font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-500/20 text-blue-800 dark:text-blue-300 border border-blue-300 dark:border-blue-500/40 text-[10px]">
                                            Heap: {item.addr}
                                        </span>
                                        <span className="text-[11px] font-mono text-zinc-600 dark:text-zinc-400 font-medium">
                                            Used by: <strong className="text-zinc-950 dark:text-zinc-100 font-bold">{holders.join(', ') || 'Anonymous'}</strong>
                                        </span>
                                    </div>

                                    <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs sm:text-sm text-blue-200 overflow-x-auto font-medium">
                                        {item.content}
                                    </div>

                                    {holders.length > 1 && (
                                        <div className="text-[11px] font-sans text-amber-800 dark:text-amber-300 font-medium flex items-center gap-1">
                                            <Info size={11} className="shrink-0" />
                                            <span>Shared: Modifying this object affects both <strong>{holders.join(' & ')}</strong>!</span>
                                        </div>
                                    )}
                                </div>
                            );
                        })}

                        {heap.length === 0 && (
                            <div className="h-full min-h-[160px] flex flex-col items-center justify-center p-6 text-center text-zinc-500 dark:text-zinc-400 font-mono text-xs">
                                <Database size={28} className="mb-2 opacity-30 text-blue-500 dark:text-blue-400" />
                                <span className="font-semibold text-zinc-700 dark:text-zinc-300">No objects in Heap</span>
                                <span className="text-[11px] text-zinc-500 mt-0.5">Objects like &#123; name: &quot;Alice&quot; &#125; allocate here</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Simple Beginner-Friendly Footer */}
            <div className="px-3.5 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 flex flex-wrap items-center justify-between text-xs font-mono text-zinc-700 dark:text-zinc-300 gap-2 flex-shrink-0">
                <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0"></span>
                    <span><strong className="text-zinc-900 dark:text-zinc-100">Green (Stack)</strong> = Safe values. Copied independently.</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0"></span>
                    <span><strong className="text-zinc-900 dark:text-zinc-100">Blue (Heap)</strong> = Shared objects. Variables point to same data.</span>
                </div>
            </div>
        </div>
    );
};

export default DataTypeVisualizer;
