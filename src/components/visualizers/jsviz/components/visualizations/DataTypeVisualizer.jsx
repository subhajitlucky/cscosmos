'use client';

import React, { useState } from 'react';
import { Layers, Database, Cpu, ArrowRight } from 'lucide-react';

const PRESETS = [
    {
        id: 'primitives',
        label: '1. Pass-by-Value',
        badge: 'Primitives',
        code: `// 1. Primitives: Copied by Value into Stack Slots
let primaryScore = 100;
let replicaScore = primaryScore; // Discrete stack copy

replicaScore = 200; // Only replicaScore is modified
console.log("primaryScore:", primaryScore); // 100
console.log("replicaScore:", replicaScore); // 200`
    },
    {
        id: 'objects',
        label: '2. Pass-by-Reference',
        badge: 'Objects',
        code: `// 2. Objects: Copied by Reference (Shared Pointer)
let user1 = { name: "Alice" };
let user2 = user1; // Both hold pointer 0x4F12!

user2.name = "Bob"; // Mutates shared heap memory

console.log("user1.name:", user1.name); // "Bob"
console.log("user2.name:", user2.name); // "Bob"`
    },
    {
        id: 'arrays',
        label: '3. Heap Array Allocation',
        badge: 'Arrays',
        code: `// 3. Arrays are Objects stored in the Heap
let taskQueue = ["Build", "Test"];
let workerQueue = taskQueue; // Shared heap reference

workerQueue.push("Deploy");

console.log("taskQueue:", taskQueue); // ["Build", "Test", "Deploy"]`
    },
    {
        id: 'null-undefined',
        label: '4. Memory States',
        badge: 'Null vs Undefined',
        code: `// 4. Undefined (Uninitialized) vs Null (Intentional Absence)
let responseData; // undefined (Unassigned stack slot)
let sessionToken = null; // null (Intentional absence of object pointer)
let requestCount = 0; // 0 (Valid 32-bit primitive integer)`
    }
];

