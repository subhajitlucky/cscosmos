'use client';
import React, { useEffect, useRef } from 'react';
import anime from 'animejs';
import { Layers, ShieldCheck, Eye, Zap } from 'lucide-react';

const MetaprogrammingVisualizer = ({ code }) => {
    const containerRef = useRef(null);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const animeFn = (anime && anime.default) || anime;
        if (typeof animeFn !== 'function') return;
        const tl = anime.timeline({
            easing: 'easeOutElastic(1, .8)',
            duration: 800
        });

        tl.add({
            targets: '.caller-node',
            translateX: [-50, 0],
            opacity: [0, 1]
        })
        .add({
            targets: '.proxy-layer',
            scale: [0.8, 1],
            opacity: [0, 1]
        }, '-=400')
        .add({
            targets: '.target-node',
            translateX: [50, 0],
            opacity: [0, 1]
        }, '-=400')
        .add({
            targets: '.trap-beam',
            width: [0, '100%'],
            opacity: [0, 1],
            delay: 500
        });

        animeFn({
            targets: '.interception-ring',
            rotate: '1turn',
            duration: 10000,
            loop: true,
            easing: 'linear'
        });
    }, []);

    const hasProxy = code.includes('new Proxy');
    const hasReflect = code.includes('Reflect');

    return (
        <div ref={containerRef} className="w-full h-full flex flex-col items-center justify-center gap-12 p-8">
            <div className="relative flex items-center justify-between w-full max-w-sm">
                
                {/* Caller side */}
                <div className="caller-node flex flex-col items-center gap-2 z-10">
                    <div className="w-12 h-12 rounded-full bg-blue-500/20 border border-blue-400 flex items-center justify-center">
                        <Zap size={20} className="text-blue-400" />
                    </div>
                    <span className="text-[8px] font-mono text-blue-400 uppercase">Caller</span>
                </div>

                {/* The Interception Beam (Caller to Proxy) */}
                <div className="absolute left-6 right-1/2 top-6 h-[2px] bg-gradient-to-r from-blue-400 to-transparent -z-10 opacity-30" />

                {/* Proxy Layer */}
                <div className="proxy-layer relative flex flex-col items-center gap-4">
                    <div className="interception-ring absolute -inset-6 border border-dashed border-purple-500/30 rounded-full" />
                    <div className="w-20 h-24 bg-[#1a1c22]/80 border-2 border-purple-500 rounded-xl flex flex-col items-center justify-center gap-2 shadow-[0_0_30px_rgba(168,85,247,0.2)]">
                        <Layers size={32} className="text-purple-400" />
                        <span className="text-[10px] font-bold text-purple-300">PROXY</span>
                    </div>
                    
                    {/* Traps */}
                    <div className="absolute -bottom-8 flex gap-2">
                        {['get', 'set', 'has'].map((trap) => (
                            <div key={trap} className={`px-2 py-0.5 rounded text-[8px] font-mono border ${code.includes(trap) ? 'bg-purple-500 text-white border-purple-400' : 'bg-gray-800 text-gray-500 border-gray-700'}`}>
                                {trap}()
                            </div>
                        ))}
                    </div>
                </div>

                {/* The Target Beam (Proxy to Target) */}
                <div className="absolute left-1/2 right-6 top-6 h-[2px] bg-gradient-to-r from-transparent to-brand-lime -z-10 opacity-30" />

                {/* Target side */}
                <div className="target-node flex flex-col items-center gap-2 z-10">
                    <div className="w-12 h-12 rounded bg-brand-lime/10 border border-brand-lime flex items-center justify-center">
                        <Eye size={20} className="text-brand-lime" />
                    </div>
                    <span className="text-[8px] font-mono text-brand-lime uppercase">Target</span>
                </div>

            </div>

            {/* Reflect API Status */}
            {hasReflect && (
                <div className="flex items-center gap-2 px-3 py-1 bg-brand-lime/10 border border-brand-lime/20 rounded-full animate-pulse">
                    <ShieldCheck size={12} className="text-brand-lime" />
                    <span className="text-[10px] font-mono text-brand-lime font-bold uppercase tracking-widest">Reflect_Protocol_Enabled</span>
                </div>
            )}

            <div className="w-full max-w-xs space-y-2 mt-4">
                <div className="flex justify-between items-center text-[8px] font-mono text-gray-500 uppercase">
                    <span>Interception Log</span>
                    <span className="text-purple-400">Live</span>
                </div>
                <div className="h-12 bg-[#0f1115] border border-brand-border rounded p-2 overflow-hidden font-mono text-[9px] text-gray-400">
                    {hasProxy ? (
                        <div className="animate-typing overflow-hidden whitespace-nowrap">
                            ➜ Trap triggered: [[Get]] on "property"<br/>
                            ➜ Validation: PASS
                        </div>
                    ) : (
                        <div className="text-gray-600 italic">Waiting for proxy initialization...</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MetaprogrammingVisualizer;

