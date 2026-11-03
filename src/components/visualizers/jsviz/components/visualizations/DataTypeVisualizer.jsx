'use client';

import React, { useState } from 'react';
import { Database, Cpu, Link as LinkIcon, AlertTriangle, CheckCircle2, ArrowRight, Info } from 'lucide-react';

const DataTypeVisualizer = ({ stack = [], heap = [] }) => {
    const [selectedAddr, setSelectedAddr] = useState(null);
    const [hoveredAddr, setHoveredAddr] = useState(null);

    const activeAddr = hoveredAddr || selectedAddr;

    // Group references to see which variables share which heap address
    const refMap = {};
    stack.forEach(s => {
        if (s.isRef && s.value) {
            refMap[s.value] = refMap[s.value] || [];
            refMap[s.value].push(s.name);
        }
    });

    const handleSelectAddress = (addr) => {
        if (selectedAddr === addr) {
            setSelectedAddr(null);
        } else {
            setSelectedAddr(addr);
        }
    };

    return (
        <div className="h-full w-full flex flex-col p-3 sm:p-4 gap-3 overflow-hidden bg-white dark:bg-zinc-950 font-sans">
            {/* Top Toolbar */}
            <div className="flex items-center justify-between pb-2.5 border-b border-zinc-200 dark:border-zinc-800 flex-shrink-0">
                <div className="flex items-center gap-2">
                    <Database size={15} className="text-blue-600 dark:text-blue-400" />
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
                        Memory Map (Stack vs Heap)
                    </span>
                </div>
                <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
                    <span className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-brand-lime font-bold border border-emerald-300 dark:border-emerald-700/40">
                        {stack.length} in Stack
                    </span>
                    <span className="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 font-bold border border-blue-300 dark:border-blue-700/40">
                        {heap.length} in Heap
                    </span>
                </div>
            </div>

            {/* Split Screen Memory Architecture: The Stack vs The Heap */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3 min-h-[360px] overflow-hidden">
                
                {/* 1. THE CALL STACK */}
                <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl flex flex-col overflow-hidden bg-zinc-50/50 dark:bg-zinc-900/30">
                    <div className="px-3.5 py-2.5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-white dark:bg-zinc-900">
                        <div className="flex items-center gap-2">
                            <Cpu size={15} className="text-emerald-700 dark:text-brand-lime" />
                            <div>
                                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
                                    The Stack (Values)
                                </h4>
                                <span className="text-[11px] text-zinc-500 dark:text-zinc-400 block">
                                    Stores variables &amp; raw primitives
                                </span>
                            </div>
                        </div>
                        <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                            Fast Memory
                        </span>
                    </div>

                    <div className="flex-1 p-3 overflow-y-auto space-y-2.5">
                        {stack.map((item, idx) => {
                            const isShared = item.isRef && (refMap[item.value]?.length || 0) > 1;
                            const isHighlighted = activeAddr && activeAddr === item.value;

                            return (
                                <div
                                    key={idx}
                                    onClick={() => item.isRef && handleSelectAddress(item.value)}
                                    onMouseEnter={() => item.isRef && setHoveredAddr(item.value)}
                                    onMouseLeave={() => setHoveredAddr(null)}
                                    className={`p-3 rounded-xl border transition-all duration-150 relative ${
                                        item.isRef ? 'cursor-pointer' : ''
                                    } ${
                                        item.isRef
                                            ? isHighlighted
                                                ? 'border-blue-500 bg-blue-100/80 dark:bg-blue-500/20 shadow-md ring-2 ring-blue-400 scale-[1.01]'
                                                : isShared
                                                    ? 'border-amber-300 dark:border-amber-500/40 bg-amber-50/50 dark:bg-amber-950/20 hover:border-blue-400'
                                                    : 'border-blue-200 dark:border-blue-500/30 bg-blue-50/40 dark:bg-blue-500/5 hover:border-blue-400'
                                            : 'border-emerald-200 dark:border-emerald-500/30 bg-emerald-50/40 dark:bg-emerald-500/5'
                                    }`}
                                >
                                    {/* Top Row: Variable Name + Type Badge */}
                                    <div className="flex items-center justify-between gap-2 mb-1.5">
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-[10px] font-mono text-zinc-400 select-none">#{idx + 1}</span>
                                            <code className="font-mono text-sm font-bold text-zinc-950 dark:text-zinc-50">
                                                {item.name}
                                            </code>
                                        </div>
                                        {item.isRef ? (
                                            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-blue-300 dark:border-blue-500/40 bg-blue-100 dark:bg-blue-500/20 text-blue-800 dark:text-blue-300">
                                                Pointer ➜
                                            </span>
                                        ) : (
                                            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-emerald-300 dark:border-emerald-500/40 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-brand-lime">
                                                Primitive Value
                                            </span>
                                        )}
                                    </div>

                                    {/* Middle Row: Content */}
                                    {item.isRef ? (
                                        <div className="space-y-1.5">
                                            <div className="text-xs font-mono font-semibold text-blue-900 dark:text-blue-200 flex items-center justify-between bg-white/70 dark:bg-black/30 p-1.5 rounded border border-blue-200 dark:border-blue-900/50">
                                                <span className="text-zinc-500 text-[11px]">Points to Heap:</span>
                                                <span className="px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/60 font-bold text-xs">{item.value}</span>
                                            </div>
                                            {isShared && (
                                                <div className="text-[11px] font-sans text-amber-800 dark:text-amber-300 font-medium pt-1 flex items-center gap-1.5">
                                                    <LinkIcon size={12} className="shrink-0 text-amber-600 dark:text-amber-400" />
                                                    <span>Shares object with: <strong className="font-bold underline">{refMap[item.value].filter(n => n !== item.name).join(', ')}</strong></span>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="space-y-1">
                                            <div className="text-xs font-mono font-bold text-emerald-900 dark:text-emerald-300 bg-white/70 dark:bg-black/30 p-1.5 rounded border border-emerald-200 dark:border-emerald-900/50 flex items-center justify-between">
                                                <span className="text-zinc-500 text-[11px] font-normal">Direct Value:</span>
                                                <span>{item.value}</span>
                                            </div>
                                            <div className="text-[11px] font-sans text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
                                                <CheckCircle2 size={12} className="text-emerald-600 dark:text-brand-lime shrink-0" />
                                                <span>Independent copy. Editing it won&apos;t affect other variables.</span>
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
                <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl flex flex-col overflow-hidden bg-zinc-50/50 dark:bg-zinc-900/30">
                    <div className="px-3.5 py-2.5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-white dark:bg-zinc-900">
                        <div className="flex items-center gap-2">
                            <Database size={15} className="text-blue-600 dark:text-blue-400" />
                            <div>
                                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
                                    The Heap (Objects)
                                </h4>
                                <span className="text-[11px] text-zinc-500 dark:text-zinc-400 block">
                                    Stores dynamic objects &amp; arrays
                                </span>
                            </div>
                        </div>
                        <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                            Dynamic Memory
                        </span>
                    </div>

                    <div className="flex-1 p-3 overflow-y-auto space-y-2.5">
                        {heap.map((item, idx) => {
                            const holders = refMap[item.addr] || [];
                            const isHighlighted = activeAddr && activeAddr === item.addr;
                            const isShared = holders.length > 1;

                            return (
                                <div
                                    key={idx}
                                    onClick={() => handleSelectAddress(item.addr)}
                                    onMouseEnter={() => setHoveredAddr(item.addr)}
                                    onMouseLeave={() => setHoveredAddr(null)}
                                    className={`p-3 rounded-xl border transition-all duration-150 space-y-2 cursor-pointer ${
                                        isHighlighted
                                            ? 'border-blue-500 bg-blue-100/80 dark:bg-blue-500/20 shadow-md ring-2 ring-blue-400 scale-[1.01]'
                                            : isShared
                                                ? 'border-amber-300 dark:border-amber-500/40 bg-amber-50/50 dark:bg-amber-950/20 hover:border-blue-400'
                                                : 'border-blue-200 dark:border-blue-500/30 bg-blue-50/40 dark:bg-blue-500/5 hover:border-blue-400'
                                    }`}
                                >
                                    {/* Top Row: Address Tag & Holders */}
                                    <div className="flex items-center justify-between gap-2 text-xs">
                                        <span className="font-mono font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-500/20 text-blue-800 dark:text-blue-300 border border-blue-300 dark:border-blue-500/40 text-[10px]">
                                            Address: {item.addr}
                                        </span>
                                        <span className="text-[11px] font-mono text-zinc-600 dark:text-zinc-400">
                                            Variables: <strong className="text-zinc-950 dark:text-zinc-100 font-bold">{holders.join(', ') || 'None'}</strong>
                                        </span>
                                    </div>

                                    {/* Object Content */}
                                    <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs sm:text-sm text-blue-200 overflow-x-auto font-medium">
                                        {item.content}
                                    </div>

                                    {/* Shared Danger Banner */}
                                    {isShared ? (
                                        <div className="p-2 rounded-lg bg-amber-100/80 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700/50 text-amber-900 dark:text-amber-300 text-[11px] font-sans flex items-start gap-1.5 leading-snug">
                                            <AlertTriangle size={13} className="shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
                                            <span>
                                                <strong>Shared Mutation:</strong> Both <code>{holders[0]}</code> and <code>{holders[1]}</code> point to this same box. Changing one changes both!
                                            </span>
                                        </div>
                                    ) : (
                                        <div className="text-[11px] font-sans text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
                                            <CheckCircle2 size={12} className="text-emerald-600 dark:text-brand-lime shrink-0" />
                                            <span>Isolated: Only <code>{holders[0]}</code> currently points here.</span>
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
                    <span><strong className="text-zinc-900 dark:text-zinc-100">Blue (Heap)</strong> = Shared objects. Multiple variables can point to the same data.</span>
                </div>
            </div>
        </div>
    );
};

export default DataTypeVisualizer;
