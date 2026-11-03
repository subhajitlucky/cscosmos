'use client';

import React, { useState, useEffect } from 'react';
import { Key, StickyNote, Box, Layers, HelpCircle, Check, ArrowRight, RefreshCw, Cpu, Database } from 'lucide-react';

const PRESETS = [
    {
        id: 'primitives',
        label: '1. Primitives (Sticky Note Copy)',
        icon: StickyNote,
        badge: 'By Value',
        code: `// 1. Primitives: Copied by Value (Sticky Notes)
let myScore = 100;
let friendScore = myScore; // Independent copy!

friendScore = 200; // Only friendScore changes!
console.log(myScore);     // 100
console.log(friendScore); // 200`
    },
    {
        id: 'objects',
        label: '2. Objects (The Shared Locker Key)',
        icon: Key,
        badge: 'By Reference',
        code: `// 2. Objects: Copied by Reference (Locker Key)
let user1 = { name: "Alice" };
let user2 = user1; // Both receive the SAME locker key!

user2.name = "Bob"; // Opens locker and updates name

console.log(user1.name); // "Bob" (Affected!)
console.log(user2.name); // "Bob"`
    },
    {
        id: 'arrays',
        label: '3. Arrays in Heap Memory',
        icon: Box,
        badge: 'Heap Array',
        code: `// 3. Arrays are Objects stored in the Heap
let shoppingList = ["Apples", "Milk"];
let friendList = shoppingList; // Same memory reference!

friendList.push("Cookies");

console.log(shoppingList); // ["Apples", "Milk", "Cookies"]`
    },
    {
        id: 'null-undefined',
        label: '4. Null vs Undefined',
        icon: HelpCircle,
        badge: 'Empty States',
        code: `// 4. Undefined (Unassigned) vs Null (Deliberately Empty)
let packageDelivery; // undefined (Box hasn't arrived yet)
let emptyWallet = null; // null (Deliberately empty wallet)
let zeroCount = 0; // 0 (A valid primitive number!)`
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
                        <Layers size={15} /> Interactive Presets:
                    </span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    {PRESETS.map((preset) => {
                        const Icon = preset.icon;
                        return (
                            <button
                                key={preset.id}
                                onClick={() => onSelectPreset && onSelectPreset(preset.code)}
                                className="px-3 py-1.5 rounded-lg text-xs sm:text-sm font-mono font-medium border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900/60 hover:border-emerald-500 dark:hover:border-brand-lime text-zinc-800 dark:text-zinc-200 transition-colors flex items-center gap-2 shadow-sm"
                                title={`Load "${preset.label}" into editor and visualizer`}
                            >
                                <Icon size={14} className="text-emerald-700 dark:text-brand-lime" />
                                <span className="font-semibold">{preset.label.split(' ')[1]}</span>
                                <span className="text-xs px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-black/60 text-zinc-700 dark:text-brand-lime font-bold border border-zinc-200 dark:border-zinc-800">
                                    {preset.badge}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Split Screen Memory Architecture: Stack vs Heap */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 min-h-[360px]">
                {/* 1. THE STACK (Pocket Memory) */}
                <div className="border border-zinc-200 dark:border-brand-border rounded-xl flex flex-col overflow-hidden shadow-sm" style={{ backgroundColor: 'var(--bg-surface)' }}>
                    <div className="px-4 py-3 border-b border-zinc-200 dark:border-brand-border flex items-center justify-between" style={{ backgroundColor: 'var(--bg-main)' }}>
                        <div className="flex items-center gap-2">
                            <Cpu size={16} className="text-emerald-700 dark:text-brand-lime" />
                            <div>
                                <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
                                    THE STACK (Pocket Memory)
                                </h4>
                                <span className="text-xs font-mono text-zinc-600 dark:text-zinc-400 font-medium">
                                    Stores Primitive Values &amp; Locker Keys
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
                                                ({item.isRef ? 'Reference Key' : 'Primitive'})
                                            </span>
                                        </div>
                                        {item.isRef ? (
                                            <span className="text-xs font-mono font-bold text-blue-800 dark:text-blue-300 bg-blue-100 dark:bg-blue-500/20 border border-blue-300 dark:border-blue-500/40 px-2 py-0.5 rounded flex items-center gap-1">
                                                <Key size={12} /> {item.value}
                                            </span>
                                        ) : (
                                            <span className="text-xs font-mono font-bold text-emerald-800 dark:text-brand-lime bg-emerald-100 dark:bg-brand-lime/20 border border-emerald-300 dark:border-brand-lime/40 px-2 py-0.5 rounded flex items-center gap-1">
                                                <StickyNote size={12} /> {item.value}
                                            </span>
                                        )}
                                    </div>

                                    {item.isRef && isShared && (
                                        <div className="text-xs font-mono text-blue-900 dark:text-blue-300 font-medium mt-1.5 flex items-center gap-1.5">
                                            <span>🔗 Shares locker with:</span>
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
                                <StickyNote size={32} className="mb-2 opacity-50 text-emerald-600 dark:text-brand-lime" />
                                <span className="font-semibold text-zinc-800 dark:text-zinc-200">Stack is currently empty.</span>
                                <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400 mt-1">Write a variable like `let x = 10;` or pick a preset above!</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* 2. THE HEAP (Warehouse Storage) */}
                <div className="border border-zinc-200 dark:border-brand-border rounded-xl flex flex-col overflow-hidden shadow-sm" style={{ backgroundColor: 'var(--bg-surface)' }}>
                    <div className="px-4 py-3 border-b border-zinc-200 dark:border-brand-border flex items-center justify-between" style={{ backgroundColor: 'var(--bg-main)' }}>
                        <div className="flex items-center gap-2">
                            <Database size={16} className="text-blue-600 dark:text-blue-400" />
                            <div>
                                <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
                                    THE HEAP (Warehouse Storage)
                                </h4>
                                <span className="text-xs font-mono text-zinc-600 dark:text-zinc-400 font-medium">
                                    Holds Big Objects, Arrays &amp; Shared Data
                                </span>
                            </div>
                        </div>
                        <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded border border-blue-300 dark:border-blue-500/30 bg-blue-100 dark:bg-blue-500/10 text-blue-800 dark:text-blue-400">
                            {heap.length} Lockers
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
                                            LOCKER ADDR: {item.addr}
                                        </span>
                                        <span className="text-xs font-mono text-zinc-600 dark:text-zinc-400 font-medium flex items-center gap-1.5">
                                            Keys held by: <strong className="text-zinc-950 dark:text-brand-lime font-bold">{holders.join(', ') || 'Anonymous'}</strong>
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
                                <Box size={32} className="mb-2 opacity-50 text-blue-500 dark:text-blue-400" />
                                <span className="font-semibold text-zinc-800 dark:text-zinc-200">No objects currently stored in the Heap.</span>
                                <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400 mt-1">Primitives stay entirely in the Stack; objects create warehouse lockers here!</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Bottom Insight Footer */}
            <div className="px-4 py-2.5 rounded-lg border border-zinc-200 dark:border-brand-border/40 bg-zinc-50 dark:bg-brand-surface/40 flex flex-wrap items-center justify-between text-xs sm:text-sm font-mono text-zinc-700 dark:text-zinc-300 font-medium gap-2">
                <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 dark:bg-brand-lime"></span>
                    <span><strong className="text-zinc-900 dark:text-zinc-100">Green Cards</strong> = Primitives (Copied by value, own memory)</span>
                </span>
                <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                    <span><strong className="text-zinc-900 dark:text-zinc-100">Blue Cards</strong> = Reference Pointers (Shared Locker Keys in Heap)</span>
                </span>
            </div>
        </div>
    );
};

export default DataTypeVisualizer;
