'use client';
import React, { useEffect } from 'react';
import anime from 'animejs';

const MapSetVisualizer = ({ code }) => {
    useEffect(() => {
        if (typeof window === 'undefined') return;
        const animeFn = (anime && anime.default) || anime;
        if (typeof animeFn !== 'function') return;
        // Key-Value entry
        animeFn({
            targets: '.hash-node',
            scale: [0, 1],
            rotate: [15, 0],
            opacity: [0, 1],
            delay: (animeFn.stagger || anime.stagger)(150),
            easing: 'easeOutElastic(1, .8)'
        });

        // Hashing effect (flicker)
        animeFn({
            targets: '.hash-tag',
            opacity: [0.3, 1],
            duration: 500,
            loop: 3,
            direction: 'alternate',
            easing: 'easeInOutQuad'
        });
    }, [code]);

    const items = [];
    if (code.includes('Set')) {
        const matches = code.matchAll(/\.add\((.*?)\)/g);
        for (const match of matches) {
            items.push({ type: 'Set', value: match[1] });
        }
    } else if (code.includes('Map')) {
        const matches = code.matchAll(/\.set\((.*?,.*?)\)/g);
        for (const match of matches) {
            const parts = match[1].split(',');
            items.push({ type: 'Map', key: parts[0]?.trim(), value: parts[1]?.trim() });
        }
    }

    return (
        <div className="h-full w-full p-10 flex flex-col items-center justify-center overflow-y-auto" style={{ background: 'radial-gradient(circle at center, rgba(139, 92, 246, 0.03) 0%, transparent 80%)' }}>
            <style>{`
                .hash-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
                    gap: 20px;
                    width: 100%;
                    max-width: 540px;
                }
                .hash-node {
                    background: var(--bg-surface);
                    border: 2px solid #8b5cf6;
                    border-radius: 12px;
                    padding: 16px;
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                    position: relative;
                    box-shadow: 0 10px 20px rgba(139, 92, 246, 0.1);
                }
                .hash-tag {
                    position: absolute;
                    top: -10px;
                    right: 10px;
                    background: #8b5cf6;
                    color: white;
                    font-size: 7px;
                    font-weight: 900;
                    padding: 2px 6px;
                    border-radius: 4px;
                    text-transform: uppercase;
                }
                .node-key {
                    font-size: 10px;
                    font-family: monospace;
                    color: #8b5cf6;
                    border-bottom: 1.5px dashed rgba(139, 92, 246, 0.2);
                    padding-bottom: 6px;
                    display: flex;
                    justify-content: space-between;
                }
                .node-value {
                    font-size: 15px;
                    font-family: 'JetBrains Mono', monospace;
                    font-weight: 800;
                    color: var(--text-main);
                }
            `}</style>

            <div className="self-start mb-10 flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-purple-500 shadow-[0_0_10px_#8b5cf6]"></div>
                <h3 className="text-xs font-mono font-bold text-gray-500 uppercase tracking-widest">High_Performance_Hash_Map</h3>
            </div>

            <div className="hash-grid">
                {items.map((item, i) => (
                    <div key={i} className="hash-node">
                        <div className="hash-tag">Hashed_Slot</div>
                        {item.type === 'Map' ? (
                            <>
                                <div className="node-key">
                                    <span>KEY: {item.key}</span>
                                    <span className="opacity-40">→</span>
                                </div>
                                <div className="node-value">{item.value}</div>
                            </>
                        ) : (
                            <div className="node-value text-center py-4">{item.value}</div>
                        )}
                    </div>
                ))}
                {items.length === 0 && (
                    <div className="col-span-full py-16 text-center border-2 border-dashed border-purple-500/20 rounded-2xl">
                        <p className="text-gray-400 font-mono text-[10px] uppercase tracking-tighter">
                            Waiting for Map.set() or Set.add() calls...
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MapSetVisualizer;
