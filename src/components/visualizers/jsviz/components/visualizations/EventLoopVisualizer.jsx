'use client';
import React, { useEffect } from 'react';
import anime from 'animejs';

const EventLoopVisualizer = ({ hasMicro, hasMacro }) => {
    useEffect(() => {
        if (typeof window === 'undefined') return;
        const animeFn = (anime && anime.default) || anime;
        if (typeof animeFn !== 'function') return;
        // Gear rotation
        animeFn({
            targets: '.gear-inner',
            rotate: '1turn',
            duration: 4000,
            loop: true,
            easing: 'linear'
        });

        // Task entry animations
        if (hasMicro) {
            animeFn({
                targets: '.micro-node',
                translateX: [150, 0],
                rotate: [90, 0],
                opacity: [0, 1],
                easing: 'easeOutElastic(1, .8)',
                duration: 1000
            });
        }

        if (hasMacro) {
            animeFn({
                targets: '.macro-node',
                translateX: [150, 0],
                rotate: [90, 0],
                opacity: [0, 1],
                easing: 'easeOutElastic(1, .8)',
                duration: 1000
            });
        }
    }, [hasMicro, hasMacro]);

    return (
        <div className="h-full w-full p-8 flex flex-col items-center justify-center relative overflow-hidden" style={{ background: 'radial-gradient(circle at center, rgba(163, 230, 53, 0.05) 0%, transparent 70%)' }}>
            <style>{`
                .loop-gear {
                    width: 160px;
                    height: 160px;
                    position: relative;
                    margin-bottom: 40px;
                }
                .gear-outer {
                    position: absolute;
                    inset: 0;
                    border: 12px dashed var(--border-main);
                    border-radius: 50%;
                    opacity: 0.3;
                }
                .gear-inner {
                    position: absolute;
                    inset: 20px;
                    border: 6px solid var(--accent-main);
                    border-top-color: transparent;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 0 30px rgba(163, 230, 53, 0.2);
                }
                .gear-label {
                    font-family: 'JetBrains Mono', monospace;
                    font-size: 11px;
                    font-weight: 900;
                    color: var(--text-main);
                    text-align: center;
                    letter-spacing: 0.2em;
                }
                .queues-grid {
                    width: 100%;
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 20px;
                }
                .queue-terminal {
                    background: var(--bg-surface);
                    border: 2px solid var(--border-main);
                    border-radius: 16px;
                    padding: 16px;
                    min-height: 120px;
                    position: relative;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.05);
                }
                .micro-node {
                    background: #f5f3ff;
                    border-left: 4px solid #8b5cf6;
                    padding: 10px;
                    font-family: monospace;
                    font-size: 11px;
                    color: #5b21b6;
                    border-radius: 4px;
                    margin-bottom: 8px;
                    box-shadow: 0 2px 4px rgba(139, 92, 246, 0.1);
                }
                .macro-node {
                    background: #fff7ed;
                    border-left: 4px solid #f97316;
                    padding: 10px;
                    font-family: monospace;
                    font-size: 11px;
                    color: #9a3412;
                    border-radius: 4px;
                    margin-bottom: 8px;
                    box-shadow: 0 2px 4px rgba(249, 115, 22, 0.1);
                }
                .tag {
                    position: absolute;
                    top: -10px;
                    left: 16px;
                    padding: 2px 8px;
                    font-size: 8px;
                    font-weight: 900;
                    text-transform: uppercase;
                    border-radius: 4px;
                    color: white;
                }
            `}</style>

            <div className="loop-gear">
                <div className="gear-outer"></div>
                <div className="gear-inner">
                    <div className="gear-label">
                        EVENT<br/>LOOP
                    </div>
                </div>
            </div>

            <div className="queues-grid">
                <div className="queue-terminal">
                    <div className="tag bg-purple-500">Microtasks (Priority)</div>
                    <div className="mt-2">
                        {hasMicro ? (
                            <div className="micro-node">RESOLVED_PROMISE</div>
                        ) : (
                            <div className="text-[10px] text-gray-300 font-mono italic text-center py-8">No_Tasks</div>
                        )}
                    </div>
                </div>
                <div className="queue-terminal">
                    <div className="tag bg-orange-500">Macrotasks</div>
                    <div className="mt-2">
                        {hasMacro ? (
                            <div className="macro-node">SET_TIMEOUT_CB</div>
                        ) : (
                            <div className="text-[10px] text-gray-300 font-mono italic text-center py-8">No_Tasks</div>
                        )}
                    </div>
                </div>
            </div>

            <div className="mt-10 text-[10px] font-mono text-gray-400 uppercase tracking-widest text-center">
                Concurrency_Simulator_v1.0
            </div>
        </div>
    );
};

export default EventLoopVisualizer;
