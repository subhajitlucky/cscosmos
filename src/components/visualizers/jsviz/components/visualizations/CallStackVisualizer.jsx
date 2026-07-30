'use client';
import React, { useEffect } from 'react';
import anime from 'animejs'; const _anime = anime.default || anime;

const CallStackVisualizer = ({ frames }) => {
    useEffect(() => {
        // Frames dropping in
        anime({
            targets: '.frame-card',
            translateY: [-100, 0],
            opacity: [0, 1],
            rotateX: [-45, 0],
            delay: anime.stagger(100),
            easing: 'easeOutElastic(1, .8)'
        });

        // Current instruction pointer
        anime({
            targets: '.active-pointer',
            translateX: [-5, 5],
            duration: 800,
            loop: true,
            direction: 'alternate',
            easing: 'easeInOutSine'
        });
    }, [frames]);

    return (
        <div className="h-full w-full flex flex-col items-center p-8 overflow-hidden" style={{ perspective: '1000px' }}>
            <style>{`
                .stack-shaft {
                    width: 100%;
                    max-width: 300px;
                    display: flex;
                    flex-direction: column-reverse;
                    gap: 16px;
                    position: relative;
                    padding: 20px;
                    background: rgba(0,0,0,0.02);
                    border-radius: 20px;
                    border: 2px solid var(--border-main);
                }
                .frame-card {
                    background: var(--bg-surface);
                    border: 3px solid #3b82f6;
                    border-radius: 12px;
                    padding: 20px;
                    position: relative;
                    box-shadow: 0 10px 30px rgba(59, 130, 246, 0.15);
                    transform-style: preserve-3d;
                }
                .frame-card.active {
                    border-color: var(--accent-main);
                    box-shadow: 0 0 20px rgba(163, 230, 53, 0.3);
                }
                .frame-title {
                    font-family: 'JetBrains Mono', monospace;
                    font-weight: 900;
                    font-size: 15px;
                    color: var(--text-main);
                }
                .active-pointer {
                    position: absolute;
                    left: -45px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: var(--accent-main);
                }
                .stack-foundation {
                    width: 100%;
                    max-width: 360px;
                    height: 16px;
                    background: var(--border-main);
                    border-radius: 8px;
                    margin-top: 24px;
                    box-shadow: 0 4px 0 rgba(0,0,0,0.1);
                }
            `}</style>

            <div className="w-full flex justify-between items-center mb-10 max-w-md">
                <h3 className="text-xs font-mono font-bold text-gray-500 uppercase tracking-widest">CPU_CALL_STACK</h3>
                <div className="flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-400"></div>
                    <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                    <div className="w-2 h-2 rounded-full bg-green-400"></div>
                </div>
            </div>

            <div className="stack-shaft">
                {frames.map((frame, i) => (
                    <div key={i} className={`frame-card ${i === frames.length - 1 ? 'active' : ''}`}>
                        {i === frames.length - 1 && (
                            <div className="active-pointer">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M10,17L15,12L10,7V17Z" />
                                </svg>
                            </div>
                        )}
                        <div className="frame-title">{frame}</div>
                        <div className="mt-2 flex justify-between items-end">
                            <span className="text-[8px] font-mono text-gray-400">CONTEXT_ID: 0x{i.toString(16)}</span>
                            <span className="text-[7px] font-bold text-blue-500 uppercase tracking-tighter">Running...</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="stack-foundation"></div>
            <p className="mt-4 text-[10px] font-mono text-gray-400 uppercase tracking-widest">Global_Memory_Base</p>
        </div>
    );
};

export default CallStackVisualizer;