const DataTypeVisualizer = ({ stack = [], heap = [], onSelectPreset }) => {
    const [hoveredAddr, setHoveredAddr] = useState(null);

    // Group references to see who points to which address
    const refMap = {};
    stack.forEach(s => {
        if (s.isRef && s.value) {
            refMap[s.value] = refMap[s.value] || [];
            refMap[s.value].push(s.name);
        }
    });

    return (
        <div className="h-full w-full flex flex-col p-3 sm:p-5 gap-4 overflow-hidden" style={{ backgroundColor: 'var(--bg-main)' }}>
            {/* Quick Interactive Presets Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-brand-border/40 pb-3">
                <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm font-mono font-bold text-emerald-800 dark:text-brand-lime uppercase tracking-wider flex items-center gap-1.5">
                        <Layers size={15} /> Memory Presets:
                    </span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    {PRESETS.map((preset) => (
                        <button
                            key={preset.id}
                            onClick={() => onSelectPreset && onSelectPreset(preset.code)}
                            className="px-3 py-1.5 rounded-lg text-xs font-mono font-medium border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900/60 hover:border-emerald-500 dark:hover:border-brand-lime text-zinc-800 dark:text-zinc-200 transition-colors flex items-center gap-2 shadow-sm"
                            title={`Load "${preset.label}" into editor and visualizer`}
                        >
                            <span className="font-semibold">{preset.label}</span>
                            <span className="text-[11px] px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-black/60 text-zinc-700 dark:text-brand-lime font-bold border border-zinc-200 dark:border-zinc-800">
                                {preset.badge}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Split Screen Memory Architecture: Stack vs Heap */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 min-h-[360px]">
                {/* 1. THE CALL STACK */}
                <div className="border border-zinc-200 dark:border-brand-border rounded-xl flex flex-col overflow-hidden shadow-sm" style={{ backgroundColor: 'var(--bg-surface)' }}>
                    <div className="px-4 py-3 border-b border-zinc-200 dark:border-brand-border flex items-center justify-between" style={{ backgroundColor: 'var(--bg-main)' }}>
                        <div className="flex items-center gap-2">
                            <Cpu size={16} className="text-emerald-700 dark:text-brand-lime" />
                            <div>
                                <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
                                    THE CALL STACK
                                </h4>
                                <span className="text-xs font-mono text-zinc-600 dark:text-zinc-400 font-medium">
                                    Execution Frame &amp; Pointer Registers
                                </span>
                            </div>
                        </div>
                        <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded border border-emerald-300 dark:border-brand-lime/30 bg-emerald-50 dark:bg-brand-lime/10 text-emerald-800 dark:text-brand-lime">
                            {stack.length} Slots
                        </span>
                    </div>

                    <div className="flex-1 p-3.5 overflow-y-auto space-y-2.5">
                        {stack.map((item, idx) => {
                            const isShared = item.isRef && (refMap[item.value]?.length || 0) > 1;
                            const isHovered = hoveredAddr && hoveredAddr === item.value;

                            return (
                                <div
                                    key={idx}
                                    onMouseEnter={() => item.isRef && setHoveredAddr(item.value)}
                                    onMouseLeave={() => setHoveredAddr(null)}
                                    className={`p-3.5 rounded-lg border transition-all duration-150 ${
                                        item.isRef
                                            ? isHovered
                                                ? 'border-blue-500 bg-blue-100/70 dark:bg-blue-500/20 shadow-md ring-1 ring-blue-400'
                                                : 'border-blue-300 dark:border-blue-500/40 bg-blue-50/60 dark:bg-blue-500/5 hover:border-blue-500'
                                            : 'border-emerald-300 dark:border-brand-lime/40 bg-emerald-50/60 dark:bg-brand-lime/5 hover:border-emerald-500'
                                    }`}
                                >
                                    <div className="flex items-center justify-between mb-1.5">
                                        <div className="flex items-center gap-2">
                                            <span className="font-mono text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-100">
                                                {item.name}
                                            </span>
                                            <span className="text-xs font-mono text-zinc-600 dark:text-zinc-400 font-medium">
                                                ({item.isRef ? 'Pointer' : 'Primitive'})
                                            </span>
                                        </div>
                                        {item.isRef ? (
                                            <span className="text-xs font-mono font-bold text-blue-800 dark:text-blue-300 bg-blue-100 dark:bg-blue-500/20 border border-blue-300 dark:border-blue-500/40 px-2 py-0.5 rounded flex items-center gap-1">
                                                addr: {item.value}
                                            </span>
                                        ) : (
                                            <span className="text-xs font-mono font-bold text-emerald-800 dark:text-brand-lime bg-emerald-100 dark:bg-brand-lime/20 border border-emerald-300 dark:border-brand-lime/40 px-2 py-0.5 rounded">
                                                val: {item.value}
                                            </span>
                                        )}
                                    </div>

                                    {item.isRef && isShared && (
                                        <div className="text-xs font-mono text-blue-900 dark:text-blue-300 font-medium mt-1.5 flex items-center gap-1.5">
                                            <span>Shares address with:</span>
                                            <span className="font-bold underline">
                                                {refMap[item.value].filter(n => n !== item.name).join(', ')}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            );
                        })}

                        {stack.length === 0 && (
                            <div className="h-full flex flex-col items-center justify-center p-8 text-center text-zinc-600 dark:text-zinc-400 font-mono text-xs sm:text-sm">
                                <Cpu size={32} className="mb-2 opacity-40 text-emerald-600 dark:text-brand-lime" />
                                <span className="font-semibold text-zinc-800 dark:text-zinc-200">Call stack frame is empty.</span>
                                <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400 mt-1">Declare a variable or choose a preset above.</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* 2. THE MEMORY HEAP */}
                <div className="border border-zinc-200 dark:border-brand-border rounded-xl flex flex-col overflow-hidden shadow-sm" style={{ backgroundColor: 'var(--bg-surface)' }}>
                    <div className="px-4 py-3 border-b border-zinc-200 dark:border-brand-border flex items-center justify-between" style={{ backgroundColor: 'var(--bg-main)' }}>
                        <div className="flex items-center gap-2">
                            <Database size={16} className="text-blue-600 dark:text-blue-400" />
                            <div>
                                <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
                                    THE MEMORY HEAP
                                </h4>
                                <span className="text-xs font-mono text-zinc-600 dark:text-zinc-400 font-medium">
                                    Dynamic Allocation &amp; Garbage Collection
                                </span>
                            </div>
                        </div>
                        <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded border border-blue-300 dark:border-blue-500/30 bg-blue-100 dark:bg-blue-500/10 text-blue-800 dark:text-blue-400">
                            {heap.length} Allocations
                        </span>
                    </div>

                    <div className="flex-1 p-3.5 overflow-y-auto space-y-3">
                        {heap.map((item, idx) => {
                            const holders = refMap[item.addr] || [];
                            const isHovered = hoveredAddr === item.addr;

                            return (
                                <div
                                    key={idx}
                                    onMouseEnter={() => setHoveredAddr(item.addr)}
                                    onMouseLeave={() => setHoveredAddr(null)}
                                    className={`p-3.5 rounded-lg border transition-all duration-150 ${
                                        isHovered
                                            ? 'border-blue-500 bg-blue-100/70 dark:bg-blue-500/20 shadow-lg ring-1 ring-blue-400'
                                             : 'border-blue-300 dark:border-blue-500/30 bg-blue-50/60 dark:bg-blue-500/5 hover:border-blue-500'
                                    }`}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-blue-100 dark:bg-blue-500/20 text-blue-800 dark:text-blue-300 border border-blue-300 dark:border-blue-500/40">
                                            HEAP ADDR: {item.addr}
                                        </span>
                                        <span className="text-xs font-mono text-zinc-600 dark:text-zinc-400 font-medium flex items-center gap-1.5">
                                            Referenced by: <strong className="text-zinc-950 dark:text-brand-lime font-bold">{holders.join(', ') || 'Anonymous'}</strong>
                                        </span>
                                    </div>

                                    <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 font-mono text-xs sm:text-sm text-blue-200 overflow-x-auto font-medium">
                                        {item.content}
                                    </div>
                                </div>
                            );
                        })}

                        {heap.length === 0 && (
                            <div className="h-full flex flex-col items-center justify-center p-8 text-center text-zinc-600 dark:text-zinc-400 font-mono text-xs sm:text-sm">
                                <Database size={32} className="mb-2 opacity-40 text-blue-500 dark:text-blue-400" />
                                <span className="font-semibold text-zinc-800 dark:text-zinc-200">No objects currently allocated in the Heap.</span>
                                <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400 mt-1">Primitives reside on the Stack; object structures allocate dynamically here.</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Bottom Insight Footer */}
            <div className="px-4 py-2.5 rounded-lg border border-zinc-200 dark:border-brand-border/40 bg-zinc-50 dark:bg-brand-surface/40 flex flex-wrap items-center justify-between text-xs sm:text-sm font-mono text-zinc-700 dark:text-zinc-300 font-medium gap-2">
                <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 dark:bg-brand-lime"></span>
                    <span><strong className="text-zinc-900 dark:text-zinc-100">Green Slots</strong> = Discrete Stack Values (Copied by value, isolated memory)</span>
                </span>
                <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                    <span><strong className="text-zinc-900 dark:text-zinc-100">Blue Slots</strong> = Heap Memory Address Pointers (Shared reference access)</span>
                </span>
            </div>
        </div>
    );
};

export default DataTypeVisualizer;
