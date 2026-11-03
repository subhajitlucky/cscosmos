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
                    <span className="text-[11px] font-mono font-bold text-brand-lime uppercase tracking-wider flex items-center gap-1.5">
                        <Layers size={13} /> Interactive Presets:
                    </span>
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                    {PRESETS.map((preset) => {
                        const Icon = preset.icon;
                        return (
                            <button
                                key={preset.id}
                                onClick={() => onSelectPreset && onSelectPreset(preset.code)}
                                className="px-2.5 py-1 rounded text-xs font-mono font-medium border border-brand-border/60 hover:border-brand-lime hover:bg-brand-lime/10 text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors flex items-center gap-1.5 shadow-sm"
                                title={`Load "${preset.label}" into editor and visualizer`}
                            >
                                <Icon size={12} className="text-brand-lime" />
                                <span>{preset.label.split(' ')[1]}</span>
                                <span className="text-[9px] px-1 py-0.2 rounded bg-black/20 text-brand-lime font-bold">
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
                <div className="border border-brand-border rounded-xl flex flex-col overflow-hidden shadow-sm" style={{ backgroundColor: 'var(--bg-surface)' }}>
                    <div className="px-4 py-3 border-b border-brand-border flex items-center justify-between" style={{ backgroundColor: 'var(--bg-main)' }}>
                        <div className="flex items-center gap-2">
                            <Cpu size={15} className="text-brand-lime" />
                            <div>
                                <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-main)' }}>
                                    THE STACK (Pocket Memory)
                                </h4>
                                <span className="text-[9px] font-mono text-[var(--text-muted)]">
                                    Stores Primitive Values &amp; Locker Keys
                                </span>
                            </div>
                        </div>
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-brand-lime/30 bg-brand-lime/10 text-brand-lime">
                            {stack.length} Slots
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
                                    className={`p-3 rounded-lg border transition-all duration-150 ${
                                        item.isRef
                                            ? isHovered
                                                ? 'border-blue-500 bg-blue-500/15 shadow-md'
                                                : 'border-blue-500/40 bg-blue-500/5 hover:border-blue-500'
                                            : 'border-brand-lime/40 bg-brand-lime/5 hover:border-brand-lime'
                                    }`}
                                >
                                    <div className="flex items-center justify-between mb-1">
                                        <div className="flex items-center gap-1.5">
                                            <span className="font-mono text-xs font-bold" style={{ color: 'var(--text-main)' }}>
                                                {item.name}
                                            </span>
                                            <span className="text-[9px] font-mono text-gray-500">
                                                ({item.isRef ? 'Reference Key' : 'Primitive'})
                                            </span>
                                        </div>
                                        {item.isRef ? (
                                            <span className="text-[10px] font-mono font-bold text-blue-400 bg-blue-500/20 px-1.5 py-0.5 rounded flex items-center gap-1">
                                                <Key size={10} /> {item.value}
                                            </span>
                                        ) : (
                                            <span className="text-[10px] font-mono font-bold text-brand-lime bg-brand-lime/20 px-1.5 py-0.5 rounded flex items-center gap-1">
                                                <StickyNote size={10} /> {item.value}
                                            </span>
                                        )}
                                    </div>

                                    {item.isRef && isShared && (
                                        <div className="text-[9px] font-mono text-blue-300/80 mt-1 flex items-center gap-1">
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
                            <div className="h-full flex flex-col items-center justify-center p-8 text-center text-gray-500 font-mono text-xs">
                                <StickyNote size={28} className="mb-2 opacity-40" />
                                <span>Stack is currently empty.</span>
                                <span className="text-[10px] opacity-60 mt-1">Write a variable like `let x = 10;` or pick a preset above!</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* 2. THE HEAP (Warehouse Storage) */}
                <div className="border border-brand-border rounded-xl flex flex-col overflow-hidden shadow-sm" style={{ backgroundColor: 'var(--bg-surface)' }}>
                    <div className="px-4 py-3 border-b border-brand-border flex items-center justify-between" style={{ backgroundColor: 'var(--bg-main)' }}>
                        <div className="flex items-center gap-2">
                            <Database size={15} className="text-blue-400" />
                            <div>
                                <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-main)' }}>
                                    THE HEAP (Warehouse Storage)
                                </h4>
                                <span className="text-[9px] font-mono text-[var(--text-muted)]">
                                    Holds Big Objects, Arrays &amp; Shared Data
                                </span>
                            </div>
                        </div>
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-blue-500/30 bg-blue-500/10 text-blue-400">
                            {heap.length} Lockers
                        </span>
                    </div>

                    <div className="flex-1 p-3 overflow-y-auto space-y-3">
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
                                            ? 'border-blue-400 bg-blue-500/20 shadow-lg ring-1 ring-blue-400'
                                            : 'border-blue-500/30 bg-blue-500/5 hover:border-blue-400'
                                    }`}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300">
                                            LOCKER ADDR: {item.addr}
                                        </span>
                                        <span className="text-[10px] font-mono text-gray-400 flex items-center gap-1">
                                            Keys held by: <strong className="text-brand-lime font-bold">{holders.join(', ') || 'Anonymous'}</strong>
                                        </span>
                                    </div>

                                    <div className="p-2.5 rounded bg-black/70 border border-brand-border/40 font-mono text-xs text-blue-200 overflow-x-auto">
                                        {item.content}
                                    </div>
                                </div>
                            );
                        })}

                        {heap.length === 0 && (
                            <div className="h-full flex flex-col items-center justify-center p-8 text-center text-gray-500 font-mono text-xs">
                                <Box size={28} className="mb-2 opacity-40 text-blue-400" />
                                <span>No objects currently stored in the Heap.</span>
                                <span className="text-[10px] opacity-60 mt-1">Primitives stay entirely in the Stack; objects create warehouse lockers here!</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Bottom Insight Footer */}
            <div className="px-3 py-2 rounded-lg border border-brand-border/40 bg-brand-surface/40 flex items-center justify-between text-[11px] font-mono text-[var(--text-muted)]">
                <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-brand-lime"></span>
                    <span><strong>Green Cards</strong> = Primitives (Copied by value, own memory)</span>
                </span>
                <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                    <span><strong>Blue Cards</strong> = Reference Pointers (Shared Locker Keys in Heap)</span>
                </span>
            </div>
        </div>
    );
};

export default DataTypeVisualizer;
