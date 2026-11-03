'use client';
import React, { useEffect, useRef } from 'react';
import anime from 'animejs';
import { ShieldCheck, Zap, AlertTriangle, Cpu } from 'lucide-react';

const InternalVisualizer = ({ topicId, code }) => {
    const containerRef = useRef(null);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const animeFn = (anime && anime.default) || anime;
        if (typeof animeFn !== 'function') return;

        if (animeFn.timeline) {
            const tl = animeFn.timeline({
                easing: 'easeOutElastic(1, .8)',
                duration: 1000
            });

            tl.add({
                targets: '.engine-core',
                scale: [0.8, 1],
                opacity: [0, 1],
                rotate: '1turn'
            })
            .add({
                targets: '.internal-node',
                translateY: [20, 0],
                opacity: [0, 1],
                delay: animeFn.stagger ? animeFn.stagger(100) : 100
            }, '-=500');
        }

        // Pulse the "Shield" for security topic
        if (topicId === 'security') {
            animeFn({
                targets: '.security-shield',
                scale: [1, 1.2, 1],
                duration: 2000,
                loop: true,
                easing: 'easeInOutSine'
            });
        }
    }, [topicId]);

    const renderContent = () => {
        if (topicId === 'security') {
            return (
                <div className="flex flex-col items-center justify-center h-full gap-8">
                    <div className="security-shield relative">
                        <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full animate-pulse" />
                        <ShieldCheck size={80} className="text-blue-400 relative z-10" />
                    </div>
                    <div className="grid grid-cols-2 gap-4 w-full px-12">
                        {['Object.freeze', 'XSS Sanitized', 'Strict Mode', 'Pure Map'].map((text, i) => (
                            <div key={i} className="internal-node bg-[var(--bg-surface)] border border-blue-500/30 p-2 rounded text-[10px] font-mono text-blue-200 text-center shadow-lg">
                                {text}
                            </div>
                        ))}
                    </div>
                    <p className="text-[10px] font-mono text-blue-400/60 uppercase tracking-widest">Language_Level_Hardening</p>
                </div>
            );
        }

        if (topicId === 'shared-memory') {
            return (
                <div className="flex flex-col items-center justify-center h-full gap-6">
                    <div className="flex items-center gap-12 relative">
                        <div className="flex flex-col items-center gap-2">
                            <Cpu size={32} className="text-green-400" />
                            <span className="text-[8px] font-mono text-green-500">THREAD_A</span>
                        </div>
                        <div className="engine-core w-24 h-24 border-2 border-brand-lime border-dashed rounded-full flex items-center justify-center bg-brand-lime/5">
                             <div className="w-16 h-16 bg-brand-lime/20 rounded-lg flex items-center justify-center animate-pulse">
                                <span className="text-[10px] font-mono text-brand-lime font-bold">RAM</span>
                             </div>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <Cpu size={32} className="text-orange-400" />
                            <span className="text-[8px] font-mono text-orange-500">THREAD_B</span>
                        </div>
                        {/* Data Flow Lines */}
                        <div className="absolute left-8 right-8 top-1/2 h-[1px] bg-yellow-500/60 -z-10" />
                    </div>
                    <div className="flex gap-2">
                        <Zap size={14} className="text-yellow-400 animate-bounce" />
                        <span className="text-[10px] font-mono text-yellow-500 font-bold uppercase">Atomics_Sync_Active</span>
                    </div>
                    <div className="w-3/4 h-8 bg-[#0f1115] border border-brand-border rounded overflow-hidden relative">
                        <div className="absolute inset-y-0 left-0 bg-brand-lime/30 w-1/3 border-r border-brand-lime" />
                        <div className="flex items-center justify-between px-4 h-full">
                            <span className="text-[8px] font-mono text-gray-500">SharedArrayBuffer</span>
                            <span className="text-[8px] font-mono text-brand-lime">0xFF32</span>
                        </div>
                    </div>
                </div>
            );
        }

        if (['v8-compiler-pipeline', 'deoptimization'].includes(topicId)) {
            return (
                <div className="flex flex-col items-center justify-center h-full gap-6">
                    <div className="flex items-center gap-4 text-xs font-mono">
                        <div className="p-3 border border-yellow-500/30 rounded-lg bg-yellow-500/10 text-yellow-400 text-center">
                            <span className="block font-bold">Parser / Scanner</span>
                            <span className="text-[9px] opacity-70">Source -&gt; AST</span>
                        </div>
                        <span className="text-brand-lime font-bold">➔</span>
                        <div className="p-3 border border-blue-500/30 rounded-lg bg-blue-500/10 text-blue-400 text-center">
                            <span className="block font-bold">Ignition</span>
                            <span className="text-[9px] opacity-70">Bytecode &amp; Profiler</span>
                        </div>
                        <span className="text-brand-lime font-bold">➔</span>
                        <div className="p-3 border border-green-500/30 rounded-lg bg-green-500/10 text-green-400 text-center">
                            <span className="block font-bold">TurboFan</span>
                            <span className="text-[9px] opacity-70">JIT Machine Code</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-mono text-[var(--text-muted)]">
                        <Zap size={12} className="text-brand-lime animate-pulse" />
                        <span>Type Feedback: Monomorphic speculative execution active</span>
                    </div>
                </div>
            );
        }

        if (['garbage-collection', 'memory-leaks'].includes(topicId)) {
            return (
                <div className="flex flex-col items-center justify-center h-full gap-6 font-mono">
                    <div className="grid grid-cols-2 gap-6 w-full max-w-md">
                        <div className="p-4 border border-brand-lime/30 rounded-lg bg-brand-lime/5 text-center">
                            <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-brand-lime mb-2">
                                <Cpu size={14} /> Young Generation
                            </div>
                            <span className="text-[10px] text-[var(--text-muted)] block">Scavenger (Semi-Spaces)</span>
                            <span className="text-[9px] text-green-400 mt-1 block">Fast O(survivors) collection</span>
                        </div>
                        <div className="p-4 border border-purple-500/30 rounded-lg bg-purple-500/5 text-center">
                            <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-purple-400 mb-2">
                                <Cpu size={14} /> Old Generation
                            </div>
                            <span className="text-[10px] text-[var(--text-muted)] block">Mark-Sweep-Compact</span>
                            <span className="text-[9px] text-purple-400 mt-1 block">Long-lived survivor heap</span>
                        </div>
                    </div>
                    <span className="text-[10px] text-[var(--text-muted)]">Tri-color marking (White / Grey / Black) active</span>
                </div>
            );
        }

        if (['dom-event-propagation', 'custom-events'].includes(topicId)) {
            return (
                <div className="flex flex-col items-center justify-center h-full gap-4 font-mono">
                    <div className="flex flex-col items-center gap-2">
                        <div className="px-6 py-2 border border-blue-500/30 bg-blue-500/10 text-blue-400 rounded text-xs">
                            1. Capturing Phase (window ➔ target)
                        </div>
                        <span className="text-xs text-[var(--text-muted)]">▼</span>
                        <div className="px-6 py-2 border-2 border-brand-lime bg-brand-lime/10 text-brand-lime font-bold rounded text-xs shadow-lg">
                            2. Target Phase (element target)
                        </div>
                        <span className="text-xs text-[var(--text-muted)]">▲</span>
                        <div className="px-6 py-2 border border-green-500/30 bg-green-500/10 text-green-400 rounded text-xs">
                            3. Bubbling Phase (target ➔ window)
                        </div>
                    </div>
                </div>
            );
        }

        if (topicId === 'web-workers') {
            return (
                <div className="flex flex-col items-center justify-center h-full gap-6 font-mono">
                    <div className="flex items-center gap-8">
                        <div className="p-4 border border-blue-500/30 bg-blue-500/10 rounded-lg text-center">
                            <span className="text-xs font-bold text-blue-400 block">Main Thread</span>
                            <span className="text-[9px] text-[var(--text-muted)]">DOM &amp; UI Events (60 FPS)</span>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                            <span className="text-[10px] text-brand-lime font-bold">postMessage</span>
                            <span className="text-xs text-[var(--text-muted)]">⇄ structuredClone ⇄</span>
                        </div>
                        <div className="p-4 border border-orange-500/30 bg-orange-500/10 rounded-lg text-center">
                            <span className="text-xs font-bold text-orange-400 block">Web Worker Thread</span>
                            <span className="text-[9px] text-[var(--text-muted)]">Heavy Computation &amp; I/O</span>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className="flex flex-col items-center justify-center h-full gap-4">
                <div className="engine-core p-6 bg-[var(--bg-surface)] border border-[var(--border-main)] rounded-2xl shadow-2xl relative">
                    <div className="absolute -top-2 -left-2 w-4 h-4 bg-brand-lime rounded-full animate-ping" />
                    <Cpu size={48} className="text-[var(--accent-main)]" />
                </div>
                <div className="flex flex-col items-center gap-1">
                    <h4 className="text-xs font-bold text-[var(--text-main)] uppercase tracking-tighter">Engine Internal View</h4>
                    <p className="text-[8px] font-mono text-[var(--text-muted)]">[[Abstract_Operations]]_Executing</p>
                </div>
                <div className="flex flex-wrap justify-center gap-2 px-8">
                    {['Bytecode', 'JIT Optimized', 'Hidden Class', 'Fast Path'].map((tag, i) => (
                        <span key={i} className="internal-node px-2 py-1 bg-[#1a1c22] border border-white/5 rounded text-[8px] font-mono text-gray-500">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div ref={containerRef} className="w-full h-full p-4">
            {renderContent()}
        </div>
    );
};

export default InternalVisualizer;
