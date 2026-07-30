'use client';
import React, { useEffect, useRef } from 'react';
import anime from 'animejs'; const _anime = anime.default || anime;
import { ShieldCheck, Zap, AlertTriangle } from 'lucide-react';

const InternalVisualizer = ({ topicId, code }) => {
    const containerRef = useRef(null);

    useEffect(() => {
        const tl = anime.timeline({
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
            delay: anime.stagger(100)
        }, '-=500');

        // Pulse the "Shield" for security topic
        if (topicId === 'security') {
            anime({
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
                        <div className="absolute left-8 right-8 top-1/2 h-[1px] bg-gradient-to-r from-green-500 via-transparent to-orange-500 -z-10" />
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

