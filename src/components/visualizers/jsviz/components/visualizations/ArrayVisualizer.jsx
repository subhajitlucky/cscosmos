'use client';
import React, { useEffect } from 'react';
import anime from 'animejs'; const _anime = anime.default || anime;

const ArrayVisualizer = ({ items }) => {
    useEffect(() => {
        // Slot entry
        anime({
            targets: '.array-card',
            scale: [0.5, 1],
            rotateY: [90, 0],
            opacity: [0, 1],
            delay: anime.stagger(100),
            easing: 'easeOutElastic(1, .8)'
        });

        // Scan pointer
        anime({
            targets: '.scan-marker',
            translateX: [0, (items.length - 1) * 80],
            duration: 3000,
            loop: true,
            direction: 'alternate',
            easing: 'easeInOutQuad'
        });
    }, [items]);

    return (
        <div className="h-full w-full p-8 flex flex-col items-center justify-center overflow-x-auto relative" style={{ perspective: '1000px' }}>
            <style>{`
                .array-tape {
                    display: flex;
                    gap: 12px;
                    padding: 40px;
                    background: var(--bg-surface);
                    border: 3px solid var(--border-main);
                    border-radius: 24px;
                    position: relative;
                    box-shadow: inset 0 4px 10px rgba(0,0,0,0.05);
                }
                .array-card {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 12px;
                    min-width: 68px;
                }
                .slot-box {
                    width: 68px;
                    height: 68px;
                    background: var(--bg-surface);
                    border: 3px solid #3b82f6;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-family: 'JetBrains Mono', monospace;
                    font-weight: 900;
                    font-size: 20px;
                    color: #3b82f6;
                    box-shadow: 0 10px 20px rgba(59, 130, 246, 0.1);
                    position: relative;
                }
                .slot-idx {
                    font-family: 'JetBrains Mono', monospace;
                    font-size: 10px;
                    font-weight: 800;
                    color: var(--text-muted);
                    background: rgba(0,0,0,0.05);
                    padding: 2px 8px;
                    border-radius: 4px;
                }
                .mem-ptr {
                    font-family: monospace;
                    font-size: 8px;
                    color: #94a3b8;
                    opacity: 0.6;
                }
                .scan-marker {
                    position: absolute;
                    top: 20px;
                    left: 70px;
                    width: 12px;
                    height: 12px;
                    background: #ef4444;
                    border-radius: 50%;
                    box-shadow: 0 0 15px #ef4444;
                    z-index: 5;
                }
            `}</style>

            <div className="self-start mb-12 flex items-center gap-3">
                <div className="w-3 h-3 rounded-sm bg-blue-500 animate-pulse"></div>
                <h3 className="text-xs font-mono font-bold text-gray-500 uppercase tracking-widest">Contiguous_Memory_Array</h3>
            </div>

            <div className="array-tape">
                <div className="scan-marker"></div>
                {items.map((item, i) => (
                    <div key={i} className="array-card">
                        <div className="slot-idx">idx[{i}]</div>
                        <div className="slot-box">
                            {item}
                        </div>
                        <div className="mem-ptr">0x{((i + 1) * 0x10).toString(16).toUpperCase()}</div>
                    </div>
                ))}
            </div>

            <div className="mt-12 flex gap-10 opacity-50">
                <div className="flex flex-col items-center">
                    <span className="text-[10px] font-bold text-gray-400">O(1)</span>
                    <span className="text-[8px] font-mono uppercase">Read_Access</span>
                </div>
                <div className="flex flex-col items-center">
                    <span className="text-[10px] font-bold text-gray-400">Sequential</span>
                    <span className="text-[8px] font-mono uppercase">Memory_Order</span>
                </div>
            </div>
        </div>
    );
};

export default ArrayVisualizer;
