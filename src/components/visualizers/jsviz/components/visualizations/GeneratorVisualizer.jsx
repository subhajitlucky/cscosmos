'use client';
import React, { useEffect } from 'react';
import anime from 'animejs'; const _anime = anime.default || anime;

const GeneratorVisualizer = ({ code }) => {
    useEffect(() => {
        // State bubble pulse
        anime({
            targets: '.state-core',
            scale: [0.95, 1.05],
            opacity: [0.8, 1],
            duration: 2000,
            loop: true,
            direction: 'alternate',
            easing: 'easeInOutQuad'
        });

        // Connector animation
        anime({
            targets: '.gen-path',
            strokeDashoffset: [anime.setDashoffset, 0],
            easing: 'easeInOutSine',
            duration: 1500,
            delay: 500,
            loop: true
        });
    }, [code]);

    const hasYield = code.includes('yield');
    const hasNext = code.includes('.next()');

    return (
        <div className="h-full w-full p-8 flex flex-col items-center justify-center relative overflow-hidden" style={{ background: 'radial-gradient(circle at center, rgba(249, 115, 22, 0.05) 0%, transparent 70%)' }}>
            <style>{`
                .gen-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 30px;
                    z-index: 2;
                }
                .state-core {
                    background: var(--bg-surface);
                    border: 4px solid #f97316;
                    border-radius: 30px;
                    padding: 30px;
                    width: 260px;
                    text-align: center;
                    position: relative;
                    box-shadow: 0 20px 40px rgba(249, 115, 22, 0.15);
                }
                .status-badge {
                    position: absolute;
                    top: -15px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: #f97316;
                    color: white;
                    font-size: 10px;
                    font-weight: 900;
                    padding: 4px 16px;
                    border-radius: 999px;
                    box-shadow: 0 4px 10px rgba(249, 115, 22, 0.3);
                }
                .yield-text {
                    font-family: 'JetBrains Mono', monospace;
                    font-weight: 900;
                    color: var(--text-main);
                    font-size: 18px;
                    letter-spacing: -0.02em;
                }
                .heap-marker {
                    font-size: 9px;
                    color: #94a3b8;
                    margin-top: 15px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 6px;
                }
                .gen-svg {
                    position: absolute;
                    inset: 0;
                    width: 100%;
                    height: 100%;
                    pointer-events: none;
                    opacity: 0.2;
                }
            `}</style>

            <svg className="gen-svg" viewBox="0 0 100 100">
                <path className="gen-path" d="M50,10 Q70,50 50,90 Q30,50 50,10" fill="none" stroke="#f97316" strokeWidth="0.5" strokeDasharray="5,5" />
            </svg>

            <div className="self-start mb-10 flex items-center gap-3">
                <div className="w-3 h-3 rotate-45 bg-orange-500 shadow-[0_0_10px_orange]"></div>
                <h3 className="text-xs font-mono font-bold text-gray-500 uppercase tracking-widest">Generator_State_Machine</h3>
            </div>

            <div className="gen-container">
                <div className="state-core">
                    <div className="status-badge">{hasNext ? 'RESUMED' : (hasYield ? 'SUSPENDED' : 'READY')}</div>
                    <div className="yield-text">{hasYield ? 'YIELDING_VALUE' : 'WAITING_CMD'}</div>
                    <div className="heap-marker">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4a2 2 0 0 0 1-1.73Z" />
                        </svg>
                        CONTEXT_ID: 0xGEN_01
                    </div>
                </div>
                
                {hasNext && (
                    <div className="animate-bounce text-orange-500">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M11,4H13V16L18.5,11L19.92,12.42L12,20.34L4.08,12.42L5.5,11L11,16V4Z" />
                        </svg>
                    </div>
                )}
            </div>

            <div className="mt-12 text-[9px] font-mono text-gray-400 text-center uppercase tracking-widest max-w-xs leading-relaxed opacity-60">
                Instruction pointer & local scope preserved in heap memory during suspension phases.
            </div>
        </div>
    );
};

export default GeneratorVisualizer;
