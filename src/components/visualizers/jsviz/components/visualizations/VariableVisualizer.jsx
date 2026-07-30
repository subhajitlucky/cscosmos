'use client';
import React, { useEffect, useRef } from 'react';
import anime from 'animejs'; const _anime = anime.default || anime;

const VariableVisualizer = ({ variables }) => {
    const containerRef = useRef(null);

    useEffect(() => {
        // Entry animation for new items
        anime({
            targets: '.variable-card',
            translateY: [30, 0],
            opacity: [0, 1],
            scale: [0.8, 1],
            delay: anime.stagger(80),
            easing: 'easeOutElastic(1, .6)'
        });

        // Pulse the dot
        anime({
            targets: '.pulse-dot',
            scale: [1, 1.5],
            opacity: [1, 0.5],
            duration: 1000,
            loop: true,
            direction: 'alternate',
            easing: 'easeInOutQuad'
        });
    }, [variables]);

    return (
        <div ref={containerRef} className="h-full w-full p-6 overflow-y-auto" style={{ backgroundColor: 'transparent' }}>
            <style>{`
                .variable-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
                    gap: 20px;
                }
                .variable-card {
                    background: var(--bg-surface);
                    border: 2px solid var(--accent-main);
                    border-radius: 12px;
                    padding: 16px;
                    position: relative;
                    box-shadow: 4px 4px 0px rgba(var(--accent-main-rgb), 0.1);
                    border-bottom-width: 6px;
                    transition: transform 0.2s ease;
                }
                .variable-card:hover {
                    transform: translate(-2px, -2px);
                    box-shadow: 6px 6px 0px var(--accent-main);
                }
                .variable-card::after {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 100%);
                    pointer-events: none;
                }
                .card-label {
                    font-family: 'JetBrains Mono', monospace;
                    font-size: 10px;
                    font-weight: 800;
                    color: var(--accent-main);
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    margin-bottom: 10px;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }
                .card-value {
                    font-family: 'JetBrains Mono', monospace;
                    font-size: 18px;
                    font-weight: 700;
                    color: var(--text-main);
                    word-break: break-all;
                    text-shadow: 0 0 10px rgba(var(--accent-main-rgb), 0.2);
                }
                .card-addr {
                    font-family: 'JetBrains Mono', monospace;
                    font-size: 9px;
                    color: var(--text-muted);
                    margin-top: 12px;
                    background: rgba(128, 128, 128, 0.1);
                    padding: 4px 8px;
                    border-radius: 6px;
                    display: inline-block;
                    border: 1px solid rgba(var(--accent-main-rgb), 0.1);
                }
                .pulse-dot {
                    width: 6px;
                    height: 6px;
                    background: var(--accent-main);
                    border-radius: 50%;
                    box-shadow: 0 0 10px var(--accent-main);
                }
            `}</style>
            
            <div className="variable-grid">
                {variables.map((v, i) => (
                    <div key={`${v.name}-${i}`} className="variable-card group">
                        <div className="card-label">
                            <div className="pulse-dot"></div>
                            {v.name}
                        </div>
                        <div className="card-value">{v.value}</div>
                        <div className="card-addr">MEM_0x{((i + 1) * 0x4D2).toString(16).toUpperCase()}</div>
                    </div>
                ))}
            </div>

            {variables.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center border-2 border-dashed rounded-2xl" style={{ borderColor: 'var(--border-main)', opacity: 0.2 }}>
                    <div className="w-16 h-16 border-4 border-t-brand-lime rounded-full animate-spin mb-4"></div>
                    <p className="text-gray-400 font-mono text-sm uppercase tracking-widest">Scanning_Memory...</p>
                </div>
            )}
        </div>
    );
};

export default VariableVisualizer;
