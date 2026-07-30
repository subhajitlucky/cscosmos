'use client';
import React, { useEffect } from 'react';
import anime from 'animejs';

const DataTypeVisualizer = ({ stack, heap }) => {
    useEffect(() => {
        if (typeof window === 'undefined') return;
        const animeFn = (anime && anime.default) || anime;
        if (typeof animeFn !== 'function') return;
        // Stack entries
        animeFn({
            targets: '.stack-frame-box',
            translateX: [-100, 0],
            opacity: [0, 1],
            rotate: [10, 0],
            delay: (animeFn.stagger || anime.stagger)(150),
            easing: 'easeOutElastic(1, .8)'
        });

        // Heap blobs
        animeFn({
            targets: '.heap-blob',
            scale: [0, 1],
            opacity: [0, 1],
            rotate: () => anime.random(-15, 15),
            delay: (animeFn.stagger || anime.stagger)(200),
            easing: 'easeOutElastic(1, .5)'
        });

        // Animation for reference lines (glow effect)
        animeFn({
            targets: '.ref-glow',
            opacity: [0.2, 0.8],
            duration: 1500,
            loop: true,
            direction: 'alternate',
            easing: 'easeInOutQuad'
        });
    }, [stack, heap]);

    return (
        <div className="h-full w-full flex p-4 gap-6 overflow-hidden" style={{ backgroundColor: 'transparent' }}>
            <style>{`
                .memory-sector {
                    flex: 1;
                    height: 100%;
                    background: rgba(0,0,0,0.03);
                    border: 2px solid var(--border-main);
                    border-radius: 20px;
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                    position: relative;
                }
                .sector-header {
                    padding: 14px;
                    font-family: 'JetBrains Mono', monospace;
                    font-size: 10px;
                    font-weight: 900;
                    text-transform: uppercase;
                    border-bottom: 2px solid var(--border-main);
                    background: var(--bg-surface);
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }
                .stack-frame-box {
                    margin: 8px 12px;
                    padding: 14px;
                    background: var(--bg-surface);
                    border: 2px solid var(--accent-main);
                    border-radius: 8px;
                    box-shadow: 4px 4px 0px var(--accent-main);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .heap-blob {
                    margin: 10px;
                    padding: 16px;
                    background: var(--bg-surface);
                    border: 2px solid #3b82f6;
                    border-radius: 16px;
                    position: relative;
                    box-shadow: 0 10px 25px -5px rgba(59, 130, 246, 0.2);
                }
                .ref-glow {
                    position: absolute;
                    right: 8px;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 8px;
                    height: 8px;
                    background: #3b82f6;
                    border-radius: 50%;
                    box-shadow: 0 0 15px #3b82f6;
                }
                .addr-chip {
                    font-family: monospace;
                    font-size: 8px;
                    color: #3b82f6;
                    background: rgba(59, 130, 246, 0.1);
                    padding: 2px 6px;
                    border-radius: 4px;
                    margin-bottom: 8px;
                    display: inline-block;
                }
                .content-text {
                    font-size: 12px;
                    color: var(--text-main);
                    font-family: 'JetBrains Mono', monospace;
                    word-break: break-all;
                }
            `}</style>

            {/* CALL STACK SECTION */}
            <div className="memory-sector">
                <div className="sector-header" style={{ color: 'var(--accent-main)' }}>
                    <span>⚡ LIFO_STACK</span>
                    <span className="text-[8px] opacity-50">Fast_Access</span>
                </div>
                <div className="flex-grow overflow-y-auto p-2 flex flex-col-reverse">
                    {stack.map((s, i) => (
                        <div key={i} className="stack-frame-box">
                            <div className="flex flex-col">
                                <span className="text-[8px] text-gray-500 font-mono mb-1">{s.name}</span>
                                <span className={`text-xs font-bold ${s.isRef ? 'text-blue-500' : 'text-gray-800'}`} style={{ color: s.isRef ? '#3b82f6' : 'var(--text-main)' }}>
                                    {s.value}
                                </span>
                            </div>
                            {s.isRef && <div className="ref-glow"></div>}
                        </div>
                    ))}
                    <div className="mt-4 p-6 text-center text-[10px] text-gray-400 font-mono border-t border-dashed">
                        --- SYSTEM_BASE ---
                    </div>
                </div>
            </div>

            {/* HEAP SECTION */}
            <div className="memory-sector">
                <div className="sector-header" style={{ color: '#3b82f6' }}>
                    <span>📦 DYNAMIC_HEAP</span>
                    <span className="text-[8px] opacity-50">Large_Memory</span>
                </div>
                <div className="flex-grow overflow-y-auto p-2">
                    {heap.map((h, i) => (
                        <div key={i} className="heap-blob">
                            <div className="addr-chip">ADDR: {h.addr}</div>
                            <div className="content-text">{h.content}</div>
                        </div>
                    ))}
                    {heap.length === 0 && (
                        <div className="h-full flex flex-col items-center justify-center opacity-20 scale-75">
                            <div className="w-20 h-20 border-4 border-dashed rounded-full animate-spin"></div>
                            <span className="mt-4 font-mono text-[10px]">No_Heap_Objects</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DataTypeVisualizer;
